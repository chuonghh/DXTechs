<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import LucianSignInCard from '../components/LucianSignInCard.vue'
import { useShopStore } from '../stores/shop.ts'

const route = useRoute()
const router = useRouter()
const shop = useShopStore()

const isRegister = computed(() => route.name === 'register')
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  remember: true,
})
const formError = reactive({ message: '' })
const showForgotPassword = ref(false)
const forgotEmail = ref('')
const forgotSent = ref(false)

function onLucianLoginSuccess(data: { email: string; name: string }) {
  shop.signIn(data.name, data.email)
  setTimeout(() => {
    router.push('/tai-khoan')
  }, 1000)
}

function submit() {
  formError.message = ''
  if (form.password.length < 6) {
    formError.message = 'Mật khẩu cần có ít nhất 6 ký tự.'
    return
  }
  if (isRegister.value && form.password !== form.confirmPassword) {
    formError.message = 'Mật khẩu nhập lại chưa khớp.'
    return
  }

  const name = isRegister.value
    ? form.name.trim()
    : form.name.trim() || form.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (letter) => letter.toLocaleUpperCase('vi'))

  shop.signIn(name, form.email.trim())
  router.push('/tai-khoan')
}

function quickLogin(type: 'personal' | 'business' | 'admin') {
  if (type === 'personal') {
    shop.signIn('Minh Anh (Cá Nhân)', 'minhanh.tech@gmail.com', 'customer', '0988 123 456')
    router.push('/tai-khoan')
  } else if (type === 'business') {
    shop.signIn('Nguyễn Hoàng Nam (CTO)', 'nam.nguyen@techcorp.vn', 'customer', '0912 345 678', 'TechCorp JSC')
    router.push('/tai-khoan')
  } else if (type === 'admin') {
    shop.signIn('Quản trị viên DXTechs', 'admin@dxtechs.vn', 'admin', '0971 798 186', 'DXTechs Digital Corp')
    router.push('/admin')
  }
}

function handleForgotPassword() {
  if (!forgotEmail.value || !forgotEmail.value.includes('@')) {
    alert('Vui lòng nhập email hợp lệ')
    return
  }
  forgotSent.value = true
  setTimeout(() => {
    shop.notify(`Đã gửi liên kết khôi phục mật khẩu tới ${forgotEmail.value}`)
  }, 300)
}
</script>

<template>
  <div class="content-wrap auth-view">
    <PageIntro
      eyebrow="DXTECHS · CLOUD &amp; SOFTWARE"
      :title="isRegister ? 'Tạo tài khoản DXTechs' : 'Chào mừng bạn trở lại'"
      :description="isRegister ? 'Đăng ký tài khoản để quản lý giấy phép bản quyền, gia hạn dịch vụ và xem hóa đơn điện tử.' : 'Đăng nhập để theo dõi đơn hàng, quản lý key phần mềm và nhận hỗ trợ kỹ thuật ưu tiên.'"
    />

    <div class="auth-card">
      <div class="auth-card-mark">
        <img src="/dxtechs-logo.png" alt="DXTechs" class="auth-logo-img" />
      </div>

      <div class="auth-tab-nav">
        <RouterLink to="/dang-nhap" class="auth-tab" :class="{ active: !isRegister }">Đăng nhập</RouterLink>
        <RouterLink to="/dang-ky" class="auth-tab" :class="{ active: isRegister }">Đăng ký mới</RouterLink>
      </div>

      <h2>{{ isRegister ? 'Tạo tài khoản thành viên' : 'Đăng nhập hệ thống' }}</h2>
      <p class="auth-demo-note">Hệ thống hỗ trợ đăng nhập 1-chạm mô phỏng nhanh dành cho người dùng trải nghiệm.</p>

      <!-- Quick 1-Click Login Chips -->
      <div class="quick-demo-accounts">
        <span class="quick-accounts-label">
          <svg class="text-cyan-400 animate-pulse icon-ai-glow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 5px;">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          Đăng nhập nhanh 1-chạm (Trải nghiệm đầy đủ tính năng):
        </span>
        <div class="quick-accounts-btns">
          <button type="button" class="quick-acc-btn" @click="quickLogin('personal')">
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <div>
              <b>Cá nhân</b>
              <small>Minh Anh</small>
            </div>
          </button>
          <button type="button" class="quick-acc-btn enterprise" @click="quickLogin('business')">
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
              </svg>
            </span>
            <div>
              <b>Doanh nghiệp</b>
              <small>TechCorp CTO</small>
            </div>
          </button>
          <button type="button" class="quick-acc-btn admin" @click="quickLogin('admin')">
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </span>
            <div>
              <b>Quản trị viên</b>
              <small>Admin Portal</small>
            </div>
          </button>
        </div>
      </div>

      <div class="auth-divider">
        <span>Hoặc với Email của bạn</span>
      </div>

      <!-- Lucian UX/UI Prompt #062: Sign-in card feedback -->
      <div v-if="!isRegister" class="lucian-signin-container">
        <LucianSignInCard
          default-email="admin@dxtechs.vn"
          brand-name="DXTechs Portal"
          welcome-subtitle="Đăng nhập tài khoản để quản lý giải pháp số và bản quyền"
          @success="onLucianLoginSuccess"
          @forgot="showForgotPassword = true"
        />
      </div>

      <!-- Main Form (for Registration) -->
      <form v-else class="stacked-form" @submit.prevent="submit">
        <label>
          Họ và tên của bạn
          <input v-model="form.name" required minlength="2" autocomplete="name" placeholder="Ví dụ: Lê Minh Trí" />
        </label>

        <label>
          Địa chỉ email
          <input v-model="form.email" required type="email" autocomplete="email" placeholder="email@domain.com" />
        </label>

        <label>
          Mật khẩu
          <input v-model="form.password" required type="password" minlength="6" autocomplete="new-password" placeholder="Tối thiểu 6 ký tự" />
        </label>

        <label>
          Xác nhận mật khẩu
          <input v-model="form.confirmPassword" required type="password" minlength="6" autocomplete="new-password" placeholder="Nhập lại mật khẩu" />
        </label>

        <p v-if="formError.message" class="form-error" role="alert">{{ formError.message }}</p>

        <button class="button button-primary button-wide auth-submit-btn" type="submit">
          Tạo tài khoản ngay <span>→</span>
        </button>
      </form>

      <!-- Social Logins -->
      <div class="social-login-block">
        <span class="social-login-title">Đăng nhập bằng tài khoản liên kết</span>
        <div class="social-btns-row">
          <button type="button" class="social-btn google-btn" @click="quickLogin('personal')">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/><path d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/><path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/></svg>
            Google
          </button>
          <button type="button" class="social-btn microsoft-btn" @click="quickLogin('business')">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><rect x="1" y="1" width="10" height="10"/><rect x="13" y="1" width="10" height="10"/><rect x="1" y="13" width="10" height="10"/><rect x="13" y="13" width="10" height="10"/></svg>
            Microsoft 365
          </button>
        </div>
      </div>

      <p class="auth-switch">
        {{ isRegister ? 'Đã có tài khoản DXTechs?' : 'Chưa có tài khoản?' }}
        <RouterLink :to="isRegister ? '/dang-nhap' : '/dang-ky'">
          {{ isRegister ? 'Đăng nhập ngay' : 'Đăng ký miễn phí' }}
        </RouterLink>
      </p>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="auth-modal-overlay" @click.self="showForgotPassword = false">
      <div class="auth-modal-card">
        <div class="auth-modal-header">
          <h3>Khôi phục mật khẩu</h3>
          <button type="button" class="modal-close-btn" @click="showForgotPassword = false">×</button>
        </div>

        <div v-if="forgotSent" class="forgot-success">
          <span class="success-icon">✓</span>
          <p>Liên kết đặt lại mật khẩu đã được gửi đến <strong>{{ forgotEmail }}</strong>. Vui lòng kiểm tra hòm thư đến hoặc thư mục Spam.</p>
          <button class="button button-primary button-wide" type="button" @click="showForgotPassword = false; forgotSent = false">
            Quay lại đăng nhập
          </button>
        </div>

        <form v-else @submit.prevent="handleForgotPassword">
          <p class="forgot-desc">Nhập địa chỉ email liên kết với tài khoản DXTechs. Chúng tôi sẽ gửi hướng dẫn thiết lập mật khẩu mới.</p>
          <label class="modal-input-label">
            Email của bạn
            <input v-model="forgotEmail" type="email" required placeholder="email@domain.com" />
          </label>
          <div class="modal-actions">
            <button type="button" class="button button-outline" @click="showForgotPassword = false">Hủy</button>
            <button type="submit" class="button button-primary">Gửi liên kết</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lucian-signin-container {
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
}
</style>
