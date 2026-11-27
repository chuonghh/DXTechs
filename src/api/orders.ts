// API giỏ hàng + đơn hàng (server PR-10, PR-11, PR-12). Giá, tồn kho, tổng tiền LUÔN do server tính — web chỉ hiển thị.
import { api } from './client'

export interface CartItemInput {
  variantId: string
  quantity: number
}

export type CartLineStatus = 'ok' | 'insufficient_stock' | 'out_of_stock' | 'unavailable'

export interface CartQuoteLine {
  variantId: string
  status: CartLineStatus
  quantity: number
  productSlug: string | null
  productName: string | null
  variantName: string | null
  sku: string | null
  deliveryType: string | null
  unitPriceVnd: number | null
  compareAtPriceVnd: number | null
  lineTotalVnd: number | null
  /** Chỉ khi thiếu hàng (tối đa 20 — server không lộ tồn thật). */
  availableQuantity: number | null
}

export interface CartQuote {
  lines: CartQuoteLine[]
  subtotalVnd: number
  discountVnd: number
  totalVnd: number
  canCheckout: boolean
  quotedAt: string
}

export interface VatInfoInput {
  companyName: string
  taxCode: string
  address: string
  email: string
}

export type OrderStatus = 'pending_payment' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded'

export interface BankTransferInstruction {
  bankName: string
  bankBin: string
  accountNumber: string
  accountName: string
  amountVnd: number
  /** Nội dung chuyển khoản = mã đơn (bắt buộc đúng để hệ thống tự nhận tiền). */
  transferContent: string
  /** Chuỗi VietQR (EMVCo) — vẽ thành mã QR, app ngân hàng quét ra đúng số tiền + nội dung. */
  vietQr: string
}

export interface OrderLine {
  id: string
  variantId: string
  productName: string
  variantName: string
  sku: string
  deliveryType: string
  unitPriceVnd: number
  quantity: number
  lineTotalVnd: number
  /** Key rõ — chỉ khi đơn đã giao, chỉ chủ đơn thấy. */
  keys: string[]
}

export interface OrderEvent {
  fromStatus: OrderStatus | null
  toStatus: OrderStatus
  actorType: string
  reason: string | null
  at: string
}

export interface Order {
  code: string
  status: OrderStatus
  subtotalVnd: number
  discountVnd: number
  totalVnd: number
  createdAt: string
  expiresAt: string
  paidAt: string | null
  fulfilledAt: string | null
  cancelledAt: string | null
  cancelReason: string | null
  note: string | null
  lines: OrderLine[]
  timeline: OrderEvent[]
  payment: BankTransferInstruction | null
}

export interface OrderSummary {
  code: string
  status: OrderStatus
  totalVnd: number
  itemCount: number
  createdAt: string
  expiresAt: string
}

export interface OrderPage {
  items: OrderSummary[]
  nextCursor: string | null
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Chờ thanh toán',
  paid: 'Đã nhận tiền — đang giao',
  fulfilled: 'Đã giao key',
  cancelled: 'Đã huỷ',
  refunded: 'Đã hoàn tiền',
}

export function quoteCart(items: CartItemInput[], signal?: AbortSignal) {
  return api.post<CartQuote>('/cart/quote', { items }, { signal })
}

/**
 * Đặt hàng. `idempotencyKey` sinh một lần cho mỗi lần bấm "Đặt hàng" và giữ nguyên khi gửi lại (mạng chập chờn, bấm hai lần)
 * ⇒ server trả lại đúng đơn đã tạo thay vì tạo đơn thứ hai.
 */
export function createOrder(items: CartItemInput[], idempotencyKey: string, note?: string, vatInfo?: VatInfoInput) {
  return api.post<Order>('/orders', { items, note: note || null, vatInfo: vatInfo ?? null }, {
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}

export function getOrder(code: string, signal?: AbortSignal) {
  return api.get<Order>(`/orders/${encodeURIComponent(code)}`, { signal })
}

export function cancelOrder(code: string) {
  return api.post<Order>(`/orders/${encodeURIComponent(code)}/cancel`, {})
}

export function myOrders(cursor?: string) {
  return api.get<OrderPage>('/me/orders', { query: { cursor } })
}

export function newIdempotencyKey(): string {
  return crypto.randomUUID()
}
