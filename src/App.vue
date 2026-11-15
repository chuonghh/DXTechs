<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useShopStore } from './stores/shop.ts'
import LucianSwipeChat from './components/LucianSwipeChat.vue'

const router = useRouter()
const shop = useShopStore()
const showBackToTop = ref(false)
const chatOpen = ref(false)
const unreadCount = ref(1)

const promptSuggestions = [
  'Báo giá Office Pro 2025',
  'Gói Cloud VPS giá tốt',
  'Hướng dẫn kích hoạt Key',
  'Xuất hóa đơn VAT 100%',
  'Mã giảm giá hôm nay',
  'Hotline hỗ trợ 24/7',
]

function updateScrollState() {
  showBackToTop.value = window.scrollY > 320
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleChat() {
  chatOpen.value = !chatOpen.value
  if (chatOpen.value) {
    unreadCount.value = 0
  }
}

function handleActionClick(action: { label?: string; copy?: string; to?: string }) {
  if (action.copy) {
    navigator.clipboard?.writeText(action.copy)
    shop.notify(`Đã sao chép mã ưu đãi “${action.copy}” vào bộ nhớ tạm!`)
  }
  if (action.to) {
    router.push(action.to)
    chatOpen.value = false
  }
}

onMounted(() => window.addEventListener('scroll', updateScrollState, { passive: true }))
onMounted(updateScrollState)
onUnmounted(() => window.removeEventListener('scroll', updateScrollState))
</script>

<template>
  <div class="app-root-shell">
    <RouterView />
    <Transition name="toast">
      <div v-if="shop.notice" class="toast-message" role="status" aria-live="polite">
        <svg class="toast-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>
        {{ shop.notice }}
        <button type="button" aria-label="Đóng thông báo" @click="shop.clearNotice">×</button>
      </div>
    </Transition>

    <!-- Interactive AI Assistant Modal / Panel (Lucian UX/UI Prompt #078 Swipe-to-reply) -->
    <Transition name="chat-panel">
      <div v-if="chatOpen" class="lucian-chat-floating-wrap">
        <LucianSwipeChat
          bot-name="Trợ lý ảo DXTechs AI"
          bot-subtitle="Tư vấn bản quyền &amp; Cloud 24/7"
          :prompts="promptSuggestions"
          @close="chatOpen = false"
          @action="handleActionClick"
        />
      </div>
    </Transition>

    <!-- Floating Actions -->
    <nav class="floating-quick-actions" aria-label="Tiện ích nhanh">
      <button
        class="floating-action floating-chat"
        type="button"
        :aria-expanded="chatOpen"
        aria-label="Mở chatbot trợ lý DXTechs"
        title="Trợ lý DXTechs AI"
        @click="toggleChat"
      >
        <span v-if="unreadCount > 0 && !chatOpen" class="floating-chat-badge">{{ unreadCount }}</span>
        <!-- Standardized Lucide Bot & AI Sparkle with High Contrast -->
        <svg class="ai-bot-icon text-white" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 8V4H8"/>
          <rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2"/>
          <path d="M20 14h2"/>
          <path d="M15 13v2"/>
          <path d="M9 13v2"/>
        </svg>
        <span class="ai-sparkle-pip text-cyan-300" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
        </span>
      </button>
      <button
        v-if="showBackToTop"
        class="floating-action floating-top"
        type="button"
        aria-label="Lên đầu trang"
        title="Lên đầu trang"
        @click="scrollToTop"
      ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6"></path></svg></button>
    </nav>
  </div>
</template>

<style scoped>
.lucian-chat-floating-wrap {
  position: fixed;
  right: 24px;
  bottom: 84px;
  z-index: 1000;
}

.floating-chat {
  position: relative;
  background: #0062ff !important;
  color: #ffffff !important;
  border: 1px solid rgba(0, 98, 255, 0.35) !important;
  box-shadow: 0 6px 20px rgba(0, 98, 255, 0.35) !important;
}

.floating-chat:hover {
  background: #004ecc !important;
  box-shadow: 0 8px 24px rgba(0, 98, 255, 0.45) !important;
}

.ai-bot-icon {
  stroke: #ffffff !important;
  color: #ffffff !important;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.floating-chat:hover .ai-bot-icon {
  transform: scale(1.08);
}

.ai-sparkle-pip {
  position: absolute;
  top: 7px;
  right: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #00e5ff !important;
  stroke: #00e5ff !important;
  pointer-events: none;
}

.ai-sparkle-pip svg {
  stroke: #00e5ff !important;
}

.floating-chat-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: #ef4444 !important;
  color: #ffffff !important;
  font-family: var(--font-heading, -apple-system, sans-serif);
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff !important;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5) !important;
  z-index: 5;
}

@media (max-width: 640px) {
  .lucian-chat-floating-wrap {
    right: 12px;
    bottom: 74px;
  }
}
</style>
