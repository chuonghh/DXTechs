<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { formatPrice } from '../data/products'
import { useShopStore } from '../stores/shop'

const shop = useShopStore()
const router = useRouter()

// PR-C4: mở ngăn giỏ / đổi số lượng ⇒ lấy báo giá thật từ server (giá, tồn kho). Chờ 400 ms để bấm +/- liên tục chỉ gọi một lần.
let quoteTimer: ReturnType<typeof setTimeout> | undefined
watch([() => shop.isCartDrawerOpen, () => shop.cart], ([open]) => {
  if (!open) return
  clearTimeout(quoteTimer)
  quoteTimer = setTimeout(() => void shop.refreshQuote(), 400)
}, { deep: true })

function goToCheckout() {
  shop.closeCartDrawer()
  router.push('/thanh-toan')
}

function goToCart() {
  shop.closeCartDrawer()
  router.push('/gio-hang')
}
</script>

<template>
  <!-- Backdrop -->
  <Transition name="drawer-fade">
    <div
      v-if="shop.isCartDrawerOpen"
      class="cart-drawer-backdrop"
      @click="shop.closeCartDrawer"
    ></div>
  </Transition>

  <!-- Slide Panel -->
  <Transition name="drawer-slide">
    <aside
      v-if="shop.isCartDrawerOpen"
      class="cart-drawer"
      aria-label="Giỏ hàng nhanh"
      role="dialog"
      aria-modal="true"
    >
      <!-- Header -->
      <div class="drawer-header">
        <div class="drawer-title-group">
          <svg class="drawer-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="20" r="1.5"></circle>
            <circle cx="18" cy="20" r="1.5"></circle>
            <path d="M1 2h4l2.68 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h2 class="drawer-title">Giỏ hàng của bạn</h2>
          <span class="drawer-count-badge">{{ shop.cartCount }}</span>
        </div>
        <button
          class="drawer-close-btn"
          type="button"
          aria-label="Đóng giỏ hàng"
          @click="shop.closeCartDrawer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!shop.cart.length" class="drawer-empty">
        <div class="empty-icon-circle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="20" r="1.5"></circle>
            <circle cx="18" cy="20" r="1.5"></circle>
            <path d="M1 2h4l2.68 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h3>Giỏ hàng đang trống</h3>
        <p>Khám phá kho phần mềm bản quyền chính hãng và giải pháp cloud của DXTechs ngay hôm nay.</p>
        <button class="drawer-explore-btn" type="button" @click="shop.closeCartDrawer">
          Khám phá danh mục
        </button>
      </div>

      <!-- Items List -->
      <div v-else class="drawer-body">
        <ul class="drawer-items-list">
          <li v-for="item in shop.cart" :key="item.product.id" class="drawer-item">
            <img
              class="drawer-item-img"
              :src="item.product.imageUrl"
              :alt="item.product.name"
            />
            <div class="drawer-item-info">
              <span class="drawer-item-category">{{ item.product.categoryLabel }}</span>
              <h4 class="drawer-item-name">{{ item.product.name }}</h4>
              <div class="drawer-item-price">{{ formatPrice(shop.quoteLineFor(item)?.unitPriceVnd ?? item.product.price) }}</div>
              <small v-if="shop.quoteLineFor(item) && shop.quoteLineFor(item)!.status !== 'ok'" class="drawer-item-stock">
                {{ shop.quoteLineFor(item)!.status === 'insufficient_stock' ? `Chỉ còn ${shop.quoteLineFor(item)!.availableQuantity}` : 'Tạm hết hàng' }}
              </small>
              
              <div class="drawer-item-controls">
                <div class="qty-pill">
                  <button
                    type="button"
                    class="qty-btn"
                    :disabled="item.quantity <= 1"
                    @click="shop.updateQuantity(item.product.id, item.quantity - 1)"
                  >
                    -
                  </button>
                  <span class="qty-val">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="qty-btn"
                    @click="shop.updateQuantity(item.product.id, item.quantity + 1)"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  class="drawer-remove-btn"
                  title="Xóa sản phẩm"
                  @click="shop.removeFromCart(item.product.id)"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </li>
        </ul>

      </div>

      <!-- Footer / Summary -->
      <div v-if="shop.cart.length" class="drawer-footer">
        <div class="drawer-summary">
          <div class="summary-line">
            <span>Tạm tính</span>
            <span>{{ formatPrice(shop.subtotal) }}</span>
          </div>
          <div v-if="shop.discountAmount > 0" class="summary-line discount">
            <span>Giảm giá</span>
            <span>-{{ formatPrice(shop.discountAmount) }}</span>
          </div>
          <div class="summary-line total">
            <span>Tổng cộng</span>
            <span class="total-amount">{{ formatPrice(shop.finalTotal) }}</span>
          </div>
          <p class="vat-note">Đã bao gồm thuế GTGT & cấp mã giấy phép tức thì</p>
        </div>

        <div class="drawer-actions">
          <button class="drawer-btn-checkout" type="button" @click="goToCheckout">
            <span>Thanh toán ngay</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <button class="drawer-btn-cart" type="button" @click="goToCart">
            Xem chi tiết giỏ hàng
          </button>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
/* ==========================================================================
   APPLE DESIGN SYSTEM: STORE BAG DRAWER (DESIGN.md)
   - Canvas White (#ffffff) & Parchment (#f5f5f7)
   - Action Blue (#0066cc) CTAs with pill radius (9999px) and scale(0.95) active
   - Hairline borders (#e0e0e0), Near-black ink (#1d1d1f)
   - Zero decorative gradients, zero chrome shadows
   ========================================================================== */
.cart-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-left: 1px solid #e0e0e0;
  box-shadow: none;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Be Vietnam Pro", system-ui, sans-serif;
}

/* Transitions */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

.drawer-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f5f5f7;
}

.drawer-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drawer-icon {
  color: #1d1d1f;
}

.drawer-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: #1d1d1f;
  letter-spacing: -0.374px;
}

.drawer-count-badge {
  background: #1d1d1f;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
}

.drawer-close-btn {
  background: #fafafc;
  border: 1px solid #e0e0e0;
  color: #1d1d1f;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.drawer-close-btn:hover {
  background: #f0f0f0;
}
.drawer-close-btn:active {
  transform: scale(0.95);
}

.drawer-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
}

.empty-icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  color: #7a7a7a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.drawer-empty h3 {
  font-size: 21px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px;
  letter-spacing: -0.28px;
}

.drawer-empty p {
  color: #7a7a7a;
  font-size: 14px;
  line-height: 1.43;
  margin: 0 0 24px;
  max-width: 280px;
}

.drawer-explore-btn {
  background: #0066cc;
  color: #ffffff;
  border: none;
  padding: 11px 22px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.drawer-explore-btn:hover {
  background: #0071e3;
}
.drawer-explore-btn:active {
  transform: scale(0.95);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: #ffffff;
}

.drawer-items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.drawer-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
}

.drawer-item-img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  box-shadow: rgba(0, 0, 0, 0.22) 3px 5px 30px 0;
}

.drawer-item-info {
  flex: 1;
  min-width: 0;
}

.drawer-item-category {
  font-size: 11px;
  text-transform: uppercase;
  color: #7a7a7a;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.drawer-item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 2px 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.374px;
}

.drawer-item-price {
  color: #1d1d1f;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
}

.drawer-item-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.qty-pill {
  display: inline-flex;
  align-items: center;
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  border-radius: 9999px;
  overflow: hidden;
}

.qty-btn {
  background: transparent;
  border: none;
  color: #1d1d1f;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}
.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-val {
  padding: 0 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1d1d1f;
}

.drawer-remove-btn {
  background: transparent;
  border: none;
  color: #0066cc;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.drawer-remove-btn:hover {
  text-decoration: underline;
}

.drawer-coupon-box {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #e0e0e0;
}

.drawer-coupon-input-group {
  display: flex;
  gap: 8px;
}

.drawer-coupon-input-group input {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #1d1d1f;
  padding: 10px 14px;
  border-radius: 9999px;
  font-size: 14px;
}
.drawer-coupon-input-group input:focus {
  outline: none;
  border-color: #0071e3;
  box-shadow: 0 0 0 2px #0071e3;
}

.drawer-coupon-input-group button {
  background: #1d1d1f;
  border: none;
  color: #ffffff;
  padding: 0 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.drawer-coupon-input-group button:active {
  transform: scale(0.95);
}

.drawer-coupon-applied {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  padding: 8px 14px;
  border-radius: 9999px;
}

.coupon-tag {
  color: #1d1d1f;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.coupon-remove {
  background: transparent;
  border: none;
  color: #0066cc;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
}

.drawer-footer {
  padding: 20px 24px;
  background: #f5f5f7;
  border-top: 1px solid #e0e0e0;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #7a7a7a;
  margin-bottom: 6px;
}

.summary-line.discount {
  color: #1d1d1f;
  font-weight: 600;
}

.summary-line.total {
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.total-amount {
  color: #1d1d1f;
  font-weight: 600;
}

.vat-note {
  font-size: 12px;
  color: #7a7a7a;
  margin: 4px 0 16px;
}

.drawer-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drawer-btn-checkout {
  width: 100%;
  background: #0066cc;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 9999px;
  font-weight: 400;
  font-size: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.15s ease, background-color 0.15s ease;
  box-shadow: none;
}
.drawer-btn-checkout:hover {
  background: #0071e3;
}
.drawer-btn-checkout:active {
  transform: scale(0.95);
}

.drawer-btn-cart {
  width: 100%;
  background: transparent;
  color: #0066cc;
  border: 1px solid #0066cc;
  padding: 10px;
  border-radius: 9999px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.drawer-btn-cart:hover {
  background: #fafafc;
}
.drawer-btn-cart:active {
  transform: scale(0.95);
}
.drawer-item-stock { display: block; color: #b45309; font-size: .78rem; }
</style>

