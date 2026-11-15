<!-- Lucian UX/UI Prompt #013 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#013 -->
<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    subtextOff?: string
    subtextOn?: string
    size?: 'sm' | 'md'
    id?: string
  }>(),
  {
    label: '',
    subtextOff: '',
    subtextOn: '',
    size: 'md',
    id: () => 'lucian-sw-' + Math.random().toString(36).slice(2, 8),
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isStretch = ref(false)
let stretchTimer: any = null

function toggle() {
  const next = !props.modelValue
  isStretch.value = true
  clearTimeout(stretchTimer)
  stretchTimer = setTimeout(() => {
    isStretch.value = false
  }, 180)
  emit('update:modelValue', next)
}
</script>

<template>
  <div
    class="ux lucian-switch-container"
    :class="[
      `size-${size}`,
      { 'is-on': modelValue, 'is-stretch': isStretch }
    ]"
  >
    <button
      :id="id"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      class="lucian-switch-track"
      @click="toggle"
    >
      <span class="lucian-switch-knob" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <!-- ✕ cross -->
          <path class="lucian-sw-x" d="M7.5 7.5l9 9M16.5 7.5l-9 9" />
          <!-- ✓ check -->
          <path class="lucian-sw-v" d="M5.5 12.5l4.5 4.5 8.5-9" />
        </svg>
      </span>
    </button>

    <div v-if="label || subtextOff || subtextOn || $slots.label" class="lucian-switch-text" @click="toggle">
      <b class="lucian-switch-label">
        <slot name="label">{{ label }}</slot>
      </b>
      <div v-if="subtextOff || subtextOn" class="lucian-switch-sub">
        <span class="sub-off">{{ subtextOff }}</span>
        <span class="sub-on">{{ subtextOn || subtextOff }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lucian-switch-container {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  user-select: none;
}

/* Medium size (default) */
.lucian-switch-track {
  position: relative;
  width: 54px;
  height: 30px;
  border: 1px solid var(--ux-line, #e0e0e0);
  padding: 0;
  border-radius: 999px;
  background: var(--ux-surface-3, #e0e0e0);
  outline: none;
  cursor: pointer;
  touch-action: none;
  box-shadow: inset 0 1px 3px rgba(29, 29, 31, 0.1);
  transition: background-color 0.35s var(--ux-ease),
              border-color 0.35s var(--ux-ease),
              box-shadow 0.4s var(--ux-ease);
}

.lucian-switch-track::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, #0066cc 0%, #0066cc 100%);
  opacity: 0;
  transition: opacity 0.35s var(--ux-ease);
}

.is-on .lucian-switch-track::before {
  opacity: 1;
}

.is-on .lucian-switch-track {
  border-color: #0066cc;
  box-shadow: 0 3px 12px rgba(0, 102, 204, 0.3);
}

.lucian-switch-track:focus-visible {
  outline: 2px solid var(--ux-accent, #0066cc);
  outline-offset: 3px;
}

/* Knob */
.lucian-switch-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #FFFFFF;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  transition: left 0.45s var(--ux-spring), width 0.28s var(--ux-ease);
  z-index: 2;
}

.is-on .lucian-switch-knob {
  left: 27px;
}

/* Rubber stretching effect */
.is-stretch .lucian-switch-knob {
  width: 33px;
  transition: left 0.45s var(--ux-spring), width 0.16s var(--ux-ease);
}

.is-on.is-stretch .lucian-switch-knob {
  left: 20px;
}

/* Knob SVG symbols */
.lucian-switch-knob svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke-width: 3.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.lucian-sw-x {
  stroke: #7a7a7a;
  stroke-dasharray: 14;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.25s var(--ux-ease) 0.08s;
}

.lucian-sw-v {
  stroke: #0066cc;
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  transition: stroke-dashoffset 0.3s var(--ux-ease);
}

.is-on .lucian-sw-x {
  stroke-dashoffset: 14;
  transition-delay: 0s;
}

.is-on .lucian-sw-v {
  stroke-dashoffset: 0;
  transition-delay: 0.14s;
}

/* Text & Labels */
.lucian-switch-text {
  display: flex;
  flex-direction: column;
}

.lucian-switch-label {
  font-size: 14px;
  font-weight: 650;
  color: var(--ux-ink);
  letter-spacing: -0.015em;
  line-height: 1.3;
}

.lucian-switch-sub {
  position: relative;
  height: 18px;
  overflow: hidden;
  font-size: 12.5px;
  color: var(--ux-ink-3);
  margin-top: 2px;
}

.lucian-switch-sub span {
  display: block;
  line-height: 18px;
  transition: transform 0.45s var(--ux-spring), opacity 0.3s var(--ux-ease);
}

.lucian-switch-sub .sub-on {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  transform: translateY(100%);
  opacity: 0;
  color: #2997ff;
  font-weight: 600;
}

.is-on .lucian-switch-sub .sub-off {
  transform: translateY(-100%);
  opacity: 0;
}

.is-on .lucian-switch-sub .sub-on {
  transform: translateY(0);
  opacity: 1;
}

/* Small Variant */
.size-sm .lucian-switch-track {
  width: 44px;
  height: 24px;
}

.size-sm .lucian-switch-knob {
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
}

.size-sm.is-on .lucian-switch-knob {
  left: 22px;
}

.size-sm.is-stretch .lucian-switch-knob {
  width: 25px;
}

.size-sm.is-on.is-stretch .lucian-switch-knob {
  left: 15px;
}

.size-sm .lucian-switch-knob svg {
  width: 10px;
  height: 10px;
}

.size-sm .lucian-switch-label {
  font-size: 13px;
}
</style>
