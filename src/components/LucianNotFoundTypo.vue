<!-- Lucian UX/UI Prompt #089 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#089 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

interface SuggestionItem {
  path: string
  name: string
  match: number
}

const router = useRouter()

const rootRef = ref<HTMLElement | null>(null)
const numRef = ref<HTMLElement | null>(null)
const cpRef = ref<HTMLElement | null>(null)
const ndRef = ref<HTMLElement | null>(null)
const leftColRef = ref<HTMLElement | null>(null)
const rightColRef = ref<HTMLElement | null>(null)

const suggestions: SuggestionItem[] = [
  { path: '/phan-mem', name: 'Phần mềm bản quyền', match: 0.94 },
  { path: '/dich-vu', name: 'Dịch vụ Cloud VPS & Hạ tầng', match: 0.86 },
  { path: '/du-an', name: 'Dự án & Năng lực triển khai', match: 0.65 },
  { path: '/lien-he', name: 'Liên hệ & Hỗ trợ kỹ thuật 24/7', match: 0.52 },
]

const currentPathText = ref('/phan-mm')
const isFixing = ref(false)
const isFound = ref(false)
const isTracking = ref(false)
const isSwapping = ref(false)
const activeIndex = ref<number | null>(null)
const titleText = ref('Có vẻ như bạn đã đi lạc hướng')
const subText = ref('Đường dẫn có thể gõ sai chính tả hoặc trang đã được chuyển đổi')

// Spring physics for needle tracking
let a = 0
let v = 0
let tgt = 0
let raf = 0
let last = 0
let timeouts: ReturnType<typeof setTimeout>[] = []
const isReducedMotion = ref(false)

function kick() {
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(step)
  }
}

function step(now: number) {
  raf = 0
  const dt = Math.min(0.032, (now - last) / 1000)
  last = now

  if (isReducedMotion.value) {
    a = tgt
    v = 0
  } else {
    v += (220 * (tgt - a) - 17 * v) * dt
    a += v * dt
  }

  if (ndRef.value) {
    ndRef.value.style.transform = `rotate(${a.toFixed(2)}deg)`
  }

  if (Math.abs(v) > 0.05 || Math.abs(tgt - a) > 0.05) {
    raf = requestAnimationFrame(step)
  }
}

function aim(deg: number) {
  tgt = a + ((((deg - a) % 360) + 540) % 360) - 180
  kick()
}

function toward(x: number, y: number) {
  if (!cpRef.value || !rootRef.value || !numRef.value) return
  const r = cpRef.value.getBoundingClientRect()
  const dx = x - (r.left + r.width / 2)
  const dy = y - (r.top + r.height / 2)
  aim((Math.atan2(dx, -dy) * 180) / Math.PI)
  const rootW = rootRef.value.getBoundingClientRect().width / 2
  numRef.value.style.setProperty('--r', Math.max(-1, Math.min(1, dx / rootW)).toFixed(3))
}

function onPointerMove(e: PointerEvent) {
  if (isFixing.value || isFound.value) return
  isTracking.value = true
  toward(e.clientX, e.clientY)
}

function onPointerLeave() {
  if (isFixing.value || isFound.value) return
  isTracking.value = false
  if (numRef.value) numRef.value.style.setProperty('--r', '0')
  aim(0)
}

function digits(x: number, y: number) {
  if (leftColRef.value) leftColRef.value.style.setProperty('--v', String(x))
  if (rightColRef.value) rightColRef.value.style.setProperty('--v', String(y))
}

function swapText(newTitle: string, newSub: string) {
  isSwapping.value = true
  const t = setTimeout(() => {
    titleText.value = newTitle
    subText.value = newSub
    isSwapping.value = false
  }, isReducedMotion.value ? 0 : 250)
  timeouts.push(t)
}

function pickSuggestion(index: number) {
  if (isFixing.value || isFound.value) return
  isFixing.value = true
  activeIndex.value = index

  const targetPath = suggestions[index].path
  const from = currentPathText.value
  let k = from.length

  function del() {
    if (k > 1) {
      k--
      currentPathText.value = from.slice(0, k)
      const t = setTimeout(del, isReducedMotion.value ? 0 : 35)
      timeouts.push(t)
      return
    }
    let j = 1
    function type() {
      j++
      currentPathText.value = targetPath.slice(0, j)
      if (j < targetPath.length) {
        const t = setTimeout(type, isReducedMotion.value ? 0 : 45)
        timeouts.push(t)
      } else {
        isFixing.value = false
        isTracking.value = false
        isFound.value = true
        if (numRef.value) numRef.value.style.setProperty('--r', '0')
        digits(2, 0) // Roll to 200 OK!
        tgt = a - (((a % 360) + 360) % 360) + 720
        kick()
        swapText('Đã tìm thấy trang đích!', `Chuyển tới “${suggestions[index].name}”`)
      }
    }
    type()
  }
  del()
}

function reset() {
  timeouts.forEach(clearTimeout)
  timeouts = []
  isFixing.value = false
  isFound.value = false
  isTracking.value = false
  activeIndex.value = null
  currentPathText.value = '/phan-mm'
  digits(4, 4)
  swapText('Có vẻ như bạn đã đi lạc hướng', 'Đường dẫn có thể gõ sai chính tả hoặc trang đã được chuyển đổi')
  aim(0)
}

function navigateToFound() {
  if (activeIndex.value !== null) {
    router.push(suggestions[activeIndex.value].path)
  }
}

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  digits(4, 4)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  timeouts.forEach(clearTimeout)
})
</script>

<template>
  <div
    ref="rootRef"
    class="ux u089"
    :class="{
      fixing: isFixing,
      found: isFound,
      trk: isTracking,
      swap: isSwapping,
    }"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <!-- Simulated Browser URL Bar with typo underline and typing cursor -->
    <div class="u089-url">
      <svg viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="5.6"/>
        <path d="M1.6 7h10.8M7 1.4c1.8 1.6 1.8 9.6 0 11.2M7 1.4c-1.8 1.6-1.8 9.6 0 11.2"/>
      </svg>
      <span>
        dxtechs.vn<b ref="pathRef">{{ currentPathText }}</b>
      </span>
    </div>

    <!-- 404 / 200 Numbers with Interactive Compass in the center -->
    <div ref="numRef" class="u089-num" role="img" :aria-label="isFound ? '200 OK' : '404 error'">
      <!-- Left Digit (Rolls 4 -> 2) -->
      <span class="u089-d" aria-hidden="true">
        <span ref="leftColRef" class="u089-col" style="--v:4">
          <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
        </span>
      </span>

      <!-- Center Compass -->
      <span ref="cpRef" class="u089-cp" aria-hidden="true">
        <svg viewBox="0 0 72 72">
          <circle class="u089-ring" cx="36" cy="36" r="30.5"/>
          <path class="u089-tk" d="M36 14v3M36 55v3M14 36h3M55 36h3"/>
          <g class="u089-wob">
            <g ref="ndRef" class="u089-nd">
              <!-- North needle (Red) -->
              <path d="M36 15.5l5.5 20.5h-11z" fill="#0066cc"/>
              <!-- South needle (Subtle Dark) -->
              <path d="M36 56.5l-5.5-20.5h11z" fill="var(--ux-ink-3)"/>
            </g>
          </g>
          <circle class="u089-hub" cx="36" cy="36" r="3.4"/>
        </svg>
      </span>

      <!-- Right Digit (Rolls 4 -> 0) -->
      <span class="u089-d" aria-hidden="true">
        <span ref="rightColRef" class="u089-col" style="--v:4">
          <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
        </span>
      </span>
    </div>

    <!-- Dynamic Titles -->
    <h2 class="u089-t" aria-live="polite">{{ titleText }}</h2>
    <p class="u089-s">{{ subText }}</p>

    <!-- Suggestion Bar & Reset -->
    <div class="u089-lab">
      <span>Gợi ý trang tương tự chính xác:</span>
      <button class="u089-re" type="button" @click="reset">Thử lại</button>
    </div>

    <!-- Suggested Links List -->
    <ul class="u089-sug">
      <li v-for="(item, i) in suggestions" :key="item.path">
        <button
          class="u089-row"
          type="button"
          :class="{ on: activeIndex === i }"
          :disabled="isFixing || (isFound && activeIndex !== i)"
          :aria-label="`Đi đến ${item.path} ${item.name}, độ khớp ${Math.round(item.match * 100)}%`"
          @click="isFound && activeIndex === i ? navigateToFound() : pickSuggestion(i)"
        >
          <code>{{ item.path }}</code>
          <small>{{ item.name }}</small>
          <span class="u089-m" aria-hidden="true">
            <i :style="{ '--m': item.match }"></i>
          </span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path v-if="activeIndex === i && isFound" d="M3.2 8.4l3 3L12.8 4.8"/>
            <path v-else d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </button>
      </li>
    </ul>

    <!-- Found CTA Button -->
    <div v-if="isFound" class="u089-action-bar">
      <button type="button" class="u089-enter-btn" @click="navigateToFound">
        Truy cập trang này ngay →
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
  --ux-shadow-strong: rgba(29, 29, 31, 0.18);
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
 * Lucian UX/UI Prompt #089: 404 that fixes the typo
 * ------------------------------------------------------------- */
.u089 {
  position: relative;
  width: 100%;
  max-width: 480px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 28px;
  background: var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 30px 60px -25px var(--ux-shadow-strong);
  overflow: hidden;
  text-align: center;
}

.u089-url {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 16px;
  border-radius: 14px;
  background: var(--ux-surface-2);
  font-size: 14px;
  font-weight: 650;
  color: var(--ux-ink-3);
  text-align: left;
}

.u089-url svg {
  width: 16px;
  height: 16px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.u089-url b {
  font-weight: 750;
  color: var(--ux-ink);
  text-decoration: underline wavy var(--ux-danger);
  text-decoration-thickness: 1.5px;
  text-underline-offset: 4px;
  text-decoration-skip-ink: none;
  transition: color .3s;
}

.u089.fixing .u089-url b {
  text-decoration-color: transparent;
}

.u089.found .u089-url b {
  color: var(--ux-mint);
  text-decoration-color: transparent;
}

.u089-url b::after {
  content: "";
  display: inline-block;
  width: 2px;
  height: 16px;
  margin-left: 2px;
  vertical-align: -2px;
  background: var(--ux-accent);
  opacity: 0;
}

.u089.fixing .u089-url b::after {
  opacity: 1;
  animation: u089-c .8s steps(1) infinite;
}

@keyframes u089-c {
  50% { opacity: 0; }
}

.u089-num {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  height: 104px;
  margin-top: 24px;
  font-size: 92px;
  font-weight: 850;
  letter-spacing: -.05em;
  line-height: 104px;
  font-variant-numeric: tabular-nums;
  user-select: none;
}

.u089-d {
  height: 104px;
  overflow: hidden;
  transition: transform .5s var(--ux-spring);
}

.u089-d:first-child {
  transform: rotate(calc(var(--r, 0) * -7deg));
}

.u089-d:last-child {
  transform: rotate(calc(var(--r, 0) * 7deg));
}

.u089-col {
  display: flex;
  flex-direction: column;
  transform: translateY(calc(var(--v) * -104px));
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.u089-d:last-child .u089-col {
  transition-delay: .12s;
}

.u089-col span {
  height: 104px;
  display: block;
}

.u089-cp {
  width: 76px;
  height: 76px;
  margin: 0 4px;
}

.u089-cp svg {
  display: block;
  width: 76px;
  height: 76px;
  overflow: visible;
}

.u089-ring {
  fill: none;
  stroke: var(--ux-ink);
  stroke-width: 10;
  transition: stroke .5s;
}

.u089.found .u089-ring {
  stroke: var(--ux-mint);
}

.u089-tk {
  stroke: var(--ux-ink-3);
  stroke-width: 2.2;
  stroke-linecap: round;
}

.u089-wob {
  transform-origin: 36px 36px;
}

.u089:not(.trk):not(.found) .u089-wob {
  animation: u089-w 3.4s ease-in-out infinite;
}

@keyframes u089-w {
  0%, 100% { transform: rotate(-16deg); }
  50% { transform: rotate(18deg); }
}

.u089-nd {
  transform-origin: 36px 36px;
}

.u089-hub {
  fill: var(--ux-surface);
  stroke: var(--ux-ink);
  stroke-width: 2.2;
}

.u089-t {
  margin: 18px 0 0;
  font-size: 20px;
  font-weight: 850;
  letter-spacing: -.035em;
  color: var(--ux-ink);
}

.u089-s {
  margin: 6px 0 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ux-ink-3);
  line-height: 1.5;
}

.u089-t, .u089-s {
  transition: opacity .25s, transform .35s var(--ux-ease);
}

.u089.swap .u089-t, .u089.swap .u089-s {
  opacity: 0;
  transform: translateY(6px);
}

.u089-lab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin-top: 24px;
  padding: 0 4px;
  font-size: 12.5px;
  font-weight: 750;
  color: var(--ux-ink-3);
}

.u089-re {
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: var(--ux-surface-2);
  font-size: 12px;
  font-weight: 750;
  color: var(--ux-ink-2);
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: opacity .3s, visibility 0s .3s;
}

.u089.found .u089-re {
  opacity: 1;
  visibility: visible;
  transition: opacity .3s;
}

.u089-re:hover {
  color: var(--ux-ink);
  background: var(--ux-surface-3);
}

.u089-sug {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.u089-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color .2s, opacity .3s;
}

.u089-row:hover {
  background: var(--ux-surface-2);
}

.u089-row:active {
  transform: scale(.98);
}

.u089-row code {
  font: 750 14px ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--ux-ink);
}

.u089-row small {
  flex: 1;
  font-size: 12.5px;
  font-weight: 650;
  color: var(--ux-ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.u089-m {
  width: 44px;
  height: 5px;
  border-radius: 3px;
  background: var(--ux-surface-3);
  overflow: hidden;
  flex-shrink: 0;
}

.u089-m i {
  display: block;
  height: 100%;
  width: calc(var(--m) * 100%);
  border-radius: inherit;
  background: var(--ux-accent);
}

.u089-row svg {
  width: 16px;
  height: 16px;
  flex: none;
  fill: none;
  stroke: var(--ux-ink-3);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform .3s var(--ux-spring);
}

.u089-row:hover svg {
  transform: translateX(3px);
}

.u089-row:disabled {
  opacity: .35;
  cursor: default;
}

.u089-row:disabled:hover {
  background: transparent;
}

.u089-row.on {
  background: color-mix(in srgb, var(--ux-mint) 16%, transparent);
  opacity: 1;
}

.u089-row.on .u089-m i {
  background: var(--ux-mint);
}

.u089-row.on svg {
  stroke: var(--ux-mint);
  transform: none;
}

.u089-action-bar {
  margin-top: 14px;
}

.u089-enter-btn {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 16px;
  background: var(--ux-accent);
  color: var(--ux-accent-ink);
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .25s var(--ux-spring);
}

.u089-enter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -6px rgba(0, 102, 204, 0.4);
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
