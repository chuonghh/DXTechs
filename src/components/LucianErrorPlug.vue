<!-- Lucian UX/UI Prompt #090 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#090 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  widgetTitle?: string
  errorTitle?: string
  errorSubtitle?: string
  endpoint?: string
  successTotalPrefix?: string
  successGrowth?: string
  daysData?: Array<{ day: string; height: number }>
}

const props = withDefaults(defineProps<Props>(), {
  widgetTitle: 'Doanh thu giải pháp tuần này',
  errorTitle: 'Không thể tải dữ liệu dịch vụ',
  errorSubtitle: 'Máy chủ phản hồi chậm hoặc đang bảo trì',
  endpoint: 'GET /api/v1/cloud/metrics\n503 Service Unavailable\nTrace ID dx-8f4b-229c · lần thử ',
  successTotalPrefix: '48.2',
  successGrowth: '+12% so với tuần trước',
  daysData: () => [
    { day: 'T2', height: 0.42 },
    { day: 'T3', height: 0.55 },
    { day: 'T4', height: 0.38 },
    { day: 'T5', height: 0.70 },
    { day: 'T6', height: 0.64 },
    { day: 'T7', height: 0.88 },
    { day: 'CN', height: 0.76 },
  ],
})

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'success'): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const errBoxRef = ref<HTMLElement | null>(null)
const ringRef = ref<SVGCircleElement | null>(null)
const isExpandedDetails = ref(false)

const currentState = ref<'wait' | 'try' | 'ok'>('wait')
const isShowingChart = ref(false)
const isZapAnimation = ref(false)

const pillText = ref('Chưa kết nối')
const pillColor = ref('var(--ux-danger)')
const countdownText = ref('')
const buttonLabel = ref('Thử lại ngay')
const animatedTotal = ref('0M ₫')
const detailCode = ref('')

const dot0 = ref('f')
const dot1 = ref('')
const dot2 = ref('')

let tries = 0
const timeouts: ReturnType<typeof setTimeout>[] = []
let rafAnim = 0
const isReducedMotion = ref(false)

function clearAllTimers() {
  timeouts.forEach(clearTimeout)
  timeouts.length = 0
}

function later(fn: () => void, ms: number) {
  const t = setTimeout(fn, ms)
  timeouts.push(t)
}

function updateDetail() {
  detailCode.value = `${props.endpoint}${tries + 1}/3`
}

function startCountdown(sec: number) {
  clearAllTimers()
  currentState.value = 'wait'
  pillText.value = 'Chưa kết nối'
  pillColor.value = 'var(--ux-danger)'
  buttonLabel.value = 'Thử lại ngay'

  if (ringRef.value) {
    ringRef.value.style.transition = 'none'
    ringRef.value.style.strokeDashoffset = '0'
    void ringRef.value.getBoundingClientRect()
    ringRef.value.style.transition = `stroke-dashoffset ${sec}s linear`
    ringRef.value.style.strokeDashoffset = '100'
  }

  let left = sec
  function tick() {
    if (left <= 0) {
      attemptConnect()
      return
    }
    countdownText.value = `Tự động thử lại sau ${left}s`
    left--
    later(tick, 1000)
  }
  tick()
}

function attemptConnect() {
  if (currentState.value !== 'wait') return
  clearAllTimers()
  tries++
  emit('retry')

  currentState.value = 'try'
  pillText.value = 'Đang kết nối lại'
  pillColor.value = 'var(--ux-warn)'
  buttonLabel.value = 'Đang kết nối...'
  countdownText.value = `Đang kết nối lần ${tries + 1}...`

  if (tries === 1) dot1.value = 'cur'
  if (tries >= 2) dot2.value = 'cur'

  later(() => {
    if (tries === 1) {
      dot1.value = 'f'
      isZapAnimation.value = false
      if (rootRef.value) void rootRef.value.offsetWidth
      isZapAnimation.value = true

      if (!isReducedMotion.value && errBoxRef.value) {
        errBoxRef.value.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-7px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(-3px)' },
            { transform: 'none' },
          ],
          { duration: 420, easing: 'ease-out' }
        )
      }
      updateDetail()
      startCountdown(7)
    } else {
      dot2.value = 'ok'
      currentState.value = 'ok'
      pillText.value = 'Đã kết nối ổn định'
      pillColor.value = 'var(--ux-mint)'
      countdownText.value = 'Kết nối thành công sau lần 3'
      buttonLabel.value = 'Chạy lại thử nghiệm lỗi'
      later(revealChart, isReducedMotion.value ? 50 : 700)
    }
  }, isReducedMotion.value ? 300 : 1400)
}

function revealChart() {
  isShowingChart.value = true
  emit('success')

  const t0 = performance.now()
  const dur = isReducedMotion.value ? 50 : 850
  const maxVal = parseFloat(props.successTotalPrefix) || 48.2

  function animateNumber(now: number) {
    const k = Math.min(1, (now - t0) / dur)
    const e = 1 - Math.pow(1 - k, 3)
    animatedTotal.value = (maxVal * e).toFixed(1) + 'M ₫'
    if (k < 1) {
      rafAnim = requestAnimationFrame(animateNumber)
    }
  }
  rafAnim = requestAnimationFrame(animateNumber)
}

function resetWidget() {
  clearAllTimers()
  cancelAnimationFrame(rafAnim)
  tries = 0
  isShowingChart.value = false
  isZapAnimation.value = false
  dot0.value = 'f'
  dot1.value = ''
  dot2.value = ''
  updateDetail()
  startCountdown(5)
}

function handleButtonClick() {
  if (currentState.value === 'wait') {
    attemptConnect()
  } else if (currentState.value === 'ok') {
    resetWidget()
  }
}

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  updateDetail()
  startCountdown(5)
})

onUnmounted(() => {
  clearAllTimers()
  cancelAnimationFrame(rafAnim)
})
</script>

<template>
  <div
    ref="rootRef"
    class="ux u090"
    :class="{ show: isShowingChart, zap: isZapAnimation }"
    :data-s="currentState"
  >
    <!-- Header with title and status pill -->
    <div class="u090-h">
      <i aria-hidden="true">
        <svg viewBox="0 0 17 17">
          <path d="M3 14V9M8.5 14V4M14 14v-7" />
        </svg>
      </i>
      <b>{{ widgetTitle }}</b>
      <span class="u090-pill" role="status" :style="{ '--c': pillColor }">
        {{ pillText }}
      </span>
    </div>

    <!-- Interactive Stage: Error Plug <-> Live Chart -->
    <div class="u090-stage">
      <!-- Error Plug Display -->
      <div ref="errBoxRef" class="u090-err">
        <svg class="u090-plug" viewBox="0 0 220 70" aria-hidden="true">
          <!-- Left cord and plug prongs -->
          <g class="u090-L">
            <path class="u090-cord" d="M-14 54C24 54 40 35 72 35" />
            <path class="u090-pr" d="M100 28h14M100 42h14" />
            <rect class="u090-bd" x="68" y="19" width="34" height="32" rx="8" />
          </g>

          <!-- Electric sparks on failure -->
          <g class="u090-spark">
            <path d="M121 20l-2-7M129 24l5-5M113 24l-5-5M121 50l-2 7M129 46l5 5M113 46l-5 5" />
          </g>

          <!-- Right socket with LED indicator -->
          <g class="u090-R">
            <rect class="u090-bd" x="124" y="17" width="38" height="36" rx="9" />
            <path class="u090-hole" d="M124 28h6M124 42h6" />
            <circle class="u090-led" cx="153" cy="25" r="3" />
            <path class="u090-cord" d="M162 35C188 35 194 16 236 16" />
          </g>
        </svg>

        <p class="u090-t">{{ errorTitle }}</p>
        <p class="u090-s">{{ errorSubtitle }}</p>

        <!-- Dots indicators and countdown -->
        <div class="u090-at">
          <span class="u090-dots" aria-hidden="true">
            <i :class="dot0"></i>
            <i :class="dot1"></i>
            <i :class="dot2"></i>
          </span>
          <span class="u090-cd" aria-live="polite">{{ countdownText }}</span>
        </div>

        <!-- Technical Details Accordion -->
        <button
          class="u090-more"
          type="button"
          :aria-expanded="isExpandedDetails"
          @click="isExpandedDetails = !isExpandedDetails"
        >
          <span>Chi tiết kỹ thuật</span>
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" />
          </svg>
        </button>

        <div class="u090-det">
          <div>
            <code>{{ detailCode }}</code>
          </div>
        </div>
      </div>

      <!-- Success Live Chart Display -->
      <div class="u090-ok" :aria-hidden="!isShowingChart">
        <div class="u090-sum">
          <small>Tổng giá trị</small>
          <b>{{ animatedTotal }}</b>
          <em>{{ successGrowth }}</em>
        </div>

        <div class="u090-bars">
          <span v-for="(d, i) in daysData" :key="i">
            <i :style="{ '--h': d.height, '--d': i }"></i>
            <em>{{ d.day }}</em>
          </span>
        </div>
      </div>
    </div>

    <!-- Action Button with shrinking countdown ring -->
    <button
      class="u090-go"
      type="button"
      :aria-disabled="currentState === 'try'"
      @click="handleButtonClick"
    >
      <svg class="u090-ring" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="8" />
        <circle ref="ringRef" cx="10" cy="10" r="8" pathLength="100" />
      </svg>
      <span>{{ buttonLabel }}</span>
    </button>
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
  --ux-grad: linear-gradient(135deg, #0066cc 0%, #2997ff 100%);
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
 * Lucian UX/UI Prompt #090: Error widget that plugs back in
 * ------------------------------------------------------------- */
.u090 {
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 420px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 28px;
  background: var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 30px 60px -36px var(--ux-shadow-strong);
  overflow: hidden;
  margin: 0 auto;
}

.u090-h {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
}

.u090-h i {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: var(--ux-surface-2);
  color: var(--ux-ink-2);
}

.u090-h i svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.u090-h b {
  font-size: 15px;
  font-weight: 850;
  letter-spacing: -.03em;
  color: var(--ux-ink);
}

.u090-pill {
  margin-left: auto;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: color-mix(in srgb, var(--c) 14%, transparent);
  color: var(--c);
  font-size: 11.5px;
  font-weight: 800;
  white-space: nowrap;
  transition: color .35s, background-color .35s;
}

.u090-pill::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.u090-stage {
  position: relative;
  flex: 1;
  margin: 6px 0 12px;
}

.u090-err, .u090-ok {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  transition: opacity .35s, transform .45s var(--ux-ease), visibility 0s;
}

.u090-err {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.u090.show .u090-err {
  opacity: 0;
  transform: scale(.94);
  visibility: hidden;
  transition: opacity .25s, transform .35s var(--ux-ease), visibility 0s .35s;
}

.u090-ok {
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: opacity .25s, transform .35s, visibility 0s .35s;
}

.u090.show .u090-ok {
  opacity: 1;
  visibility: visible;
  transform: none;
  transition: opacity .35s .15s, transform .5s var(--ux-ease) .15s;
}

.u090-plug {
  width: 220px;
  height: 70px;
  overflow: visible;
}

.u090-cord {
  fill: none;
  stroke: var(--ux-ink-3);
  stroke-width: 4;
  stroke-linecap: round;
}

.u090-pr {
  stroke: var(--ux-ink-2);
  stroke-width: 4.5;
  stroke-linecap: round;
}

.u090-bd {
  fill: var(--ux-ink);
}

.u090-hole {
  stroke: var(--ux-surface);
  stroke-width: 3;
  stroke-linecap: round;
}

.u090-led {
  fill: var(--ux-danger);
  transition: fill .3s;
}

.u090-L, .u090-R {
  transition: transform .55s var(--ux-spring);
}

.u090-L { transform: translateX(-10px); }
.u090-R { transform: translateX(8px); }

.u090[data-s="try"] .u090-L {
  transform: translateX(9px);
  animation: u090-jig .28s .5s ease-in-out infinite;
}

.u090[data-s="try"] .u090-R { transform: translateX(-2px); }

.u090[data-s="try"] .u090-led {
  fill: var(--ux-warn);
  animation: u090-blink .5s steps(1) infinite;
}

.u090[data-s="ok"] .u090-L { transform: translateX(16px); }
.u090[data-s="ok"] .u090-R { transform: translateX(-4px); }
.u090[data-s="ok"] .u090-led { fill: var(--ux-mint); }

@keyframes u090-jig { 50% { transform: translateX(6px); } }
@keyframes u090-blink { 50% { fill: var(--ux-surface-3); } }

.u090-spark {
  stroke: var(--ux-warn);
  stroke-width: 2.6;
  stroke-linecap: round;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

.u090.zap .u090-spark {
  animation: u090-zap .55s var(--ux-ease);
}

@keyframes u090-zap {
  0% { opacity: 1; transform: scale(.4); }
  60% { opacity: 1; }
  100% { opacity: 0; transform: scale(1.25); }
}

.u090-t {
  margin: 14px 0 0;
  font-size: 16px;
  font-weight: 850;
  letter-spacing: -.03em;
  color: var(--ux-ink);
}

.u090-s {
  margin: 4px 0 0;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--ux-ink-3);
}

.u090-at {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 750;
  color: var(--ux-ink-2);
  font-variant-numeric: tabular-nums;
}

.u090-dots {
  display: flex;
  gap: 4px;
}

.u090-dots i {
  width: 16px;
  height: 6px;
  border-radius: 3px;
  background: var(--ux-surface-3);
  transition: background-color .3s;
}

.u090-dots i.f { background: var(--ux-danger); }
.u090-dots i.cur { background: var(--ux-warn); animation: u090-cur .7s ease-in-out infinite; }
.u090-dots i.ok { background: var(--ux-mint); }

@keyframes u090-cur { 50% { opacity: .4; } }

.u090-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  margin-top: 8px;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-size: 11.5px;
  font-weight: 750;
  color: var(--ux-ink-3);
  cursor: pointer;
}

.u090-more:hover {
  color: var(--ux-ink);
  background: var(--ux-surface-2);
}

.u090-more svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform .3s var(--ux-ease);
}

.u090-more[aria-expanded="true"] svg {
  transform: rotate(180deg);
}

.u090-det {
  display: grid;
  grid-template-rows: 0fr;
  width: 100%;
  transition: grid-template-rows .35s var(--ux-ease);
}

.u090-more[aria-expanded="true"] + .u090-det {
  grid-template-rows: 1fr;
}

.u090-det > div {
  min-height: 0;
  overflow: hidden;
}

.u090-det code {
  display: block;
  margin-top: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--ux-surface-2);
  text-align: left;
  font: 600 11px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--ux-ink-2);
  white-space: pre-wrap;
}

.u090-sum {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 4px;
}

.u090-sum small {
  font-size: 12px;
  font-weight: 700;
  color: var(--ux-ink-3);
}

.u090-sum b {
  font-size: 28px;
  font-weight: 850;
  letter-spacing: -.05em;
  color: var(--ux-ink);
  font-variant-numeric: tabular-nums;
}

.u090-sum em {
  font-style: normal;
  font-size: 12px;
  font-weight: 800;
  color: var(--ux-mint);
}

.u090-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-top: 14px;
  padding-bottom: 22px;
}

.u090-bars span {
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.u090-bars i {
  width: 100%;
  height: calc(var(--h) * 100%);
  border-radius: 6px 6px 3px 3px;
  background: var(--ux-surface-3);
  transform-origin: 50% 100%;
  transform: scaleY(0);
  transition: transform .7s var(--ux-spring), background-color .2s;
  transition-delay: calc(var(--d) * 60ms + .2s), 0s;
}

.u090.show .u090-bars i {
  transform: none;
}

.u090-bars span:last-child i {
  background: var(--ux-grad);
}

.u090-bars span:hover i {
  background: var(--ux-accent);
}

.u090-bars em {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -20px;
  text-align: center;
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  color: var(--ux-ink-3);
}

.u090-go {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  height: 48px;
  border: 0;
  border-radius: 16px;
  background: var(--ux-ink);
  color: var(--ux-page);
  font-size: 14px;
  font-weight: 760;
  cursor: pointer;
  transition: transform .3s var(--ux-spring), opacity .3s;
}

.u090-go:active {
  transform: scale(.97);
}

.u090-go[aria-disabled="true"] {
  opacity: .55;
  cursor: not-allowed;
}

.u090-ring {
  width: 18px;
  height: 18px;
  transform: rotate(-90deg);
  transition: width .3s, margin .3s;
}

.u090-ring circle {
  fill: none;
  stroke-width: 2.6;
  stroke-linecap: round;
}

.u090-ring circle:first-child {
  stroke: color-mix(in srgb, var(--ux-page) 25%, transparent);
}

.u090-ring circle + circle {
  stroke: var(--ux-page);
  stroke-dasharray: 100;
}

.u090[data-s="try"] .u090-ring {
  animation: u090-spin .8s linear infinite;
}

.u090[data-s="try"] .u090-ring circle + circle {
  stroke-dasharray: 28 72;
  stroke-dashoffset: 0 !important;
  transition: none !important;
}

.u090[data-s="ok"] .u090-ring {
  width: 0;
  margin-right: -9px;
}

.u090-go:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 2px;
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
