<script setup lang="ts">
// Thanh toán thật (PR-C4, ADR-013): giỏ ⇒ báo giá của server ⇒ đặt hàng ⇒ trang đơn có mã VietQR.
// Web không tính tiền: tổng tiền, tồn kho do server quyết; khách chỉ chọn có xuất hoá đơn VAT hay không.
// Idempotency-Key: sinh một lần cho mỗi "phiên đặt" — bấm hai lần hay mạng chập chờn gửi lại đều ra ĐÚNG MỘT đơn;
// đổi giỏ ⇒ sinh khoá mới (đơn khác).
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import { ApiError, createOrder, newIdempotencyKey } from '../api'
import { formatPrice } from '../data/products'
import { useAuthStore } from '../stores/auth'
import { useShopStore } from '../stores/shop'

const shop = useShopStore()
const auth = useAuthStore()
const router = useRouter()

const requestVat = ref(false)
const vat = reactive({ companyName: '', taxCode: '', address: '', email: '' })
const note = ref('')
const agree = ref(false)
const submitting = ref(false)
const error = ref('')
const errorLink = ref<{ to: string; label: string } | null>(null)
let idempotencyKey = newIdempotencyKey()

const canSubmit = computed(() => !!shop.quote?.canCheckout && agree.value && !submitting.value && !shop.quoting)

onMounted(() => void shop.refreshQuote())
watch(() => shop.cart, () => {
  idempotencyKey = newIdempotencyKey()
  void shop.refreshQuote()
}, { deep: true })

function describe(e: unknown) {
  errorLink.value = null
  if (!(e instanceof ApiError)) return 'Không đặt được đơn (lỗi kết nối). Vui lòng thử lại — bạn sẽ không bị tạo đơn trùng.'
  const code = e.problem?.code
  if (code === 'sales.ordering_unavailable') return 'Cửa hàng chưa mở nhận thanh toán trực tuyến. Vui lòng gọi hotline 1900 886 628 để đặt mua.'
  if (code === 'sales.too_many_pending') {
    errorLink.value = { to: '/don-hang', label: 'Xem đơn đang chờ' }
    return 'Bạn đang có 3 đơn chờ thanh toán. Hãy thanh toán hoặc huỷ bớt đơn cũ trước khi đặt đơn mới.'
  }
  if (code === 'sales.daily_limit') return 'Bạn đã đặt quá số đơn cho phép trong hôm nay. Vui lòng thử lại ngày mai hoặc gọi hotline.'
  if (code === 'sales.out_of_stock' || code === 'sales.cart_not_available') {
    void shop.refreshQuote()
    return 'Có sản phẩm vừa hết hàng hoặc đổi giá — giỏ hàng đã được cập nhật, vui lòng kiểm tra lại.'
  }
  if (e.status === 429) return 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.'
  if (e.status === 400) {
    const fields = Object.values(e.problem?.errors ?? {}).flat()
    return fields.length ? fields.join(' ') : e.message
  }
  return e.message
}

async function placeOrder() {
  if (!canSubmit.value) return
  submitting.value = true
  error.value = ''
  try {
    const order = await createOrder(
      shop.cartItemsInput(),
      idempotencyKey,
      note.value.trim() || undefined,
      requestVat.value ? { companyName: vat.companyName.trim(), taxCode: vat.taxCode.trim(), address: vat.address.trim(), email: vat.email.trim() } : undefined,
    )
    shop.clearCart()
    idempotencyKey = newIdempotencyKey()
    await router.push(`/don-hang/${order.code}`)
  } catch (e) {
    error.value = describe(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="content-wrap checkout-page">
    <PageIntro
      eyebrow="Thanh toán an toàn"
      title="Xác nhận đơn hàng"
      description="Thanh toán bằng chuyển khoản VietQR. Hệ thống tự nhận tiền và giao license key vào mục Đơn của tôi ngay khi tiền về."
    />

    <div v-if="!shop.cart.length" class="co-empty">
      <h2>Giỏ hàng đang trống</h2>
      <p>Chọn phần mềm bản quyền hoặc dịch vụ số để bắt đầu.</p>
      <RouterLink class="button button-primary" to="/phan-mem">Khám phá phần mềm</RouterLink>
      <RouterLink class="button button-outline" to="/don-hang">Xem đơn của tôi</RouterLink>
    </div>

    <form v-else class="co-grid" @submit.prevent="placeOrder">
      <section class="co-card">
        <h2>Thông tin nhận key</h2>
        <p class="co-muted">Key và thông báo được gửi về tài khoản <strong>{{ auth.user?.email }}</strong> ({{ auth.user?.fullName }}). Đơn và key chỉ hiển thị cho tài khoản này.</p>

        <label class="co-check"><input v-model="requestVat" type="checkbox" /> Xuất hoá đơn VAT cho doanh nghiệp</label>
        <div v-if="requestVat" class="co-vat">
          <label>Tên công ty * <input v-model="vat.companyName" required maxlength="200" /></label>
          <label>Mã số thuế * <input v-model="vat.taxCode" required pattern="[0-9]{10}(-[0-9]{3})?|[0-9]{13}" placeholder="10 hoặc 13 số" /></label>
          <label class="co-wide">Địa chỉ * <input v-model="vat.address" required maxlength="300" /></label>
          <label class="co-wide">Email nhận hoá đơn * <input v-model="vat.email" type="email" required maxlength="254" /></label>
        </div>

        <label>Ghi chú cho đơn (tuỳ chọn) <textarea v-model="note" rows="2" maxlength="1000" /></label>

        <div class="co-howto">
          <h3>Cách thanh toán</h3>
          <ol>
            <li>Bấm <b>Đặt hàng</b> — hệ thống giữ hàng cho bạn <b>30 phút</b>.</li>
            <li>Mở app ngân hàng, quét mã VietQR (đã điền sẵn số tiền và nội dung chuyển khoản = mã đơn).</li>
            <li>Tiền về ⇒ key hiện ngay trên trang đơn hàng và trong mục <b>Đơn của tôi</b>.</li>
          </ol>
        </div>
      </section>

      <aside class="co-card co-summary">
        <h2>Đơn hàng</h2>
        <ul class="co-lines">
          <li v-for="item in shop.cart" :key="item.product.id">
            <span>{{ item.product.name }}<small>{{ shop.quoteLineFor(item)?.variantName ?? item.product.term }} × {{ item.quantity }}</small></span>
            <b>{{ formatPrice(shop.quoteLineFor(item)?.lineTotalVnd ?? item.product.price * item.quantity) }}</b>
          </li>
        </ul>
        <div class="co-total"><span>Tổng thanh toán</span><strong>{{ shop.quote ? formatPrice(shop.quote.totalVnd) : '…' }}</strong></div>
        <p v-if="shop.quoteError" class="co-error" role="alert">{{ shop.quoteError }}</p>
        <p v-else-if="shop.quote && !shop.quote.canCheckout" class="co-error" role="alert">
          Có sản phẩm không đủ hàng. <RouterLink to="/gio-hang">Điều chỉnh giỏ hàng</RouterLink>
        </p>

        <label class="co-check"><input v-model="agree" type="checkbox" /> Tôi đồng ý với <RouterLink to="/chinh-sach">chính sách mua hàng &amp; đổi trả</RouterLink>.</label>
        <p v-if="error" class="co-error" role="alert">{{ error }} <RouterLink v-if="errorLink" :to="errorLink.to">{{ errorLink.label }} →</RouterLink></p>
        <button type="submit" class="button button-primary co-submit" :disabled="!canSubmit">
          {{ submitting ? 'Đang tạo đơn…' : shop.quoting ? 'Đang cập nhật giá…' : 'Đặt hàng' }}
        </button>
        <RouterLink class="co-back" to="/gio-hang">← Sửa giỏ hàng</RouterLink>
      </aside>
    </form>
  </div>
</template>

<style scoped>
.checkout-page { display: grid; gap: 1.5rem; padding-bottom: 3rem; }
.co-empty { display: grid; justify-items: start; gap: .75rem; padding: 2rem; border-radius: 16px; background: rgba(255, 255, 255, .7); }
.co-empty h2 { margin: 0; }
.co-grid { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 1.25rem; align-items: start; }
@media (max-width: 900px) { .co-grid { grid-template-columns: 1fr; } }
.co-card { display: grid; gap: .9rem; padding: 1.25rem; border: 1px solid rgba(127, 127, 127, .2); border-radius: 16px; background: #fff; }
.co-card h2 { margin: 0; font-size: 1.15rem; }
.co-card h3 { margin: 0 0 .4rem; font-size: 1rem; }
.co-card label { display: grid; gap: .3rem; font-size: .88rem; font-weight: 600; }
.co-card input:not([type=checkbox]), .co-card textarea { padding: .6rem .75rem; border: 1px solid rgba(127, 127, 127, .35); border-radius: 10px; font: inherit; font-weight: 400; }
.co-check { display: flex !important; gap: .5rem; align-items: center; font-weight: 500 !important; }
.co-vat { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; padding: .9rem; border-radius: 12px; background: rgba(0, 102, 204, .05); }
.co-wide { grid-column: 1 / -1; }
@media (max-width: 600px) { .co-vat { grid-template-columns: 1fr; } }
.co-muted { margin: 0; font-size: .88rem; opacity: .8; }
.co-howto { padding: .9rem 1rem; border-radius: 12px; background: rgba(127, 127, 127, .07); font-size: .9rem; }
.co-howto ol { margin: 0; padding-left: 1.2rem; display: grid; gap: .3rem; }
.co-summary { position: sticky; top: 6rem; }
.co-lines { list-style: none; margin: 0; padding: 0; display: grid; gap: .6rem; }
.co-lines li { display: flex; justify-content: space-between; gap: .75rem; font-size: .9rem; }
.co-lines small { display: block; opacity: .65; font-size: .8rem; }
.co-total { display: flex; justify-content: space-between; align-items: baseline; padding-top: .75rem; border-top: 1px solid rgba(127, 127, 127, .25); }
.co-total strong { font-size: 1.4rem; color: #0066cc; }
.co-error { margin: 0; padding: .6rem .8rem; border-radius: 10px; background: rgba(220, 38, 38, .1); color: #b91c1c; font-size: .88rem; }
.co-submit { width: 100%; justify-content: center; }
.co-submit:disabled { opacity: .5; cursor: not-allowed; }
.co-back { font-size: .88rem; }
</style>
