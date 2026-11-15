<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '../data/products'
import { formatPrice } from '../data/products'
import { useShopStore } from '../stores/shop'

const props = defineProps<{ product: Product }>()
const router = useRouter()
const shop = useShopStore()
const imageFailed = ref(false)

function useFallbackImage() {
  imageFailed.value = true
}

const discountPercent = computed(() => {
  if (!props.product.oldPrice || props.product.oldPrice <= props.product.price) return null
  return Math.round(((props.product.oldPrice - props.product.price) / props.product.oldPrice) * 100)
})

const isAiProduct = computed(() => {
  const b = props.product.badge?.toLowerCase() || ''
  const n = props.product.name.toLowerCase()
  return b.includes('ai') || n.includes('copilot') || n.includes('chatgpt')
})

function buyNow(product: Product) {
  shop.addToCart(product, 1, false)
  router.push('/thanh-toan')
}
</script>

<template>
  <article class="product-card">
    <RouterLink class="product-image" :to="`/san-pham/${product.slug}`">
      <div class="product-badge-stack">
        <span class="product-badge official-badge" title="Bản quyền chính hãng 100%">
          <svg class="badge-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <span>Official License</span>
        </span>
        <span
          v-if="product.badge"
          class="product-badge promo-badge"
          :class="{ 'ai-badge text-cyan-400': isAiProduct }"
        >
          <svg
            v-if="isAiProduct"
            class="badge-ai-sparkle animate-pulse text-cyan-400"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          <span>{{ product.badge }}</span>
        </span>
      </div>
      <img
        :src="imageFailed ? `/products/${product.category}.svg` : product.imageUrl"
        :alt="`Minh họa ${product.name}`"
        loading="lazy"
        @error="useFallbackImage"
      />
      <span class="image-caption">
        {{ product.categoryLabel }}
      </span>
    </RouterLink>
    <div class="product-copy">
      <span class="product-category">{{ product.categoryLabel }}</span>
      <RouterLink class="product-name" :to="`/san-pham/${product.slug}`">{{ product.name }}</RouterLink>
      <p>{{ product.description }}</p>
      <div class="product-meta-row">
        <div class="product-term-pill">
          <svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{{ product.term }}</span>
        </div>
        <div v-if="product.os && product.os.length" class="product-os-list">
          <span v-for="os in product.os" :key="os" class="os-mini-badge">{{ os }}</span>
        </div>
      </div>
      <div class="product-card-bottom">
        <div class="product-price-block">
          <div v-if="product.oldPrice" class="product-price-top">
            <del>{{ formatPrice(product.oldPrice) }}</del>
            <span v-if="discountPercent" class="discount-pill">-{{ discountPercent }}%</span>
          </div>
          <div class="product-price-current">
            <strong class="price-amount">{{ formatPrice(product.price) }}</strong>
          </div>
          <small class="product-price-note">✓ Kích hoạt online 30s</small>
        </div>
        <div class="product-card-actions-group">
          <button
            class="btn-quick-add"
            type="button"
            :aria-label="`Thêm ${product.name} vào giỏ hàng`"
            :title="`Thêm ${product.name} vào giỏ hàng`"
            @click.stop="shop.addToCart(product)"
          >
            <svg class="cart-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
          <button
            class="btn-buy-now"
            type="button"
            :aria-label="`Mua ngay ${product.name}`"
            @click.stop="buyNow(product)"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card-actions-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-quick-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid #e0e0e0;
  background: #f5f5f7;
  color: #0066cc;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
}

.btn-quick-add:hover {
  background: #e0e0e0;
  border-color: #0066cc;
}

.btn-quick-add:active {
  transform: scale(0.95);
}

.btn-buy-now {
  padding: 8px 18px;
  min-height: 38px;
  border-radius: var(--radius-pill, 9999px);
  border: none;
  background: #0066cc;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: none;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.btn-buy-now:hover {
  background: #0066cc;
}

.btn-buy-now:active {
  transform: scale(0.95);
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(41, 151, 255, 0.12) !important;
  border: 1px solid rgba(41, 151, 255, 0.3) !important;
  box-shadow: 0 0 8px rgba(41, 151, 255, 0.25);
}

.badge-ai-sparkle {
  flex-shrink: 0;
}
</style>
