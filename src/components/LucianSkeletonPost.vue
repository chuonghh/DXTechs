<!-- Lucian UX/UI Prompt #079 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#079 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  author?: string
  subtitle?: string
  imageLabel?: string
  likesCount?: number
  commentsCount?: number
  sharesCount?: number
  firstLine?: string
  secondLine?: string
  tagsLine?: string
}

const props = withDefaults(defineProps<Props>(), {
  author: 'Nguyễn Hoàng Nam',
  subtitle: 'DXTechs Architecture · 2 giờ trước',
  imageLabel: 'Hình ảnh kiến trúc hệ thống đám mây phân tán',
  likesCount: 248,
  commentsCount: 31,
  sharesCount: 19,
  firstLine: 'Kiến trúc Multi-Region Cloud với độ trễ dưới 15ms.',
  secondLine: 'Đảm bảo tính sẵn sàng 99.99% và tự động chuyển vùng dự phòng.',
  tagsLine: '#dxtechs #cloud #kubernetes #devops',
})

const rootRef = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const isDone = ref(false)
const isReducedMotion = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined

function alignShine() {
  if (!rootRef.value) return
  const sks = rootRef.value.querySelectorAll<HTMLElement>('.u079-sk')
  sks.forEach((s) => {
    let x = 0
    let el: HTMLElement | null = s.parentElement
    while (el && el !== rootRef.value) {
      x += el.offsetLeft
      el = el.offsetParent as HTMLElement | null
    }
    s.style.setProperty('--sx', -x + 'px')
  })
}

function loadPost() {
  clearTimeout(timer)
  isDone.value = false
  isLoading.value = true

  const duration = isReducedMotion.value ? 300 : 1600
  timer = setTimeout(() => {
    isLoading.value = false
    isDone.value = true
  }, duration)
}

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  alignShine()
  loadPost()
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <div
    ref="rootRef"
    class="ux u079"
    :class="{ 'is-loading': isLoading, 'is-done': isDone }"
    :aria-busy="isLoading"
  >
    <!-- Refresh Button -->
    <button
      class="u079-re"
      type="button"
      :aria-label="isLoading ? 'Đang tải bài viết...' : 'Tải lại mô phỏng Skeleton'"
      @click="loadPost"
    >
      <svg viewBox="0 0 17 17" aria-hidden="true">
        <path d="M14 8.5a5.5 5.5 0 1 1-1.6-3.9M14 2.5v3h-3" />
      </svg>
    </button>

    <!-- Post Header: Avatar & Author -->
    <div class="u079-head">
      <div class="u079-av u079-s" style="--d: 0s">
        <span class="u079-sk"></span>
        <span class="u079-r"></span>
      </div>

      <div class="u079-nm">
        <div class="u079-s" style="--d: .06s">
          <span class="u079-sk"></span>
          <span class="u079-r">{{ author }}</span>
        </div>
        <div class="u079-s" style="--d: .1s">
          <span class="u079-sk"></span>
          <span class="u079-r">{{ subtitle }}</span>
        </div>
      </div>
    </div>

    <!-- Post Image with Blur-to-Sharp Transition -->
    <div class="u079-img u079-s" style="--d: .16s">
      <span class="u079-sk"></span>
      <span class="u079-r" role="img" :aria-label="imageLabel"></span>
    </div>

    <!-- Post Reactions -->
    <div class="u079-acts">
      <div class="u079-s" style="--d: .28s">
        <span class="u079-sk"></span>
        <span class="u079-r">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" style="display: inline-block; vertical-align: -1px; margin-right: 3px;">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          {{ likesCount }}
        </span>
      </div>
      <div class="u079-s" style="--d: .32s">
        <span class="u079-sk"></span>
        <span class="u079-r">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -1px; margin-right: 3px;">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
          </svg>
          {{ commentsCount }}
        </span>
      </div>
      <div class="u079-s" style="--d: .36s">
        <span class="u079-sk"></span>
        <span class="u079-r">↗ Chia sẻ</span>
      </div>
    </div>

    <!-- Post Text Lines -->
    <div class="u079-tx">
      <div class="u079-s" style="--d: .42s">
        <span class="u079-sk"></span>
        <span class="u079-r"><b>{{ author }}</b> {{ firstLine }}</span>
      </div>
      <div class="u079-s" style="--d: .48s">
        <span class="u079-sk"></span>
        <span class="u079-r">{{ secondLine }}</span>
      </div>
      <div class="u079-s" style="--d: .54s">
        <span class="u079-sk"></span>
        <span class="u079-r tags-text">{{ tagsLine }}</span>
      </div>
    </div>
  </div>
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
  --ux-shadow-strong: rgba(29, 29, 31, 0.22);
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(0.16, 1, 0.3, 1);

  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--ux-ink);
  -webkit-font-smoothing: antialiased;
}

:root[data-theme="dark"] .ux,
:global(.theme-dark) .ux {
  color-scheme: dark;
  --ux-page: #1d1d1f;
  --ux-surface: #1d1d1f;
  --ux-surface-2: #1d1d1f;
  --ux-surface-3: #1d1d1f;
  --ux-ink: #f5f5f7;
  --ux-ink-2: rgba(249, 250, 251, 0.72);
  --ux-ink-3: rgba(249, 250, 251, 0.45);
  --ux-line: rgba(255, 255, 255, 0.08);
  --ux-line-2: rgba(255, 255, 255, 0.16);
  --ux-accent: #2997ff;
  --ux-accent-2: #2997ff;
  --ux-accent-soft: rgba(41, 151, 255, 0.15);
  --ux-accent-ink: #1d1d1f;
  --ux-shadow-strong: rgba(0, 0, 0, 0.65);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .ux {
    color-scheme: dark;
    --ux-page: #1d1d1f;
    --ux-surface: #1d1d1f;
    --ux-surface-2: #1d1d1f;
    --ux-surface-3: #1d1d1f;
    --ux-ink: #f5f5f7;
    --ux-ink-2: rgba(249, 250, 251, 0.72);
    --ux-ink-3: rgba(249, 250, 251, 0.45);
    --ux-line: rgba(255, 255, 255, 0.08);
    --ux-line-2: rgba(255, 255, 255, 0.16);
    --ux-accent: #2997ff;
    --ux-accent-2: #2997ff;
    --ux-accent-soft: rgba(41, 151, 255, 0.15);
    --ux-accent-ink: #1d1d1f;
    --ux-shadow-strong: rgba(0, 0, 0, 0.65);
  }
}

.ux, .ux *, .ux *::before, .ux *::after {
  box-sizing: border-box;
}

/* -------------------------------------------------------------
 * Lucian UX/UI Prompt #079: Skeleton that blooms into a post
 * ------------------------------------------------------------- */
.u079 {
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 480px;
  padding: 16px;
  border-radius: 28px;
  background: var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 30px 60px -36px var(--ux-shadow-strong);
  overflow: hidden;
  margin: 0 auto;
}

.u079-re {
  position: absolute;
  right: 14px;
  top: 14px;
  z-index: 2;
  width: 38px;
  height: 38px;
  border: 0;
  padding: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--ux-surface-2);
  color: var(--ux-ink-2);
  cursor: pointer;
  transition: transform .3s var(--ux-spring), background-color .2s;
}

.u079-re:hover {
  background: var(--ux-surface-3);
  color: var(--ux-ink);
}

.u079-re:active {
  transform: scale(.88);
}

.u079-re:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 2px;
}

.u079-re svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u079.is-loading .u079-re svg {
  animation: u079-spin .9s linear infinite;
}

@keyframes u079-spin {
  to { transform: rotate(360deg); }
}

.u079-s {
  position: relative;
}

.u079-sk {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  animation: u079-shine 1.6s linear infinite;
  transition: opacity .45s var(--ux-ease);
  background: linear-gradient(100deg, transparent 28%, color-mix(in srgb, var(--ux-surface-3), var(--ux-ink) 7%) 45%, transparent 62%) var(--sx, 0) 0 / var(--sw, 700px) 100% no-repeat, var(--ux-surface-2);
}

@keyframes u079-shine {
  from { background-position: calc(var(--sx, 0px) - 700px) 0, 0 0; }
  to { background-position: calc(var(--sx, 0px) + 700px) 0, 0 0; }
}

.u079-r {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .5s var(--ux-ease), transform .6s var(--ux-spring);
}

.u079.is-done .u079-sk {
  opacity: 0;
  pointer-events: none;
  transition-delay: var(--d);
}

.u079.is-done .u079-r {
  opacity: 1;
  transform: none;
  transition-delay: var(--d);
}

.u079-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.u079-av {
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 50%;
}

.u079-av .u079-r {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 32%, #f5f5f7, #2997ff 50%, #0066cc);
  box-shadow: 0 0 0 2px var(--ux-line);
}

.u079-nm {
  flex: 1;
  min-width: 0;
}

.u079-nm .u079-s {
  height: 13px;
  width: 120px;
  border-radius: 7px;
  margin-bottom: 6px;
}

.u079-nm .u079-s + .u079-s {
  width: 140px;
  height: 11px;
  margin: 0;
}

.u079-nm .u079-r {
  position: absolute;
  inset: -4px 0 auto;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 800;
  color: var(--ux-ink);
}

.u079-nm .u079-s + .u079-s .u079-r {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ux-ink-3);
  top: -3px;
}

.u079-img {
  height: 230px;
  margin-top: 14px;
  border-radius: 20px;
  overflow: hidden;
}

.u079-img .u079-r {
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 50% at 70% 30%, #f5f5f7, transparent 60%), linear-gradient(160deg, #0066cc, #2997ff 50%, #1d1d1f);
  filter: blur(16px);
  transform: scale(1.08);
}

.u079.is-done .u079-img .u079-r {
  filter: none;
  transform: none;
  transition: opacity .5s var(--ux-ease) var(--d), filter .9s var(--ux-ease) calc(var(--d) + .1s), transform .9s var(--ux-ease) calc(var(--d) + .1s);
}

.u079-img .u079-r::after {
  content: "";
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: -30%;
  height: 60%;
  border-radius: 50%;
  background: rgba(29, 29, 31, 0.4);
}

.u079-acts {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.u079-acts .u079-s {
  width: 68px;
  height: 30px;
  border-radius: 15px;
}

.u079-acts .u079-r {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 15px;
  background: var(--ux-surface-2);
  font-size: 12px;
  font-weight: 750;
  color: var(--ux-ink-2);
}

.u079-tx {
  margin-top: 12px;
}

.u079-tx .u079-s {
  height: 12px;
  border-radius: 6px;
  margin-bottom: 9px;
}

.u079-tx .u079-s:nth-child(2) {
  width: 90%;
}

.u079-tx .u079-s:nth-child(3) {
  width: 65%;
}

.u079-tx .u079-r {
  position: absolute;
  left: 0;
  right: -40px;
  top: -5px;
  font-size: 13px;
  line-height: 22px;
  color: var(--ux-ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.u079-tx .u079-s:first-child .u079-r b {
  color: var(--ux-ink);
  margin-right: 4px;
}

.tags-text {
  color: var(--ux-accent) !important;
  font-weight: 700;
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
