<!-- Lucian UX/UI Prompt #040 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#040 -->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

export interface SideRailItem {
  id: string
  label: string
  icon?: string
  badge?: number | string
  badgeLabel?: string
}

export interface SideRailUser {
  name: string
  role: string
  avatar?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    isWide?: boolean
    items?: SideRailItem[]
    brandName?: string
    brandSubtitle?: string
    user?: SideRailUser
    defaultWide?: boolean
    fullLayout?: boolean
    theme?: 'light' | 'dark' | 'auto'
    storeLink?: string
  }>(),
  {
    modelValue: 'dashboard',
    isWide: undefined,
    brandName: 'DXTechs',
    brandSubtitle: 'DXTechs SaaS Console',
    defaultWide: false,
    fullLayout: false,
    theme: 'auto',
    storeLink: '',
    user: () => ({
      name: 'Admin DXTechs',
      role: 'Super Admin',
    }),
    items: () => [
      {
        id: 'dashboard',
        label: 'Tổng quan (KPIs)',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
      },
      {
        id: 'products',
        label: 'Quản lý sản phẩm',
        badge: 15,
        badgeLabel: '15 sản phẩm',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
      },
      {
        id: 'orders',
        label: 'Quản lý đơn hàng',
        badge: 3,
        badgeLabel: '3 đơn mới',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
      },
      {
        id: 'licenses',
        label: 'Kho License Key',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/></svg>',
      },
      {
        id: 'customers',
        label: 'Khách hàng',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      },
    ],
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:isWide', value: boolean): void
  (e: 'change', value: string): void
  (e: 'toggleWide', isWide: boolean): void
}>()

const isWideLocal = ref(props.isWide !== undefined ? props.isWide : props.defaultWide)
const isWideComputed = computed({
  get: () => (props.isWide !== undefined ? props.isWide : isWideLocal.value),
  set: (val: boolean) => {
    isWideLocal.value = val
    emit('update:isWide', val)
    emit('toggleWide', val)
  },
})

const highlightY = ref(0)
const isSwapping = ref(false)
const currentTitle = ref('')

const itemLiRefs = ref<HTMLElement[]>([])
const btnRefs = ref<HTMLElement[]>([])

const currentActiveItem = computed(() => {
  return props.items.find(it => it.id === props.modelValue) || props.items[0]
})

function toggleWide() {
  isWideComputed.value = !isWideComputed.value
  nextTick(() => {
    setTimeout(updateHighlightPos, 300)
  })
}

function updateHighlightPos() {
  const activeIdx = props.items.findIndex(it => it.id === props.modelValue)
  const targetIdx = activeIdx >= 0 ? activeIdx : 0
  const el = itemLiRefs.value[targetIdx]
  if (el) {
    highlightY.value = el.offsetTop
  }
}

function selectItem(item: SideRailItem, index: number) {
  if (props.modelValue === item.id) return
  emit('update:modelValue', item.id)
  emit('change', item.id)

  const el = itemLiRefs.value[index]
  if (el) {
    highlightY.value = el.offsetTop
  }

  isSwapping.value = true
  setTimeout(() => {
    currentTitle.value = item.label
    isSwapping.value = false
  }, 180)
}

function handleKeydown(e: KeyboardEvent, index: number) {
  let direction = 0
  if (e.key === 'ArrowDown') direction = 1
  else if (e.key === 'ArrowUp') direction = -1

  if (direction !== 0) {
    e.preventDefault()
    const nextIndex = (index + direction + props.items.length) % props.items.length
    const nextBtn = btnRefs.value[nextIndex]
    if (nextBtn) {
      nextBtn.focus()
      const nextItem = props.items[nextIndex]
      if (nextItem) {
        selectItem(nextItem, nextIndex)
      }
    }
  }
}

watch(
  () => props.modelValue,
  () => {
    nextTick(() => {
      updateHighlightPos()
      if (currentActiveItem.value) {
        currentTitle.value = currentActiveItem.value.label
      }
    })
  }
)

watch(
  () => props.defaultWide,
  (val) => {
    isWideLocal.value = val
    nextTick(updateHighlightPos)
  }
)

onMounted(() => {
  if (currentActiveItem.value) {
    currentTitle.value = currentActiveItem.value.label
  }
  nextTick(() => {
    updateHighlightPos()
  })
})
</script>

<template>
  <div
    class="ux u040"
    :class="{
      'is-wide': isWideComputed,
      'is-full-layout': fullLayout,
      [`theme-${theme}`]: true,
    }"
  >
    <!-- Left Navigation Rail -->
    <nav class="u040-rail" aria-label="Menu quản trị mở rộng">
      <!-- Top Brand Header -->
      <div class="u040-top">
        <span class="u040-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="u040-logo-icon">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </span>
        <span class="u040-name">{{ brandName }}</span>
      </div>

      <!-- Expand / Collapse Toggle Button -->
      <button
        id="u040-toggle-btn"
        class="u040-tog"
        type="button"
        :aria-expanded="isWideComputed"
        :aria-label="isWideComputed ? 'Thu gọn thanh điều hướng' : 'Mở rộng thanh điều hướng'"
        :title="isWideComputed ? 'Thu gọn menu' : 'Mở rộng menu'"
        @click="toggleWide"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 3.5L10.5 8 6 12.5" />
        </svg>
      </button>

      <!-- Navigation List -->
      <ul class="u040-nav">
        <!-- Sliding Highlight Pill -->
        <li
          class="u040-hl"
          role="presentation"
          :style="{ '--y': `${highlightY}px` }"
        ></li>

        <!-- Menu items -->
        <li
          v-for="(it, idx) in items"
          :key="it.id"
          :ref="el => { if (el) itemLiRefs[idx] = el as HTMLElement }"
        >
          <button
            :ref="el => { if (el) btnRefs[idx] = el as HTMLElement }"
            class="u040-it"
            type="button"
            :style="{ '--i': idx }"
            :aria-current="modelValue === it.id ? 'page' : undefined"
            @click="selectItem(it, idx)"
            @keydown="handleKeydown($event, idx)"
          >
            <!-- SVG Icon -->
            <span v-if="it.icon" class="u040-it-icon" v-html="it.icon"></span>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="4" y="4" width="7" height="7" rx="2" />
              <rect x="13" y="4" width="7" height="7" rx="2" />
              <rect x="4" y="13" width="7" height="7" rx="2" />
              <rect x="13" y="13" width="7" height="7" rx="2" />
            </svg>

            <!-- Label -->
            <span class="u040-it-label">{{ it.label }}</span>

            <!-- Badge (Notification count) -->
            <em
              v-if="it.badge !== undefined"
              class="u040-bd"
              :aria-label="it.badgeLabel || `${it.badge} mục`"
            >
              {{ it.badge }}
            </em>
          </button>
        </li>
      </ul>

      <!-- Optional Return to Store Link -->
      <RouterLink
        v-if="storeLink"
        :to="storeLink"
        class="u040-back"
        :title="isWide ? 'Về cửa hàng' : 'Về cửa hàng DXTechs'"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Về cửa hàng</span>
      </RouterLink>

      <!-- User Profile Badge at Bottom -->
      <div class="u040-me">
        <i aria-hidden="true">
          {{ user.avatar || user.name.slice(0, 2).toUpperCase() }}
        </i>
        <span>
          {{ user.name }}
          <small>{{ user.role }}</small>
        </span>
      </div>
    </nav>

    <!-- Main Content Area beside the Rail -->
    <section v-if="!fullLayout || $slots.default" class="u040-main" aria-live="polite">
      <slot :active-item="currentActiveItem" :active-title="currentTitle">
        <!-- Standalone Default Content Blocks -->
        <small>{{ brandSubtitle }}</small>
        <h3 :class="{ swap: isSwapping }">{{ currentTitle || currentActiveItem?.label }}</h3>

        <div class="u040-blk" style="--c: linear-gradient(140deg, #0066cc, #2997ff)">
          <div class="u040-blk-meta">
            <strong>Bản Quyền Đang Kích Hoạt</strong>
            <span>48.920 bản quyền Microsoft &amp; JetBrains</span>
          </div>
        </div>
        <div class="u040-blk" style="--c: linear-gradient(140deg, #0066cc, #0066cc)">
          <div class="u040-blk-meta">
            <strong>Hạ Tầng Cloud VPS NVMe</strong>
            <span>Độ sẵn sàng hệ thống đạt 99.98% SLA</span>
          </div>
        </div>
        <div class="u040-blk" style="--c: linear-gradient(140deg, #7a7a7a, #7a7a7a)">
          <div class="u040-blk-meta">
            <strong>Tốc Độ Cấp Key Tự Động</strong>
            <span>Thời gian trung bình 18 giây qua API Gateway</span>
          </div>
        </div>
        <div class="u040-blk" style="--c: linear-gradient(140deg, #0066cc, #0066cc)">
          <div class="u040-blk-meta">
            <strong>Kỹ Sư Trực Tuyến 24/7</strong>
            <span>Phản hồi dưới 15 phút qua UltraViewer</span>
          </div>
        </div>
      </slot>
    </section>
  </div>
</template>

<style scoped>
/* Theme Tokens mapped to DXTechs Design System */
.u040 {
  --ux-page: var(--dx-canvas, #f5f5f7);
  --ux-surface: var(--dx-card, #FFFFFF);
  --ux-surface-2: var(--dx-card-subtle, #f5f5f7);
  --ux-surface-3: var(--dx-hairline, #e0e0e0);
  /* Rail uses blue, not dark ink — "taste" palette: beige + blue, no black */
  --ux-ink: #0055bb;
  --ux-ink-2: #004aa0;
  --ux-ink-3: rgba(255,255,255,0.65);
  --ux-line: var(--dx-hairline, #e0e0e0);
  --ux-line-2: rgba(0, 102, 204, 0.18);
  --ux-accent: var(--dx-blue, #0066cc);
  --ux-accent-2: var(--dx-cyan, #2997ff);
  --ux-accent-soft: rgba(0, 102, 204, 0.12);
  --ux-accent-ink: #FFFFFF;
  --ux-shadow-strong: rgba(0, 86, 180, 0.22);
  --ux-grad: linear-gradient(135deg, #0062FF 0%, #2997ff 100%);
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(0.16, 1, 0.3, 1);

  --rw: 76px;
  position: relative;
  display: flex;
  gap: 10px;
  width: 350px;
  height: 520px;
  font-family: var(--font-body, 'Inter', sans-serif);
}

.u040.is-wide {
  --rw: 220px;
}

/* Full Layout Mode Adaptation for SaaS Dashboard */
.u040.is-full-layout {
  width: auto;
  flex: none;
  height: auto;
  min-height: 100vh;
  gap: 0;
}

.u040.is-full-layout .u040-rail {
  min-height: 100vh;
  height: 100vh;
  position: sticky;
  top: 0;
  border-radius: 0 24px 24px 0;
}

/* Dark Theme — still using blue rail, no black */
.u040.theme-dark {
  --ux-page: #f5f5f7;
  --ux-surface: #FFFFFF;
  --ux-surface-2: #f5f5f7;
  --ux-surface-3: #e0e0e0;
  --ux-ink: #004aa0;
  --ux-ink-2: #003d8a;
  --ux-ink-3: rgba(255,255,255,0.65);
  --ux-line: rgba(255, 255, 255, 0.18);
  --ux-line-2: rgba(41, 151, 255, 0.25);
  --ux-accent: #2997ff;
}

/* Force light surface even in dark OS — no dark mode, per design */
@media (prefers-color-scheme: dark) {
  .u040.theme-auto {
    --ux-page: #f5f5f7;
    --ux-surface: #FFFFFF;
    --ux-surface-2: #f5f5f7;
    --ux-surface-3: #e0e0e0;
    --ux-line: rgba(0, 0, 0, 0.1);
    --ux-line-2: rgba(0, 102, 204, 0.18);
    --ux-accent: #0066cc;
  }
}

/* -------------------------------------------------------------
 * 1. SIDE NAVIGATION RAIL
 * ------------------------------------------------------------- */
.u040-rail {
  position: relative;
  flex: none;
  width: var(--rw);
  padding: 16px 10px;
  border-radius: 0 24px 24px 0;
  /* Taste warm beige & white rail - matching website standard */
  background: #ffffff;
  color: #0f224a;
  border-right: 1px solid #ebe6dc;
  overflow: hidden;
  transition: width .6s var(--ux-spring);
  box-shadow: 4px 0 24px rgba(15, 34, 74, 0.04);
}

.u040-top {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  margin-bottom: 14px;
}

.u040-logo {
  width: 36px;
  height: 36px;
  flex: none;
  margin-left: 10px;
  border-radius: 12px;
  background: #eef5ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
  display: grid;
  place-items: center;
  color: #0062ff;
}

.u040-logo-icon {
  width: 20px;
  height: 20px;
}

.u040-name {
  font-family: var(--font-heading, 'Be Vietnam Pro', sans-serif);
  font-size: 15.5px;
  font-weight: 780;
  letter-spacing: -.03em;
  white-space: nowrap;
  opacity: 0;
  transition: opacity .25s;
  color: #0f224a;
}

.u040.is-wide .u040-name {
  opacity: 1;
  transition: opacity .3s .15s;
}

/* Expand / Collapse Toggle Arrow */
.u040-tog {
  position: absolute;
  right: -1px;
  top: 16px;
  width: 30px;
  height: 36px;
  border: 1px solid #ebe6dc;
  border-right: 0;
  padding: 0;
  border-radius: 10px 0 0 10px;
  background: #f6f3ec;
  color: #5a6e8c;
  display: grid;
  place-items: center;
  opacity: 0;
  transition: opacity .2s, color .2s, background-color .2s;
  cursor: pointer;
  z-index: 10;
}

.u040-tog:hover {
  color: #0062ff;
  background: #ffffff;
}

.u040-rail:hover .u040-tog,
.u040-tog:focus-visible,
.u040.is-wide .u040-tog {
  opacity: 1;
}

@media (hover: none) {
  .u040-tog {
    opacity: 1;
  }
}

.u040-tog:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: -2px;
}

.u040-tog svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform .5s var(--ux-spring);
}

.u040.is-wide .u040-tog svg {
  transform: rotate(180deg);
}

/* Navigation List */
.u040-nav {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Sliding Highlight Pill */
.u040-hl {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 48px;
  border-radius: 15px;
  background: #eef5ff;
  border-left: 3px solid #0062ff;
  transform: translateY(var(--y, 0));
  transition: transform .5s var(--ux-spring);
  pointer-events: none;
}

/* Nav Item Button */
.u040-it {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  height: 48px;
  padding: 0 0 0 16px;
  border: 0;
  border-radius: 15px;
  background: none;
  color: #5a6e8c;
  opacity: 1;
  text-align: left;
  transition: color .2s, background-color .2s;
  cursor: pointer;
  user-select: none;
}

.u040-it:hover {
  color: #0062ff;
  background: #fbf9f5;
}

.u040-it[aria-current="page"] {
  color: #0062ff;
  font-weight: 700;
}

.u040-it:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: -2px;
}

.u040-it-icon {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex: none;
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}

.u040-it svg,
.u040-it :deep(svg),
.u040-it-icon svg,
.u040-it-icon :deep(svg) {
  width: 22px;
  height: 22px;
  flex: none;
  display: block;
  opacity: 1 !important;
  visibility: visible !important;
}

.u040-it svg *,
.u040-it :deep(svg) *,
.u040-it-icon svg *,
.u040-it-icon :deep(svg) * {
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 2px !important;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u040-it-label {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 14.5px;
  font-weight: 650;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity .2s, transform .35s var(--ux-ease);
}

.u040.is-wide .u040-it-label {
  opacity: 1;
  transform: none;
  transition: opacity .3s var(--ux-ease), transform .5s var(--ux-spring);
  transition-delay: calc(.12s + var(--i) * 35ms);
}

/* Notification Badge */
.u040-bd {
  position: absolute;
  left: 26px;
  top: 5px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #eef5ff;
  color: #0062ff;
  border: 1px solid rgba(0, 98, 255, 0.25);
  font-size: 10.5px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  box-shadow: 0 1px 4px rgba(0, 98, 255, 0.12);
  transition: all .4s var(--ux-spring);
  z-index: 2;
}

.u040.is-wide .u040-bd {
  left: auto;
  right: 14px;
  top: 15px;
}

/* Return to Store Link */
.u040-back {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 72px;
  display: flex;
  align-items: center;
  gap: 14px;
  height: 44px;
  padding: 0 0 0 16px;
  border-radius: 14px;
  color: #5a6e8c;
  opacity: 1;
  text-decoration: none;
  transition: color .2s, background-color .2s;
}

.u040-back:hover {
  color: #0062ff;
  background: #fbf9f5;
}

.u040-back svg {
  width: 20px;
  height: 20px;
  flex: none;
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 2px !important;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u040-back span {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity .2s, transform .35s var(--ux-ease);
}

.u040.is-wide .u040-back span {
  opacity: 1;
  transform: none;
  transition: opacity .3s var(--ux-ease), transform .5s var(--ux-spring);
  transition-delay: .25s;
}

/* User Profile Badge at Bottom */
.u040-me {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 0 0 10px;
  border-radius: 16px;
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  color: #0f224a;
}

.u040-me i {
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 50%;
  background: #eef5ff;
  color: #0062ff;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  font-style: normal;
  border: 1.5px solid rgba(0, 98, 255, 0.25);
}

.u040-me span {
  font-size: 13px;
  font-weight: 650;
  white-space: nowrap;
  opacity: 0;
  color: #0f224a;
  transition: opacity .25s;
}

.u040-me small {
  display: block;
  font-size: 11.5px;
  color: #5a6e8c;
  font-weight: 500;
}

.u040.is-wide .u040-me span {
  opacity: 1;
  transition-delay: .25s;
}

/* -------------------------------------------------------------
 * 2. MAIN CONTENT SCREEN BESIDE THE RAIL
 * ------------------------------------------------------------- */
.u040-main {
  flex: 1;
  min-width: 0;
  padding: 18px 16px;
  border-radius: 24px;
  background: var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 20px 40px -20px var(--ux-shadow-strong);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.u040-main small {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--ux-ink-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.u040-main h3 {
  margin: 4px 0 16px;
  font-family: var(--font-heading, 'Be Vietnam Pro', sans-serif);
  font-size: 21px;
  font-weight: 780;
  letter-spacing: -.035em;
  white-space: nowrap;
  color: var(--ux-ink);
  transition: opacity .2s, transform .4s var(--ux-spring);
}

.u040-main h3.swap {
  opacity: 0;
  transform: translateY(8px);
}

/* Content Blocks */
.u040-blk {
  height: 80px;
  margin-bottom: 10px;
  border-radius: 16px;
  background: var(--ux-surface-2);
  position: relative;
  overflow: hidden;
  padding: 14px 16px 14px 60px;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.u040-blk:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px -4px rgba(29, 29, 31, 0.06);
}

.u040-blk::before {
  content: "";
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--c);
  box-shadow: 0 4px 10px rgba(0, 102, 204, 0.2);
}

.u040-blk-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.u040-blk-meta strong {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ux-ink);
}

.u040-blk-meta span {
  font-size: 11.5px;
  color: var(--ux-ink-3);
}

/* Reduced Motion Override */
@media (prefers-reduced-motion: reduce) {
  .u040,
  .u040 *,
  .u040 *::before,
  .u040 *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }

  .u040-hl {
    transition: none !important;
  }

  .u040-rail {
    transition: none !important;
  }

  .u040-main h3 {
    transition: none !important;
  }
}
</style>

<style>
/* Unscoped SVG guarantees for dynamically injected v-html icons in LucianSideRail */
.u040-it-icon {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  min-height: 22px !important;
  flex: none !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.u040-it-icon svg {
  display: block !important;
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  min-height: 22px !important;
  flex: none !important;
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 2px !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.u040-it-icon svg * {
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 2px !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}

.u040-it[aria-current="page"] {
  color: #0062ff !important;
}

.u040-it[aria-current="page"] .u040-it-icon svg,
.u040-it[aria-current="page"] .u040-it-icon svg * {
  stroke: #0062ff !important;
}

.u040-it:not([aria-current="page"]) {
  color: #5a6e8c !important;
}

.u040-it:not([aria-current="page"]) .u040-it-icon svg,
.u040-it:not([aria-current="page"]) .u040-it-icon svg * {
  stroke: #5a6e8c !important;
}

.u040-it:hover {
  color: #0062ff !important;
}

.u040-it:hover .u040-it-icon svg,
.u040-it:hover .u040-it-icon svg * {
  stroke: #0062ff !important;
}
</style>
