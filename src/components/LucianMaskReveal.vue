<!-- Lucian UX/UI Prompt #237 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#237 -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export interface MaskRevealCopy {
  lines: [string, string, string]
}

const props = withDefaults(
  defineProps<{
    kickerLeft?: string
    kickerRight?: string
    items?: MaskRevealCopy[]
    theme?: 'light' | 'dark' | 'auto'
  }>(),
  {
    kickerLeft: 'DXTECHS · CHIẾN DỊCH 2026',
    kickerRight: 'MANIFESTO',
    theme: 'auto',
    items: () => [
      { lines: ['Bản quyền thật,', 'hiệu năng', 'vươn xa'] },
      { lines: ['Hạ tầng Cloud,', 'vận hành', 'bền bỉ'] },
      { lines: ['Đồng hành 24/7,', 'tăng trưởng', 'vững chắc'] },
      { lines: ['Bảo mật tối đa,', 'an tâm', 'phát triển'] },
    ],
  }
)

const emit = defineEmits<{
  (e: 'change', index: number): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const curIndex = ref(0)
const isDrawn = ref(false)
const underlineWidth = ref(170)
const blockStates = ref<Record<number, 'is-in' | 'is-out' | ''>>({})

let drawTimer: any = null
let replayTimer: any = null

const formattedCurrent = computed(() => String(curIndex.value + 1).padStart(2, '0'))
const formattedTotal = computed(() => String(props.items.length).padStart(2, '0'))
const currentAriaLabel = computed(() => props.items[curIndex.value]?.lines.join(' ') || '')

function updateUnderlineWidth(index: number) {
  nextTick(() => {
    if (!rootRef.value) return
    const blocks = rootRef.value.querySelectorAll('.u237-cp')
    const activeBlock = blocks[index]
    if (!activeBlock) return
    const inners = activeBlock.querySelectorAll<HTMLElement>('.u237-in')
    const lastWord = inners[2]
    if (lastWord) {
      underlineWidth.value = Math.max(90, lastWord.offsetWidth + 14)
    }
  })
}

function show(targetIndex: number, replay = false) {
  clearTimeout(drawTimer)
  clearTimeout(replayTimer)
  isDrawn.value = false

  const prev = curIndex.value
  curIndex.value = targetIndex
  emit('change', targetIndex)

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Transition previous block out
  props.items.forEach((_, k) => {
    if (k === prev && (k !== targetIndex || replay)) {
      blockStates.value[k] = 'is-out'
    } else if (k !== targetIndex) {
      blockStates.value[k] = ''
    }
  })

  const enter = () => {
    if (!rootRef.value) return
    const blocks = rootRef.value.querySelectorAll<HTMLElement>('.u237-cp')
    const b = blocks[targetIndex]
    if (b) {
      // Force DOM reflow to ensure the entrance transition starts cleanly from bottom
      blockStates.value[targetIndex] = ''
      b.style.visibility = 'hidden'
      void b.offsetWidth
      b.style.visibility = ''
    }

    blockStates.value[targetIndex] = 'is-in'
    updateUnderlineWidth(targetIndex)

    drawTimer = setTimeout(() => {
      if (rootRef.value) {
        isDrawn.value = true
      }
    }, isReducedMotion ? 0 : 950)
  }

  if (replay && !isReducedMotion) {
    replayTimer = setTimeout(enter, 520)
  } else {
    enter()
  }
}

function nextCopy() {
  const next = (curIndex.value + 1) % props.items.length
  show(next)
}

function prevCopy() {
  const prev = (curIndex.value + props.items.length - 1) % props.items.length
  show(prev)
}

function replayCurrent() {
  show(curIndex.value, true)
}

onMounted(() => {
  requestAnimationFrame(() => {
    show(0)
  })
})

onBeforeUnmount(() => {
  clearTimeout(drawTimer)
  clearTimeout(replayTimer)
})
</script>

<template>
  <div
    ref="rootRef"
    class="ux u237"
    :class="[`theme-${theme}`, { 'is-drawn': isDrawn }]"
  >
    <!-- Kicker Header -->
    <p class="u237-k">
      <span>{{ kickerLeft }}</span>
      <span>{{ kickerRight }}</span>
    </p>

    <!-- Main Mask Reveal Headline -->
    <h3 class="u237-h" :aria-label="currentAriaLabel">
      <span
        v-for="(item, itemIndex) in items"
        :key="itemIndex"
        class="u237-cp"
        :class="blockStates[itemIndex] || ''"
        aria-hidden="true"
      >
        <span
          v-for="(line, lineIndex) in item.lines"
          :key="lineIndex"
          class="u237-ln"
        >
          <span
            class="u237-in"
            :style="{ '--i': lineIndex }"
          >{{ line }}</span>
        </span>
      </span>

      <!-- Hand-drawn sketched SVG Underline -->
      <svg
        class="u237-u"
        viewBox="0 0 210 22"
        aria-hidden="true"
        :style="{ width: `${underlineWidth}px` }"
      >
        <path d="M3 14c30-8 62-9 96-5s70 6 108-4" />
      </svg>
    </h3>

    <!-- Footer Controls -->
    <div class="u237-ft">
      <span class="u237-ct">
        <b>{{ formattedCurrent }}</b> / {{ formattedTotal }}
      </span>
      <button
        class="u237-re"
        type="button"
        title="Phát lại hiệu ứng chữ"
        @click="replayCurrent"
      >
        Replay
      </button>
      <button
        class="u237-pv"
        type="button"
        aria-label="Thông điệp trước đó"
        title="Trước đó"
        @click="prevCopy"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        class="u237-nx"
        type="button"
        aria-label="Thông điệp kế tiếp"
        title="Kế tiếp"
        @click="nextCopy"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Theme tokens strictly mapped to DXTechs light design system */
.u237 {
  --ux-page: #f8fafc;
  --ux-surface: #ffffff;
  --ux-surface-2: #f0f5ff;
  --ux-surface-3: #e2e8f0;
  --ux-ink: #070e24;
  --ux-ink-2: #070e24;
  --ux-ink-3: #5a6e8c;
  --ux-line: rgba(15, 34, 74, 0.08);
  --ux-line-2: rgba(0, 98, 255, 0.25);
  --ux-accent: #0062ff;
  --ux-accent-2: #00c2ff;
  --ux-accent-soft: rgba(0, 98, 255, 0.08);
  --ux-accent-ink: #ffffff;
  --ux-shadow-strong: rgba(7, 14, 36, 0.08);
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Component Container */
.u237 {
  position: relative;
  width: 340px;
  max-width: 100%;
  min-height: 330px;
  display: flex;
  flex-direction: column;
  padding: 24px 22px 20px;
  border-radius: 28px;
  background: #ffffff !important;
  border: 1px solid rgba(15, 34, 74, 0.08) !important;
  box-shadow: 0 16px 40px -12px rgba(7, 14, 36, 0.08);
  overflow: hidden;
  user-select: none;
  font-family: var(--font-body, 'Inter', sans-serif);
}

@media (max-width: 380px) {
  .u237 {
    padding: 18px 16px 16px;
    border-radius: 22px;
  }
  .u237-ln {
    font-size: 31px;
  }
  .u237-u {
    top: 132px;
  }
}

/* Kicker */
.u237-k {
  margin: 0;
  display: flex;
  justify-content: space-between;
  font: 600 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: .14em;
  color: #5a6e8c !important;
  text-transform: uppercase;
}

/* Headline Display Area */
.u237-h {
  position: relative;
  margin: 20px 0 0;
  height: 180px;
}

/* Copy Block Positioned Absolute */
.u237-cp {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  pointer-events: none;
}

/* Line with overflow hidden to create invisible mask */
.u237-ln {
  display: block;
  overflow: hidden;
  padding: 0.04em 0 0.1em;
  font-family: var(--font-heading, 'Be Vietnam Pro', sans-serif);
  font-size: 38px;
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.045em;
  color: #070e24 !important;
}

.u237-ln:nth-child(3) .u237-in {
  color: #0062ff !important;
}

/* Inner Text Span Animated From Below */
.u237-in {
  display: inline-block;
  transform: translateY(108%) rotate(4deg);
  transform-origin: 0 100%;
  will-change: transform;
}

.u237-cp.is-in .u237-in {
  transform: none;
  transition: transform .9s cubic-bezier(.2, .9, .2, 1) calc(var(--i) * 95ms);
}

.u237-cp.is-out .u237-in {
  transform: translateY(-108%) rotate(-2deg);
  transition: transform .55s cubic-bezier(.6, 0, .4, 1) calc(var(--i) * 55ms);
}

/* Hand-Drawn SVG Underline */
.u237-u {
  position: absolute;
  left: -4px;
  top: 148px;
  width: 170px;
  height: 22px;
  overflow: visible;
  fill: none;
  stroke: var(--ux-accent);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 240;
  stroke-dashoffset: 240;
  transition: stroke-dashoffset .2s ease;
  pointer-events: none;
}

.u237.is-drawn .u237-u {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset .7s cubic-bezier(.6, 0, .2, 1);
}

/* Footer Navigation Controls */
.u237-ft {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.u237-ct {
  flex: 1;
  font: 600 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--ux-ink-3);
  font-variant-numeric: tabular-nums;
}

.u237-ct b {
  color: var(--ux-ink);
}

.u237-re {
  height: 38px;
  padding: 0 16px;
  border: 1px solid rgba(0, 98, 255, 0.16);
  border-radius: 999px;
  background: #f0f5ff;
  font-size: 13px;
  font-weight: 700;
  color: #0062ff;
  transition: transform .35s var(--ux-spring), background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
}

.u237-re:hover {
  background: #0062ff;
  color: #ffffff;
}

.u237-pv,
.u237-nx {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: transform .35s var(--ux-spring), background-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.u237-pv {
  background: #f0f5ff;
  color: #070e24;
  border: 1px solid rgba(15, 34, 74, 0.08);
}

.u237-pv:hover {
  background: #e2e8f0;
}

.u237-nx {
  background: #0062ff;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 98, 255, 0.25);
}

.u237-nx:hover {
  background: #004ecc;
  box-shadow: 0 6px 18px rgba(0, 98, 255, 0.35);
}

.u237-re:active,
.u237-pv:active,
.u237-nx:active {
  transform: scale(.9);
}

.u237-ft svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Accessibility: Focus visible */
.u237 :focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 3px;
}

/* Reduced Motion Override */
@media (prefers-reduced-motion: reduce) {
  .u237,
  .u237 *,
  .u237 *::before,
  .u237 *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }

  .u237 .u237-in {
    transform: none !important;
    transition: none !important;
  }

  .u237 .u237-u {
    stroke-dashoffset: 0 !important;
    transition: none !important;
  }
}
</style>
