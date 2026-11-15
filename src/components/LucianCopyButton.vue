<!-- Lucian UX/UI Prompt #008 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#008 -->
<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    label?: string
    feedbackText?: string
    compact?: boolean
  }>(),
  {
    label: '',
    feedbackText: 'Đã chép!',
    compact: true,
  }
)

const emit = defineEmits<{
  (e: 'copied', text: string): void
}>()

const isCopied = ref(false)
let timer: any = null

async function handleCopy() {
  if (!props.text) return
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.text)
    } else {
      const input = document.createElement('textarea')
      input.value = props.text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
  } catch (err) {
    console.error('Failed to copy', err)
  }

  isCopied.value = true
  emit('copied', props.text)

  clearTimeout(timer)
  timer = setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <div class="ux lucian-copy-wrap" :class="{ 'is-copied': isCopied, 'is-compact': compact }">
    <button
      type="button"
      class="lucian-copy-btn"
      :aria-label="label ? label : 'Sao chép mã bản quyền'"
      :title="label ? label : 'Sao chép'"
      @click="handleCopy"
    >
      <span class="icon-holder" aria-hidden="true">
        <!-- Copy squares -->
        <svg class="lucian-cp-icon" viewBox="0 0 24 24">
          <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
          <path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
        </svg>
        <!-- Morphing checkmark -->
        <svg class="lucian-ok-icon" viewBox="0 0 24 24">
          <path d="M5.5 12.5l4.2 4.2L18.5 8" />
        </svg>
      </span>
      <span v-if="label" class="lucian-copy-label">{{ label }}</span>
    </button>
    <span class="lucian-tip" role="status" aria-live="polite">
      {{ feedbackText }}
    </span>
  </div>
</template>

<style scoped>
.lucian-copy-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.lucian-copy-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 28px;
  min-width: 28px;
  padding: 0 9px;
  border: 1px solid rgba(0, 98, 255, 0.2);
  border-radius: 7px;
  background: #f0f5ff;
  color: #0062ff;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease,
              border-color 0.2s ease,
              color 0.2s ease,
              transform 0.2s ease,
              box-shadow 0.2s ease;
}

.is-compact:not(:has(.lucian-copy-label)) .lucian-copy-btn,
.is-compact .lucian-copy-btn:not(:has(.lucian-copy-label)) {
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0;
  border-radius: 8px;
  flex: none;
}

.lucian-copy-label {
  display: inline-block;
  white-space: nowrap;
  line-height: 1;
}

.lucian-copy-btn:hover {
  background: #0062ff;
  border-color: #0062ff;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 98, 255, 0.25);
}

.lucian-copy-btn:active {
  transform: scale(0.92);
}

.lucian-copy-btn:focus-visible {
  outline: 2px solid #0062ff;
  outline-offset: 2px;
}

.icon-holder {
  position: relative;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lucian-cp-icon,
.lucian-ok-icon {
  position: absolute;
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: opacity 0.22s var(--ux-ease), transform 0.45s var(--ux-spring);
}

.lucian-ok-icon {
  opacity: 0;
  transform: scale(0.4) rotate(-30deg);
}

.lucian-ok-icon path {
  stroke-width: 2.6;
  stroke-dasharray: 22;
  stroke-dashoffset: 22;
  transition: stroke-dashoffset 0.35s var(--ux-ease) 0.08s;
}

/* Copied active state */
.is-copied .lucian-copy-btn {
  background: #0066cc;
  border-color: #0066cc;
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.35);
}

.is-copied .lucian-cp-icon {
  opacity: 0;
  transform: scale(0.4) rotate(30deg);
}

.is-copied .lucian-ok-icon {
  opacity: 1;
  transform: none;
}

.is-copied .lucian-ok-icon path {
  stroke-dashoffset: 0;
}

/* Tooltip floating bubble */
.lucian-tip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%) translateY(6px) scale(0.8);
  padding: 4px 10px;
  border-radius: 8px;
  background: #1d1d1f;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s var(--ux-ease), transform 0.4s var(--ux-spring);
  box-shadow: 0 4px 14px rgba(29, 29, 31, 0.25);
  z-index: 100;
}

.lucian-tip::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -4px;
  width: 8px;
  height: 8px;
  background: inherit;
  border-radius: 1.5px;
  transform: translateX(-50%) rotate(45deg);
}

.is-copied .lucian-tip {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}
</style>
