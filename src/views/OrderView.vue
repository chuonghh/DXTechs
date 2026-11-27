<script setup lang="ts">
// Trang một đơn hàng (PR-C4, ADR-013 §5): mã VietQR + thông tin chuyển khoản, đếm ngược 30 phút, tự cập nhật trạng thái
// mỗi 3 giây (không cần WebSocket ở quy mô này), hiện key khi đơn đã giao. Chỉ chủ đơn xem được (server trả 404 cho người khác).
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'
import LucianCopyButton from '../components/LucianCopyButton.vue'
import { ApiError, cancelOrder, getOrder, ORDER_STATUS_LABELS, type Order } from '../api'
import { formatPrice } from '../data/products'

const POLL_MS = 3000
const route = useRoute()
const code = computed(() => String(route.params.code ?? ''))
const order = ref<Order | null>(null)
const qr = ref('')
const notFound = ref(false)
const error = ref('')
const now = ref(Date.now())
const cancelling = ref(false)
let pollTimer: ReturnType<typeof setTimeout> | undefined
let clockTimer: ReturnType<typeof setInterval> | undefined

const isPending = computed(() => order.value?.status === 'pending_payment')
const remainingMs = computed(() => (order.value ? new Date(order.value.expiresAt).getTime() - now.value : 0))
const countdown = computed(() => {
  const s = Math.max(0, Math.floor(remainingMs.value / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
})
const keys = computed(() => order.value?.lines.filter((l) => l.keys.length) ?? [])
const CANCEL_REASONS: Record<string, string> = { expired: 'quá 30 phút chưa nhận được tiền', customer: 'bạn đã huỷ', admin: 'quản trị viên huỷ' }

async function load() {
  try {
    const next = await getOrder(code.value)
    order.value = next
    error.value = ''
    if (next.payment && !qr.value) {
      // Ảnh QR tạo ngay trên trình duyệt — mã đơn và số tiền không đi qua dịch vụ bên ngoài.
      qr.value = await QRCode.toDataURL(next.payment.vietQr, { errorCorrectionLevel: 'M', margin: 1, width: 280 })
    }
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound.value = true
    else error.value = 'Mất kết nối — đang thử lại…'
  }
}

/** Hỏi lại trạng thái khi đơn còn chờ tiền/đang giao; tab bị ẩn thì tạm dừng (đỡ tải server), quay lại thì chạy tiếp. */
function schedulePoll() {
  clearTimeout(pollTimer)
  const status = order.value?.status
  if (notFound.value || (status && status !== 'pending_payment' && status !== 'paid')) return
  pollTimer = setTimeout(async () => {
    if (document.visibilityState === 'visible') await load()
    schedulePoll()
  }, POLL_MS)
}

function onVisible() {
  if (document.visibilityState === 'visible') void load().then(schedulePoll)
}

async function cancel() {
  if (!order.value || !confirm(`Huỷ đơn ${order.value.code}? Nếu bạn đã chuyển khoản, đừng huỷ — hãy chờ vài phút để hệ thống nhận tiền.`)) return
  cancelling.value = true
  try {
    order.value = await cancelOrder(order.value.code)
  } catch (e) {
    error.value = e instanceof ApiError && e.status === 409 ? 'Đơn vừa đổi trạng thái (có thể tiền đã về) — đã tải lại.' : 'Huỷ đơn thất bại.'
    await load()
  } finally {
    cancelling.value = false
  }
}

watch(code, async () => {
  order.value = null
  qr.value = ''
  notFound.value = false
  await load()
  schedulePoll()
})

onMounted(async () => {
  await load()
  schedulePoll()
  clockTimer = setInterval(() => { now.value = Date.now() }, 1000)
  document.addEventListener('visibilitychange', onVisible)
})

onBeforeUnmount(() => {
  clearTimeout(pollTimer)
  clearInterval(clockTimer)
  document.removeEventListener('visibilitychange', onVisible)
})
</script>

<template>
  <div class="content-wrap order-page">
    <div v-if="notFound" class="op-card">
      <h1>Không tìm thấy đơn hàng</h1>
      <p>Đơn không tồn tại hoặc thuộc tài khoản khác.</p>
      <RouterLink class="button button-primary" to="/don-hang">Đơn của tôi</RouterLink>
    </div>

    <p v-else-if="!order" class="op-loading" role="status">Đang tải đơn hàng…</p>

    <template v-else>
      <header class="op-head">
        <div>
          <span class="eyebrow">Đơn hàng</span>
          <h1>{{ order.code }}</h1>
          <span class="op-status" :class="order.status">{{ ORDER_STATUS_LABELS[order.status] }}</span>
        </div>
        <RouterLink class="button button-outline" to="/don-hang">← Đơn của tôi</RouterLink>
      </header>
      <p v-if="error" class="op-warn" role="status">{{ error }}</p>

      <!-- Chờ thanh toán: QR + thông tin chuyển khoản -->
      <section v-if="isPending && order.payment" class="op-card op-pay">
        <div class="op-qr">
          <img v-if="qr" :src="qr" width="280" height="280" alt="Mã VietQR thanh toán đơn hàng" />
          <p>Quét bằng app ngân hàng bất kỳ</p>
        </div>
        <div class="op-bank">
          <div class="op-countdown" :class="{ urgent: remainingMs < 5 * 60_000 }">
            <span>Giữ hàng còn</span><strong>{{ countdown }}</strong>
          </div>
          <dl>
            <dt>Số tiền</dt><dd><strong>{{ formatPrice(order.payment.amountVnd) }}</strong> <LucianCopyButton :text="String(order.payment.amountVnd)" label="Chép" compact /></dd>
            <dt>Nội dung chuyển khoản</dt><dd><code>{{ order.payment.transferContent }}</code> <LucianCopyButton :text="order.payment.transferContent" label="Chép" compact /></dd>
            <dt>Ngân hàng</dt><dd>{{ order.payment.bankName }}</dd>
            <dt>Số tài khoản</dt><dd><code>{{ order.payment.accountNumber }}</code> <LucianCopyButton :text="order.payment.accountNumber" label="Chép" compact /></dd>
            <dt>Chủ tài khoản</dt><dd>{{ order.payment.accountName }}</dd>
          </dl>
          <p class="op-note">Chuyển <b>đúng số tiền</b> và <b>giữ nguyên nội dung</b> {{ order.payment.transferContent }} để hệ thống tự nhận tiền. Trang này tự cập nhật — không cần tải lại.</p>
          <button type="button" class="op-cancel" :disabled="cancelling" @click="cancel">Huỷ đơn</button>
        </div>
      </section>

      <section v-else-if="order.status === 'paid'" class="op-card op-ok" role="status">
        <h2>Đã nhận tiền — đang giao key…</h2>
        <p>Thường mất vài giây. Trang tự cập nhật.</p>
      </section>

      <section v-else-if="order.status === 'cancelled'" class="op-card">
        <h2>Đơn đã huỷ</h2>
        <p>Lý do: {{ CANCEL_REASONS[order.cancelReason ?? ''] ?? order.cancelReason }}.
          Nếu bạn đã chuyển khoản sau khi đơn huỷ, hệ thống tự mở lại đơn trong 24 giờ (nếu còn hàng) — hoặc liên hệ hotline 1900 886 628.</p>
        <RouterLink class="button button-primary" to="/phan-mem">Đặt lại</RouterLink>
      </section>

      <!-- Đã giao: key -->
      <section v-if="keys.length" class="op-card">
        <h2>License key của bạn</h2>
        <p class="op-note">Lưu key ở nơi an toàn. Key luôn xem lại được tại trang này khi đăng nhập.</p>
        <article v-for="line in keys" :key="line.id" class="op-keys">
          <h3>{{ line.productName }} <small>{{ line.variantName }}</small></h3>
          <div v-for="(k, i) in line.keys" :key="i" class="op-key"><code>{{ k }}</code> <LucianCopyButton :text="k" label="Sao chép" feedback-text="Đã chép key!" /></div>
        </article>
      </section>

      <section class="op-card">
        <h2>Chi tiết</h2>
        <ul class="op-lines">
          <li v-for="line in order.lines" :key="line.id">
            <span>{{ line.productName }}<small>{{ line.variantName }} · {{ formatPrice(line.unitPriceVnd) }} × {{ line.quantity }}</small></span>
            <b>{{ formatPrice(line.lineTotalVnd) }}</b>
          </li>
        </ul>
        <div class="op-total"><span>Tổng</span><strong>{{ formatPrice(order.totalVnd) }}</strong></div>
        <ol class="op-timeline">
          <li v-for="(ev, i) in order.timeline" :key="i">{{ new Date(ev.at).toLocaleString('vi-VN') }} — {{ ORDER_STATUS_LABELS[ev.toStatus] }}</li>
        </ol>
      </section>
    </template>
  </div>
</template>

<style scoped>
.order-page { display: grid; gap: 1.25rem; padding: 1.5rem 0 3rem; }
.op-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; }
.op-head h1 { margin: .2rem 0 .4rem; letter-spacing: .04em; }
.op-status { display: inline-block; padding: .2rem .7rem; border-radius: 999px; font-size: .85rem; background: rgba(234, 140, 0, .15); color: #b45309; }
.op-status.paid, .op-status.fulfilled { background: rgba(22, 163, 74, .15); color: #15803d; }
.op-status.cancelled, .op-status.refunded { background: rgba(127, 127, 127, .15); color: inherit; }
.op-card { display: grid; gap: .75rem; padding: 1.25rem; border: 1px solid rgba(127, 127, 127, .2); border-radius: 16px; background: #fff; }
.op-card h2 { margin: 0; font-size: 1.15rem; }
.op-pay { grid-template-columns: auto 1fr; gap: 1.5rem; align-items: start; }
@media (max-width: 720px) { .op-pay { grid-template-columns: 1fr; justify-items: center; } }
.op-qr { display: grid; justify-items: center; gap: .4rem; font-size: .85rem; opacity: .9; }
.op-qr img { border-radius: 12px; border: 1px solid rgba(127, 127, 127, .2); }
.op-bank { display: grid; gap: .75rem; width: 100%; }
.op-bank dl { display: grid; grid-template-columns: max-content 1fr; gap: .45rem 1rem; margin: 0; font-size: .95rem; }
.op-bank dt { opacity: .65; }
.op-bank dd { margin: 0; display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; }
.op-bank code, .op-key code { padding: .15rem .45rem; border-radius: 6px; background: rgba(0, 102, 204, .08); font-size: 1rem; letter-spacing: .03em; }
.op-countdown { display: flex; gap: .75rem; align-items: baseline; }
.op-countdown strong { font-size: 1.6rem; font-variant-numeric: tabular-nums; color: #0066cc; }
.op-countdown.urgent strong { color: #b91c1c; }
.op-note { margin: 0; font-size: .88rem; opacity: .8; }
.op-warn { margin: 0; padding: .6rem .9rem; border-radius: 10px; background: rgba(234, 140, 0, .12); }
.op-ok { background: rgba(22, 163, 74, .08); }
.op-cancel { justify-self: start; border: 0; background: transparent; color: #b91c1c; cursor: pointer; padding: 0; }
.op-keys h3 { margin: 0 0 .4rem; font-size: 1rem; }
.op-keys small { opacity: .65; font-weight: 400; }
.op-key { display: flex; gap: .75rem; align-items: center; flex-wrap: wrap; margin-bottom: .4rem; }
.op-lines { list-style: none; margin: 0; padding: 0; display: grid; gap: .5rem; }
.op-lines li { display: flex; justify-content: space-between; gap: 1rem; }
.op-lines small { display: block; opacity: .65; font-size: .82rem; }
.op-total { display: flex; justify-content: space-between; padding-top: .6rem; border-top: 1px solid rgba(127, 127, 127, .2); }
.op-timeline { margin: 0; padding-left: 1.1rem; font-size: .85rem; opacity: .8; }
.op-loading { padding: 2rem 0; }
</style>
