import { ApiError, api } from './client'

export type HealthStatus = 'Healthy' | 'Degraded' | 'Unhealthy'

/** API còn sống (không kiểm tra database) — GET /api/health. */
export function getHealth(signal?: AbortSignal): Promise<HealthStatus> {
  return api.get<HealthStatus>('/health', { signal, timeoutMs: 5_000 })
}

/**
 * API sẵn sàng phục vụ (kết nối được PostgreSQL) — GET /api/health/ready.
 * Server trả 503 khi chưa sẵn sàng; hàm này quy đổi thành 'Unhealthy' thay vì ném lỗi.
 */
export async function getReadiness(signal?: AbortSignal): Promise<HealthStatus> {
  try {
    return await api.get<HealthStatus>('/health/ready', { signal, timeoutMs: 5_000 })
  } catch (error) {
    if (error instanceof ApiError && error.status === 503) return 'Unhealthy'
    throw error
  }
}
