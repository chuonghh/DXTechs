import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authApi from '../api/auth'
import type { UserProfile } from '../api/auth'

/**
 * Trạng thái đăng nhập thật (server PR-8). Thay cho người dùng giả trong localStorage và switchRole() (đã gỡ).
 * Quyền thật nằm ở server (API admin trả 403 cho customer); store/route guard chỉ để giao diện đúng.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  /** unknown: đang khôi phục phiên lúc mở trang; sau đó là ready. */
  const status = ref<'unknown' | 'ready'>('unknown')

  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  /** Biên tập viên hoặc admin — được vào trang quản trị nội dung (server kiểm lại bằng policy `content`). */
  const canManageContent = computed(() => user.value?.role === 'editor' || user.value?.role === 'admin')

  // Refresh tự động (trong api/client) hoặc phiên bị thu hồi ⇒ cập nhật store.
  authApi.subscribeSession((next) => {
    user.value = next
  })

  let initPromise: Promise<void> | null = null

  /** Gọi một lần khi mở trang: dùng cookie refresh (nếu có) để khôi phục phiên. Router chờ hàm này. */
  function init(): Promise<void> {
    initPromise ??= (async () => {
      try {
        await authApi.refreshSession()
      } catch {
        // Mất mạng / server lỗi: coi như chưa đăng nhập, trang công khai vẫn dùng được.
        user.value = null
      } finally {
        status.value = 'ready'
      }
    })()
    return initPromise
  }

  async function login(email: string, password: string) {
    return authApi.login(email.trim(), password)
  }

  async function register(email: string, password: string, fullName: string) {
    return authApi.register(email.trim(), password, fullName.trim())
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Server không phản hồi: phía client vẫn xoá phiên; cookie sẽ hết hạn.
    }
  }

  async function logoutAll() {
    await authApi.logoutAll()
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    return authApi.changePassword(currentPassword, newPassword)
  }

  return { user, status, isAuthenticated, isAdmin, canManageContent, init, login, register, logout, logoutAll, changePassword }
})
