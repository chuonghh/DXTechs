<script setup lang="ts">
import { ref } from 'vue'
import PageIntro from '../components/PageIntro.vue'
import { formatPrice } from '../data/products.ts'
import { useShopStore } from '../stores/shop.ts'

const shop = useShopStore()
const couponInput = ref('')
const couponMessage = ref<{ text: string; isError: boolean } | null>(null)

function useFallbackImage(event: Event) {
  const image = event.currentTarget
  if (image instanceof HTMLImageElement && !image.src.endsWith('/software.svg')) {
    image.src = '/products/software.svg'
  }
}

function handleApplyCoupon(codeToApply?: string) {
  const targetCode = codeToApply || couponInput.value
  if (!targetCode.trim()) {
    couponMessage.value = { text: 'Vui lòng nhập mã ưu đãi trước khi áp dụng.', isError: true }
    return
  }
  const res = shop.applyCoupon(targetCode)
  couponMessage.value = { text: res.message, isError: !res.success }
  if (res.success) {
    couponInput.value = ''
  }
}

function handleRemoveCoupon() {
  shop.removeCoupon()
  couponMessage.value = null
}

function confirmClearCart() {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?')) {
    shop.clearCart()
  }
}
</script>

<template>
  <div class="content-wrap cart-view">
    <PageIntro
      eyebrow="GIỎ HÀNG CỦA BẠN"
      title="Sẵn sàng cho lựa chọn số?"
      description="Kiểm tra chi tiết sản phẩm, thời hạn gói và mã ưu đãi trước khi tiến hành thanh toán."
    />

    <div v-if="shop.cart.length" class="cart-layout">
      <!-- Left side: Cart Items List -->
      <section class="cart-items">
        <div class="cart-header-actions">
          <span class="cart-count-label"><b>{{ shop.cartCount }}</b> sản phẩm trong giỏ</span>
          <button type="button" class="clear-cart-btn" @click="confirmClearCart">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Xóa tất cả
          </button>
        </div>

        <div class="cart-table-head">
          <span>Sản phẩm</span>
          <span>Đơn giá</span>
          <span>Số lượng</span>
          <span>Tạm tính</span>
        </div>

        <article v-for="item in shop.cart" :key="item.product.id" class="cart-item">
          <RouterLink class="cart-thumb" :to="`/san-pham/${item.product.slug}`">
            <img :src="item.product.imageUrl" :alt="`Minh họa ${item.product.name}`" @error="useFallbackImage" />
          </RouterLink>
          <div class="cart-product-info">
            <RouterLink class="cart-item-title" :to="`/san-pham/${item.product.slug}`">{{ item.product.name }}</RouterLink>
            <div class="cart-item-tags">
              <span class="cart-license-badge">{{ item.product.license }}</span>
              <span class="cart-term-badge">{{ item.product.term }}</span>
            </div>
            <button class="remove-link" type="button" @click="shop.removeFromCart(item.product.id)">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>
              Xóa sản phẩm
            </button>
          </div>
          <strong class="cart-unit-price">{{ formatPrice(item.product.price) }}</strong>
          <div class="quantity-control">
            <button type="button" :aria-label="`Giảm số lượng ${item.product.name}`" @click="shop.updateQuantity(item.product.id, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button type="button" :aria-label="`Tăng số lượng ${item.product.name}`" @click="shop.updateQuantity(item.product.id, item.quantity + 1)">+</button>
          </div>
          <strong class="cart-line-price">{{ formatPrice(item.product.price * item.quantity) }}</strong>
        </article>

        <!-- Voucher Input Block -->
        <div class="cart-coupon-card">
          <div class="cart-coupon-header">
            <span class="coupon-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>
                <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>
              </svg>
            </span>
            <div>
              <strong>Mã giảm giá &amp; Ưu đãi đối tác</strong>
              <small>Nhập mã để nhận chiết khấu trực tiếp vào đơn hàng</small>
            </div>
          </div>

          <div v-if="shop.couponCode" class="active-coupon-pill">
            <span>Mã đang dùng: <strong>{{ shop.couponCode }}</strong> (-{{ shop.discountPercent }}%)</span>
            <button type="button" class="remove-coupon-btn" @click="handleRemoveCoupon">Hủy áp dụng</button>
          </div>

          <form v-else class="cart-coupon-form" @submit.prevent="handleApplyCoupon()">
            <input
              v-model="couponInput"
              type="text"
              placeholder="Nhập mã: DXTECHS2025, WELCOME10..."
              aria-label="Mã ưu đãi"
            />
            <button type="submit" class="button button-outline">Áp dụng</button>
          </form>

          <div v-if="couponMessage" :class="['coupon-alert', { 'is-error': couponMessage.isError }]">
            {{ couponMessage.text }}
          </div>

          <div class="quick-coupon-hints">
            <span>Gợi ý mã:</span>
            <button type="button" class="coupon-chip" @click="handleApplyCoupon('DXTECHS2025')">DXTECHS2025 (-15%)</button>
            <button type="button" class="coupon-chip" @click="handleApplyCoupon('WELCOME10')">WELCOME10 (-10%)</button>
            <button type="button" class="coupon-chip" @click="handleApplyCoupon('VIP20')">VIP20 (-20%)</button>
          </div>
        </div>

        <RouterLink class="back-to-shop" to="/dich-vu">
          <span aria-hidden="true">←</span> Tiếp tục khám phá dịch vụ số
        </RouterLink>
      </section>

      <!-- Right side: Order Summary & Trust -->
      <aside class="order-summary">
        <h2>Tóm tắt đơn hàng</h2>

        <div class="summary-row">
          <span>Tạm tính ({{ shop.cartCount }} sản phẩm)</span>
          <b>{{ formatPrice(shop.subtotal) }}</b>
        </div>

        <div v-if="shop.discountAmount > 0" class="summary-row discount-row">
          <span>Ưu đãi ({{ shop.couponCode }} -{{ shop.discountPercent }}%)</span>
          <b class="discount-value">−{{ formatPrice(shop.discountAmount) }}</b>
        </div>

        <div class="summary-row">
          <span>Phí cấp phép &amp; bàn giao</span>
          <b class="free-text">Miễn phí (0₫)</b>
        </div>

        <div class="summary-row summary-total">
          <span>Tổng thanh toán</span>
          <strong class="total-price-tag">{{ formatPrice(shop.finalTotal) }}</strong>
        </div>

        <p class="summary-note">Giá hiển thị là số liệu demo bằng VNĐ. Hệ thống hỗ trợ trải nghiệm thanh toán mô phỏng an toàn.</p>

        <RouterLink class="button button-primary button-wide checkout-cta-btn" to="/thanh-toan">
          Tiến hành thanh toán <span>→</span>
        </RouterLink>

        <!-- Trust Badges Block -->
        <div class="cart-trust-badges">
          <div class="trust-badge-item">
            <span class="trust-badge-icon">
              <svg class="text-cyan-400 animate-pulse icon-ai-glow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </span>
            <div>
              <b>Kích hoạt tự động</b>
              <small>Cấp key và hướng dẫn ngay sau thanh toán</small>
            </div>
          </div>
          <div class="trust-badge-item">
            <span class="trust-badge-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </span>
            <div>
              <b>Chính hãng 100%</b>
              <small>Cam kết bản quyền và bảo hành toàn thời hạn</small>
            </div>
          </div>
          <div class="trust-badge-item">
            <span class="trust-badge-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
            </span>
            <div>
              <b>Hỗ trợ kỹ thuật 24/7</b>
              <small>Đội ngũ chuyên gia UltraViewer / AnyDesk sẵn sàng</small>
            </div>
          </div>
        </div>

        <div class="secure-note">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -1px; margin-right: 4px;">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Mô phỏng giao dịch bảo mật SSL 256-bit
        </div>
      </aside>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state cart-empty">
      <div class="empty-icon" aria-hidden="true">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="8" cy="21" r="1"/>
          <circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
      </div>
      <h2>Giỏ hàng của bạn đang trống</h2>
      <p>Hãy khám phá các danh mục phần mềm bản quyền, tên miền và giải pháp đám mây của DXTechs.</p>
      <div class="empty-cart-actions">
        <RouterLink class="button button-primary" to="/phan-mem">Xem phần mềm bản quyền</RouterLink>
        <RouterLink class="button button-outline" to="/dich-vu">Khám phá giải pháp số</RouterLink>
      </div>
    </div>
  </div>
</template>
