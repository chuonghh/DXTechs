<!-- Lucian UX/UI Prompt #044 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#044 -->
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

export interface FaqAccordionItem {
  id?: string | number
  question?: string
  q?: string
  answer?: string
  a?: string
  linkText?: string
  linkUrl?: string
  open?: boolean
}

interface Props {
  items: FaqAccordionItem[]
  defaultOpenIndex?: number | null
  allowMultiple?: boolean
  fixedSize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpenIndex: 0,
  allowMultiple: false,
  fixedSize: false,
})

const emit = defineEmits<{
  (e: 'change', index: number | null): void
}>()

// Generate an instance UID for aria-controls and IDs
const instanceUid = `u044-${Math.random().toString(36).slice(2, 8)}`

// Active state tracking
const activeIndex = ref<number | null>(props.defaultOpenIndex ?? 0)
const multipleActive = ref<Set<number>>(new Set(props.defaultOpenIndex !== null && props.defaultOpenIndex !== undefined ? [props.defaultOpenIndex] : []))

const buttonRefs = ref<(HTMLButtonElement | null)[]>([])

function isOpen(index: number): boolean {
  if (props.allowMultiple) {
    return multipleActive.value.has(index)
  }
  return activeIndex.value === index
}

function toggle(index: number) {
  if (props.allowMultiple) {
    if (multipleActive.value.has(index)) {
      multipleActive.value.delete(index)
    } else {
      multipleActive.value.add(index)
    }
    emit('change', index)
  } else {
    if (activeIndex.value === index) {
      activeIndex.value = null
      emit('change', null)
    } else {
      activeIndex.value = index
      emit('change', index)
    }
  }
}

function handleKeydown(e: KeyboardEvent, index: number) {
  const total = props.items.length
  if (total === 0) return

  let targetIndex = -1
  if (e.key === 'ArrowDown') {
    targetIndex = (index + 1) % total
  } else if (e.key === 'ArrowUp') {
    targetIndex = (index - 1 + total) % total
  } else if (e.key === 'Home') {
    targetIndex = 0
  } else if (e.key === 'End') {
    targetIndex = total - 1
  }

  if (targetIndex !== -1) {
    e.preventDefault()
    buttonRefs.value[targetIndex]?.focus()
  }
}

function getQuestion(item: FaqAccordionItem): string {
  return item.question || item.q || ''
}

function getAnswer(item: FaqAccordionItem): string {
  return item.answer || item.a || ''
}

function formatIndex(index: number): string {
  const num = index + 1
  return num < 10 ? `0${num}` : `${num}`
}

function isInternalLink(url?: string): boolean {
  if (!url) return false
  return url.startsWith('/') && !url.startsWith('//')
}
</script>

<template>
  <div class="ux u044" :class="{ 'is-fixed': fixedSize }" role="presentation">
    <div
      v-for="(item, i) in items"
      :key="item.id ?? i"
      class="u044-it"
      :class="{ open: isOpen(i) }"
    >
      <button
        :ref="(el) => { buttonRefs[i] = el as HTMLButtonElement }"
        :id="`${instanceUid}-q${i}`"
        class="u044-q"
        type="button"
        :aria-expanded="isOpen(i)"
        :aria-controls="`${instanceUid}-a${i}`"
        @click="toggle(i)"
        @keydown="handleKeydown($event, i)"
      >
        <span class="u044-n">{{ formatIndex(i) }}</span>
        <span class="u044-t">{{ getQuestion(item) }}</span>
        <span class="u044-pm" aria-hidden="true"></span>
      </button>

      <div
        :id="`${instanceUid}-a${i}`"
        class="u044-body"
        role="region"
        :aria-labelledby="`${instanceUid}-q${i}`"
      >
        <div>
          <div class="u044-a">
            <p>{{ getAnswer(item) }}</p>

            <RouterLink
              v-if="item.linkUrl && item.linkText && isInternalLink(item.linkUrl)"
              :to="item.linkUrl"
              class="u044-link"
              :tabindex="isOpen(i) ? 0 : -1"
            >
              {{ item.linkText }}
              <i aria-hidden="true">→</i>
            </RouterLink>

            <a
              v-else-if="item.linkUrl && item.linkText"
              :href="item.linkUrl"
              class="u044-link"
              :tabindex="isOpen(i) ? 0 : -1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ item.linkText }}
              <i aria-hidden="true">→</i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Design tokens strictly mapped to DXTechs light brand design */
.ux {
  color-scheme: light;
  --ux-page: #f8fafc;
  --ux-surface: #ffffff;
  --ux-surface-2: #f0f5ff;
  --ux-surface-3: #e2e8f0;
  --ux-ink: #070e24;
  --ux-ink-2: #5a6e8c;
  --ux-ink-3: #0062ff;
  --ux-line: rgba(15, 34, 74, 0.08);
  --ux-line-2: rgba(0, 98, 255, 0.25);
  --ux-accent: #0062ff;
  --ux-accent-2: #00c2ff;
  --ux-accent-soft: rgba(0, 98, 255, 0.08);
  --ux-accent-ink: #ffffff;
  --ux-mint: #0062ff;
  --ux-warn: #eab308;
  --ux-danger: #ef4444;
  --ux-glass: rgba(255, 255, 255, 0.85);
  --ux-glass-line: rgba(15, 34, 74, 0.08);
  --ux-shadow: rgba(7, 14, 36, 0.04);
  --ux-shadow-strong: rgba(0, 98, 255, 0.12);
  --ux-grad: linear-gradient(135deg, #0062ff 0%, #00c2ff 100%);
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(0.16, 1, 0.3, 1);

  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--ux-ink);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -.01em;
  -webkit-tap-highlight-color: transparent;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.ux, .ux *, .ux *::before, .ux *::after {
  box-sizing: border-box;
}

:where(.ux) :is(button, input, textarea, select) {
  font: inherit;
  color: inherit;
}

:where(.ux) button {
  cursor: pointer;
}

.ux :focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 3px;
}

.ux [hidden] {
  display: none !important;
}

/* -------------------------------------------------------------
 * Lucian UX/UI Prompt #044: FAQ accordion
 * ------------------------------------------------------------- */
.u044 {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.u044.is-fixed {
  width: 350px;
  height: 400px;
  gap: 8px;
}

.u044-it {
  position: relative;
  border-radius: 18px;
  background: #ffffff !important;
  border: 1px solid rgba(15, 34, 74, 0.08) !important;
  box-shadow: 0 2px 10px rgba(7, 14, 36, 0.03);
  transition: background-color .3s var(--ux-ease), box-shadow .3s var(--ux-ease), transform .3s var(--ux-spring), border-color .3s;
}

.u044-it:hover {
  border-color: #0062ff !important;
  box-shadow: 0 6px 20px rgba(0, 98, 255, 0.08);
}

.u044-it.open {
  border-color: #0062ff !important;
  box-shadow: 0 10px 30px -10px rgba(0, 98, 255, 0.15);
  transform: translateY(-2px);
}

.u044-q {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 58px;
  padding: 16px 18px 16px 20px;
  border: 0;
  border-radius: 20px;
  background: none;
  font-size: 15.5px;
  font-weight: 680;
  letter-spacing: -.02em;
  color: #070e24 !important;
  text-align: left;
  line-height: 1.4;
  user-select: none;
}

.u044-q:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 2px;
}

.u044-n {
  font-size: 13px;
  font-weight: 800;
  color: #0062ff !important;
  font-variant-numeric: tabular-nums;
  transition: color .3s;
  flex-shrink: 0;
}

.u044-it.open .u044-n {
  color: var(--ux-accent);
}

.u044-t {
  flex: 1;
}

.u044-pm {
  position: relative;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 50%;
  background: var(--ux-surface-2);
  box-shadow: none;
  transition: background-color .35s var(--ux-ease), box-shadow .35s, transform .45s var(--ux-spring);
}

.u044-q:hover .u044-pm {
  transform: scale(1.1);
}

.u044-q:active .u044-pm {
  transform: scale(.9);
}

.u044-pm::before,
.u044-pm::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 2px;
  margin: -1px 0 0 -6px;
  border-radius: 2px;
  background: var(--ux-ink);
  transition: transform .5s var(--ux-spring), background-color .3s;
}

.u044-pm::after {
  transform: rotate(90deg);
}

.u044-it.open .u044-pm {
  background: var(--ux-accent, #0062ff);
  box-shadow: 0 2px 8px rgba(0, 98, 255, 0.35);
}

.u044-it.open .u044-pm::before,
.u044-it.open .u044-pm::after {
  background: #ffffff;
}

/* The vertical stroke rotates 90deg -> 180deg to lie flat with the horizontal stroke (+ becomes -) */
.u044-it.open .u044-pm::after {
  transform: rotate(180deg);
}

.u044-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .5s var(--ux-ease);
}

.u044-it.open .u044-body {
  grid-template-rows: 1fr;
}

.u044-body > div {
  overflow: hidden;
  min-height: 0;
}

.u044-a {
  padding: 0 22px 20px 48px;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity .25s var(--ux-ease), transform .45s var(--ux-spring);
}

.u044-it.open .u044-a {
  opacity: 1;
  transform: none;
  transition-delay: .12s;
}

.u044-a p {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.68;
  color: var(--ux-ink-2);
}

.u044-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ux-accent);
  text-decoration: none;
}

.u044-link:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

.u044-link i {
  font-style: normal;
  display: inline-block;
  transition: transform .3s var(--ux-spring);
}

.u044-link:hover i {
  transform: translateX(4px);
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .u044-q {
    padding: 14px 14px 14px 16px;
    gap: 10px;
    font-size: 14.5px;
  }
  .u044-a {
    padding: 0 16px 16px 40px;
  }
  .u044-a p {
    font-size: 13.5px;
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
