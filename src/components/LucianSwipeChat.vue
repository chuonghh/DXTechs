<!-- Lucian UX/UI Prompt #078 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#078 -->
<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

export interface ChatMsg {
  id: number | string
  text: string
  sender: 'user' | 'bot'
  time?: string
  quote?: string
  quoteWho?: string
  action?: {
    label: string
    copy?: string
    to?: string
  }
}

interface Props {
  botName?: string
  botSubtitle?: string
  prompts?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  botName: 'DXTechs AI Assistant',
  botSubtitle: 'Trực tuyến 24/7 · Tư vấn bản quyền & Cloud',
  prompts: () => [
    'Báo giá Office Pro 2025',
    'Gói Cloud VPS giá tốt',
    'Hướng dẫn kích hoạt Key',
    'Mã giảm giá hôm nay',
  ],
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'action', action: NonNullable<ChatMsg['action']>): void
}>()

const messages = ref<ChatMsg[]>([
  {
    id: 1,
    sender: 'bot',
    text: 'Xin chào! Tôi là DXTechs AI Assistant. Tôi có thể giải đáp báo giá bản quyền phần mềm, hạ tầng Cloud VPS, xuất hóa đơn VAT và gửi tặng voucher độc quyền hôm nay. Quý khách cần hỗ trợ nội dung nào ạ?',
    time: 'Vừa xong',
    action: {
      label: 'Nhận mã giảm giá DXTECHS2025 (-15%)',
      copy: 'DXTECHS2025',
    },
  },
])

const inputVal = ref('')
const isTyping = ref(false)
const replyTarget = ref<{ text: string; who: string } | null>(null)
const logRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// Pointer drag state for swipe-to-reply
const activeDrag = ref<{ id: number | string; dx: number; ro: number } | null>(null)
let startX = 0
let currentMsgId: number | string | null = null

function scrollToBottom() {
  nextTick(() => {
    if (logRef.value) {
      logRef.value.scrollTop = logRef.value.scrollHeight
    }
  })
}

function setReply(msg: ChatMsg) {
  replyTarget.value = {
    text: msg.text,
    who: msg.sender === 'user' ? 'Tôi' : props.botName,
  }
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function clearReply() {
  replyTarget.value = null
}

function handlePointerDown(e: PointerEvent, msg: ChatMsg) {
  if (msg.sender === 'user' || e.button !== 0) return
  const target = e.currentTarget as HTMLElement
  target.setPointerCapture(e.pointerId)
  startX = e.clientX
  currentMsgId = msg.id
  activeDrag.value = { id: msg.id, dx: 0, ro: 0 }
}

function handlePointerMove(e: PointerEvent) {
  if (!activeDrag.value || currentMsgId === null) return
  const diff = Math.max(0, e.clientX - startX)
  const clamped = diff > 60 ? 60 + (diff - 60) * 0.25 : diff
  const ro = Math.min(1, diff / 60)
  activeDrag.value.dx = clamped
  activeDrag.value.ro = ro
}

function handlePointerUp(msg: ChatMsg) {
  if (!activeDrag.value) return
  const shouldReply = activeDrag.value.dx >= 55
  activeDrag.value = null
  currentMsgId = null
  if (shouldReply) {
    setReply(msg)
  }
}

function botReply(query: string) {
  isTyping.value = true
  scrollToBottom()

  setTimeout(() => {
    isTyping.value = false
    const q = query.toLowerCase()
    let replyText = 'DXTechs cung cấp giấy phép bản quyền chính hãng 100%, bảo hành trọn đời và xuất hóa đơn điện tử VAT hợp pháp theo quy định.'
    let actionItem: ChatMsg['action'] | undefined

    if (q.includes('giá') || q.includes('báo giá') || q.includes('office') || q.includes('windows')) {
      replyText = 'Các gói bản quyền phổ biến hiện có ưu đãi hấp dẫn:\n• Windows 11 Pro: 349.000đ (Retail vĩnh viễn)\n• Office 365 Pro 1 năm: 490.000đ\n• JetBrains All Products: 1.250.000đ/năm\nQuý khách muốn xem chi tiết gói nào ạ?'
      actionItem = { label: 'Xem bảng giá phần mềm', to: '/phan-mem' }
    } else if (q.includes('vps') || q.includes('cloud') || q.includes('server')) {
      replyText = 'Hạ tầng Cloud VPS tại DXTechs đặt tại Tier 3 Data Center (Viettel/VNPT IDC), sử dụng 100% ổ cứng NVMe Gen4, băng thông trong nước 10Gbps và cam kết SLA 99.99%.'
      actionItem = { label: 'Xem gói Cloud VPS', to: '/dich-vu' }
    } else if (q.includes('mã') || q.includes('voucher') || q.includes('khuyến mãi')) {
      replyText = 'Tặng quý khách mã ưu đãi độc quyền: DXTECHS2025. Nhập tại trang thanh toán để được giảm ngay 15% tổng hóa đơn!'
      actionItem = { label: 'Sao chép mã DXTECHS2025', copy: 'DXTECHS2025' }
    } else if (q.includes('vat') || q.includes('hóa đơn')) {
      replyText = '100% đơn hàng tại DXTechs đều được xuất hóa đơn VAT điện tử hợp lệ của Tổng Cục Thuế. Quý khách chỉ cần tích chọn "Xuất hóa đơn VAT" khi đặt hàng.'
    }

    messages.value.push({
      id: Date.now(),
      sender: 'bot',
      text: replyText,
      time: 'Vừa xong',
      action: actionItem,
    })
    scrollToBottom()
  }, 1200)
}

function sendCurrentMessage() {
  const text = inputVal.value.trim()
  if (!text) return

  const newMsg: ChatMsg = {
    id: Date.now(),
    sender: 'user',
    text,
    time: 'Vừa xong',
    quote: replyTarget.value?.text,
    quoteWho: replyTarget.value?.who,
  }

  messages.value.push(newMsg)
  inputVal.value = ''
  clearReply()
  scrollToBottom()

  botReply(text)
}

function handleChipClick(prompt: string) {
  inputVal.value = prompt
  sendCurrentMessage()
}

function handleAction(act?: ChatMsg['action']) {
  if (act) emit('action', act)
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="ux u078" role="dialog" aria-label="AI Chat Assistant">
    <!-- Header -->
    <div class="u078-top">
      <div class="u078-avatar-icon" aria-hidden="true">
        <svg class="u078-bot-svg text-cyan-400 icon-ai-glow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8V4H8"/>
          <rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2"/>
          <path d="M20 14h2"/>
          <path d="M15 13v2"/>
          <path d="M9 13v2"/>
        </svg>
        <span class="u078-status-pip animate-pulse"></span>
      </div>
      <div class="u078-top-meta">
        <div class="u078-title-row">
          <b>{{ botName }}</b>
          <span class="u078-ai-pill text-cyan-400">
            <svg class="animate-pulse" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
            AI Agent
          </span>
        </div>
        <small>{{ botSubtitle }}</small>
      </div>
      <button class="u078-close-btn" type="button" aria-label="Đóng chat" @click="$emit('close')">
        <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>
      </button>
    </div>

    <!-- Message Log -->
    <div ref="logRef" class="u078-log" aria-live="polite">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="u078-m in"
        :class="{
          me: msg.sender === 'user',
          drag: activeDrag?.id === msg.id,
        }"
      >
        <!-- Reply icon revealed on drag -->
        <span
          v-if="msg.sender === 'bot'"
          class="u078-rep"
          :class="{ full: (activeDrag?.id === msg.id ? activeDrag.dx : 0) >= 55 }"
          :style="{
            '--ro': activeDrag?.id === msg.id ? activeDrag.ro : 0,
          }"
          aria-hidden="true"
        >
          <svg viewBox="0 0 14 14"><path d="M5.5 3.5L2 7l3.5 3.5M2 7h6.5a3.5 3.5 0 0 1 3.5 3.5"/></svg>
        </span>

        <!-- Message Bubble -->
        <div
          class="u078-bub"
          :style="{
            '--dx': `${activeDrag?.id === msg.id ? activeDrag.dx : 0}px`,
          }"
          @pointerdown="handlePointerDown($event, msg)"
          @pointermove="handlePointerMove"
          @pointerup="handlePointerUp(msg)"
          @pointercancel="handlePointerUp(msg)"
        >
          <!-- Quoted preview if this was a reply -->
          <span v-if="msg.quote" class="u078-q">
            <strong>{{ msg.quoteWho || 'Trích dẫn' }}:</strong> {{ msg.quote }}
          </span>

          <span class="u078-text">{{ msg.text }}</span>

          <!-- Interactive Action CTA inside message -->
          <div v-if="msg.action" class="u078-msg-action">
            <button type="button" class="u078-action-pill" @click="handleAction(msg.action)">
              <span>{{ msg.action.label }}</span>
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </button>
          </div>
        </div>

        <!-- Desktop Hover reply button -->
        <button
          v-if="msg.sender === 'bot'"
          class="u078-rb"
          type="button"
          aria-label="Trả lời tin nhắn này"
          @click="setReply(msg)"
        >
          <svg viewBox="0 0 14 14"><path d="M5.5 3.5L2 7l3.5 3.5M2 7h6.5a3.5 3.5 0 0 1 3.5 3.5"/></svg>
        </button>
      </div>

      <!-- Typing dots indicator -->
      <div v-if="isTyping" class="u078-ty u078-m in" aria-label="DXTechs AI đang nhập">
        <i></i><i></i><i></i>
      </div>
    </div>

    <!-- Reply banner when quoting a message -->
    <div class="u078-reply" :class="{ on: !!replyTarget }">
      <div>
        <div class="u078-rbox">
          <span>
            <b>Đang trả lời {{ replyTarget?.who }}</b>
            <em>{{ replyTarget?.text }}</em>
          </span>
          <button class="u078-rx" type="button" aria-label="Hủy trích dẫn" @click="clearReply">
            <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3L3 9"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick prompt chips -->
    <div class="u078-chips">
      <button
        v-for="p in prompts"
        :key="p"
        type="button"
        class="u078-chip"
        @click="handleChipClick(p)"
      >
        <svg class="u078-chip-sparkle text-cyan-400" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
        <span>{{ p }}</span>
      </button>
    </div>

    <!-- Composer Bar -->
    <form class="u078-bar" @submit.prevent="sendCurrentMessage">
      <input
        ref="inputRef"
        v-model="inputVal"
        class="u078-in"
        type="text"
        placeholder="Nhập câu hỏi cho DXTechs AI..."
        aria-label="Nội dung tin nhắn"
        autocomplete="off"
      />
      <button
        class="u078-send"
        :class="{ go: !!inputVal.trim() }"
        type="submit"
        :aria-label="inputVal.trim() ? 'Gửi tin nhắn' : 'Thu âm giọng nói'"
      >
        <!-- Mic icon -->
        <svg class="mic" viewBox="0 0 20 20" aria-hidden="true">
          <rect x="7.5" y="3" width="5" height="9" rx="2.5"/>
          <path d="M5 10a5 5 0 0 0 10 0M10 15v2.5"/>
        </svg>
        <!-- Send paper plane icon -->
        <svg class="s" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3.5 10L16.5 3.5 12 16.5 9.5 11z"/>
        </svg>
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Tokens mapped strictly to DXTechs light brand system */
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
  --ux-shadow-strong: rgba(7, 14, 36, 0.16);
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
 * Lucian UX/UI Prompt #078: Swipe-to-reply chat
 * ------------------------------------------------------------- */
.u078 {
  position: relative;
  width: 360px;
  max-width: calc(100vw - 32px);
  height: 520px;
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  border-radius: 28px;
  background: var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 30px 60px -20px var(--ux-shadow-strong);
  overflow: hidden;
  z-index: 999;
}

.u078-top {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 64px;
  padding: 0 16px;
  border-bottom: 1px solid var(--ux-line);
  background: var(--ux-surface);
  flex-shrink: 0;
}

.u078-avatar-icon {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #0062ff;
  border: 1.5px solid rgba(0, 98, 255, 0.3);
  flex-shrink: 0;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 12px rgba(0, 98, 255, 0.25);
}

.u078-bot-svg {
  color: #ffffff;
}

.u078-status-pip {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #34c759;
  border: 2px solid var(--ux-surface);
}

.u078-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.u078-ai-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  background: rgba(41, 151, 255, 0.12);
  border: 1px solid rgba(41, 151, 255, 0.25);
  letter-spacing: 0.02em;
}

.u078-chip-sparkle {
  margin-right: 4px;
  flex-shrink: 0;
}

.u078-top-meta {
  flex: 1;
  min-width: 0;
}

.u078-top-meta b {
  display: block;
  font-size: 14.5px;
  font-weight: 800;
  color: var(--ux-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.u078-top-meta small {
  display: block;
  font-size: 11.5px;
  font-weight: 650;
  color: var(--ux-mint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.u078-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 0;
  background: var(--ux-surface-2);
  color: var(--ux-ink-2);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.u078-close-btn:hover {
  background: var(--ux-surface-3);
  color: var(--ux-ink);
}

.u078-log {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 14px 8px;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 18px);
  mask-image: linear-gradient(180deg, transparent, #000 18px);
}

.u078-m {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 86%;
  touch-action: pan-y;
}

.u078-m.me {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.u078-bub {
  position: relative;
  z-index: 1;
  padding: 10px 14px;
  border-radius: 18px 18px 18px 6px;
  background: var(--ux-surface-2);
  font-size: 13.5px;
  line-height: 1.48;
  color: var(--ux-ink);
  transform: translateX(var(--dx, 0px));
  transition: transform .4s var(--ux-spring);
  user-select: none;
  -webkit-user-select: none;
  word-break: break-word;
}

.u078-m.drag .u078-bub {
  transition: none;
}

.u078-m.me .u078-bub {
  border-radius: 18px 18px 6px 18px;
  background: var(--ux-accent);
  color: var(--ux-accent-ink);
}

.u078-q {
  display: block;
  margin: -2px -4px 6px;
  padding: 6px 8px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 12%, transparent);
  font-size: 11.5px;
  line-height: 1.35;
  opacity: .85;
  border-left: 3px solid currentColor;
}

.u078-rep {
  position: absolute;
  left: 6px;
  top: 50%;
  width: 26px;
  height: 26px;
  margin-top: -13px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--ux-surface-2);
  color: var(--ux-ink-2);
  opacity: var(--ro, 0);
  transform: scale(calc(.5 + var(--ro, 0) * .5));
  transition: background-color .2s;
}

.u078-rep svg, .u078-rb svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u078-rep.full {
  background: var(--ux-accent);
  color: var(--ux-accent-ink);
}

.u078-rb {
  width: 28px;
  height: 28px;
  flex: none;
  margin: 0 4px;
  border: 0;
  padding: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: none;
  color: var(--ux-ink-3);
  opacity: 0;
  cursor: pointer;
  transition: opacity .2s, background-color .2s;
}

.u078-m:hover .u078-rb, .u078-rb:focus-visible {
  opacity: 1;
}

.u078-rb:hover {
  background: var(--ux-surface-2);
  color: var(--ux-ink);
}

.u078-rb:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 1px;
}

@media (hover: none) {
  .u078-rb {
    display: none;
  }
}

.u078-m.in {
  animation: u078-in .5s var(--ux-ease);
}

@keyframes u078-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(.9);
  }
}

.u078-m.me.in {
  transform-origin: 100% 100%;
  animation: u078-up .55s var(--ux-ease);
}

@keyframes u078-up {
  from {
    opacity: 0;
    transform: translateY(36px) scale(.7);
  }
}

.u078-msg-action {
  margin-top: 8px;
}

.u078-action-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--ux-accent);
  background: var(--ux-surface);
  color: var(--ux-accent);
  font-size: 11.5px;
  font-weight: 750;
  cursor: pointer;
  transition: all .2s;
}

.u078-action-pill:hover {
  background: var(--ux-accent);
  color: var(--ux-accent-ink);
}

.u078-ty {
  display: flex;
  gap: 4px;
  align-self: flex-start;
  padding: 12px 14px;
  border-radius: 18px 18px 18px 6px;
  background: var(--ux-surface-2);
}

.u078-ty i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ux-ink-3);
  animation: u078-dot 1.2s ease-in-out infinite;
}

.u078-ty i:nth-child(2) { animation-delay: .15s; }
.u078-ty i:nth-child(3) { animation-delay: .3s; }

@keyframes u078-dot {
  0%, 60%, 100% { transform: none; opacity: .5; }
  30% { transform: translateY(-4px); opacity: 1; }
}

.u078-reply {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .35s var(--ux-ease);
  flex-shrink: 0;
}

.u078-reply.on {
  grid-template-rows: 1fr;
}

.u078-reply > div {
  min-height: 0;
  overflow: hidden;
}

.u078-rbox {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 12px;
  padding: 8px 6px 8px 12px;
  border-radius: 14px 14px 0 0;
  background: var(--ux-surface-2);
  border-left: 3px solid var(--ux-accent);
}

.u078-rbox span {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  line-height: 1.35;
  color: var(--ux-ink-2);
}

.u078-rbox span b {
  display: block;
  font-size: 11px;
  color: var(--ux-accent);
}

.u078-rbox span em {
  display: block;
  font-style: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.u078-rx {
  width: 26px;
  height: 26px;
  border: 0;
  padding: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: none;
  color: var(--ux-ink-3);
  cursor: pointer;
}

.u078-rx svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
}

.u078-chips {
  display: flex;
  gap: 6px;
  padding: 6px 12px;
  overflow-x: auto;
  flex-shrink: 0;
  scrollbar-width: none;
}

.u078-chips::-webkit-scrollbar {
  display: none;
}

.u078-chip {
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--ux-line-2);
  background: var(--ux-surface);
  color: var(--ux-ink-2);
  font-size: 11.5px;
  font-weight: 650;
  white-space: nowrap;
  cursor: pointer;
  transition: all .2s;
}

.u078-chip:hover {
  border-color: var(--ux-accent);
  color: var(--ux-accent);
  background: var(--ux-surface-2);
}

.u078-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 12px;
  flex-shrink: 0;
}

.u078-in {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: 22px;
  background: var(--ux-surface-2);
  font-size: 13.5px;
  color: var(--ux-ink);
  outline: none;
  box-shadow: inset 0 0 0 1.5px transparent;
  transition: box-shadow .2s;
}

.u078-in:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 1.5px var(--ux-accent);
}

.u078-send {
  position: relative;
  width: 44px;
  height: 44px;
  flex: none;
  border: 0;
  padding: 0;
  border-radius: 50%;
  background: var(--ux-surface-2);
  color: var(--ux-ink-2);
  cursor: pointer;
  transition: background-color .3s, color .3s, transform .3s var(--ux-spring);
}

.u078-send.go {
  background: var(--ux-accent);
  color: var(--ux-accent-ink);
}

.u078-send:active {
  transform: scale(.88);
}

.u078-send:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 2px;
}

.u078-send svg {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20px;
  height: 20px;
  margin: -10px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform .35s var(--ux-spring), opacity .2s;
}

.u078-send .s {
  transform: scale(.3) rotate(-45deg);
  opacity: 0;
}

.u078-send.go .s {
  transform: none;
  opacity: 1;
}

.u078-send.go .mic {
  transform: scale(.3);
  opacity: 0;
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
