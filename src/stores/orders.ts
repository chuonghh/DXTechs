// "Đơn của tôi" + kho license key thật (PR-C4) — thay đơn mẫu trong store shop cho khách hàng.
// Key chỉ có ở chi tiết đơn đã giao (server không trả key trong danh sách) ⇒ kho key tải chi tiết các đơn `fulfilled`.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ApiError, getOrder, myOrders, type OrderSummary } from '../api'

export interface LicenseEntry {
  orderCode: string
  productName: string
  variantName: string
  key: string
  fulfilledAt: string | null
}

/** Số đơn đã giao tối đa được tải chi tiết cho kho key (đơn cũ hơn xem từng đơn). */
const VAULT_ORDER_LIMIT = 20

export const useOrdersStore = defineStore('orders', () => {
  const items = ref<OrderSummary[]>([])
  const nextCursor = ref<string | null>(null)
  const loading = ref(false)
  const error = ref('')
  const licenses = ref<LicenseEntry[]>([])
  const licensesLoading = ref(false)

  const pendingCount = computed(() => items.value.filter((o) => o.status === 'pending_payment').length)

  async function load(more = false) {
    loading.value = true
    error.value = ''
    try {
      const page = await myOrders(more ? nextCursor.value ?? undefined : undefined)
      items.value = more ? [...items.value, ...page.items] : page.items
      nextCursor.value = page.nextCursor
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Không tải được danh sách đơn hàng.'
    } finally {
      loading.value = false
    }
  }

  async function loadLicenses() {
    if (!items.value.length) await load()
    licensesLoading.value = true
    try {
      const fulfilled = items.value.filter((o) => o.status === 'fulfilled').slice(0, VAULT_ORDER_LIMIT)
      const orders = await Promise.all(fulfilled.map((o) => getOrder(o.code).catch(() => null)))
      licenses.value = orders.flatMap((order) => (order ? order.lines.flatMap((line) => line.keys.map((key) => ({
        orderCode: order.code, productName: line.productName, variantName: line.variantName, key, fulfilledAt: order.fulfilledAt,
      }))) : []))
    } finally {
      licensesLoading.value = false
    }
  }

  return { items, nextCursor, loading, error, licenses, licensesLoading, pendingCount, load, loadLicenses }
})
