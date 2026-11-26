<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

export interface CategoryCarouselItem {
  id?: string | number
  title: string
  eyebrow?: string
  description?: string
  image: string
  imageAlt?: string
  to: RouteLocationRaw
  ctaText?: string
  icon?: string
}

const props = withDefaults(
  defineProps<{
    items: CategoryCarouselItem[]
    defaultEyebrow?: string
    defaultCtaText?: string
  }>(),
  {
    defaultEyebrow: 'Giải pháp số',
    defaultCtaText: 'Khám phá ngay',
  }
)

const scrollTrack = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

// Helper to select an ultra-clean precision line icon (1.8 stroke, Phosphor/Apple aesthetic)
function getIconType(item: CategoryCarouselItem): string {
  if (item.icon) return item.icon
  const t = item.title.toLowerCase()
  if (t.includes('quản trị') || t.includes('doanh nghiệp') || t.includes('tài chính') || t.includes('kpi')) return 'chart'
  if (t.includes('kinh doanh') || t.includes('thương mại') || t.includes('bán lẻ') || t.includes('bán hàng')) return 'briefcase'
  if (t.includes('sản xuất') || t.includes('chất lượng') || t.includes('bảo trì') || t.includes('nhà máy')) return 'gear'
  if (t.includes('vận hành') || t.includes('logistics') || t.includes('kho') || t.includes('giao nhận')) return 'box'
  if (t.includes('ai') || t.includes('tự động') || t.includes('trí tuệ')) return 'cpu'
  if (t.includes('erp')) return 'database'
  if (t.includes('mes')) return 'sliders'
  if (t.includes('mrp')) return 'layers'
  if (t.includes('web') || t.includes('giao diện')) return 'globe'
  if (t.includes('di động') || t.includes('mobile') || t.includes('app')) return 'smartphone'
  if (t.includes('cloud') || t.includes('devops') || t.includes('hosting')) return 'cloud'
  if (t.includes('bảo mật') || t.includes('ssl') || t.includes('an toàn')) return 'shield'
  if (t.includes('tên miền') || t.includes('domain')) return 'at-sign'
  if (t.includes('lưu trữ') || t.includes('storage') || t.includes('backup') || t.includes('sao lưu')) return 'hard-drive'
  return 'sparkles'
}

function updateScrollState() {
  const el = scrollTrack.value
  if (!el) return

  canScrollLeft.value = el.scrollLeft > 10
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 10

  const firstChild = el.firstElementChild as HTMLElement | null
  if (firstChild) {
    const cardWidth = firstChild.offsetWidth + 20 // width + gap
    const index = Math.round(el.scrollLeft / cardWidth)
    activeIndex.value = Math.max(0, Math.min(index, props.items.length - 1))
  }
}

function scroll(direction: -1 | 1) {
  const el = scrollTrack.value
  if (!el) return
  const firstChild = el.firstElementChild as HTMLElement | null
  const scrollAmount = firstChild ? (firstChild.offsetWidth + 20) * direction : el.clientWidth * 0.75 * direction
  el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

function scrollToItem(index: number) {
  const el = scrollTrack.value
  if (!el) return
  const firstChild = el.firstElementChild as HTMLElement | null
  if (firstChild) {
    const cardWidth = firstChild.offsetWidth + 20
    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
    activeIndex.value = index
  }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const el = scrollTrack.value
  if (!el) return
  el.addEventListener('scroll', updateScrollState, { passive: true })
  updateScrollState()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateScrollState())
    resizeObserver.observe(el)
  }
})

onBeforeUnmount(() => {
  const el = scrollTrack.value
  if (el) {
    el.removeEventListener('scroll', updateScrollState)
  }
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="category-carousel-wrapper" role="region" aria-label="Danh mục nổi bật">
    <!-- Prev Arrow Button -->
    <button
      type="button"
      class="carousel-nav-btn carousel-nav-prev"
      :class="{ 'is-disabled': !canScrollLeft }"
      :disabled="!canScrollLeft"
      aria-label="Xem danh mục trước"
      @click="scroll(-1)"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>

    <!-- Scroll Track -->
    <div ref="scrollTrack" class="category-carousel-track">
      <!-- Entire Card is a Semantic Accessible RouterLink with Double-Bezel Framing -->
      <RouterLink
        v-for="(item, index) in items"
        :key="item.id || item.title"
        :to="item.to"
        class="category-carousel-card"
        :class="{ 'is-active': activeIndex === index }"
      >
        <!-- Card Outer Shell & Visual Stage -->
        <div class="card-visual-frame">
          <img
            :src="item.image"
            :alt="item.imageAlt || `Hình minh họa ${item.title}`"
            loading="lazy"
            class="card-visual-img"
          />
          <div class="card-visual-scrim" aria-hidden="true"></div>

          <!-- Top Meta Bar: Quiet Pill Tag + Refined Precision Icon -->
          <div class="card-meta-bar">
            <span class="card-topic-tag">{{ item.eyebrow || defaultEyebrow }}</span>
            <div class="card-precision-icon" aria-hidden="true">
              <svg v-if="getIconType(item) === 'chart'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
                <path d="M4 10l5-5 5 5 6-6"></path>
              </svg>
              <svg v-else-if="getIconType(item) === 'briefcase'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <svg v-else-if="getIconType(item) === 'gear'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <svg v-else-if="getIconType(item) === 'box'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <svg v-else-if="getIconType(item) === 'cpu'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
              </svg>
              <svg v-else-if="getIconType(item) === 'database'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
              <svg v-else-if="getIconType(item) === 'sliders'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
              </svg>
              <svg v-else-if="getIconType(item) === 'layers'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <svg v-else-if="getIconType(item) === 'globe'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
        </div>

        <!-- Card Content Body -->
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-description">{{ item.description || 'Giải pháp toàn diện, tối ưu hiệu suất và quy trình doanh nghiệp.' }}</p>

          <!-- Precision Action Row: High-End Interactive Discovery -->
          <div class="card-action-bar">
            <span class="action-text">{{ item.ctaText || defaultCtaText }}</span>
            <span class="action-arrow-disc" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Next Arrow Button -->
    <button
      type="button"
      class="carousel-nav-btn carousel-nav-next"
      :class="{ 'is-disabled': !canScrollRight }"
      :disabled="!canScrollRight"
      aria-label="Xem danh mục kế tiếp"
      @click="scroll(1)"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>

    <!-- Refined Minimalist Carousel Progress Indicator -->
    <div class="carousel-progress-wrapper" role="tablist" aria-label="Tiến trình danh mục">
      <div class="carousel-progress-bar">
        <span
          class="carousel-progress-thumb"
          :style="{
            width: `${100 / Math.max(1, items.length)}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }"
        ></span>
      </div>
      <div class="carousel-step-indicators">
        <button
          v-for="(_, index) in items"
          :key="index"
          type="button"
          class="carousel-step-dot"
          :class="{ 'is-active': activeIndex === index }"
          :aria-label="`Đến slide ${index + 1}`"
          @click="scrollToItem(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* -------------------------------------------------------------
   UNSLOP & TASTE DESIGN SYSTEM: HORIZONTAL CATEGORY CAROUSEL
   - Pure, architectural framing (no cheesy cartoon bubbles)
   - Real typography & proportional spacing (4px scale)
   - Tactile interactive physics on the entire card surface
   - Neutral palette with Dark Ink #070E24 accents
   ------------------------------------------------------------- */
.category-carousel-wrapper {
  position: relative;
  width: 100%;
  padding: 10px 0 24px;
}

/* Scroll Track */
.category-carousel-track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding: 8px 4px 18px 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.category-carousel-track::-webkit-scrollbar {
  display: none;
}

/* Category Card: Structuralism & Tactile Craft */
.category-carousel-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid rgba(7, 14, 36, 0.08);
  box-shadow: 0 2px 10px rgba(7, 14, 36, 0.03);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  scroll-snap-align: start;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.28s ease;

  /* Responsive Width: 4-5 cards on desktop, 2 on tablet, 1 on mobile */
  flex: 0 0 calc((100% - 4 * 20px) / 5);
  min-width: 228px;
}

@media (max-width: 1240px) {
  .category-carousel-card {
    flex: 0 0 calc((100% - 3 * 20px) / 4);
    min-width: 220px;
  }
}

@media (max-width: 992px) {
  .category-carousel-card {
    flex: 0 0 calc((100% - 20px) / 2);
    min-width: 240px;
  }
}

@media (max-width: 640px) {
  .category-carousel-card {
    flex: 0 0 85%;
    min-width: 0;
  }
}

/* Hover Physical Elevation */
.category-carousel-card:hover {
  transform: translateY(-5px);
  border-color: rgba(7, 14, 36, 0.16);
  box-shadow: 0 16px 36px -6px rgba(7, 14, 36, 0.09), 0 4px 12px -2px rgba(7, 14, 36, 0.03);
}

/* 1. VISUAL STAGE (Clean 16:10 Framing with Integrated Metadata) */
.card-visual-frame {
  position: relative;
  width: 100%;
  height: 170px;
  overflow: hidden;
  background: #f1f5f9;
}

.card-visual-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-carousel-card:hover .card-visual-img {
  transform: scale(1.05);
}

.card-visual-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(7, 14, 36, 0.32) 0%, transparent 40%, rgba(7, 14, 36, 0.06) 100%);
  pointer-events: none;
}

/* Top Meta Bar: Frosted pill tag + precision icon */
.card-meta-bar {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  z-index: 2;
}

.card-topic-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: #070e24;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 6px rgba(7, 14, 36, 0.06);
}

.card-precision-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: #070e24;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 6px rgba(7, 14, 36, 0.06);
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
}

.category-carousel-card:hover .card-precision-icon {
  background: #070e24;
  color: #ffffff;
  transform: scale(1.05);
}

/* 2. CARD CONTENT BODY */
.card-body {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 18px 20px 18px 20px;
  background: #ffffff;
}

.card-title {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #070e24;
  margin: 0 0 8px 0;
  line-height: 1.35;
  letter-spacing: -0.015em;
  transition: color 0.2s ease;
}

.category-carousel-card:hover .card-title {
  color: #0062ff;
}

.card-description {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 13.5px;
  line-height: 1.6;
  color: #64748b;
  margin: 0 0 16px 0;
  min-height: 42px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 3. PRECISION ACTION ROW */
.card-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(7, 14, 36, 0.06);
}

.action-text {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 13px;
  font-weight: 600;
  color: #070e24;
  letter-spacing: -0.01em;
  transition: color 0.2s ease;
}

.category-carousel-card:hover .action-text {
  color: #0062ff;
}

.action-arrow-disc {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #070e24;
  display: grid;
  place-items: center;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-carousel-card:hover .action-arrow-disc {
  background: #070e24;
  color: #ffffff;
  transform: translateX(3px);
}

/* 4. NAVIGATION ARROWS (High-Tactile Glass & Black Elevation) */
.carousel-nav-btn {
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  color: #070e24;
  border: 1.5px solid rgba(7, 14, 36, 0.1);
  box-shadow: 0 4px 16px rgba(7, 14, 36, 0.08);
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-nav-prev {
  left: -20px;
}

.carousel-nav-next {
  right: -20px;
}

@media (max-width: 1300px) {
  .carousel-nav-prev { left: 4px; }
  .carousel-nav-next { right: 4px; }
}

.carousel-nav-btn:hover:not(.is-disabled) {
  background: #070e24;
  color: #ffffff;
  border-color: #070e24;
  transform: translateY(-50%) scale(1.06);
  box-shadow: 0 6px 20px rgba(7, 14, 36, 0.16);
}

.carousel-nav-btn.is-disabled {
  opacity: 0.25;
  cursor: not-allowed;
  pointer-events: none;
}

/* 5. MINIMALIST PROGRESS INDICATORS */
.carousel-progress-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.carousel-progress-bar {
  width: 140px;
  height: 3px;
  background: rgba(7, 14, 36, 0.08);
  border-radius: 999px;
  position: relative;
  overflow: hidden;
}

.carousel-progress-thumb {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #070e24;
  border-radius: 999px;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-step-indicators {
  display: flex;
  align-items: center;
  gap: 6px;
}

.carousel-step-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  border: 0;
  background: rgba(7, 14, 36, 0.18);
  padding: 0;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-step-dot:hover {
  background: rgba(7, 14, 36, 0.4);
}

.carousel-step-dot.is-active {
  width: 22px;
  background: #070e24;
}
</style>
