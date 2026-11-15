<!-- Lucian UX/UI Prompt #091 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#091 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  channelTitle?: string
  defaultOnline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  channelTitle: 'Kênh Kỹ Thuật DXTechs',
  defaultOnline: false,
})

const emit = defineEmits<{
  (e: 'send', msg: string): void
  (e: 'online-change', isOnline: boolean): void
}>()

const inputVal = ref('')
const state = ref<'off' | 'rec' | 'back' | 'on'>(props.defaultOnline ? 'on' : 'off')
const isWifiOn = ref(props.defaultOnline)
const subStatus = ref(props.defaultOnline ? 'Trực tuyến' : 'Mất kết nối')
const bannerTitle = ref('Đang ngoại tuyến')
const bannerSub = ref('Tin nhắn sẽ tự động gửi khi có kết nối trở lại')

interface ChatMsg {
  id: string
  text: string
  me: boolean
  queued: boolean
  time: string
  popping?: boolean
}

const messages = ref<ChatMsg[]>([
  { id: '1', text: 'Chào bạn, đội ngũ kỹ sư DXTechs đang sẵn sàng hỗ trợ triển khai hệ thống.', me: false, queued: false, time: '14:20' },
  { id: '2', text: 'Tôi cần kiểm tra cấu hình kết nối VPN và xác thực SSO cho tên miền công ty.', me: true, queued: false, time: '14:21' },
  { id: '3', text: 'Vui lòng cung cấp thêm thông tin chứng chỉ SSL và gateway.', me: true, queued: true, time: 'Đang chờ' },
])

let minutes = 22
let hasReplied = false
const timeouts: ReturnType<typeof setTimeout>[] = []
const isReducedMotion = ref(false)

function later(fn: () => void, ms: number) {
  const t = setTimeout(fn, ms)
  timeouts.push(t)
}

function clearAllTimers() {
  timeouts.forEach(clearTimeout)
  timeouts.length = 0
}

function updateOfflineText() {
  const queuedCount = messages.value.filter((m) => m.queued).length
  bannerTitle.value = 'Bạn đang ngoại tuyến'
  bannerSub.value = queuedCount
    ? `Còn ${queuedCount} tin nhắn chờ gửi khi có mạng`
    : 'Tin nhắn sẽ tự động gửi khi kết nối mạng được khôi phục'
}

function toggleWifi() {
  if (state.value === 'off') {
    reconnect()
  } else {
    goOffline()
  }
}

function reconnect() {
  clearAllTimers()
  state.value = 'rec'
  isWifiOn.value = true
  subStatus.value = 'Đang tìm tín hiệu'
  bannerTitle.value = 'Đang kết nối lại…'
  bannerSub.value = 'Đã tìm thấy máy chủ gateway'
  emit('online-change', true)

  later(() => {
    state.value = 'back'
    flushQueue()
  }, isReducedMotion.value ? 200 : 1200)
}

function goOffline() {
  clearAllTimers()
  state.value = 'off'
  isWifiOn.value = false
  subStatus.value = 'Mất kết nối'
  updateOfflineText()
  emit('online-change', false)
}

function flushQueue() {
  const queuedItems = messages.value.filter((m) => m.queued)
  const count = queuedItems.length

  queuedItems.forEach((msg, idx) => {
    later(() => {
      minutes++
      msg.queued = false
      msg.time = `14:${minutes}`
      msg.popping = true
      setTimeout(() => {
        msg.popping = false
      }, 450)
    }, isReducedMotion.value ? 0 : 300 + idx * 350)
  })

  bannerTitle.value = 'Đã kết nối trực tuyến'
  bannerSub.value = count
    ? `Đã gửi thành công ${count} tin nhắn đang chờ`
    : 'Hệ thống gửi nhận dữ liệu thời gian thực'

  later(() => {
    state.value = 'on'
    subStatus.value = 'Trực tuyến'
    if (count && !hasReplied) {
      hasReplied = true
      later(() => {
        messages.value.push({
          id: String(Date.now()),
          text: 'Kỹ sư DXTechs đã nhận đủ thông tin và đang xử lý yêu cầu cho bạn!',
          me: false,
          queued: false,
          time: `14:${minutes + 1}`,
        })
      }, isReducedMotion.value ? 100 : 1200)
    }
  }, isReducedMotion.value ? 300 : 1400 + count * 350)
}

function handleSendMessage() {
  const text = inputVal.value.trim()
  if (!text) return

  inputVal.value = ''
  emit('send', text)

  if (state.value === 'off' || state.value === 'rec') {
    messages.value.push({
      id: String(Date.now()),
      text,
      me: true,
      queued: true,
      time: 'Đang chờ',
    })
    if (state.value === 'off') updateOfflineText()
  } else {
    minutes++
    const newMsg: ChatMsg = {
      id: String(Date.now()),
      text,
      me: true,
      queued: false,
      time: `14:${minutes}`,
    }
    messages.value.push(newMsg)
  }

  if (messages.value.length > 9) {
    messages.value.shift()
  }
}

function onNetworkEvent() {
  if (navigator.onLine) {
    if (state.value === 'off') reconnect()
  } else {
    if (state.value !== 'off') goOffline()
  }
}

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('online', onNetworkEvent)
  window.addEventListener('offline', onNetworkEvent)
  if (!props.defaultOnline) updateOfflineText()
})

onUnmounted(() => {
  clearAllTimers()
  window.removeEventListener('online', onNetworkEvent)
  window.removeEventListener('offline', onNetworkEvent)
})
</script>

<template>
  <div
    class="ux u091"
    :class="[state]"
  >
    <!-- Channel Header with Avatars and Wi-Fi Switch -->
    <div class="u091-top">
      <span class="u091-av" aria-hidden="true">
        <i style="--g: linear-gradient(140deg, #2997ff, #0066cc)"></i>
        <i style="--g: linear-gradient(140deg, #0066cc, #2997ff)"></i>
        <i style="--g: linear-gradient(140deg, #0066cc, #0066cc)"></i>
      </span>

      <span class="u091-ti">
        <b>{{ channelTitle }}</b>
        <small>{{ subStatus }}</small>
      </span>

      <button
        class="u091-sw"
        type="button"
        role="switch"
        :aria-checked="isWifiOn"
        :aria-label="isWifiOn ? 'Ngắt kết nối mạng mô phỏng' : 'Bật kết nối Wi-Fi mô phỏng'"
        @click="toggleWifi"
      >
        <span aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M5.6 10.2a3.4 3.4 0 0 1 4.8 0M3.4 7.8a6.6 6.6 0 0 1 9.2 0" />
            <circle cx="8" cy="12.6" r=".6" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Connection Status Banner -->
    <div class="u091-bn">
      <div class="u091-bi">
        <div class="u091-bc" role="status">
          <span class="u091-wf" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path class="a a3" d="M2.8 9.2a13.2 13.2 0 0 1 18.4 0" />
              <path class="a a2" d="M5.7 12.4a9 9 0 0 1 12.6 0" />
              <path class="a" d="M8.6 15.6a4.8 4.8 0 0 1 6.8 0" />
              <circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none" />
              <path class="x" d="M4.5 3.5l15 17" />
            </svg>
          </span>
          <span class="u091-bt">
            <b>{{ bannerTitle }}</b>
            <small>{{ bannerSub }}</small>
          </span>
        </div>
      </div>
    </div>

    <!-- Messages Log -->
    <div class="u091-list" aria-live="polite">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="u091-r"
        :class="{
          me: msg.me,
          q: msg.queued,
          pop: msg.popping,
        }"
      >
        <div class="u091-m">{{ msg.text }}</div>
        <span v-if="msg.me" class="u091-meta">
          <span>{{ msg.time }}</span>
          <!-- Clock icon when queued, checkmarks when sent -->
          <svg v-if="msg.queued" viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="5.2" />
            <path d="M7 4.4V7l1.8 1.2" />
          </svg>
          <svg v-else viewBox="0 0 14 14" aria-hidden="true">
            <path d="M1.6 7.4l2.4 2.4L9 4.8M6.4 9.4l.4.4 5-5" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Message Composer -->
    <form class="u091-cmp" @submit.prevent="handleSendMessage">
      <input
        v-model="inputVal"
        class="u091-in"
        type="text"
        maxlength="80"
        autocomplete="off"
        placeholder="Nhập phản hồi thử nghiệm..."
        aria-label="Soạn tin nhắn"
      />
      <button
        class="u091-send"
        type="submit"
        aria-label="Gửi tin nhắn"
        :aria-disabled="!inputVal.trim()"
      >
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M9 14.5v-11M4 8l5-4.5L14 8" />
        </svg>
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Tokens mapped to DXTechs brand system */
.ux {
  color-scheme: light;
  --ux-page: #f5f5f7;
  --ux-surface: #FFFFFF;
  --ux-surface-2: #f5f5f7;
  --ux-surface-3: #e0e0e0;
  --ux-ink: #1d1d1f;
  --ux-ink-2: #7a7a7a;
  --ux-ink-3: #7a7a7a;
  --ux-line: rgba(29, 29, 31, 0.08);
  --ux-line-2: rgba(29, 29, 31, 0.16);
  --ux-accent: #0066cc;
  --ux-accent-2: #2997ff;
  --ux-accent-soft: rgba(0, 102, 204, 0.12);
  --ux-accent-ink: #FFFFFF;
  --ux-mint: #0066cc;
  --ux-warn: #7a7a7a;
  --ux-danger: #7a7a7a;
  --ux-shadow-strong: rgba(29, 29, 31, 0.22);
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(0.16, 1, 0.3, 1);

  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--ux-ink);
  -webkit-font-smoothing: antialiased;
}

:root[data-theme="dark"] .ux,
:global(.theme-dark) .ux {
  color-scheme: dark;
  --ux-page: #1d1d1f;
  --ux-surface: #1d1d1f;
  --ux-surface-2: #1d1d1f;
  --ux-surface-3: #1d1d1f;
  --ux-ink: #f5f5f7;
  --ux-ink-2: rgba(249, 250, 251, 0.72);
  --ux-ink-3: rgba(249, 250, 251, 0.45);
  --ux-line: rgba(255, 255, 255, 0.08);
  --ux-line-2: rgba(255, 255, 255, 0.16);
  --ux-accent: #2997ff;
  --ux-accent-2: #2997ff;
  --ux-accent-soft: rgba(41, 151, 255, 0.15);
  --ux-accent-ink: #1d1d1f;
  --ux-shadow-strong: rgba(0, 0, 0, 0.65);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .ux {
    color-scheme: dark;
    --ux-page: #1d1d1f;
    --ux-surface: #1d1d1f;
    --ux-surface-2: #1d1d1f;
    --ux-surface-3: #1d1d1f;
    --ux-ink: #f5f5f7;
    --ux-ink-2: rgba(249, 250, 251, 0.72);
    --ux-ink-3: rgba(249, 250, 251, 0.45);
    --ux-line: rgba(255, 255, 255, 0.08);
    --ux-line-2: rgba(255, 255, 255, 0.16);
    --ux-accent: #2997ff;
    --ux-accent-2: #2997ff;
    --ux-accent-soft: rgba(41, 151, 255, 0.15);
    --ux-accent-ink: #1d1d1f;
    --ux-shadow-strong: rgba(0, 0, 0, 0.65);
  }
}

.ux, .ux *, .ux *::before, .ux *::after {
  box-sizing: border-box;
}

/* -------------------------------------------------------------
 * Lucian UX/UI Prompt #091: Offline message queue
 * ------------------------------------------------------------- */
.u091 {
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 480px;
  display: flex;
  flex-direction: column;
  border-radius: 28px;
  background: var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 30px 60px -36px var(--ux-shadow-strong);
  overflow: hidden;
  margin: 0 auto;
}

.u091-top {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 64px;
  flex: none;
  padding: 0 14px 0 16px;
  border-bottom: 1px solid var(--ux-line);
}

.u091-av {
  display: flex;
}

.u091-av i {
  width: 30px;
  height: 30px;
  margin-right: -9px;
  border-radius: 50%;
  background: var(--g);
  box-shadow: 0 0 0 2.5px var(--ux-surface);
}

.u091-ti {
  margin-left: 10px;
}

.u091-ti b {
  display: block;
  font-size: 15px;
  font-weight: 850;
  letter-spacing: -.03em;
  color: var(--ux-ink);
}

.u091-ti small {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ux-ink-3);
  transition: color .3s;
}

.u091.on .u091-ti small,
.u091.back .u091-ti small {
  color: var(--ux-mint);
}

.u091-sw {
  position: relative;
  margin-left: auto;
  width: 60px;
  height: 32px;
  flex: none;
  border: 0;
  padding: 0;
  border-radius: 16px;
  background: var(--ux-surface-3);
  cursor: pointer;
  transition: background-color .3s;
}

.u091-sw[aria-checked="true"] {
  background: var(--ux-mint);
}

.u091-sw span {
  position: absolute;
  left: 3px;
  top: 3px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--ux-surface);
  color: var(--ux-ink-3);
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.35);
  transition: transform .45s var(--ux-spring), color .3s;
}

.u091-sw[aria-checked="true"] span {
  transform: translateX(28px);
  color: var(--ux-mint);
}

.u091-sw svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
}

.u091-sw:active span {
  width: 30px;
}

.u091-sw[aria-checked="true"]:active span {
  transform: translateX(24px);
}

.u091-bn {
  display: grid;
  grid-template-rows: 0fr;
  flex: none;
  transition: grid-template-rows .45s var(--ux-ease);
}

.u091.off .u091-bn,
.u091.rec .u091-bn,
.u091.back .u091-bn {
  grid-template-rows: 1fr;
}

.u091-bi {
  min-height: 0;
  overflow: hidden;
}

.u091-bc {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 10px 12px 2px;
  padding: 10px 14px 10px 10px;
  border-radius: 17px;
  background: var(--ux-ink);
  color: var(--ux-page);
  transition: background-color .4s, color .4s;
}

.u091.back .u091-bc {
  background: var(--ux-mint);
  color: var(--ux-accent-ink);
}

.u091-wf {
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, currentColor 12%, transparent);
}

.u091-wf svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
}

.u091-wf .a {
  opacity: .25;
}

.u091.off .u091-wf .a {
  animation: u091-scan 1.8s ease-in-out infinite;
}

.u091.rec .u091-wf .a {
  animation: u091-scan .9s ease-in-out infinite;
}

.u091-wf .a2 { animation-delay: .2s !important; }
.u091-wf .a3 { animation-delay: .4s !important; }
.u091.back .u091-wf .a { opacity: 1; }

@keyframes u091-scan {
  30% { opacity: 1; }
  70%, 100% { opacity: .25; }
}

.u091-wf .x {
  stroke-dasharray: 24;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset .45s var(--ux-ease);
}

.u091.rec .u091-wf .x,
.u091.back .u091-wf .x {
  stroke-dashoffset: 24;
}

.u091-bt b {
  display: block;
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: -.02em;
}

.u091-bt small {
  display: block;
  margin-top: 1px;
  font-size: 11.5px;
  font-weight: 650;
  opacity: .75;
}

.u091-list {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 14px 10px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 22px);
  mask-image: linear-gradient(180deg, transparent, #000 22px);
}

.u091-r {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  align-items: flex-start;
  max-width: 82%;
  animation: u091-in .45s var(--ux-ease) backwards;
}

@keyframes u091-in {
  from { opacity: 0; transform: translateY(12px) scale(.96); }
}

.u091-r.me {
  align-self: flex-end;
  align-items: flex-end;
}

.u091-m {
  padding: 9px 13px;
  border-radius: 18px 18px 18px 6px;
  background: var(--ux-surface-2);
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--ux-ink);
  transition: background-color .35s, color .35s, outline-color .35s;
}

.u091-r.me .u091-m {
  border-radius: 18px 18px 6px 18px;
  background: var(--ux-accent);
  color: var(--ux-accent-ink);
  outline: 1.5px dashed transparent;
  outline-offset: -1.5px;
}

.u091-r.q .u091-m {
  background: var(--ux-accent-soft);
  color: var(--ux-ink);
  outline-color: var(--ux-accent);
}

.u091-r.pop .u091-m {
  animation: u091-pop .45s var(--ux-ease);
}

@keyframes u091-pop {
  40% { transform: scale(1.05); }
}

.u091-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 3px;
  padding: 0 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--ux-ink-3);
}

.u091-meta svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u091-r.q .u091-meta {
  color: var(--ux-accent);
}

.u091-r.q .u091-meta svg {
  animation: u091-tick 2s linear infinite;
}

@keyframes u091-tick {
  to { transform: rotate(360deg); }
}

.u091-cmp {
  display: flex;
  gap: 8px;
  flex: none;
  padding: 10px 12px 14px;
  border-top: 1px solid var(--ux-line);
}

.u091-in {
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: 22px;
  background: var(--ux-surface-2);
  font: inherit;
  font-size: 13.5px;
  color: var(--ux-ink);
  outline: none;
  transition: box-shadow .2s;
}

.u091-in::placeholder {
  color: var(--ux-ink-3);
}

.u091-in:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--ux-accent);
}

.u091-send {
  width: 44px;
  height: 44px;
  flex: none;
  border: 0;
  padding: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--ux-accent);
  color: var(--ux-accent-ink);
  cursor: pointer;
  transition: transform .3s var(--ux-spring), opacity .2s;
}

.u091-send svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u091-send[aria-disabled="true"] {
  opacity: .35;
  cursor: not-allowed;
}

.u091-send:not([aria-disabled="true"]):active {
  transform: scale(.88);
}

.u091-sw:focus-visible,
.u091-send:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 2px;
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
