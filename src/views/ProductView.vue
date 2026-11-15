<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LucianButton from '../components/LucianButton.vue'
import LucianCopyButton from '../components/LucianCopyButton.vue'
import LucianSegmented from '../components/LucianSegmented.vue'
import ProductCard from '../components/ProductCard.vue'
import { formatPrice, products } from '../data/products.ts'
import { useShopStore } from '../stores/shop.ts'

const route = useRoute()
const router = useRouter()
const shop = useShopStore()
const imageFailed = ref(false)

const product = computed(() => {
  const slug = String(route.params.slug || '')
  return shop.productList?.find((item) => item.slug === slug) || products.find((item) => item.slug === slug)
})

const quantity = ref(1)

function increaseQty() {
  quantity.value++
}

function decreaseQty() {
  if (quantity.value > 1) quantity.value--
}

const totalPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price * quantity.value
})

const discountPercent = computed(() => {
  if (!product.value?.oldPrice || product.value.oldPrice <= product.value.price) return null
  return Math.round(((product.value.oldPrice - product.value.price) / product.value.oldPrice) * 100)
})

const isAiProduct = computed(() => {
  if (!product.value) return false
  const b = product.value.badge?.toLowerCase() || ''
  const n = product.value.name.toLowerCase()
  return b.includes('ai') || n.includes('copilot') || n.includes('chatgpt')
})

// 3D Tilt Card Interaction
const cardRef = ref<HTMLElement | null>(null)
const tiltX = ref(0)
const tiltY = ref(0)
const glareX = ref(50)
const glareY = ref(50)
const isHovering = ref(false)

function handleMouseMove(e: MouseEvent) {
  if (!cardRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  tiltX.value = -((y - centerY) / centerY) * 10
  tiltY.value = ((x - centerX) / centerX) * 10
  glareX.value = (x / rect.width) * 100
  glareY.value = (y / rect.height) * 100
}

function handleMouseEnter() {
  isHovering.value = true
}

function handleMouseLeave() {
  isHovering.value = false
  tiltX.value = 0
  tiltY.value = 0
  glareX.value = 50
  glareY.value = 50
}

// Active Tab
const activeDetailTab = ref<'features' | 'activation' | 'warranty' | 'reviews'>('features')
const detailTabOptions = [
  { value: 'features', label: 'Tính năng & Quyền lợi' },
  { value: 'activation', label: 'Hướng dẫn kích hoạt 3 bước' },
  { value: 'warranty', label: 'Bảo hành & Hóa đơn VAT' },
  { value: 'reviews', label: 'Đánh giá khách hàng' },
]

// Sample Product Key Simulation
const sampleKey = computed(() => {
  if (!product.value) return 'DXT-MICROSOFT-GENUINE-KEY-2025'
  const prefix = product.value.category.toUpperCase().slice(0, 3)
  return `${prefix}25-A8F9-94BE-7C21-DXTECH`
})

// Reviews
const reviewFormOpen = ref(false)
const reviewForm = reactive({ name: '', rating: 5, comment: '' })

const defaultReviews = [
  {
    id: 1,
    name: 'Đặng Tuấn Anh (CTO - FinTech)',
    rating: 5,
    comment: 'Bản quyền kích hoạt mượt mà, liên kết trực tiếp vào tài khoản công ty. Hóa đơn điện tử VAT gửi về email chỉ sau 15 phút.',
    period: 'Đã mua hàng',
    helpful: 16,
  },
  {
    id: 2,
    name: 'Nguyễn Bích Ngọc (Lead Designer)',
    rating: 5,
    comment: 'Cấp quyền nhanh chóng, tải và dùng bản mới nhất không gặp lỗi gì. Kỹ thuật viên hỗ trợ nhiệt tình qua UltraViewer.',
    period: 'Đã mua hàng',
    helpful: 9,
  },
  {
    id: 3,
    name: 'Trần Quang Huy (DevOps Engineer)',
    rating: 5,
    comment: 'Giá tốt hơn nhiều so với mua lẻ từng năm, key retail chuẩn Microsoft liên kết tài khoản vĩnh viễn rất an tâm.',
    period: 'Đã mua hàng',
    helpful: 12,
  },
]

const productReviews = ref([...defaultReviews])
const reviewCount = computed(() => productReviews.value.length)
const averageRating = computed(() => {
  if (!reviewCount.value) return '5.0'
  return (productReviews.value.reduce((sum, r) => sum + r.rating, 0) / reviewCount.value).toFixed(1)
})

const ratingBreakdown = computed(() => [5, 4, 3, 2, 1].map((rating) => {
  const count = productReviews.value.filter((r) => r.rating === rating).length
  return { rating, count, percentage: reviewCount.value ? Math.round((count / reviewCount.value) * 100) : 0 }
}))

function submitReview() {
  const name = reviewForm.name.trim()
  const comment = reviewForm.comment.trim()
  if (!name || !comment) return

  productReviews.value.unshift({
    id: Date.now(),
    name,
    rating: reviewForm.rating,
    comment,
    period: 'Vừa đánh giá',
    helpful: 0,
  })
  reviewForm.name = ''
  reviewForm.rating = 5
  reviewForm.comment = ''
  reviewFormOpen.value = false
  shop.notify(`Cảm ơn bạn đã gửi đánh giá cho ${product.value?.name}`)
}

// Add to Cart & Buy Now
function addToCart() {
  if (!product.value) return
  shop.addToCart(product.value, quantity.value)
}

function buyNow() {
  if (!product.value) return
  shop.addToCart(product.value, quantity.value, false)
  router.push('/thanh-toan')
}

// Related Products Slideshow
const relatedProducts = computed(() => (shop.productList || products).filter((item) => item.category === product.value?.category && item.id !== product.value?.id))
const relatedProductsPerPage = 3
const relatedPage = ref(0)
const relatedSlideDirection = ref<'next' | 'previous'>('next')
const relatedSlideshowPaused = ref(false)
const relatedPageCount = computed(() => Math.ceil(relatedProducts.value.length / relatedProductsPerPage))
const visibleRelatedProducts = computed(() => relatedProducts.value.slice(
  relatedPage.value * relatedProductsPerPage,
  (relatedPage.value + 1) * relatedProductsPerPage,
))
let relatedSlideTimer: ReturnType<typeof setInterval> | undefined

function stopRelatedSlideshow() {
  if (!relatedSlideTimer) return
  clearInterval(relatedSlideTimer)
  relatedSlideTimer = undefined
}

function startRelatedSlideshow() {
  stopRelatedSlideshow()
  if (relatedSlideshowPaused.value || relatedPageCount.value < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  relatedSlideTimer = setInterval(() => changeRelatedPage(relatedPage.value + 1), 8000)
}

function pauseRelatedSlideshow() {
  relatedSlideshowPaused.value = true
  stopRelatedSlideshow()
}

function resumeRelatedSlideshow(event?: FocusEvent) {
  if (event?.relatedTarget instanceof Node && event.currentTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return
  relatedSlideshowPaused.value = false
  startRelatedSlideshow()
}

function changeRelatedPage(page: number) {
  if (relatedPageCount.value < 2) return
  relatedSlideDirection.value = page >= relatedPage.value ? 'next' : 'previous'
  relatedPage.value = (page + relatedPageCount.value) % relatedPageCount.value
  startRelatedSlideshow()
}

watch(() => product.value?.id, () => {
  relatedPage.value = 0
  quantity.value = 1
  imageFailed.value = false
  startRelatedSlideshow()
})

onMounted(startRelatedSlideshow)
onUnmounted(stopRelatedSlideshow)
</script>

<template>
  <div v-if="product" class="content-wrap product-detail-awesome">
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs" aria-label="Đường dẫn trang">
      <RouterLink to="/">Trang chủ</RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink :to="product.category === 'software' ? '/phan-mem' : '/dich-vu'">{{ product.categoryLabel }}</RouterLink>
      <span aria-hidden="true">/</span>
      <span class="breadcrumb-current">{{ product.name }}</span>
    </nav>

    <!-- Top Showcase Grid -->
    <section class="pdetail-hero-grid">
      <!-- Left: 3D Tilt Product License Showcase Card -->
      <div class="pdetail-visual-col">
        <div
          ref="cardRef"
          class="pdetail-3d-card"
          :style="{
            transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }"
          @mousemove="handleMouseMove"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <!-- Dynamic Glare Light Sheen -->
          <div
            class="pdetail-card-glare"
            :style="{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`,
              opacity: isHovering ? 1 : 0
            }"
            aria-hidden="true"
          ></div>

          <!-- Top Badge Stack -->
          <div class="pdetail-card-header">
            <span class="pdetail-official-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span>100% Genuine License</span>
            </span>
            <span
              v-if="product.badge"
              class="pdetail-promo-badge"
              :class="{ 'ai-badge text-cyan-400': isAiProduct }"
            >
              <svg
                v-if="isAiProduct"
                class="badge-ai-sparkle animate-pulse text-cyan-400"
                width="13"
                height="13"
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

          <!-- Central Product Graphic Stage -->
          <div class="pdetail-image-stage">
            <img
              :src="imageFailed ? `/products/${product.category}.svg` : product.imageUrl"
              :alt="`Hình minh họa ${product.name}`"
              class="pdetail-img"
              @error="imageFailed = true"
            />
            <div class="pdetail-holo-seal" aria-hidden="true">
              <span class="seal-ring"></span>
              <span class="seal-text">VERIFIED CSP PARTNER</span>
            </div>
          </div>

          <!-- License Key Simulator Strip -->
          <div class="pdetail-license-box">
            <div class="license-box-top">
              <span class="license-box-kicker">MÃ GIẤY PHÉP ĐIỆN TỬ (ESD KEY)</span>
              <span class="license-status-dot">Kích hoạt trực tuyến 24/7</span>
            </div>
            <div class="license-key-display">
              <code>{{ sampleKey }}</code>
              <LucianCopyButton :text="sampleKey" label="Sao chép" />
            </div>
            <p class="license-box-note">Mã kích hoạt chính hãng được hệ thống tự động gán và gửi qua email trong vòng 30 giây.</p>
          </div>
        </div>

        <!-- Trust Badges Strip Below Visual -->
        <div class="pdetail-trust-pills">
          <div class="trust-pill-item">
            <span class="pill-icon">
              <svg class="text-cyan-400 animate-pulse icon-ai-glow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </span>
            <div><strong>Giao key tự động</strong><small>&lt; 30 giây qua email</small></div>
          </div>
          <div class="trust-pill-item">
            <span class="pill-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </span>
            <div><strong>Bảo hành 1 đổi 1</strong><small>Cam kết trọn đời gói</small></div>
          </div>
          <div class="trust-pill-item">
            <span class="pill-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
                <path d="M8 7h8"/>
                <path d="M8 11h8"/>
                <path d="M8 15h5"/>
              </svg>
            </span>
            <div><strong>Xuất hóa đơn VAT</strong><small>100% đầy đủ thuế GTGT</small></div>
          </div>
        </div>
      </div>

      <!-- Right: Product Purchase & Info Column -->
      <div class="pdetail-info-col">
        <div class="pdetail-header-block">
          <div class="pdetail-category-tag">
            <span>{{ product.categoryLabel.toUpperCase() }}</span>
            <span class="tag-divider">·</span>
            <span>BẢN QUYỀN CHÍNH HÃNG</span>
          </div>
          <h1 class="pdetail-title">{{ product.name }}</h1>
          <p class="pdetail-lead">{{ product.description }}</p>
        </div>

        <!-- Price Display Block -->
        <div class="pdetail-price-card">
          <div class="price-row-top">
            <span class="price-kicker">GIÁ ƯU ĐÃI CHÍNH HÃNG</span>
            <span v-if="discountPercent" class="discount-pill">Tiết kiệm {{ discountPercent }}%</span>
          </div>
          <div class="price-row-main">
            <del v-if="product.oldPrice" class="old-price">{{ formatPrice(product.oldPrice) }}</del>
            <strong class="current-price">{{ formatPrice(product.price) }}</strong>
            <span class="vat-included-tag">Đã gồm 10% VAT</span>
          </div>
          <p class="price-assurance">
            <span class="check-icon">✓</span>
            <span>Cấp phép vĩnh viễn hoặc theo kỳ hạn chuẩn nhà phát hành. Không phí ẩn.</span>
          </p>
        </div>

        <!-- Specifications Mini-Grid -->
        <div class="pdetail-quick-specs">
          <div class="spec-card-mini">
            <span class="spec-kicker">HÌNH THỨC CẤP PHÉP</span>
            <strong>{{ product.license }}</strong>
          </div>
          <div class="spec-card-mini">
            <span class="spec-kicker">THỜI HẠN / GÓI</span>
            <strong>{{ product.term }}</strong>
          </div>
          <div class="spec-card-mini">
            <span class="spec-kicker">TƯƠNG THÍCH HỆ ĐIỀU HÀNH</span>
            <strong>{{ product.os.length ? product.os.join(', ') : 'Quản lý đa nền tảng Cloud' }}</strong>
          </div>
          <div class="spec-card-mini">
            <span class="spec-kicker">KỸ THUẬT HỖ TRỢ</span>
            <strong>UltraViewer 24/7 Miễn phí</strong>
          </div>
        </div>

        <!-- Purchase Action Controls -->
        <div class="pdetail-actions-box">
          <div class="quantity-row">
            <label class="qty-label">Số lượng bản quyền:</label>
            <div class="qty-stepper">
              <button type="button" class="stepper-btn" :disabled="quantity <= 1" aria-label="Giảm số lượng" @click="decreaseQty">−</button>
              <span class="qty-display">{{ quantity }}</span>
              <button type="button" class="stepper-btn" aria-label="Tăng số lượng" @click="increaseQty">+</button>
            </div>
            <div v-if="quantity > 1" class="total-calc-display">
              Tổng tiền: <strong>{{ formatPrice(totalPrice) }}</strong>
            </div>
          </div>

          <div class="action-buttons-group">
            <LucianButton
              variant="outline"
              size="lg"
              class="btn-add-cart-large"
              @click="addToCart"
            >
              Thêm vào giỏ hàng <span aria-hidden="true">＋</span>
            </LucianButton>
            <LucianButton
              variant="primary"
              size="lg"
              class="btn-buy-now-large"
              @click="buyNow"
            >
              Mua ngay &amp; Kích hoạt <span>→</span>
            </LucianButton>
          </div>

          <div class="direct-support-hint">
            <span>Cần tư vấn hợp đồng doanh nghiệp lớn?</span>
            <RouterLink :to="{ path: '/lien-he', query: { service: product.name } }">
              Yêu cầu báo giá B2B chiết khấu tới 35% →
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Tabs Section -->
    <section class="pdetail-tabs-section">
      <div class="tabs-control-wrap">
        <LucianSegmented
          v-model="activeDetailTab"
          :items="detailTabOptions"
          aria-label="Chọn mục thông tin chi tiết sản phẩm"
        />
      </div>

      <!-- Tab Content 1: Features -->
      <div v-show="activeDetailTab === 'features'" class="tab-panel tab-features-panel">
        <div class="panel-intro">
          <span class="eyebrow">TÍNH NĂNG VƯỢT TRỘI</span>
          <h2>Quyền lợi &amp; Tính năng đi kèm bản quyền</h2>
          <p>Mọi tính năng được cập nhật chính hãng từ nhà sản xuất không bị giới hạn.</p>
        </div>
        <div class="features-grid-3d">
          <article v-for="(feature, idx) in product.features" :key="idx" class="feature-card-3d">
            <span class="feature-idx">0{{ idx + 1 }}</span>
            <div class="feature-check-icon">✓</div>
            <h3>{{ feature }}</h3>
            <p>Cam kết sử dụng đầy đủ các quyền lợi trực tuyến, cập nhật bảo mật định kỳ và hỗ trợ kỹ thuật chính thức từ nhà phát hành.</p>
          </article>
        </div>
      </div>

      <!-- Tab Content 2: 3-Step Activation Guide -->
      <div v-show="activeDetailTab === 'activation'" class="tab-panel tab-activation-panel">
        <div class="panel-intro">
          <span class="eyebrow">KÍCH HOẠT NHANH CHÓNG</span>
          <h2>Quy trình nhận và kích hoạt bản quyền 3 bước</h2>
          <p>Hệ thống tự động hóa 100% giúp bạn sử dụng phần mềm trong vòng 3 phút.</p>
        </div>
        <div class="steps-timeline-grid">
          <div class="timeline-step-card">
            <span class="step-num-badge">BƯỚC 01</span>
            <h3>Đặt mua &amp; Thanh toán tự động</h3>
            <p>Chọn phương thức thanh toán qua VietQR, chuyển khoản ngân hàng hoặc thẻ tín dụng. Hệ thống xác nhận giao dịch trong 5 giây.</p>
          </div>
          <div class="timeline-step-card">
            <span class="step-num-badge">BƯỚC 02</span>
            <h3>Nhận Product Key qua Email &amp; Web</h3>
            <p>Mã bản quyền chính hãng (Product Key / License Key) và hóa đơn điện tử VAT được gửi thẳng vào email đăng ký và lưu tại mục Tài khoản.</p>
          </div>
          <div class="timeline-step-card">
            <span class="step-num-badge">BƯỚC 03</span>
            <h3>Nhập Key &amp; Hỗ trợ UltraViewer</h3>
            <p>Nhập mã trực tiếp vào phần mềm để liên kết bản quyền. Nếu cần hỗ trợ, kỹ sư DXTechs sẵn sàng UltraViewer từ xa miễn phí.</p>
          </div>
        </div>
      </div>

      <!-- Tab Content 3: Warranty & VAT -->
      <div v-show="activeDetailTab === 'warranty'" class="tab-panel tab-warranty-panel">
        <div class="panel-intro">
          <span class="eyebrow">CAM KẾT PHÁP LÝ &amp; BẢO HÀNH</span>
          <h2>Chính sách bảo hành &amp; Hóa đơn GTGT</h2>
          <p>Bảo đảm an toàn pháp lý tuyệt đối cho cá nhân và tổ chức doanh nghiệp.</p>
        </div>
        <div class="warranty-cards-grid">
          <div class="warranty-card">
            <span class="w-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </span>
            <h3>Bảo hành 1 đổi 1 trọn đời gói</h3>
            <p>Trong toàn bộ thời hạn bản quyền, nếu mã key gặp sự cố kỹ thuật từ hệ thống nhà cung cấp, bạn sẽ được cấp lại mã mới ngay lập tức.</p>
          </div>
          <div class="warranty-card">
            <span class="w-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
                <path d="M8 7h8"/>
                <path d="M8 11h8"/>
                <path d="M8 15h5"/>
              </svg>
            </span>
            <h3>Hóa đơn điện tử VAT 100%</h3>
            <p>Xuất hóa đơn GTGT hợp pháp theo thông tư Tổng cục Thuế, phục vụ đầy đủ quyết toán chi phí doanh nghiệp.</p>
          </div>
          <div class="warranty-card">
            <span class="w-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="18" height="12" x="3" y="4" rx="2"/>
                <line x1="2" x2="22" y1="20" y2="20"/>
              </svg>
            </span>
            <h3>Hỗ trợ chuyển đổi thiết bị</h3>
            <p>Với các loại giấy phép Retail hoặc Subscription, bạn có thể dễ dàng chuyển bản quyền sang máy tính mới khi đổi máy.</p>
          </div>
        </div>
      </div>

      <!-- Tab Content 4: Customer Reviews -->
      <div v-show="activeDetailTab === 'reviews'" class="tab-panel tab-reviews-panel">
        <div class="reviews-summary-bar">
          <div class="rating-big-card">
            <span class="score-number">{{ averageRating }}</span>
            <div class="stars-row" aria-label="5 trên 5 sao">
              <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="#ff9f0a" stroke="none" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span class="reviews-count-label">{{ reviewCount }} đánh giá thực tế</span>
          </div>

          <div class="rating-bars-stack">
            <div v-for="row in ratingBreakdown" :key="row.rating" class="rating-bar-row">
              <span class="bar-star-label">
                {{ row.rating }}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff9f0a" stroke="none" aria-hidden="true" style="display: inline-block; vertical-align: -1px; margin-left: 2px;">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: `${row.percentage}%` }"></div>
              </div>
              <span class="bar-count-label">{{ row.count }}</span>
            </div>
          </div>

          <div class="write-review-prompt">
            <LucianButton
              variant="outline"
              @click="reviewFormOpen = !reviewFormOpen"
            >
              {{ reviewFormOpen ? 'Đóng form đánh giá' : 'Viết đánh giá của bạn' }}
            </LucianButton>
          </div>
        </div>

        <!-- Review Form -->
        <form v-if="reviewFormOpen" class="new-review-form" @submit.prevent="submitReview">
          <h3>Chia sẻ trải nghiệm sử dụng</h3>
          <div class="form-grid-two">
            <label class="form-field">
              <span class="field-label">Họ và tên của bạn:</span>
              <input v-model="reviewForm.name" class="form-input-enhanced" required placeholder="Ví dụ: Hoàng Tuấn" />
            </label>
            <div class="form-field">
              <span class="field-label">Mức độ hài lòng (1 - 5 sao):</span>
              <select v-model="reviewForm.rating" class="form-select-enhanced">
                <option :value="5">5 sao — Cực kỳ hài lòng</option>
                <option :value="4">4 sao — Hài lòng</option>
                <option :value="3">3 sao — Bình thường</option>
                <option :value="2">2 sao — Cần cải thiện</option>
                <option :value="1">1 sao — Không hài lòng</option>
              </select>
            </div>
          </div>
          <label class="form-field">
            <span class="field-label">Nội dung nhận xét:</span>
            <textarea
              v-model="reviewForm.comment"
              class="form-textarea-enhanced"
              required
              rows="3"
              placeholder="Chia sẻ về độ mượt của việc kích hoạt, hỗ trợ kỹ thuật hoặc trải nghiệm phần mềm..."
            ></textarea>
          </label>
          <div class="form-submit-row">
            <LucianButton variant="primary" type="submit">
              Gửi đánh giá
            </LucianButton>
          </div>
        </form>

        <!-- Reviews List -->
        <div class="reviews-list-grid">
          <article v-for="rev in productReviews" :key="rev.id" class="review-item-card">
            <div class="review-author-row">
              <div class="author-avatar">{{ rev.name.charAt(0) }}</div>
              <div class="author-info">
                <strong>{{ rev.name }}</strong>
                <span class="verified-purchase-badge">✓ {{ rev.period }}</span>
              </div>
              <div class="review-stars-pill">
                <svg v-for="s in rev.rating" :key="s" width="12" height="12" viewBox="0 0 24 24" fill="#ff9f0a" stroke="none" aria-hidden="true" style="margin-right: 1px;">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
            <p class="review-comment-text">{{ rev.comment }}</p>
            <div class="review-helpful-action">
              <button type="button" class="btn-helpful" @click="rev.helpful++">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -1px; margin-right: 4px;">
                  <path d="M7 10v12"/>
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3"/>
                </svg>
                Hữu ích ({{ rev.helpful }})
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Related Products Carousel -->
    <section
      v-if="relatedProducts.length"
      class="section-block related-products-container"
      aria-label="Sản phẩm liên quan"
      @mouseenter="pauseRelatedSlideshow"
      @mouseleave="resumeRelatedSlideshow()"
      @focusin="pauseRelatedSlideshow"
      @focusout="resumeRelatedSlideshow"
    >
      <div class="section-heading">
        <div>
          <span class="eyebrow">CÙNG DANH MỤC</span>
          <h2>Giải pháp liên quan bạn có thể quan tâm</h2>
        </div>
        <span v-if="relatedPageCount > 1" class="related-page-status" aria-live="polite">
          {{ relatedPage + 1 }} / {{ relatedPageCount }}
        </span>
      </div>

      <div class="related-products-stage">
        <div :key="relatedPage" :class="['product-grid', 'related-products-grid', `related-page-enter-${relatedSlideDirection}`]">
          <ProductCard v-for="item in visibleRelatedProducts" :key="item.id" :product="item" />
        </div>
      </div>

      <div v-if="relatedPageCount > 1" class="related-products-controls" aria-label="Điều khiển sản phẩm liên quan">
        <button type="button" class="related-page-arrow" aria-label="Trang trước" @click="changeRelatedPage(relatedPage - 1)">‹</button>
        <div class="related-page-dots" aria-label="Chọn trang sản phẩm">
          <button
            v-for="page in relatedPageCount"
            :key="page"
            type="button"
            :class="{ active: relatedPage === page - 1 }"
            :aria-label="`Hiển thị trang ${page}`"
            :aria-current="relatedPage === page - 1 ? 'page' : undefined"
            @click="changeRelatedPage(page - 1)"
          ></button>
        </div>
        <button type="button" class="related-page-arrow" aria-label="Trang tiếp theo" @click="changeRelatedPage(relatedPage + 1)">›</button>
      </div>
    </section>
  </div>

  <!-- Empty / Not Found State -->
  <div v-else class="content-wrap not-found-state">
    <div class="not-found-card-3d">
      <span class="not-found-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </span>
      <h2>Không tìm thấy sản phẩm yêu cầu</h2>
      <p>Sản phẩm này có thể đã được thay đổi danh mục hoặc tạm ngưng cung cấp. Bạn có thể duyệt lại toàn bộ danh mục bản quyền chính hãng tại kho phần mềm.</p>
      <RouterLink class="button button-primary" to="/phan-mem">
        Duyệt kho phần mềm bản quyền <span>→</span>
      </RouterLink>
    </div>
  </div>
</template>
