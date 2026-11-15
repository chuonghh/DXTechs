<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalItems: number
    pageSize?: number
    pageSizeOptions?: number[]
    itemLabel?: string
    showPageSize?: boolean
    showJumpTo?: boolean
    theme?: 'dark' | 'light' | 'auto'
  }>(),
  {
    pageSize: 8,
    pageSizeOptions: () => [5, 8, 10, 20],
    itemLabel: 'mục',
    showPageSize: true,
    showJumpTo: false,
    theme: 'auto',
  },
)

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'change', page: number): void
}>()

const totalPages = computed(() => {
  if (props.totalItems <= 0) return 1
  return Math.max(1, Math.ceil(props.totalItems / props.pageSize))
})

const startItem = computed(() => {
  if (props.totalItems <= 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  if (props.totalItems <= 0) return 0
  return Math.min(props.totalItems, props.currentPage * props.pageSize)
})

// Jump input state
const jumpInput = ref(props.currentPage)
watch(() => props.currentPage, (val) => {
  jumpInput.value = val
})

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('change', page)
}

function handlePageSizeChange(e: Event) {
  const newSize = Number((e.target as HTMLSelectElement).value)
  emit('update:pageSize', newSize)
  // Auto reset to page 1 to prevent out-of-range pages
  emit('update:currentPage', 1)
  emit('change', 1)
}

function handleJumpSubmit() {
  const target = Math.floor(Number(jumpInput.value))
  if (Number.isFinite(target) && target >= 1 && target <= totalPages.value) {
    goToPage(target)
  } else {
    jumpInput.value = props.currentPage
  }
}

// Generate smart page items (with ellipsis '...')
const pageItems = computed<(number | string)[]>(() => {
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }

  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
})
</script>

<template>
  <nav
    class="pagination-bar"
    :class="[`theme-${theme}`]"
    aria-label="Thanh điều hướng chuyển trang"
  >
    <!-- Left: Status Summary -->
    <div class="pagination-info">
      <span class="info-text">
        Hiển thị
        <strong class="info-highlight">{{ startItem }} - {{ endItem }}</strong>
        trên tổng số
        <strong class="info-highlight">{{ totalItems }}</strong>
        {{ itemLabel }}
      </span>

      <!-- Page Size Dropdown -->
      <div v-if="showPageSize && totalItems > 0" class="page-size-wrap">
        <label :for="`page-size-select-${itemLabel}`" class="page-size-label">Mỗi trang:</label>
        <div class="select-shell">
          <select
            :id="`page-size-select-${itemLabel}`"
            :value="pageSize"
            class="page-size-select"
            @change="handlePageSizeChange"
          >
            <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>

    <!-- Right: Page Controls -->
    <div class="pagination-controls">
      <!-- First page button -->
      <button
        type="button"
        class="nav-btn first-btn"
        :disabled="currentPage <= 1"
        title="Trang đầu tiên"
        aria-label="Trang đầu tiên"
        @click="goToPage(1)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      </button>

      <!-- Previous page button -->
      <button
        type="button"
        class="nav-btn prev-btn"
        :disabled="currentPage <= 1"
        title="Trang trước"
        aria-label="Trang trước"
        @click="goToPage(currentPage - 1)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span class="btn-text">Trước</span>
      </button>

      <!-- Page numbers list -->
      <div class="page-numbers-group" role="group" aria-label="Danh sách trang">
        <template v-for="(item, idx) in pageItems" :key="`page-${idx}`">
          <span v-if="item === '...'" class="ellipsis-chip" aria-hidden="true">
            •••
          </span>
          <button
            v-else
            type="button"
            class="page-num-btn"
            :class="{ active: item === currentPage }"
            :aria-current="item === currentPage ? 'page' : undefined"
            :aria-label="`Đến trang ${item}`"
            @click="goToPage(item as number)"
          >
            {{ item }}
          </button>
        </template>
      </div>

      <!-- Next page button -->
      <button
        type="button"
        class="nav-btn next-btn"
        :disabled="currentPage >= totalPages"
        title="Trang tiếp theo"
        aria-label="Trang tiếp theo"
        @click="goToPage(currentPage + 1)"
      >
        <span class="btn-text">Sau</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <!-- Last page button -->
      <button
        type="button"
        class="nav-btn last-btn"
        :disabled="currentPage >= totalPages"
        title="Trang cuối cùng"
        aria-label="Trang cuối cùng"
        @click="goToPage(totalPages)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
      </button>

      <!-- Optional Direct Jump Box -->
      <div v-if="showJumpTo && totalPages > 1" class="jump-box">
        <span class="jump-label">Trang</span>
        <input
          v-model.lazy="jumpInput"
          type="number"
          min="1"
          :max="totalPages"
          class="jump-input"
          @keyup.enter="handleJumpSubmit"
          @blur="handleJumpSubmit"
        />
        <span class="jump-total">/ {{ totalPages }}</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 0.875rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  user-select: none;
}

/* ==========================================================================
   THEME VARIANTS: DARK (Admin) & LIGHT (Account/Storefront)
   ========================================================================== */

/* Dark Theme (used in Admin Console) */
.pagination-bar.theme-dark {
  background: rgba(10, 19, 43, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #7a7a7a;
  backdrop-filter: blur(12px);
}

.pagination-bar.theme-dark .info-highlight {
  color: #f5f5f7;
  font-weight: 700;
}

.pagination-bar.theme-dark .page-size-label,
.pagination-bar.theme-dark .jump-label,
.pagination-bar.theme-dark .jump-total {
  color: #7a7a7a;
}

.pagination-bar.theme-dark .select-shell,
.pagination-bar.theme-dark .jump-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f5f5f7;
}

.pagination-bar.theme-dark .nav-btn,
.pagination-bar.theme-dark .page-num-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
}

.pagination-bar.theme-dark .nav-btn:hover:not(:disabled),
.pagination-bar.theme-dark .page-num-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  border-color: rgba(41, 151, 255, 0.35);
}

/* Light / Auto Theme (used in Customer Account Portal) */
.pagination-bar.theme-light,
.pagination-bar.theme-auto {
  background: #FFFFFF;
  border: 1px solid #e0e0e0;
  color: #7a7a7a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.pagination-bar.theme-light .info-highlight,
.pagination-bar.theme-auto .info-highlight {
  color: #1d1d1f;
  font-weight: 700;
}

.pagination-bar.theme-light .page-size-label,
.pagination-bar.theme-auto .page-size-label,
.pagination-bar.theme-light .jump-label,
.pagination-bar.theme-auto .jump-label,
.pagination-bar.theme-light .jump-total,
.pagination-bar.theme-auto .jump-total {
  color: #7a7a7a;
}

.pagination-bar.theme-light .select-shell,
.pagination-bar.theme-auto .select-shell,
.pagination-bar.theme-light .jump-input,
.pagination-bar.theme-auto .jump-input {
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  color: #1d1d1f;
}

.pagination-bar.theme-light .nav-btn,
.pagination-bar.theme-auto .nav-btn,
.pagination-bar.theme-light .page-num-btn,
.pagination-bar.theme-auto .page-num-btn {
  background: #FFFFFF;
  border: 1px solid #e0e0e0;
  color: #7a7a7a;
}

.pagination-bar.theme-light .nav-btn:hover:not(:disabled),
.pagination-bar.theme-auto .nav-btn:hover:not(:disabled),
.pagination-bar.theme-light .page-num-btn:hover:not(.active),
.pagination-bar.theme-auto .page-num-btn:hover:not(.active) {
  background: #f5f5f7;
  color: #0066cc;
  border-color: #e0e0e0;
}

/* ==========================================================================
   LAYOUT SECTIONS
   ========================================================================== */

.pagination-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.info-text {
  font-size: 0.85rem;
  letter-spacing: -0.01em;
}

.page-size-wrap {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
}

.select-shell {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.select-shell:hover {
  border-color: #0066cc;
}

.page-size-select {
  appearance: none;
  background: transparent;
  border: none;
  color: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.35rem 1.75rem 0.35rem 0.65rem;
  cursor: pointer;
  outline: none;
  border-radius: 8px;
}

.select-chevron {
  position: absolute;
  right: 0.5rem;
  pointer-events: none;
  opacity: 0.6;
}

/* Controls */
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.page-numbers-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0.2rem;
}

/* Nav & Page Buttons */
.nav-btn,
.page-num-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 0.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}

.nav-btn {
  gap: 0.3rem;
  padding: 0 0.65rem;
}

.nav-btn:active:not(:disabled),
.page-num-btn:active:not(.active) {
  transform: scale(0.95);
}

.nav-btn:disabled {
  opacity: 0.32;
  cursor: not-allowed;
  pointer-events: none;
}

/* Active State - Vibrant Brand Blue with Smooth Glow */
.page-num-btn.active {
  background: #0066cc !important;
  color: #FFFFFF !important;
  border-color: #0066cc !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.38);
}

.ellipsis-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 36px;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.5;
}

/* Direct Jump Input */
.jump-box {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: 0.5rem;
  font-size: 0.82rem;
}

.jump-input {
  width: 44px;
  height: 34px;
  padding: 0 0.35rem;
  text-align: center;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
}

.jump-input:focus {
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

/* Hide spin buttons */
.jump-input::-webkit-outer-spin-button,
.jump-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.jump-input[type=number] {
  -moz-appearance: textfield;
}

/* Focus Visibility for WCAG AA */
.nav-btn:focus-visible,
.page-num-btn:focus-visible,
.page-size-select:focus-visible,
.jump-input:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pagination-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.85rem;
    padding: 0.85rem;
  }

  .pagination-info {
    justify-content: space-between;
  }

  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }

  .first-btn,
  .last-btn,
  .jump-box {
    display: none;
  }

  .nav-btn .btn-text {
    display: none;
  }

  .nav-btn {
    min-width: 36px;
    padding: 0;
  }
}
</style>
