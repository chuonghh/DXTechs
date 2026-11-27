// API xác thực (server PR-8, ADR-012).
// - Access token (JWT ~15 phút) chỉ giữ trong BỘ NHỚ của tab — không localStorage/sessionStorage (giảm rủi ro XSS).
// - Refresh token nằm trong cookie HttpOnly do server đặt (Path=/api/auth); JavaScript không đọc được.
// - Mở lại trang / F5: gọi /auth/refresh để lấy access token mới từ cookie (khôi phục phiên).
// - Nhiều tab cùng refresh: dùng Web Locks API để chỉ một refresh chạy tại một thời điểm; server trả 409
//   (refresh_conflict) khi hai request dùng cùng token trong 10 giây ⇒ chờ chút rồi thử lại với cookie mới.

import { ApiError, apiRequest, setAuthHooks } from './client'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  /** editor: quản lý nội dung (ADR-015 §4), không thấy đơn hàng/thanh toán. */
  role: 'customer' | 'editor' | 'admin'
  phone: string | null
  companyName: string | null
  taxCode: string | null
  emailConfirmed: boolean
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: 'Bearer'
  expiresAt: string
  user: UserProfile
}

let accessToken: string | null = null
let onSessionChange: ((user: UserProfile | null) => void) | undefined

/** Store đăng ký để nhận phiên mới (refresh tự động, đăng xuất do hết phiên). */
export function subscribeSession(listener: (user: UserProfile | null) => void) {
  onSessionChange = listener
}

function applySession(response: AuthResponse | null) {
  accessToken = response?.accessToken ?? null
  onSessionChange?.(response?.user ?? null)
}

export function getAccessToken(): string | null {
  return accessToken
}

// ---------- Gọi API ----------

export async function login(email: string, password: string): Promise<UserProfile> {
  const response = await apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: { email, password }, skipAuth: true })
  applySession(response)
  return response.user
}

export async function register(email: string, password: string, fullName: string): Promise<UserProfile> {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: { email, password, fullName },
    skipAuth: true,
  })
  applySession(response)
  return response.user
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>('/auth/logout', { method: 'POST', skipAuth: true })
  } finally {
    applySession(null)
  }
}

export async function logoutAll(): Promise<void> {
  try {
    await apiRequest<void>('/me/logout-all', { method: 'POST' })
  } finally {
    applySession(null)
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<UserProfile> {
  const response = await apiRequest<AuthResponse>('/me/password', { method: 'PUT', body: { currentPassword, newPassword } })
  applySession(response)
  return response.user
}

export function getMe(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/me')
}

// ---------- Làm mới phiên ----------

let refreshing: Promise<UserProfile | null> | null = null

/**
 * Đổi cookie refresh lấy access token mới. Trả null khi không còn phiên (chưa đăng nhập / hết hạn / bị thu hồi).
 * Lỗi mạng ⇒ ném lỗi (giữ nguyên trạng thái, không coi là đăng xuất).
 */
export function refreshSession(): Promise<UserProfile | null> {
  refreshing ??= withCrossTabLock(doRefresh).finally(() => {
    refreshing = null
  })
  return refreshing
}

async function doRefresh(): Promise<UserProfile | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await apiRequest<AuthResponse>('/auth/refresh', { method: 'POST', skipAuth: true })
      applySession(response)
      return response.user
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        // Tab khác vừa xoay vòng token — cookie mới đã được trình duyệt lưu, thử lại.
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)))
        continue
      }
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        applySession(null)
        return null
      }
      throw error
    }
  }
  applySession(null)
  return null
}

async function withCrossTabLock<T>(work: () => Promise<T>): Promise<T> {
  const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined
  return locks ? locks.request('dxtechs:auth-refresh', work) : work()
}

// Lớp gọi API: gắn Bearer cho mọi request; khi access token hết hạn (401) thì refresh một lần rồi gửi lại.
setAuthHooks({
  getAccessToken,
  refresh: async () => (await refreshSession()) !== null,
})

/** Lấy thông báo lỗi hiển thị và lỗi theo từng ô nhập (key viết thường chữ đầu như form). */
export function describeAuthError(error: unknown): { message: string; fields: Record<string, string> } {
  if (!(error instanceof ApiError)) return { message: 'Đã có lỗi xảy ra. Vui lòng thử lại.', fields: {} }
  const fields: Record<string, string> = {}
  for (const [key, messages] of Object.entries(error.problem?.errors ?? {})) {
    fields[key.charAt(0).toLowerCase() + key.slice(1)] = messages.join(' ')
  }
  return { message: error.message, fields }
}
