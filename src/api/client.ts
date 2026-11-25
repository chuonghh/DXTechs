// Lớp gọi API dùng chung cho toàn bộ client.
// - Base URL: dev/preview '/api' (Vite proxy, cùng origin); production 'https://api.dxtechs.com/api'.
// - Mọi request đi qua đây: một chỗ duy nhất để gắn base URL, timeout, header, xử lý lỗi,
//   gắn access token (Bearer) và tự làm mới phiên một lần khi server báo token hết hạn (401) — xem api/auth.ts.
// - Chỉ dùng fetch có sẵn của trình duyệt, không thêm thư viện.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '')
const DEFAULT_TIMEOUT_MS = 15_000

/** Lỗi theo chuẩn RFC 7807 mà ASP.NET Core trả về (AddProblemDetails / ValidationProblem). */
export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  /** Lỗi validation theo từng field: { "Email": ["Email không hợp lệ"] }. */
  errors?: Record<string, string[]>
  [key: string]: unknown
}

/**
 * Lỗi khi gọi API.
 * status = 0 nghĩa là không nhận được phản hồi (mất mạng, server sập, quá thời gian chờ).
 */
export class ApiError extends Error {
  readonly status: number
  readonly problem?: ProblemDetails

  constructor(status: number, message: string, problem?: ProblemDetails) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }

  get isNetworkError(): boolean {
    return this.status === 0
  }
}

type QueryValue = string | number | boolean | null | undefined

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Object/array sẽ được gửi dạng JSON; FormData được gửi nguyên trạng (upload file). */
  body?: unknown
  /** Query string; giá trị null/undefined bị bỏ qua. */
  query?: Record<string, QueryValue>
  timeoutMs?: number
  /** Không gắn Bearer và không tự refresh (dùng cho chính các endpoint /auth/*). */
  skipAuth?: boolean
}

/** Do api/auth.ts đăng ký — tránh import vòng giữa client.ts và auth.ts. */
interface AuthHooks {
  getAccessToken: () => string | null
  /** true = đã có access token mới, gửi lại request được. */
  refresh: () => Promise<boolean>
}

let authHooks: AuthHooks | undefined

export function setAuthHooks(hooks: AuthHooks) {
  authHooks = hooks
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) params.append(key, String(value))
  }
  const qs = params.toString()
  return `${BASE_URL}${normalizedPath}${qs ? `?${qs}` : ''}`
}

async function toApiError(response: Response): Promise<ApiError> {
  const contentType = response.headers.get('content-type') ?? ''
  let problem: ProblemDetails | undefined
  if (contentType.includes('json')) {
    try {
      problem = (await response.json()) as ProblemDetails
    } catch {
      problem = undefined
    }
  }
  const message = problem?.detail || problem?.title || `Yêu cầu thất bại (HTTP ${response.status})`
  return new ApiError(response.status, message, problem)
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    return await send<T>(path, options)
  } catch (error) {
    // Access token hết hạn/không hợp lệ ⇒ làm mới phiên một lần rồi gửi lại. Không lặp vô hạn: lần gửi lại có skipAuth=false
    // nhưng nếu vẫn 401 thì lỗi được trả thẳng cho nơi gọi.
    const hadToken = !options.skipAuth && !!authHooks?.getAccessToken()
    if (error instanceof ApiError && error.status === 401 && hadToken && authHooks && (await authHooks.refresh())) {
      return send<T>(path, options)
    }
    throw error
  }
}

async function send<T>(path: string, options: RequestOptions): Promise<T> {
  const { body, query, timeoutMs = DEFAULT_TIMEOUT_MS, headers, signal, skipAuth, ...init } = options

  // Gộp timeout với signal của nơi gọi (ví dụ huỷ request khi rời trang).
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const forwardAbort = () => controller.abort(signal?.reason)
  if (signal?.aborted) forwardAbort()
  else signal?.addEventListener('abort', forwardAbort, { once: true })

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const requestHeaders = new Headers(headers)
  if (!requestHeaders.has('Accept')) requestHeaders.set('Accept', 'application/json')
  if (body !== undefined && !isFormData && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }
  const token = skipAuth ? null : authHooks?.getAccessToken()
  if (token && !requestHeaders.has('Authorization')) requestHeaders.set('Authorization', `Bearer ${token}`)

  try {
    const response = await fetch(buildUrl(path, query), {
      ...init,
      headers: requestHeaders,
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
      // API ở https://api.dxtechs.com — khác origin nhưng cùng site với https://dxtechs.com:
      // 'include' để cookie phiên đăng nhập (httpOnly, SameSite=Strict, Phase 2) đi kèm request.
      // Server chỉ cho phép đúng origin của web (CORS AllowCredentials), không dùng '*'.
      credentials: init.credentials ?? 'include',
      signal: controller.signal,
    })

    if (!response.ok) throw await toApiError(response)
    if (response.status === 204) return undefined as T

    const contentType = response.headers.get('content-type') ?? ''
    return (contentType.includes('json') ? await response.json() : await response.text()) as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    // Nơi gọi tự huỷ → ném lại nguyên lỗi AbortError để họ bỏ qua.
    if (signal?.aborted) throw error
    if (timedOut) throw new ApiError(0, 'Máy chủ phản hồi quá lâu, vui lòng thử lại.')
    throw new ApiError(0, 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.')
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', forwardAbort)
  }
}

type BodylessOptions = Omit<RequestOptions, 'method' | 'body'>
type BodyOptions = Omit<RequestOptions, 'method'>

export const api = {
  get: <T>(path: string, options?: BodylessOptions) => apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: BodyOptions) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: BodyOptions) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: BodyOptions) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: BodylessOptions) => apiRequest<T>(path, { ...options, method: 'DELETE' }),
}
