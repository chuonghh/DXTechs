<!-- Lucian UX/UI Prompt #062 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#062 -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  defaultEmail?: string
  successPassword?: string
  brandName?: string
  welcomeSubtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultEmail: 'admin@dxtechs.vn',
  successPassword: 'lumen2026',
  brandName: 'DXTechs Hub',
  welcomeSubtitle: 'Đăng nhập vào hệ thống DXTechs Cloud & SaaS',
})

const emit = defineEmits<{
  (e: 'success', data: { email: string; name: string }): void
  (e: 'forgot'): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const emailVal = ref(props.defaultEmail)
const passwordVal = ref('')
const showPassword = ref(false)
const isCapsOn = ref(false)
const isBusy = ref(false)
const isOk = ref(false)
const isSuccessView = ref(false)
const isShaking = ref(false)
const isBadPassword = ref(false)
const triesLeft = ref(3)
const errorMessage = ref('')
const welcomeName = ref('Quản trị viên')

let timer1: ReturnType<typeof setTimeout> | undefined
let timer2: ReturnType<typeof setTimeout> | undefined
const isReducedMotion = ref(false)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

function onPasswordKeyup(e: KeyboardEvent) {
  if (e.getModifierState) {
    isCapsOn.value = e.getModifierState('CapsLock')
  }
}

function onPasswordInput() {
  isBadPassword.value = false
  errorMessage.value = ''
}

function handleLoginSubmit() {
  if (isBusy.value || isOk.value) return

  const email = emailVal.value.trim()
  const pw = passwordVal.value

  if (!email || !pw) {
    errorMessage.value = 'Vui lòng điền đầy đủ email và mật khẩu.'
    isBadPassword.value = true
    triggerShake()
    return
  }

  isBusy.value = true

  timer1 = setTimeout(() => {
    isBusy.value = false

    // Accept lumen2026 or any password >= 6 characters for user convenience
    const isValid = pw === props.successPassword || pw.length >= 6

    if (isValid) {
      isOk.value = true
      const parsedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      welcomeName.value = parsedName || 'Thành viên DXTechs'

      timer2 = setTimeout(() => {
        isSuccessView.value = true
        emit('success', { email, name: welcomeName.value })
      }, isReducedMotion.value ? 100 : 650)
    } else {
      triesLeft.value = Math.max(0, triesLeft.value - 1)
      errorMessage.value = triesLeft.value
        ? `Mật khẩu chưa chính xác · Còn ${triesLeft.value} lần thử (Mẹo: thử "lumen2026")`
        : 'Tạm khóa đăng nhập · Vui lòng khôi phục mật khẩu hoặc thử lại sau'
      isBadPassword.value = true
      triggerShake()
    }
  }, isReducedMotion.value ? 200 : 1000)
}

function triggerShake() {
  isShaking.value = false
  if (rootRef.value) {
    void rootRef.value.offsetWidth
  }
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 500)
}

function handleResetAccount() {
  clearTimeout(timer1)
  clearTimeout(timer2)
  isSuccessView.value = false
  isOk.value = false
  isBusy.value = false
  passwordVal.value = ''
  isBadPassword.value = false
  errorMessage.value = ''
  triesLeft.value = 3
}

onMounted(() => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

onUnmounted(() => {
  clearTimeout(timer1)
  clearTimeout(timer2)
})
</script>

<template>
  <div
    ref="rootRef"
    class="ux u062"
    :class="{
      shake: isShaking,
      'is-in': isSuccessView,
    }"
  >
    <!-- Pane 1: Sign in Form -->
    <form class="u062-pane u062-login" novalidate @submit.prevent="handleLoginSubmit">
      <div class="u062-top-brand">
        <span class="u062-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </span>
        <span class="u062-brand-badge">DXTechs Auth</span>
      </div>

      <h3>Đăng nhập</h3>
      <p>{{ welcomeSubtitle }}</p>

      <!-- Email Field -->
      <div class="u062-f">
        <label for="u062-email-input">Email tài khoản</label>
        <div class="u062-box">
          <input
            id="u062-email-input"
            v-model="emailVal"
            type="email"
            placeholder="name@company.com"
            autocomplete="username"
            required
          />
        </div>
      </div>

      <!-- Password Field with interactive eye and caps lock detection -->
      <div class="u062-f u062-pw" :class="{ bad: isBadPassword }">
        <label for="u062-pw-input">Mật khẩu</label>
        <span class="u062-caps" :class="{ on: isCapsOn }" aria-live="polite">Caps Lock đang bật</span>
        <div class="u062-box">
          <input
            id="u062-pw-input"
            v-model="passwordVal"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Nhập mật khẩu (lumen2026)"
            autocomplete="current-password"
            @keyup="onPasswordKeyup"
            @input="onPasswordInput"
          />
          <button
            class="u062-eye"
            type="button"
            :aria-pressed="showPassword"
            :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
            @click="togglePasswordVisibility"
          >
            <svg viewBox="0 0 24 24">
              <g class="u062-lid">
                <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/>
                <circle cx="12" cy="12" r="3"/>
              </g>
              <path class="u062-slash" d="M4 4l16 16"/>
            </svg>
          </button>
        </div>

        <div class="u062-err">
          <span role="alert">{{ errorMessage }}</span>
        </div>
      </div>

      <div class="u062-row">
        <button type="button" class="u062-forgot-btn" @click="$emit('forgot')">Quên mật khẩu?</button>
      </div>

      <!-- Submit button transforms into spinner circle on busy, and green check on success -->
      <button
        class="u062-go"
        :class="{ busy: isBusy, ok: isOk }"
        type="submit"
        :aria-label="isBusy ? 'Đang kiểm tra...' : isOk ? 'Đăng nhập thành công' : 'Đăng nhập'"
      >
        <span>Xác nhận đăng nhập</span>
        <i aria-hidden="true"></i>
        <svg viewBox="0 0 26 26" aria-hidden="true">
          <path d="M6 13.5l4.5 4.5L20 8.5"/>
        </svg>
      </button>
    </form>

    <!-- Pane 2: Welcome Success Screen -->
    <div class="u062-pane u062-hi" :aria-hidden="!isSuccessView">
      <span class="u062-av" aria-hidden="true"></span>
      <h3>Chào mừng bạn trở lại, {{ welcomeName }}!</h3>
      <p>Tài khoản đã xác thực an toàn · DXTechs Cloud</p>
      <button type="button" @click="handleResetAccount">Sử dụng tài khoản khác</button>
    </div>
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
  --ux-grad: linear-gradient(135deg, #0066cc 0%, #2997ff 100%);
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
 * Lucian UX/UI Prompt #062: Sign-in card feedback
 * ------------------------------------------------------------- */
.u062 {
  position: relative;
  width: 100%;
  max-width: 380px;
  height: 520px;
  margin: 0 auto;
  border-radius: 28px;
  background: var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 30px 60px -25px var(--ux-shadow-strong);
  overflow: hidden;
}

.u062.shake {
  animation: u062-no .5s cubic-bezier(.36, .07, .19, .97);
}

@keyframes u062-no {
  15% { transform: translateX(-9px) rotate(-.6deg); }
  30% { transform: translateX(8px) rotate(.5deg); }
  45% { transform: translateX(-6px); }
  60% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
}

.u062-pane {
  position: absolute;
  inset: 0;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  transition: transform .6s var(--ux-ease), opacity .4s;
}

.u062-top-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.u062-logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--ux-grad);
  display: grid;
  place-items: center;
  box-shadow: 0 10px 20px -8px rgba(0, 102, 204, 0.5);
}

.u062-brand-badge {
  font-size: 11.5px;
  font-weight: 750;
  letter-spacing: .04em;
  color: var(--ux-accent);
  background: var(--ux-accent-soft);
  padding: 4px 10px;
  border-radius: 999px;
}

.u062-pane h3 {
  margin: 16px 0 4px;
  font-size: 24px;
  font-weight: 850;
  letter-spacing: -.04em;
  color: var(--ux-ink);
}

.u062-pane > p {
  margin: 0 0 20px;
  font-size: 13.5px;
  color: var(--ux-ink-3);
  line-height: 1.45;
}

.u062-f {
  position: relative;
  margin-bottom: 14px;
}

.u062-f label {
  display: block;
  margin-bottom: 6px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ux-ink-2);
}

.u062-box {
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 15px;
  background: var(--ux-surface-2);
  box-shadow: inset 0 0 0 1.5px transparent;
  transition: box-shadow .25s, background-color .25s;
}

.u062-box:focus-within {
  background: var(--ux-surface);
  box-shadow: inset 0 0 0 1.5px var(--ux-accent), 0 0 0 4px var(--ux-accent-soft);
}

.u062-f.bad .u062-box {
  box-shadow: inset 0 0 0 1.5px var(--ux-danger);
  background: color-mix(in srgb, var(--ux-danger) 6%, var(--ux-surface));
}

.u062-box input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  padding: 0 16px;
  background: none;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ux-ink);
  outline: none;
}

.u062-box input::placeholder {
  color: var(--ux-ink-3);
  font-weight: 500;
}

.u062-eye {
  width: 44px;
  height: 44px;
  margin-right: 4px;
  border: 0;
  padding: 0;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: none;
  color: var(--ux-ink-3);
  cursor: pointer;
  transition: color .2s;
}

.u062-eye:hover {
  color: var(--ux-ink);
}

.u062-eye:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: -4px;
}

.u062-eye svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u062-lid {
  transform-origin: 12px 12px;
  transition: transform .35s var(--ux-spring);
}

.u062-eye[aria-pressed="false"] .u062-lid {
  transform: scaleY(.5);
}

.u062-slash {
  stroke-dasharray: 24;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset .35s var(--ux-ease);
}

.u062-eye[aria-pressed="true"] .u062-slash {
  stroke-dashoffset: 24;
}

.u062-caps {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ux-warn);
  opacity: 0;
  transition: opacity .2s;
}

.u062-caps.on {
  opacity: 1;
}

.u062-err {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .35s var(--ux-ease);
}

.u062-err > span {
  overflow: hidden;
  min-height: 0;
  font-size: 12px;
  font-weight: 650;
  color: var(--ux-danger);
  line-height: 1.4;
  display: block;
  padding-top: 4px;
}

.u062-f.bad .u062-err {
  grid-template-rows: 1fr;
}

.u062-row {
  display: flex;
  justify-content: flex-end;
  margin: -4px 0 16px;
}

.u062-forgot-btn {
  border: 0;
  background: none;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ux-accent);
  cursor: pointer;
  padding: 0;
}

.u062-forgot-btn:hover {
  text-decoration: underline;
}

.u062-go {
  position: relative;
  align-self: center;
  width: 100%;
  height: 52px;
  margin-top: auto;
  border: 0;
  border-radius: 16px;
  background: var(--ux-ink);
  color: var(--ux-page);
  font-size: 15px;
  font-weight: 750;
  cursor: pointer;
  overflow: hidden;
  transition: width .45s var(--ux-spring), border-radius .45s var(--ux-spring), background-color .4s, transform .3s var(--ux-spring);
}

.u062-go:active {
  transform: scale(.97);
}

.u062-go:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 3px;
}

.u062-go span {
  transition: opacity .2s;
}

.u062-go i {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 22px;
  height: 22px;
  margin: -11px 0 0 -11px;
  border-radius: 50%;
  border: 2.5px solid currentColor;
  border-right-color: transparent;
  opacity: 0;
  animation: u062-spin .7s linear infinite;
}

.u062-go svg {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 26px;
  height: 26px;
  margin: -13px 0 0 -13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.u062-go svg path {
  stroke-dasharray: 26;
  stroke-dashoffset: 26;
  transition: stroke-dashoffset .4s var(--ux-ease) .1s;
}

.u062-go.busy, .u062-go.ok {
  width: 52px;
  border-radius: 26px;
}

.u062-go.busy span, .u062-go.ok span {
  opacity: 0;
}

.u062-go.busy i {
  opacity: 1;
}

.u062-go.ok {
  background: var(--ux-mint);
  color: var(--ux-accent-ink);
}

.u062-go.ok svg path {
  stroke-dashoffset: 0;
}

@keyframes u062-spin {
  to { transform: rotate(360deg); }
}

.u062-hi {
  transform: translateX(100%);
  opacity: 0;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.u062.is-in .u062-login {
  transform: translateX(-30%);
  opacity: 0;
  pointer-events: none;
}

.u062.is-in .u062-hi {
  transform: none;
  opacity: 1;
  pointer-events: auto;
}

.u062-av {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 32%, #f5f5f7, #7a7a7a 45%, #7a7a7a);
  box-shadow: 0 0 0 6px var(--ux-surface), 0 0 0 8px var(--ux-mint);
}

.u062-hi h3 {
  margin-top: 22px;
}

.u062-hi button {
  margin-top: 22px;
  height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  background: var(--ux-surface-2);
  color: var(--ux-ink);
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.u062-hi button:hover {
  background: var(--ux-surface-3);
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
