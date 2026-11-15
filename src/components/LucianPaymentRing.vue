<!-- Lucian UX/UI Prompt #081 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#081 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  amountText?: string
  totalAmount?: string
  items?: Array<{ name: string; price: string }>
  shippingText?: string
  cardTitle?: string
  cardSubtitle?: string
  pointsText?: string
  orderCode?: string
  paidDateText?: string
}

const props = withDefaults(defineProps<Props>(), {
  amountText: '320.000 ₫',
  totalAmount: '320.000 ₫',
  items: () => [
    { name: 'Gói Bản quyền DXTechs Cloud', price: '320.000 ₫' }
  ],
  shippingText: 'Miễn phí kích hoạt',
  cardTitle: 'DXTechs Corporate Card',
  cardSubtitle: '•••• 0818',
  pointsText: '+ 960 DX-Points',
  orderCode: 'DXT-2026-0818',
  paidDateText: 'Hôm nay, 16:42',
})

const emit = defineEmits<{
  (e: 'pay'): void
  (e: 'complete'): void
  (e: 'reset'): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const step1 = ref(false)
const step2 = ref(false)
const step3 = ref(false)

const isRun = ref(false)
const isOk = ref(false)
const isRec = ref(false)
const srText = ref('')
const progressVal = ref('0')

let rafId = 0
const timeouts: ReturnType<typeof setTimeout>[] = []
const isReducedMotion = ref(false)

function later(fn: () => void, ms: number) {
  const t = setTimeout(fn, ms)
  timeouts.push(t)
}

function handleStartPayment() {
  if (isRun.value || isOk.value) return

  emit('pay')
  isRun.value = true
  srText.value = 'Đang xử lý thanh toán mô phỏng...'

  const t0 = performance.now()
  const DUR = isReducedMotion.value ? 600 : 2400
  const delay = isReducedMotion.value ? 0 : 300

  function step(now: number) {
    if (!rootRef.value) return
    const k = Math.max(0, Math.min(1, (now - t0 - delay) / DUR))
    const e = 1 - Math.pow(1 - k, 2.2)

    progressVal.value = e.toFixed(4)
    step1.value = e >= 0.02
    step2.value = e >= 0.45
    step3.value = e >= 0.999

    if (k < 1) {
      rafId = requestAnimationFrame(step)
      return
    }

    isRun.value = false
    isOk.value = true
    srText.value = 'Thanh toán hoàn tất! Đang xuất hóa đơn'
    emit('complete')

    later(() => {
      isRec.value = true
    }, isReducedMotion.value ? 50 : 850)
  }

  rafId = requestAnimationFrame(step)
}

function handleReset() {
  cancelAnimationFrame(rafId)
  timeouts.forEach(clearTimeout)
  timeouts.length = 0

  isRun.value = false
  isOk.value = false
  isRec.value = false
  progressVal.value = '0'
  step1.value = false
  step2.value = false
  step3.value = false
  srText.value = ''

  emit('reset')
}

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  timeouts.forEach(clearTimeout)
})
</script>

<template>
  <div
    ref="rootRef"
    class="ux u081"
    :class="{
      'is-run': isRun,
      'is-ok': isOk,
      'is-rec': isRec,
    }"
  >
    <!-- Summary Header -->
    <div class="u081-sum">
      <div v-for="(it, i) in items" :key="i">
        <span>{{ it.name }}</span>
        <span>{{ it.price }}</span>
      </div>
      <div>
        <span>Giao dịch Sandbox</span>
        <span>{{ shippingText }}</span>
      </div>
      <div class="t">
        <span>Tổng thanh toán</span>
        <span>{{ totalAmount }}</span>
      </div>
    </div>

    <!-- Card Pill -->
    <div class="u081-card">
      <i aria-hidden="true"></i>
      <span>{{ cardTitle }}</span>
      <small>{{ cardSubtitle }}</small>
    </div>

    <!-- Options -->
    <div class="u081-opt">
      <span>Hình thức</span>
      <b>Thanh toán tức thì</b>
    </div>
    <div class="u081-opt">
      <span>Tích lũy ưu đãi</span>
      <b class="m">{{ pointsText }}</b>
    </div>

    <!-- Steps indicator -->
    <div class="u081-steps" aria-hidden="true">
      <span :class="{ on: step1 }">Khởi tạo</span>
      <span :class="{ on: step2 }">Đối tác</span>
      <span :class="{ on: step3 }">Cấp phép</span>
    </div>

    <!-- Action stage: Button + Animated Circular Ring + Green Check -->
    <div class="u081-stage">
      <button class="u081-go" type="button" @click="handleStartPayment">
        <span>Thanh toán {{ amountText }}</span>
      </button>

      <svg
        class="u081-ring"
        viewBox="0 0 80 80"
        aria-hidden="true"
        :style="{ '--p': progressVal }"
      >
        <circle class="t" cx="40" cy="40" r="36" />
        <circle class="p" cx="40" cy="40" r="36" pathLength="100" />
      </svg>

      <svg class="u081-ck" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </div>

    <!-- Live announcer -->
    <p class="u081-sr" role="status" aria-live="polite">{{ srText }}</p>

    <!-- Slide-up receipt -->
    <div class="u081-rec" :aria-hidden="!isRec">
      <i aria-hidden="true">
        <svg viewBox="0 0 30 30">
          <path d="M8 15.5l5 5L23 10" />
        </svg>
      </i>
      <b>Thanh toán thành công</b>
      <p>Hóa đơn điện tử &amp; Key đã gửi qua email</p>

      <dl>
        <dt>Mã đơn hàng</dt>
        <dd>{{ orderCode }}</dd>
        <dt>Thời gian</dt>
        <dd>{{ paidDateText }}</dd>
        <dt>Số tiền</dt>
        <dd>{{ totalAmount }}</dd>
      </dl>

      <button type="button" :tabindex="isRec ? 0 : -1" @click="handleReset">
        Xem lại mô phỏng
      </button>
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
 * Lucian UX/UI Prompt #081: Payment ring and check
 * ------------------------------------------------------------- */
.u081 {
  position: relative;
  width: 100%;
  max-width: 360px;
  height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 20px;
  border-radius: 28px;
  background: var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 30px 60px -30px var(--ux-shadow-strong);
  overflow: hidden;
  margin: 0 auto;
}

.u081-sum {
  width: 100%;
  padding: 16px;
  border-radius: 20px;
  background: var(--ux-surface-2);
  transition: opacity .4s, transform .5s var(--ux-ease);
}

.u081-sum div {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  font-weight: 650;
  color: var(--ux-ink-2);
  padding: 3px 0;
}

.u081-sum div.t {
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px dashed var(--ux-line-2);
  font-size: 16px;
  font-weight: 850;
  color: var(--ux-ink);
}

.u081-card {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  box-shadow: inset 0 0 0 1.5px var(--ux-line-2);
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ux-ink);
}

.u081-card i {
  width: 34px;
  height: 24px;
  border-radius: 5px;
  background: linear-gradient(135deg, #1d1d1f, #0066cc 50%, #2997ff);
}

.u081-card small {
  margin-left: auto;
  font-size: 12px;
  font-weight: 650;
  color: var(--ux-ink-3);
}

.u081-opt {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 12px 4px 0;
  font-size: 13px;
  font-weight: 650;
  color: var(--ux-ink-3);
}

.u081-opt b {
  color: var(--ux-ink);
  font-weight: 750;
}

.u081-opt b.m {
  color: var(--ux-mint);
}

.u081-stage {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: opacity .3s;
}

.u081-go {
  position: relative;
  width: 100%;
  height: 54px;
  border: 0;
  border-radius: 18px;
  background: var(--ux-ink);
  color: var(--ux-page);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: width .5s var(--ux-spring), border-radius .5s var(--ux-spring), transform .3s var(--ux-spring), background-color .4s;
  overflow: hidden;
}

.u081-go:active {
  transform: scale(.97);
}

.u081-go:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 3px;
}

.u081-go span {
  transition: opacity .2s;
}

.u081.is-run .u081-go,
.u081.is-ok .u081-go {
  width: 56px;
  border-radius: 50%;
  pointer-events: none;
}

.u081.is-run .u081-go span,
.u081.is-ok .u081-go span {
  opacity: 0;
}

.u081-ring {
  pointer-events: none;
  position: absolute;
  left: 50%;
  bottom: -13px;
  width: 80px;
  height: 80px;
  margin-left: -40px;
  transform: rotate(-90deg);
  opacity: 0;
  transition: opacity .3s;
}

.u081.is-run .u081-ring,
.u081.is-ok .u081-ring {
  opacity: 1;
  transition-delay: .25s;
}

.u081-ring circle {
  fill: none;
  stroke-width: 5;
  stroke-linecap: round;
}

.u081-ring .t {
  stroke: var(--ux-surface-3);
}

.u081-ring .p {
  stroke: var(--ux-accent);
  stroke-dasharray: 100;
  stroke-dashoffset: calc(100 - var(--p, 0) * 100);
  transition: stroke .4s;
}

.u081.is-ok .u081-ring .p {
  stroke: var(--ux-mint);
}

.u081-ck {
  position: absolute;
  left: 50%;
  bottom: 15px;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  fill: none;
  stroke: var(--ux-page);
  stroke-width: 3.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}

.u081-ck path {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset .45s var(--ux-ease) .2s;
}

.u081.is-ok .u081-go {
  background: var(--ux-mint);
}

.u081.is-ok .u081-ck {
  stroke: var(--ux-accent-ink);
}

.u081.is-ok .u081-ck path {
  stroke-dashoffset: 0;
}

.u081-steps {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 18px 0 6px;
  height: 24px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ux-ink-3);
  opacity: 0;
  transition: opacity .3s;
}

.u081.is-run .u081-steps,
.u081.is-ok .u081-steps {
  opacity: 1;
}

.u081-steps span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: color .3s;
}

.u081-steps span::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ux-line-2);
  transition: background-color .3s, transform .4s var(--ux-spring);
}

.u081-steps span.on {
  color: var(--ux-ink);
}

.u081-steps span.on::before {
  background: var(--ux-accent);
  transform: scale(1.3);
}

.u081.is-ok .u081-steps span.on::before {
  background: var(--ux-mint);
}

.u081-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

/* Slide up receipt */
.u081-rec {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 22px 18px 16px;
  border-radius: 22px;
  background: var(--ux-surface-2);
  transform: translateY(110%);
  transition: transform .6s var(--ux-spring);
  text-align: center;
}

.u081.is-rec .u081-rec {
  transform: none;
}

.u081.is-rec .u081-sum,
.u081.is-rec .u081-card,
.u081.is-rec .u081-opt,
.u081.is-rec .u081-steps {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity .4s, transform .5s var(--ux-ease);
}

.u081.is-rec .u081-stage {
  opacity: 0;
  pointer-events: none;
}

.u081-rec i {
  width: 60px;
  height: 60px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--ux-mint);
  color: var(--ux-accent-ink);
  box-shadow: 0 0 0 8px color-mix(in srgb, var(--ux-mint) 16%, transparent);
}

.u081-rec i svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u081-rec::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -8px;
  height: 16px;
  background: radial-gradient(circle 8px at 8px 0, transparent 98%, var(--ux-surface-2)) 0 8px/16px 8px repeat-x;
}

.u081-rec b {
  display: block;
  font-size: 19px;
  font-weight: 850;
  letter-spacing: -.03em;
  color: var(--ux-ink);
}

.u081-rec p {
  margin: 4px 0 12px;
  font-size: 12.5px;
  color: var(--ux-ink-3);
}

.u081-rec dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 6px 12px;
  margin: 0 0 16px;
  text-align: left;
  font-size: 12.5px;
}

.u081-rec dt {
  color: var(--ux-ink-3);
  font-weight: 650;
}

.u081-rec dd {
  margin: 0;
  text-align: right;
  font-weight: 750;
  color: var(--ux-ink);
  font-variant-numeric: tabular-nums;
}

.u081-rec button {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 14px;
  background: var(--ux-ink);
  color: var(--ux-page);
  font-size: 13.5px;
  font-weight: 750;
  cursor: pointer;
  transition: transform .2s var(--ux-spring);
}

.u081-rec button:hover {
  transform: translateY(-1px);
}

.u081-rec button:active {
  transform: scale(0.98);
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
