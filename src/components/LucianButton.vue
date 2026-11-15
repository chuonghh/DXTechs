<!-- Lucian UX/UI Prompt #001 & #002 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/ -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
  }
)

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

function handleClick(ev: MouseEvent) {
  emit('click', ev)
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="ux lucian-btn"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      { 'is-loading': loading }
    ]"
    @click="handleClick"
  >
    <!-- Sheen light reflection -->
    <span class="lucian-sheen" aria-hidden="true"></span>

    <!-- Content slot -->
    <span class="btn-content">
      <span v-if="loading" class="btn-spinner" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" />
        </svg>
      </span>
      <slot />
    </span>
  </button>
</template>

<style scoped>
.lucian-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-weight: 650;
  text-decoration: none;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  user-select: none;
  white-space: nowrap;
  outline: none;
  transition: transform 0.35s var(--ux-spring),
              background 0.3s var(--ux-ease),
              box-shadow 0.35s var(--ux-ease),
              border-color 0.25s var(--ux-ease);
}

.lucian-btn:hover {
  transform: translateY(-1.5px);
}

.lucian-btn:active {
  transform: translateY(0.5px) scale(0.97);
}

.lucian-btn:focus-visible {
  outline: 2px solid var(--ux-accent-2);
  outline-offset: 3px;
}

.lucian-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Sizing */
.size-sm {
  height: 34px;
  padding: 0 14px;
  font-size: 13px;
  border-radius: 9px;
  gap: 6px;
}

.size-md {
  height: 42px;
  padding: 0 18px;
  font-size: 14px;
  border-radius: 11px;
  gap: 8px;
}

.size-lg {
  height: 48px;
  padding: 0 24px;
  font-size: 15px;
  border-radius: 13px;
  gap: 10px;
}

/* Variants */
.variant-primary {
  background: linear-gradient(135deg, #0066cc 0%, #0066cc 100%);
  color: #FFFFFF;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3),
              0 4px 14px rgba(0, 102, 204, 0.3);
}

.variant-primary:hover {
  background: linear-gradient(135deg, #0066cc 0%, #0066cc 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4),
              0 6px 20px rgba(0, 102, 204, 0.4);
}

.variant-secondary {
  background: #f5f5f7;
  color: #1d1d1f;
  border-color: #e0e0e0;
  box-shadow: 0 1px 3px rgba(29, 29, 31, 0.04);
}

.variant-secondary:hover {
  background: #e0e0e0;
  border-color: #e0e0e0;
  color: #1d1d1f;
  box-shadow: 0 3px 8px rgba(29, 29, 31, 0.06);
}

.variant-outline {
  background: transparent;
  color: #0066cc;
  border: 1.5px solid #0066cc;
}

.variant-outline:hover {
  background: #f5f5f7;
  border-color: #0066cc;
  color: #0066cc;
}

.variant-danger {
  background: linear-gradient(135deg, #7a7a7a 0%, #7a7a7a 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25);
}

.variant-danger:hover {
  background: linear-gradient(135deg, #7a7a7a 0%, #7a7a7a 100%);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.35);
}

.variant-ghost {
  background: transparent;
  color: #7a7a7a;
  border-color: transparent;
}

.variant-ghost:hover {
  background: #f5f5f7;
  color: #1d1d1f;
}

/* Light Sheen effect on hover */
.lucian-sheen {
  position: absolute;
  top: -60%;
  bottom: -60%;
  left: 0;
  width: 45%;
  pointer-events: none;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.32) 50%, transparent);
  transform: translateX(-160%) skewX(-15deg);
  transition: transform 0.85s var(--ux-ease);
}

.lucian-btn:hover .lucian-sheen {
  transform: translateX(360%) skewX(-15deg);
}

.btn-content {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: inherit;
}

/* Spinner */
.btn-spinner {
  width: 16px;
  height: 16px;
  display: inline-flex;
}

.btn-spinner svg {
  width: 100%;
  height: 100%;
  animation: lucian-spin 0.85s linear infinite;
}

.btn-spinner circle {
  stroke-dasharray: 45;
  stroke-dashoffset: 20;
}

@keyframes lucian-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
