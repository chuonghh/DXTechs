<!-- Lucian UX/UI Prompt #039 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#039 -->
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

export interface SegmentItem {
  value: string
  label: string
  count?: number
  icon?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    items: SegmentItem[]
    ariaLabel?: string
    theme?: 'light' | 'dark' | 'auto'
  }>(),
  {
    ariaLabel: 'Menu chuyển tab',
    theme: 'light',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const pillX = ref(4)
const pillWidth = ref(80)
const isReady = ref(false)

function updatePillPosition(animate = true) {
  if (!containerRef.value) return
  const activeBtn = containerRef.value.querySelector<HTMLButtonElement>(`button[data-value="${props.modelValue}"]`)
  if (activeBtn) {
    pillX.value = activeBtn.offsetLeft
    pillWidth.value = activeBtn.offsetWidth
    isReady.value = animate
  }
}

function selectTab(val: string) {
  emit('update:modelValue', val)
}

function onKeydown(e: KeyboardEvent, currentIndex: number) {
  let dir = 0
  if (e.key === 'ArrowRight') dir = 1
  else if (e.key === 'ArrowLeft') dir = -1

  if (dir !== 0) {
    e.preventDefault()
    const nextIndex = (currentIndex + dir + props.items.length) % props.items.length
    const nextItem = props.items[nextIndex]
    if (nextItem) {
      selectTab(nextItem.value)
      nextTick(() => {
        const nextBtn = containerRef.value?.querySelector<HTMLButtonElement>(`button[data-value="${nextItem.value}"]`)
        nextBtn?.focus()
      })
    }
  }
}

watch(() => props.modelValue, () => {
  nextTick(() => updatePillPosition(true))
})

watch(() => props.items, () => {
  nextTick(() => updatePillPosition(false))
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    updatePillPosition(false)
    window.addEventListener('resize', () => updatePillPosition(false))
  })
})
</script>

<template>
  <div
    ref="containerRef"
    class="ux lucian-segmented"
    :class="[`theme-${theme}`]"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <!-- Sliding spring pill -->
    <span
      class="lucian-pill"
      :class="{ 'has-transition': isReady }"
      :style="{
        transform: `translateX(${pillX}px)`,
        width: `${pillWidth}px`
      }"
      aria-hidden="true"
    ></span>

    <!-- Tab buttons -->
    <button
      v-for="(item, idx) in items"
      :key="item.value"
      type="button"
      role="tab"
      :data-value="item.value"
      :aria-selected="modelValue === item.value"
      :tabindex="modelValue === item.value ? 0 : -1"
      class="lucian-tab-btn"
      @click="selectTab(item.value)"
      @keydown="onKeydown($event, idx)"
    >
      <span v-if="item.icon" class="tab-icon" v-html="item.icon"></span>
      <span class="tab-label">{{ item.label }}</span>
      <span v-if="item.count !== undefined" class="tab-badge">{{ item.count }}</span>
    </button>
  </div>
</template>

<style scoped>
.lucian-segmented {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 999px;
  background: #f6f3ec;
  border: 1px solid #ebe6dc;
  box-shadow: inset 0 1px 3px rgba(15, 34, 74, 0.04);
  user-select: none;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.lucian-segmented::-webkit-scrollbar {
  display: none;
}

/* Sliding Pill */
.lucian-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  border-radius: 999px;
  background: #0062ff;
  box-shadow: 0 3px 10px rgba(0, 98, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  pointer-events: none;
  z-index: 1;
}

.lucian-pill.has-transition {
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Tab button */
.lucian-tab-btn {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 18px;
  border: none;
  background: transparent;
  color: #5a6e8c;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 999px;
  outline: none;
  transition: color 0.25s ease;
}

.lucian-tab-btn:hover {
  color: #0f224a;
}

.lucian-tab-btn[aria-selected="true"] {
  color: #FFFFFF;
  font-weight: 700;
}

.lucian-tab-btn:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 2px;
}

.tab-icon {
  display: inline-flex;
  align-items: center;
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #ebe6dc;
  color: #5a6e8c;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.lucian-tab-btn[aria-selected="true"] .tab-badge {
  background: rgba(255, 255, 255, 0.28);
  color: #FFFFFF;
}

/* Dark Theme Variant */
.lucian-segmented.theme-dark {
  background: #0b1a38;
  border: 1px solid rgba(0, 98, 255, 0.2);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.2);
}

.lucian-segmented.theme-dark .lucian-tab-btn {
  color: #7a7a7a;
}

.lucian-segmented.theme-dark .lucian-tab-btn:hover {
  color: #f5f5f7;
}

.lucian-segmented.theme-dark .lucian-tab-btn[aria-selected="true"] {
  color: #FFFFFF;
}

.lucian-segmented.theme-dark .tab-badge {
  background: rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
}

.lucian-segmented.theme-dark .lucian-tab-btn[aria-selected="true"] .tab-badge {
  background: rgba(255, 255, 255, 0.25);
}
</style>
