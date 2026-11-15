<!-- Lucian UX/UI Prompt #101 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#101 -->
<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  eyebrow?: string
  title: string
  description?: string
  defaultSplit?: number
  minSplit?: number
  maxSplit?: number
  posterBadge?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultSplit: 55,
  minSplit: 30,
  maxSplit: 75,
  posterBadge: 'DXTechs SaaS Hub',
})

const splitVal = ref(props.defaultSplit)
const panesRef = ref<HTMLElement | null>(null)

function setSplit(val: number) {
  splitVal.value = Math.max(props.minSplit, Math.min(props.maxSplit, Math.round(val)))
}

function handleKeydown(e: KeyboardEvent) {
  if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape'].includes(e.key)) {
    e.preventDefault()
    if (e.key === 'Escape') setSplit(props.defaultSplit)
    else if (e.key === 'Home') setSplit(props.minSplit)
    else if (e.key === 'End') setSplit(props.maxSplit)
    else if (e.key === 'ArrowRight') setSplit(splitVal.value + 3)
    else if (e.key === 'ArrowLeft') setSplit(splitVal.value - 3)
  }
}

function onPointerDown(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  if (el.hasPointerCapture(e.pointerId) && panesRef.value) {
    const rect = panesRef.value.getBoundingClientRect()
    if (rect.width > 0) {
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setSplit(pct)
    }
  }
}
</script>

<template>
  <div class="ux u101" :style="{ '--split': `${splitVal}%` }">
    <div ref="panesRef" class="panes">
      <section class="doc">
        <span v-if="eyebrow" class="doc-eyebrow">{{ eyebrow }}</span>
        <h1 class="doc-title">{{ title }}</h1>
        <p v-if="description" class="doc-desc">{{ description }}</p>
        <slot name="extra" />
      </section>

      <button
        class="sep"
        type="button"
        role="separator"
        aria-label="Điều chỉnh độ rộng tiêu đề bằng phím mũi tên"
        aria-orientation="vertical"
        :aria-valuemin="minSplit"
        :aria-valuemax="maxSplit"
        :aria-valuenow="splitVal"
        @keydown="handleKeydown"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
      >
        <span class="sep-dots" aria-hidden="true">⋮</span>
      </button>

      <section class="preview" aria-label="Cover preview">
        <div class="poster">
          <div class="poster-mesh" aria-hidden="true"></div>
          <div class="poster-core" aria-hidden="true"></div>
          <div class="poster-meta">
            <span class="poster-tag">{{ posterBadge }}</span>
            <span class="poster-glow"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Tokens mapped to DXTechs brand system */
.ux {
  color-scheme: light;
  --ux-page: #fbf9f5;
  --ux-surface: #FFFFFF;
  --ux-surface-2: #f6f3ec;
  --ux-surface-3: #ebe6dc;
  --ux-ink: #0f224a;
  --ux-ink-2: #5a6e8c;
  --ux-ink-3: #5a6e8c;
  --ux-line: rgba(0, 85, 187, 0.08);
  --ux-line-2: rgba(0, 85, 187, 0.14);
  --ux-accent: #0062ff;
  --ux-accent-2: #2997ff;
  --ux-accent-soft: rgba(0, 98, 255, 0.12);
  --ux-accent-ink: #FFFFFF;
  --ux-mint: #0062ff;
  --ux-warn: #b45309;
  --ux-danger: #c2410c;
  --ux-shadow: rgba(0, 85, 187, 0.06);
  --ux-shadow-strong: rgba(0, 85, 187, 0.16);
  --ux-grad: linear-gradient(135deg, #0062ff 0%, #2997ff 100%);
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(0.16, 1, 0.3, 1);

  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--ux-ink);
  -webkit-font-smoothing: antialiased;
}

.ux, .ux *, .ux *::before, .ux *::after {
  box-sizing: border-box;
}

/* -------------------------------------------------------------
 * Lucian UX/UI Prompt #101: Split workspace
 * ------------------------------------------------------------- */
.u101 {
  width: 100%;
  min-width: 0;
  font-size: 14px;
  border: 1px solid var(--ux-line-2);
  border-radius: 20px;
  overflow: hidden;
  background: var(--ux-surface);
  box-shadow: 0 4px 20px var(--ux-shadow);
  margin-bottom: 24px;
}

.u101 .panes {
  display: grid;
  grid-template-columns: minmax(0, var(--split, 55%)) 22px minmax(0, 1fr);
  min-height: 200px;
}

.u101 .doc {
  padding: 28px 24px;
  background: var(--ux-surface);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.u101 .doc-eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.05em;
  color: var(--ux-accent);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.u101 .doc-title {
  margin: 0 0 10px;
  font-size: clamp(20px, 2.4vw, 30px);
  line-height: 1.25;
  font-weight: 850;
  letter-spacing: -0.035em;
  color: var(--ux-ink);
}

.u101 .doc-desc {
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--ux-ink-2);
  margin: 0;
  max-width: 65ch;
}

.u101 .sep {
  padding: 0;
  border: 0;
  background: var(--ux-surface-3);
  cursor: col-resize;
  touch-action: none;
  color: var(--ux-ink-3);
  display: grid;
  place-items: center;
  user-select: none;
  transition: background-color 0.2s, color 0.2s;
}

.u101 .sep:hover,
.u101 .sep:focus-visible {
  background: var(--ux-accent);
  color: var(--ux-accent-ink);
  outline: none;
}

.u101 .sep-dots {
  font-size: 20px;
  line-height: 1;
  pointer-events: none;
}

.u101 .preview {
  padding: 20px 20px 20px 14px;
  background: var(--ux-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.u101 .poster {
  width: 100%;
  height: 100%;
  min-height: 160px;
  border-radius: 16px;
  background: linear-gradient(135deg, #004cc8 0%, #0062ff 60%, #2997ff 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 28px -10px var(--ux-shadow-strong);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.u101 .poster-mesh {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 80% 20%, rgba(41, 151, 255, 0.45), transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(17, 156, 114, 0.35), transparent 50%);
  filter: blur(20px);
}

.u101 .poster-core {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.4), rgba(41, 151, 255, 0.2));
  right: -20px;
  bottom: -20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.u101 .poster-meta {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.u101 .poster-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.04em;
}

.u101 .poster-glow {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ux-mint);
  box-shadow: 0 0 10px var(--ux-mint);
}

/* Responsive on mobile */
@media (max-width: 720px) {
  .u101 .panes {
    grid-template-columns: 1fr;
    height: auto;
  }
  .u101 .sep {
    display: none;
  }
  .u101 .preview {
    padding: 0 16px 16px;
  }
  .u101 .poster {
    min-height: 120px;
  }
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
