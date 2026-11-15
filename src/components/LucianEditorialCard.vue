<!-- Lucian UX/UI Prompt #049 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#049 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  tag?: string
  issue?: string
  title?: string
  summary?: string
  author?: string
  role?: string
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'BẢN QUYỀN · HƯỚNG DẪN',
  issue: 'CHUYÊN MỤC 12 · 4 PHÚT ĐỌC',
  title: '5 bước cài đặt phần mềm bản quyền',
  summary: 'Từ kiểm tra cấu hình thiết bị đến kích hoạt an toàn, các bước chuẩn hóa giúp bảo vệ tài sản số doanh nghiệp.',
  author: 'Lê Minh Trí',
  role: 'Chuyên gia giải pháp DXTechs',
  to: '/tai-nguyen',
})

const emit = defineEmits<{
  (e: 'bookmark', val: boolean): void
  (e: 'read'): void
}>()

const router = useRouter()
const rootRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLButtonElement | null>(null)
const isOpen = ref(false)
const isBookmarked = ref(false)
const isOpening = ref(false)
const isReducedMotion = ref(false)
const gid = ref('u049-' + Math.random().toString(36).slice(2, 7))

let quiet = false

function toggleOpen(val?: boolean) {
  isOpen.value = val !== undefined ? val : !isOpen.value
}

function handlePointerEnter(e: PointerEvent) {
  if (e.pointerType === 'mouse') toggleOpen(true)
}

function handlePointerMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || isReducedMotion.value || !rootRef.value) return
  const r = rootRef.value.getBoundingClientRect()
  const px = ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3)
  const py = ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3)
  rootRef.value.style.setProperty('--px', px)
  rootRef.value.style.setProperty('--py', py)
}

function handlePointerLeave(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || !rootRef.value) return
  rootRef.value.style.setProperty('--px', '0')
  rootRef.value.style.setProperty('--py', '0')
  if (!rootRef.value.contains(document.activeElement)) {
    toggleOpen(false)
  }
}

function handleCardClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('button')) return
  toggleOpen()
}

function handleFocusIn() {
  if (!quiet) toggleOpen(true)
}

function handleFocusOut(e: FocusEvent) {
  if (!rootRef.value) return
  if (!rootRef.value.contains(e.relatedTarget as Node) && !rootRef.value.matches(':hover')) {
    toggleOpen(false)
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.target === rootRef.value && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault()
    ctaRef.value?.focus()
  }
  if (e.key === 'Escape') {
    quiet = true
    rootRef.value?.focus()
    quiet = false
    toggleOpen(false)
  }
}

function toggleBookmark(e: Event) {
  e.stopPropagation()
  isBookmarked.value = !isBookmarked.value
  emit('bookmark', isBookmarked.value)
}

function handleRead(e: Event) {
  e.stopPropagation()
  isOpening.value = true
  emit('read')
  setTimeout(() => {
    isOpening.value = false
    if (props.to) {
      if (props.to.startsWith('http')) {
        window.open(props.to, '_blank')
      } else {
        router.push(props.to)
      }
    }
  }, 450)
}

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<template>
  <article
    ref="rootRef"
    class="ux u049"
    :class="{ 'is-open': isOpen }"
    tabindex="0"
    :aria-label="title"
    @pointerenter="handlePointerEnter"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
    @click="handleCardClick"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @keydown="handleKeyDown"
  >
    <!-- 3-Layer Parallax Illustration Art -->
    <div class="u049-art" aria-hidden="true">
      <!-- Layer 1: Sky and Sun -->
      <svg class="u049-l1" viewBox="0 0 360 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient :id="gid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#1d1d1f" />
            <stop offset="0.55" stop-color="#0066cc" />
            <stop offset="1" stop-color="#2997ff" />
          </linearGradient>
        </defs>
        <rect width="360" height="500" :fill="`url(#${gid})`" />
        <circle cx="236" cy="210" r="62" fill="#f5f5f7" />
        <circle cx="236" cy="210" r="96" fill="#f5f5f7" opacity="0.22" />
      </svg>

      <!-- Layer 2: Midground Mountain / Curves -->
      <svg class="u049-l2" viewBox="0 0 360 500" preserveAspectRatio="xMidYMid slice">
        <path d="M-10 300 C 60 250 110 270 160 245 S 260 200 370 260 V500 H-10Z" fill="#0066cc" />
        <path d="M-10 330 C 80 300 120 320 190 300 S 300 290 370 310 V500 H-10Z" fill="#1d1d1f" opacity="0.92" />
      </svg>

      <!-- Layer 3: Foreground Ridges & Accents -->
      <svg class="u049-l3" viewBox="0 0 360 500" preserveAspectRatio="xMidYMid slice">
        <path d="M-10 370 C 70 330 140 380 210 350 S 320 340 370 360 V500 H-10Z" fill="#1d1d1f" />
        <path d="M40 368 l8 -26 l8 26 M70 360 l10 -34 l10 34" fill="#1d1d1f" />
      </svg>
    </div>

    <!-- Vignette / Shade Overlay -->
    <div class="u049-shade" aria-hidden="true"></div>

    <!-- Top Badge & Bookmark Button -->
    <div class="u049-top">
      <span class="u049-tag">{{ tag }}</span>
      <button
        class="u049-bm"
        type="button"
        :aria-pressed="isBookmarked"
        :aria-label="isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết'"
        @click="toggleBookmark"
      >
        <svg viewBox="0 0 24 24">
          <path d="M6.5 4h11a.5.5 0 0 1 .5.5V20l-6-4-6 4V4.5a.5.5 0 0 1 .5-.5z" />
        </svg>
      </button>
    </div>

    <!-- Sliding Body with Title, Summary, Author & Read Button -->
    <div class="u049-body">
      <div class="u049-k">{{ issue }}</div>
      <h3 class="u049-t">{{ title }}</h3>
      <p class="u049-sum">{{ summary }}</p>

      <div class="u049-foot">
        <span class="u049-av" aria-hidden="true"></span>
        <span class="u049-by">
          {{ author }}
          <small>{{ role }}</small>
        </span>

        <button ref="ctaRef" class="u049-cta" type="button" @click="handleRead">
          <span>{{ isOpening ? 'Đang mở' : 'Đọc bài' }}</span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Tokens mapped to DXTechs brand system */
.ux {
  color-scheme: light;
  --ux-page: #f5f5f7;
  --ux-surface: #FFFFFF;
  --ux-surface-2: #f5f5f7;
  --ux-surface-3: #e0e0e0;
  --ux-ink: #1d1d1f;
  --ux-ink-2: #7a7a7a;
  --ux-ink-3: #7a7a7a;
  --ux-line: rgba(29, 29, 31, 0.08);
  --ux-line-2: rgba(29, 29, 31, 0.16);
  --ux-accent: #0066cc;
  --ux-accent-2: #2997ff;
  --ux-accent-soft: rgba(0, 102, 204, 0.12);
  --ux-accent-ink: #FFFFFF;
  --ux-mint: #0066cc;
  --ux-warn: #7a7a7a;
  --ux-danger: #7a7a7a;
  --ux-shadow-strong: rgba(29, 29, 31, 0.28);
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(0.16, 1, 0.3, 1);

  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #fff;
  -webkit-font-smoothing: antialiased;
}

:root[data-theme="dark"] .ux,
:global(.theme-dark) .ux {
  color-scheme: dark;
  --ux-shadow-strong: rgba(0, 0, 0, 0.65);
}

.ux, .ux *, .ux *::before, .ux *::after {
  box-sizing: border-box;
}

/* -------------------------------------------------------------
 * Lucian UX/UI Prompt #049: Layered editorial card
 * ------------------------------------------------------------- */
.u049 {
  --px: 0;
  --py: 0;
  position: relative;
  width: 100%;
  max-width: 330px;
  height: 470px;
  border-radius: 28px;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  background: #1d1d1f;
  box-shadow: 0 30px 60px -30px var(--ux-shadow-strong);
  transition: transform .6s var(--ux-ease), box-shadow .6s var(--ux-ease);
  cursor: pointer;
  margin: 0 auto;
}

.u049.is-open {
  transform: translateY(-5px);
  box-shadow: 0 40px 70px -32px var(--ux-shadow-strong);
}

.u049-art {
  position: absolute;
  inset: -20px;
  z-index: -1;
}

.u049-art svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: transform .9s var(--ux-ease);
}

.u049-l1 {
  transform: translate(calc(var(--px) * -6px), calc(var(--py) * -4px)) scale(1.02);
}

.u049-l2 {
  transform: translate(calc(var(--px) * -14px), calc(var(--py) * -8px)) scale(1.04);
}

.u049-l3 {
  transform: translate(calc(var(--px) * -24px), calc(var(--py) * -12px)) scale(1.06);
}

.u049.is-open .u049-l1 {
  transform: translate(calc(var(--px) * -6px), calc(var(--py) * -4px - 10px)) scale(1.06);
}

.u049-shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(29, 29, 31, 0) 30%, rgba(29, 29, 31, 0.88) 100%);
  transition: opacity .6s;
}

.u049-top {
  position: absolute;
  left: 20px;
  right: 16px;
  top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.u049-tag {
  height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .04em;
  color: #fff;
}

.u049-bm {
  width: 40px;
  height: 40px;
  border: 0;
  padding: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
  color: #fff;
  cursor: pointer;
  transition: transform .4s var(--ux-spring), background-color .3s;
}

.u049-bm:hover {
  background: rgba(255, 255, 255, 0.32);
}

.u049-bm:active {
  transform: scale(.86);
}

.u049-bm:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.u049-bm svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linejoin: round;
  transition: fill .3s;
}

.u049-bm[aria-pressed="true"] svg {
  fill: currentColor;
  animation: u049-pop .5s var(--ux-ease);
}

@keyframes u049-pop {
  40% { transform: scale(1.3); }
}

.u049-body {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 22px;
  transform: translateY(var(--lift, 118px));
  transition: transform .7s var(--ux-spring);
}

.u049.is-open .u049-body {
  --lift: 0px;
}

.u049-k {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .12em;
  opacity: .8;
  text-transform: uppercase;
}

.u049-t {
  margin: 6px 0 0;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 850;
  letter-spacing: -.04em;
  color: #fff;
}

.u049-sum {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.88);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity .3s, transform .5s var(--ux-ease);
}

.u049-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity .3s, transform .5s var(--ux-ease);
}

.u049.is-open .u049-sum {
  opacity: 1;
  transform: none;
  transition: opacity .45s .12s, transform .6s var(--ux-spring) .12s;
}

.u049.is-open .u049-foot {
  opacity: 1;
  transform: none;
  transition: opacity .45s .2s, transform .6s var(--ux-spring) .2s;
}

.u049-av {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #f5f5f7, #2997ff 50%, #0066cc);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.u049-by {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
}

.u049-by small {
  display: block;
  font-size: 11px;
  opacity: .75;
  font-weight: 500;
}

.u049-cta {
  margin-left: auto;
  height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  color: #1d1d1f;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .35s var(--ux-spring), background-color .2s;
}

.u049-cta:hover {
  transform: translateX(3px);
  background: #f5f5f7;
}

.u049-cta:active {
  transform: scale(.94);
}

.u049-cta:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

.u049-cta svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u049:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 4px;
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .ux, .ux *, .ux *::before, .ux *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
