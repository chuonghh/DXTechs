<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import { ApiError } from '../api'
import { describeAuthError } from '../api/auth'
import { useAuthStore } from '../stores/auth'
import { useShopStore } from '../stores/shop.ts'

// Đăng nhập / đăng ký thật (server PR-8, ADR-012). Đã gỡ đăng nhập “1 chạm” giả và nút Google/Microsoft chưa có thật.
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const shop = useShopStore()

const isRegister = computed(() => route.name === 'register')
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const state = reactive({ busy: false, message: '', fields: {} as Record<string, string> })
const showForgotPassword = ref(false)

watch(isRegister, () => {
  state.message = ''
  state.fields = {}
})

/** Chỉ cho chuyển hướng về đường dẫn nội bộ (chống open redirect qua ?redirect=https://…). */
function redirectTarget(fallback: string): string {
  const target = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  return target.startsWith('/') && !target.startsWith('//') ? target : fallback
}

async function submit() {
  state.message = ''
  state.fields = {}
  if (isRegister.value && form.password !== form.confirmPassword) {
    state.fields = { password: 'Mật khẩu nhập lại chưa khớp.' }
    return
  }

  state.busy = true
  try {
    const user = isRegister.value
      ? await auth.register(form.email, form.password, form.name)
      : await auth.login(form.email, form.password)
    form.password = form.confirmPassword = ''
    shop.notify(`Xin chào ${user.fullName}!`)
    await router.push(redirectTarget(user.role === 'admin' ? '/admin' : '/tai-khoan'))
  } catch (error) {
    const { message, fields } = describeAuthError(error)
    state.fields = fields
    state.message = error instanceof ApiError && error.status === 429
      ? 'Bạn thử quá nhiều lần. Vui lòng đợi một phút rồi thử lại.'
      : message
  } finally {
    state.busy = false
  }
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

      <form class="stacked-form" novalidate @submit.prevent="submit">
        <label v-if="isRegister">
          Họ và tên của bạn
          <input v-model="form.name" required minlength="1" maxlength="100" autocomplete="name" placeholder="Ví dụ: Lê Minh Trí" />
          <small v-if="state.fields.fullName" class="form-error">{{ state.fields.fullName }}</small>
        </label>

        <label>
          Địa chỉ email
          <input v-model="form.email" required type="email" maxlength="254" autocomplete="email" placeholder="email@domain.com" />
          <small v-if="state.fields.email" class="form-error">{{ state.fields.email }}</small>
        </label>

        <label>
          Mật khẩu
          <input
            v-model="form.password"
            required
            type="password"
            :minlength="isRegister ? 10 : undefined"
            maxlength="128"
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
            :placeholder="isRegister ? 'Ít nhất 10 ký tự — có thể là một câu dễ nhớ' : 'Mật khẩu của bạn'"
          />
          <small v-if="state.fields.password" class="form-error">{{ state.fields.password }}</small>
        </label>

        <label v-if="isRegister">
          Xác nhận mật khẩu
          <input v-model="form.confirmPassword" required type="password" maxlength="128" autocomplete="new-password" placeholder="Nhập lại mật khẩu" />
        </label>

        <p v-if="isRegister" class="auth-demo-note">
          Mật khẩu tối thiểu 10 ký tự, dùng được chữ có dấu và khoảng trắng; không cần ký tự đặc biệt.
        </p>

        <p v-if="state.message" class="form-error" role="alert">{{ state.message }}</p>

        <button class="button button-primary button-wide auth-submit-btn" type="submit" :disabled="state.busy">
          <template v-if="state.busy">Đang xử lý…</template>
          <template v-else>{{ isRegister ? 'Tạo tài khoản' : 'Đăng nhập' }} <span>→</span></template>
        </button>

        <button v-if="!isRegister" type="button" class="auth-switch-link" @click="showForgotPassword = true">
          Quên mật khẩu?
        </button>
      </form>

      <p class="auth-switch">
        {{ isRegister ? 'Đã có tài khoản DXTechs?' : 'Chưa có tài khoản?' }}
        <RouterLink :to="{ path: isRegister ? '/dang-nhap' : '/dang-ky', query: route.query }">
          {{ isRegister ? 'Đăng nhập ngay' : 'Đăng ký miễn phí' }}
        </RouterLink>
      </p>
    </div>

    <!-- Quên mật khẩu: chưa có gửi email tự động (cần dịch vụ email — Phase 3) -->
    <div v-if="showForgotPassword" class="auth-modal-overlay" @click.self="showForgotPassword = false">
      <div class="auth-modal-card">
        <div class="auth-modal-header">
          <h3>Khôi phục mật khẩu</h3>
          <button type="button" class="modal-close-btn" @click="showForgotPassword = false">×</button>
        </div>
        <p class="forgot-desc">
          Tính năng đặt lại mật khẩu qua email sẽ có trong bản cập nhật tới. Hiện tại, vui lòng liên hệ
          <a href="mailto:support@dxtechs.vn">support@dxtechs.vn</a> từ email đã đăng ký để được hỗ trợ.
        </p>
        <div class="modal-actions">
          <button type="button" class="button button-primary" @click="showForgotPassword = false">Đã hiểu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-switch-link {
  background: none;
  border: 0;
  color: inherit;
  opacity: 0.75;
  text-decoration: underline;
  cursor: pointer;
  justify-self: center;
  font: inherit;
  font-size: 0.85rem;
}
.stacked-form small.form-error {
  display: block;
  margin-top: 4px;
}
</style>
