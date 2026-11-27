<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LucianButton from '../components/LucianButton.vue'
import { useShopStore } from '../stores/shop.ts'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import MyOrders from '../components/MyOrders.vue'
import LicenseVault from '../components/LicenseVault.vue'
import { describeAuthError } from '../api/auth'

const route = useRoute()
const router = useRouter()
const shop = useShopStore()
const orders = useOrdersStore()
// PR-C4: số đơn + key thật (tab Tổng quan cũng hiển thị).
void orders.load().then(() => orders.loadLicenses())
const auth = useAuthStore()

const activeTab = ref<'overview' | 'vault' | 'orders' | 'profile' | 'security'>('overview')
const isOrdersPage = computed(() => route.name === 'orders')

// Active tab sync with route
if (isOrdersPage.value) {
  activeTab.value = 'orders'
}

// In-frame tab switching without full-page router reload or scroll jumping
watch(activeTab, (tab) => {
  const targetPath = tab === 'orders' ? '/don-hang' : '/tai-khoan'
  if (window.location.pathname !== targetPath) {
    window.history.replaceState(null, '', targetPath)
  }
})

watch(() => route.name, (name) => {
  if (name === 'orders') {
    activeTab.value = 'orders'
  }
})

// Navigation tabs for LucianSegmented
const accountNavTabs = computed(() => [
  { value: 'overview', label: 'Tổng quan' },
  { value: 'vault', label: 'Kho License', count: orders.licenses.length },
  { value: 'orders', label: 'Đơn hàng', count: orders.items.length },
  { value: 'profile', label: 'Hồ sơ' },
  { value: 'security', label: 'Bảo mật & 2FA' },
])

// Route guard chuyển về đây khi tài khoản không phải admin mở /admin.
const deniedAdmin = computed(() => route.query.denied === 'admin')

// Hồ sơ: hiển thị từ tài khoản thật (server). Sửa hồ sơ qua API sẽ có ở bản sau — chưa cho sửa để không “lưu giả”.
const profileForm = computed(() => ({
  name: auth.user?.fullName ?? '',
  email: auth.user?.email ?? '',
  phone: auth.user?.phone ?? '',
  company: auth.user?.companyName ?? '',
  taxCode: auth.user?.taxCode ?? '',
}))

// Đổi mật khẩu (PUT /api/me/password): mọi phiên khác bị thu hồi, thiết bị này nhận phiên mới.
const passwordForm = reactive({ current: '', next: '', confirm: '' })
const passwordState = reactive({ busy: false, message: '', error: '', fields: {} as Record<string, string> })

async function submitPasswordChange() {
  passwordState.message = ''
  passwordState.error = ''
  passwordState.fields = {}
  if (passwordForm.next !== passwordForm.confirm) {
    passwordState.fields = { newPassword: 'Mật khẩu nhập lại chưa khớp.' }
    return
  }
  passwordState.busy = true
  try {
    await auth.changePassword(passwordForm.current, passwordForm.next)
    passwordForm.current = passwordForm.next = passwordForm.confirm = ''
    passwordState.message = 'Đã đổi mật khẩu. Các thiết bị khác đã bị đăng xuất.'
  } catch (error) {
    const { message, fields } = describeAuthError(error)
    passwordState.error = message
    passwordState.fields = fields
  } finally {
    passwordState.busy = false
  }
}

async function logoutEverywhere() {
  if (!window.confirm('Đăng xuất khỏi tất cả thiết bị, kể cả thiết bị này?')) return
  try {
    await auth.logoutAll()
  } finally {
    shop.notify('Đã đăng xuất khỏi mọi thiết bị')
    router.push('/dang-nhap')
  }
}

async function logout() {
  await shop.signOut()
  router.push('/')
}
</script>

<template>
  <div class="account-view-page">
    <div class="content-wrap account-view">
      <!-- Dedicated Dashboard Top Header -->
      <header class="account-dashboard-header">
        <div class="account-header-left">
          <span class="account-header-eyebrow">KHÔNG GIAN QUẢN TRỊ KHÁCH HÀNG</span>
          <h1 class="account-header-title">{{ isOrdersPage ? 'Đơn hàng &amp; Giấy phép bản quyền' : 'Tài khoản khách hàng DXTechs' }}</h1>
          <p class="account-header-desc">Quản trị giấy phép số, tra cứu key kích hoạt, tải hóa đơn VAT và cập nhật thông tin doanh nghiệp.</p>
        </div>
      </header>

      <!-- User Logged In Experience -->
      <div v-if="shop.user" class="account-user-container">
        <div class="account-body-grid">
        <!-- Account Sidebar -->
        <aside class="account-sidebar">
          <div class="account-profile-header">
            <div class="account-avatar">
              {{ shop.user.name.charAt(0).toUpperCase() }}
              <span class="online-indicator" title="Đang hoạt động"></span>
            </div>
            <b class="account-name">{{ shop.user.name }}</b>
            <small class="account-email">{{ shop.user.email }}</small>
            <span class="account-tier-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Doanh nghiệp Verified
            </span>
          </div>

          <!-- Nav Items Desktop List -->
          <nav class="account-nav-list" aria-label="Menu tài khoản">
            <button
              v-for="item in accountNavTabs"
              :key="item.value"
              type="button"
              class="account-nav-item"
              :class="{ active: activeTab === item.value }"
              @click="activeTab = item.value as any"
            >
              <span class="nav-label-with-icon">
                <span class="nav-icon-wrap" aria-hidden="true">
                  <svg v-if="item.value === 'overview'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
                  </svg>
                  <svg v-else-if="item.value === 'vault'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/>
                  </svg>
                  <svg v-else-if="item.value === 'orders'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <svg v-else-if="item.value === 'profile'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <svg v-else-if="item.value === 'security'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <span class="nav-text">{{ item.label }}</span>
              </span>
              <span v-if="item.count !== undefined" class="orders-count-pill">{{ item.count }}</span>
            </button>
          </nav>

          <!-- Role Switching Demonstration Card -->
          <div class="account-role-box" :class="shop.user.role">
            <div class="role-box-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="shop.user.role === 'admin'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <template v-else>
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </template>
              </svg>
              <span>{{ shop.user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Khách hàng (Verified)' }}</span>
            </div>
            <p class="role-box-desc">
              {{ shop.user.role === 'admin'
                ? 'Toàn quyền duyệt đơn, quản lý sản phẩm, cấp phát key bản quyền và xem báo cáo tài chính.'
                : 'Tài khoản khách hàng: theo dõi đơn hàng, license và hoá đơn của bạn.' }}
            </p>
            <p v-if="deniedAdmin && shop.user.role !== 'admin'" class="form-error" role="alert">
              Trang quản trị chỉ dành cho tài khoản admin.
            </p>
            <LucianButton
              v-if="shop.user.role === 'admin'"
              variant="primary"
              size="sm"
              style="width: 100%; justify-content: center;"
              @click="router.push('/admin')"
            >
              Mở Admin Console →
            </LucianButton>
          </div>

          <div class="account-sidebar-footer">
            <LucianButton
              variant="ghost"
              size="sm"
              style="width: 100%; justify-content: center; color: #7a7a7a;"
              @click="logout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Đăng xuất tài khoản</span>
            </LucianButton>
          </div>
        </aside>

        <!-- Account Main Panel -->
        <section class="account-main">
          <!-- TAB 1: OVERVIEW -->
          <template v-if="activeTab === 'overview'">
            <div class="account-welcome-banner">
              <div class="welcome-copy">
                <div class="welcome-badges-strip">
                  <span class="eyebrow-cyan">KHÔNG GIAN QUẢN TRỊ KHÁCH HÀNG</span>
                  <span class="welcome-status-chip">
                    <span class="pulse-dot"></span>
                    Hệ thống hoạt động bình thường
                  </span>
                </div>
                <h2>{{ shop.user.name }}</h2>
                <p>Bạn có <strong>{{ orders.items.length }}</strong> đơn hàng<template v-if="orders.pendingCount"> (<strong>{{ orders.pendingCount }}</strong> đang chờ thanh toán)</template> và <strong>{{ orders.licenses.length }}</strong> license key.</p>
                <div class="account-trust-tags">
                  <span class="trust-tag">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Tài khoản Doanh nghiệp Verified
                  </span>
                  <span class="trust-tag">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Đăng nhập bảo mật (phiên có hạn)
                  </span>
                  <span class="trust-tag">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Bảo hành 100% chính hãng
                  </span>
                </div>
              </div>
              <RouterLink v-if="!orders.items.length" class="button button-outline" to="/phan-mem">Khám phá phần mềm →</RouterLink>
            </div>

            <!-- Stat Grid (4-Column Bento Grid - UI/UX Pro Max) -->
            <div class="account-stat-grid">
              <div class="stat-card">
                <span class="stat-icon blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </span>
                <div>
                  <small>Tổng đơn hàng đã đặt</small>
                  <b>{{ orders.items.length }} đơn</b>
                </div>
              </div>

              <div class="stat-card">
                <span class="stat-icon cyan">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <div>
                  <small>Bản quyền đang hoạt động</small>
                  <b>{{ orders.licenses.length }} License Key</b>
                </div>
              </div>

              <div class="stat-card">
                <span class="stat-icon emerald">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </span>
                <div>
                  <small>Trạng thái bảo hành</small>
                  <b class="text-emerald">Cam kết chính hãng 100%</b>
                </div>
              </div>

              <div class="stat-card">
                <span class="stat-icon purple">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="2" y1="20" x2="22" y2="20"></line>
                  </svg>
                </span>
                <div>
                  <small>Cấp phép thiết bị</small>
                  <b class="text-accent">Không giới hạn trọn đời</b>
                </div>
              </div>
            </div>

            <!-- Quick Action Cards (3-Column Bento - UI/UX Pro Max) -->
            <div class="quick-overview-grid">
              <div class="overview-box" @click="activeTab = 'vault'">
                <div class="box-head">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <h4>Tra cứu Kho Giấy phép số</h4>
                </div>
                <p>Xem toàn bộ License Keys, thời hạn sử dụng và hướng dẫn kích hoạt bản quyền nhanh.</p>
                <span class="box-link">Mở kho giấy phép →</span>
              </div>

              <div class="overview-box" @click="activeTab = 'orders'">
                <div class="box-head">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <h4>Hóa đơn GTGT &amp; Đơn hàng</h4>
                </div>
                <p>Tra cứu lịch sử mua hàng, tải biên nhận điện tử và yêu cầu xuất hóa đơn đỏ VAT.</p>
                <span class="box-link">Xem lịch sử đơn hàng →</span>
              </div>

              <div class="overview-box" @click="activeTab = 'security'">
                <div class="box-head">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <h4>Bảo mật &amp; Quyền riêng tư</h4>
                </div>
                <p>Cấu hình xác thực 2 bước (2FA), kiểm soát các thiết bị đã đăng nhập và lịch sử truy cập.</p>
                <span class="box-link">Trung tâm bảo mật →</span>
              </div>
            </div>
          </template>

          <!-- TAB 2: VAULT (KHO BẢN QUYỀN) -->
          <template v-else-if="activeTab === 'vault'">
            <div class="account-section-title">
              <div>
                <span class="eyebrow-cyan">KHO GIẤY PHÉP ĐIỆN TỬ</span>
                <h2>License key của bạn ({{ orders.licenses.length }})</h2>
              </div>
            </div>
            <LicenseVault />
          </template>

          <template v-else-if="activeTab === 'orders'">
            <div class="account-section-title">
              <div>
                <span class="eyebrow-cyan">LỊCH SỬ GIAO DỊCH</span>
                <h2>Đơn của tôi</h2>
              </div>
            </div>
            <MyOrders />
          </template>

          <template v-else-if="activeTab === 'profile'">
            <div class="account-section-title">
              <div>
                <span class="eyebrow-cyan">THÔNG TIN TỔ CHỨC</span>
                <h2>Hồ sơ cá nhân &amp; Doanh nghiệp</h2>
              </div>
            </div>

            <div class="profile-card">
              <form class="profile-edit-form" @submit.prevent>
                <div class="form-grid-two">
                  <label class="dark-form-label">
                    <span>Họ và tên</span>
                    <input :value="profileForm.name" class="dark-input" readonly />
                  </label>
                  <label class="dark-form-label">
                    <span>Email tài khoản</span>
                    <input :value="profileForm.email" type="email" class="dark-input" readonly />
                  </label>
                </div>

                <div class="form-grid-two">
                  <label class="dark-form-label">
                    <span>Số điện thoại liên hệ</span>
                    <input :value="profileForm.phone" type="tel" class="dark-input" readonly placeholder="Chưa cập nhật" />
                  </label>
                  <label class="dark-form-label">
                    <span>Tên công ty / Tổ chức</span>
                    <input :value="profileForm.company" class="dark-input" readonly placeholder="Chưa cập nhật" />
                  </label>
                </div>

                <label class="dark-form-label">
                  <span>Mã số thuế (để xuất hoá đơn VAT)</span>
                  <input :value="profileForm.taxCode" class="dark-input" readonly placeholder="Chưa cập nhật" />
                </label>

                <p class="security-card-desc">Chỉnh sửa hồ sơ sẽ có trong bản cập nhật tới. Cần thay đổi gấp, vui lòng liên hệ hỗ trợ.</p>
              </form>
            </div>
          </template>

          <!-- TAB 5: SECURITY (LUCIAN UX/UI STRETCHY SWITCHES) -->
          <template v-else-if="activeTab === 'security'">
            <div class="account-section-title">
              <div>
                <span class="eyebrow-cyan">TRUNG TÂM BẢO MẬT &amp; QUYỀN RIÊNG TƯ</span>
                <h2>Cài đặt An ninh Tài khoản (Lucian Controls)</h2>
              </div>
            </div>

            <!-- Đổi mật khẩu (API thật) -->
            <div class="security-card">
              <h3 class="security-card-title">Đổi mật khẩu tài khoản</h3>
              <p class="security-card-desc">
                Tối thiểu 10 ký tự — có thể dùng chữ có dấu và khoảng trắng (ví dụ một câu dễ nhớ). Không cần ký tự đặc biệt.
                Đổi xong, mọi thiết bị khác sẽ bị đăng xuất.
              </p>
              <form class="security-pass-form" @submit.prevent="submitPasswordChange">
                <label class="dark-form-label">
                  <span>Mật khẩu hiện tại</span>
                  <input v-model="passwordForm.current" type="password" autocomplete="current-password" class="dark-input" required />
                  <small v-if="passwordState.fields.currentPassword" class="form-error">{{ passwordState.fields.currentPassword }}</small>
                </label>
                <div class="form-grid-two">
                  <label class="dark-form-label">
                    <span>Mật khẩu mới</span>
                    <input v-model="passwordForm.next" type="password" minlength="10" maxlength="128" autocomplete="new-password" placeholder="Ít nhất 10 ký tự" class="dark-input" required />
                    <small v-if="passwordState.fields.newPassword" class="form-error">{{ passwordState.fields.newPassword }}</small>
                  </label>
                  <label class="dark-form-label">
                    <span>Xác nhận mật khẩu mới</span>
                    <input v-model="passwordForm.confirm" type="password" minlength="10" maxlength="128" autocomplete="new-password" placeholder="Nhập lại mật khẩu" class="dark-input" required />
                  </label>
                </div>
                <p v-if="passwordState.error" class="form-error" role="alert">{{ passwordState.error }}</p>
                <p v-if="passwordState.message" class="security-card-desc" role="status">{{ passwordState.message }}</p>
                <div style="margin-top: 1rem;">
                  <LucianButton variant="outline" type="submit" :disabled="passwordState.busy">
                    {{ passwordState.busy ? 'Đang cập nhật…' : 'Cập nhật mật khẩu' }}
                  </LucianButton>
                </div>
              </form>
            </div>

            <!-- Phiên đăng nhập -->
            <div class="security-card active-sessions-card mt-6">
              <h3 class="security-card-title">Phiên đăng nhập</h3>
              <p class="security-card-desc">
                Phiên trên mỗi thiết bị tự gia hạn khi bạn dùng và kết thúc sau tối đa 30 ngày. Nếu nghi ngờ tài khoản bị lộ,
                hãy đổi mật khẩu hoặc đăng xuất khỏi mọi thiết bị.
              </p>
              <LucianButton variant="outline" @click="logoutEverywhere">
                Đăng xuất khỏi mọi thiết bị
              </LucianButton>
            </div>
          </template>
        </section>
      </div>
    </div>

    <!-- Quick Login Placeholder when signed out -->
    <div v-else class="not-logged-in-container">
      <div class="not-logged-card">
        <span class="not-logged-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </span>
        <h2>Truy cập Kho Giấy Phép DXTechs</h2>
        <p>Vui lòng đăng nhập để tra cứu bản quyền số, kích hoạt key và tải hóa đơn GTGT.</p>

        <div class="quick-login-grid">
          <RouterLink class="quick-login-card" :to="{ name: 'login', query: { redirect: route.fullPath } }">
            <b>Đăng nhập</b>
            <small>Dùng email đã đăng ký</small>
          </RouterLink>
          <RouterLink class="quick-login-card" to="/dang-ky">
            <b>Tạo tài khoản</b>
            <small>Miễn phí, chỉ cần email</small>
          </RouterLink>
        </div>
      </div>
    </div>

  </div>
</div>
</template>

<style scoped>
/* ==========================================================================
   DXTECHS ACCOUNT VIEW - APPLE DESIGN SYSTEM SPECIFICATION
   ========================================================================== */

.account-view-page {
  background: #fbf9f5;
  min-height: 100vh;
  color: #0f224a;
}

.account-view {
  min-height: 100vh;
  padding-bottom: 4rem;
  color: #0f224a;
}

/* Dedicated Dashboard Header */
.account-dashboard-header {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.75rem 2rem;
  margin: 2rem 0;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.account-header-left {
  flex: 1 1 360px;
}

.account-header-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #0062ff;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.account-header-title {
  margin: 0 0 0.35rem;
  font-family: var(--heading);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 700;
  color: #0f224a;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.account-header-desc {
  margin: 0;
  font-size: 14.5px;
  color: #5a6e8c;
  max-width: 62ch;
  line-height: 1.5;
}

.account-header-nav-wrap {
  display: flex;
  align-items: center;
}

.account-user-container {
  width: 100%;
}

.account-body-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .account-body-grid {
    grid-template-columns: 1fr;
  }
}

/* Sidebar */
.account-sidebar {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
}

.account-profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #ebe6dc;
}

.account-avatar {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-pill, 9999px);
  background: #0062ff;
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  display: grid;
  place-items: center;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 14px rgba(0, 98, 255, 0.25);
}

.online-indicator {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 14px;
  height: 14px;
  border-radius: var(--radius-pill, 9999px);
  background: #0062ff;
  border: 2px solid #ffffff;
}

.account-name {
  font-family: var(--heading);
  font-size: 18px;
  font-weight: 700;
  color: #0f224a;
  letter-spacing: -0.015em;
}

.account-email {
  font-size: 13px;
  color: #5a6e8c;
  margin-top: 0.15rem;
}

.account-tier-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 0.65rem;
  padding: 3px 10px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 11px;
  font-weight: 600;
  background: #eef5ff;
  color: #0062ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
}

/* Nav Desktop Items */
.account-nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid #ebe6dc;
}

.account-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-pill, 9999px);
  background: transparent;
  border: 1px solid transparent;
  color: #5a6e8c;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  text-align: left;
}

.nav-label-with-icon {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.nav-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0062ff;
  transition: color 0.15s ease;
}

.nav-icon-wrap svg {
  stroke: currentColor;
  fill: none;
}

.account-nav-item:hover {
  background: #fbf9f5;
  border-color: #ebe6dc;
  color: #0f224a;
}

.account-nav-item:active {
  transform: scale(0.97);
}

.account-nav-item.active {
  background: #0062ff;
  border-color: #0062ff;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 98, 255, 0.25);
}

.account-nav-item.active .nav-icon-wrap {
  color: #ffffff;
}

.orders-count-pill {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  background: #eef5ff;
  color: #0062ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
  font-weight: 600;
}

.account-nav-item.active .orders-count-pill {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  border-color: transparent;
}

/* Role Switching Box */
.account-role-box {
  margin: 1.25rem 0;
  padding: 1rem;
  border-radius: var(--radius-md, 11px);
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.role-box-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #0062ff;
}

.role-box-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: #5a6e8c;
}

.account-sidebar-footer {
  padding-top: 0.75rem;
}

/* Main Panel */
.account-main {
  min-width: 0;
}

.eyebrow-cyan {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #0062ff;
  text-transform: uppercase;
}

.account-section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.account-section-title h2 {
  font-family: var(--heading);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 0.25rem 0 0;
  color: #0f224a;
}

/* Welcome Banner */
.account-welcome-banner {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.75rem;
  margin-bottom: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
}

.welcome-copy h2 {
  font-family: var(--heading);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #0f224a;
  margin: 0.25rem 0 0.4rem;
}

.welcome-badges-strip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.welcome-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-pill, 9999px);
  background: #f0fdf4;
  border: 1px solid rgba(22, 163, 74, 0.2);
  color: #16a34a;
  font-size: 11px;
  font-weight: 600;
}

.account-trust-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.85rem;
}

.trust-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-pill, 9999px);
  background: #eef5ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
  color: #0062ff;
  font-size: 12px;
  font-weight: 600;
}

.welcome-copy p {
  color: #5a6e8c;
  font-size: 15px;
  margin: 0;
}

/* Stat Grid */
.account-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 85, 187, 0.04);
}

.stat-card:hover {
  border-color: #0062ff;
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md, 11px);
  display: grid;
  place-items: center;
  background: #eef5ff;
  color: #0062ff;
  border: 1px solid rgba(0, 98, 255, 0.15);
}

.stat-icon svg {
  stroke: currentColor;
  fill: none;
  width: 22px;
  height: 22px;
}

.stat-icon.blue { background: #eef5ff; color: #0062ff; border-color: rgba(0, 98, 255, 0.2); }
.stat-icon.cyan { background: #e0f7ff; color: #0088cc; border-color: rgba(0, 136, 204, 0.2); }
.stat-icon.emerald { background: #ecfdf5; color: #059669; border-color: rgba(5, 150, 105, 0.2); }
.stat-icon.purple { background: #eef2ff; color: #4f46e5; border-color: rgba(79, 70, 229, 0.2); }

.stat-card small {
  display: block;
  font-size: 12px;
  color: #5a6e8c;
  margin-bottom: 0.2rem;
}

.stat-card b {
  font-family: var(--heading);
  font-size: 21px;
  font-weight: 700;
  color: #0062ff;
  letter-spacing: -0.015em;
}

.text-emerald {
  color: #0062ff !important;
}

/* Overview boxes */
.quick-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.overview-box {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 85, 187, 0.04);
}

.overview-box:hover {
  border-color: #0062ff;
  transform: translateY(-2px);
}

.box-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #0062ff;
  margin-bottom: 0.65rem;
}

.box-head h4 {
  font-family: var(--heading);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 0;
  color: #0f224a;
}

.overview-box p {
  color: #5a6e8c;
  font-size: 14px;
  line-height: 1.47;
  margin: 0 0 1rem;
}

.box-link {
  font-size: 13px;
  font-weight: 600;
  color: #0062ff;
}

/* Vault Cards */
.vault-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.vault-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
  transition: border-color 0.2s ease;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
}

.vault-card:hover {
  border-color: #0062ff;
}

.vault-card-head {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

.vault-product-thumb {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md, 11px);
  background: #fbf9f5;
  padding: 8px;
  border: 1px solid #ebe6dc;
  box-shadow: 0 2px 8px rgba(0, 85, 187, 0.08);
}

.vault-info {
  flex: 1;
}

.vault-info-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.vault-cat-pill {
  font-size: 11px;
  font-weight: 600;
  color: #0062ff;
  background: #eef5ff;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid rgba(0, 98, 255, 0.2);
}

.vault-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #0062ff;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: var(--radius-pill, 9999px);
  background: #0062ff;
}

.vault-product-title {
  font-family: var(--heading);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #0f224a;
  margin: 0 0 0.35rem;
}

.vault-meta-row {
  display: flex;
  gap: 0.5rem;
  color: #5a6e8c;
  font-size: 13px;
}

/* Vault Key Container */
.vault-key-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-md, 11px);
  padding: 0.85rem 1.25rem;
  margin-bottom: 1.25rem;
  gap: 1rem;
}

.vault-key-meta {
  display: flex;
  flex-direction: column;
}

.vault-key-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #5a6e8c;
  margin-bottom: 0.25rem;
}

.vault-key-code {
  font-family: ui-monospace, Menlo, Monaco, Consolas, monospace;
  font-size: 17px;
  font-weight: 700;
  color: #0062ff;
  letter-spacing: 0.04em;
}

.vault-card-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.vault-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #5a6e8c;
  padding-top: 0.85rem;
  border-top: 1px solid #f2eee6;
}

.vault-guarantee-badge {
  color: #0062ff;
  font-weight: 600;
}

/* Order History Cards */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card-modern {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
  transition: border-color 0.2s ease;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
}

.order-card-modern:hover {
  border-color: #0062ff;
}

.order-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f2eee6;
}

.id-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.id-row b {
  font-family: var(--heading);
  font-size: 16px;
  font-weight: 700;
  color: #0062ff;
  letter-spacing: -0.015em;
}

.order-status-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  background: #eef5ff;
  color: #0062ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
}

.order-id-meta small {
  color: #5a6e8c;
  font-size: 13px;
}

.order-table-details {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-table-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.item-name-col strong {
  display: block;
  color: #0f224a;
  font-weight: 600;
}

.item-name-col small {
  color: #5a6e8c;
}

.item-price-col {
  font-weight: 700;
  color: #0062ff;
}

.license-key-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-md, 11px);
  padding: 0.85rem 1.25rem;
  margin: 0.5rem 0 1rem;
  gap: 1rem;
}

.key-label-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.key-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-pill, 9999px);
  background: #eef5ff;
  color: #0062ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
}

.license-code-display {
  font-family: ui-monospace, Menlo, Monaco, monospace;
  font-size: 15px;
  font-weight: 700;
  color: #0062ff;
}

.key-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.order-card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid #f2eee6;
}

.order-total-display {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
}

.order-total-display span {
  color: #5a6e8c;
  font-size: 13px;
}

.order-total-display strong {
  font-size: 18px;
  font-weight: 700;
  color: #0062ff;
}

/* Profile Form */
.profile-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 2rem;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
}

.form-grid-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

@media (max-width: 600px) {
  .form-grid-two {
    grid-template-columns: 1fr;
  }
}

.dark-form-label {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 13px;
  font-weight: 600;
  color: #0f224a;
  margin-bottom: 1rem;
}

.dark-input {
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-md, 11px);
  padding: 10px 14px;
  color: #0f224a;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}

.dark-input:focus {
  border-color: #0062ff;
  outline: 2px solid rgba(0, 98, 255, 0.2);
  outline-offset: 1px;
  background: #ffffff;
}

.profile-actions-bar {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #ebe6dc;
  display: flex;
  justify-content: flex-end;
}

/* Security & Stretchy Switch Panel */
.security-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 2rem;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
}

.security-card-title {
  font-family: var(--heading);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #0f224a;
  margin: 0 0 0.35rem;
}

.security-card-desc {
  font-size: 14px;
  color: #5a6e8c;
  margin: 0 0 1.5rem;
  line-height: 1.47;
}

.security-switches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-switch-row {
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-md, 11px);
  padding: 1.15rem 1.4rem;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.security-switch-row:hover {
  border-color: #0062ff;
  background: #ffffff;
}

.session-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f2eee6;
}

.session-row:last-child {
  border-bottom: none;
}

.session-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md, 11px);
  background: #eef5ff;
  color: #0062ff;
  border: 1px solid rgba(0, 98, 255, 0.15);
  display: grid;
  place-items: center;
}

.session-row b {
  display: block;
  color: #0f224a;
  font-size: 14px;
  font-weight: 600;
}

.session-row small {
  color: #5a6e8c;
  font-size: 12px;
}

.current-session-badge {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-pill, 9999px);
  background: #eef5ff;
  color: #0062ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
}

/* Modals */
.auth-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 34, 74, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 1000;
}

.auth-modal-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  width: 100%;
  max-width: 640px;
  padding: 2rem;
  box-shadow: 0 16px 40px rgba(0, 85, 187, 0.12);
  max-height: 90vh;
  overflow-y: auto;
}

.auth-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.auth-modal-header h3 {
  font-family: var(--heading);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #0f224a;
  margin: 0;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: #5a6e8c;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.modal-close-btn:hover {
  color: #0f224a;
}

.guide-key-banner {
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-md, 11px);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.guide-key-banner code {
  font-family: ui-monospace, Menlo, monospace;
  font-size: 16px;
  font-weight: 700;
  color: #0062ff;
}

.guide-steps {
  padding-left: 1.25rem;
  margin-bottom: 1.5rem;
}

.guide-steps li {
  margin-bottom: 1rem;
}

.guide-steps b {
  color: #0f224a;
  display: block;
  font-size: 14px;
  font-weight: 600;
}

.guide-steps p {
  color: #5a6e8c;
  font-size: 13px;
  margin: 0.25rem 0 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Invoice Mock */
.mock-invoice-paper {
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.invoice-paper-top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ebe6dc;
}

.invoice-paper-top strong {
  display: block;
  font-size: 15px;
  color: #0f224a;
  font-weight: 700;
}

.invoice-paper-top small {
  display: block;
  color: #5a6e8c;
  font-size: 12px;
}

.invoice-num-box {
  text-align: right;
}

.invoice-num-box span {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #0062ff;
}

.invoice-num-box b {
  display: block;
  font-size: 16px;
  color: #0f224a;
  font-weight: 700;
}

.invoice-customer-info {
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
  font-size: 14px;
}

.invoice-customer-info span {
  color: #5a6e8c;
  margin-right: 0.4rem;
}

.invoice-customer-info b {
  color: #0f224a;
  font-weight: 600;
}

.invoice-items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 1rem;
}

.invoice-items-table th,
.invoice-items-table td {
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid #ebe6dc;
  text-align: left;
}

.invoice-items-table th {
  color: #5a6e8c;
  font-weight: 700;
  font-size: 12px;
  background: #f6f3ec;
}

.text-right {
  text-align: right;
}

.digital-signature {
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-sm, 8px);
  padding: 0.75rem;
  font-size: 12px;
  color: #0062ff;
}

.digital-signature span {
  display: block;
  font-weight: 700;
}

.digital-signature small {
  display: block;
  color: #5a6e8c;
}

/* Empty State & Not logged */
.account-empty-card,
.not-logged-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
}

.empty-icon-wrap,
.not-logged-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-pill, 9999px);
  background: #eef5ff;
  color: #0062ff;
  display: grid;
  place-items: center;
  margin: 0 auto 1.25rem;
  border: 1px solid rgba(0, 98, 255, 0.2);
}

.account-empty-card h3,
.not-logged-card h2 {
  font-family: var(--heading);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #0f224a;
  margin: 0 0 0.5rem;
}

.account-empty-card p,
.not-logged-card p {
  color: #5a6e8c;
  font-size: 15px;
  max-width: 480px;
  margin: 0 auto 1.5rem;
  line-height: 1.47;
}

.quick-login-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 520px;
  margin: 0 auto;
}

.quick-login-card {
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-md, 11px);
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.15s ease, background-color 0.2s ease;
  text-align: left;
}

.quick-login-card:hover {
  border-color: #0062ff;
  background: #ffffff;
}

.quick-login-card:active {
  transform: scale(0.95);
}

.quick-login-card.admin-highlight {
  border-color: rgba(0, 98, 255, 0.25);
  background: #eef5ff;
}

.quick-login-card.admin-highlight:hover {
  border-color: #0062ff;
  background: #ffffff;
}

.quick-login-card b {
  display: block;
  color: #0f224a;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.quick-login-card small {
  color: #5a6e8c;
  font-size: 12px;
}

.mt-6 {
  margin-top: 1.5rem;
}
</style>
