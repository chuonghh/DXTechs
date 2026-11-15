<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import LucianButton from '../components/LucianButton.vue'
import LucianCopyButton from '../components/LucianCopyButton.vue'
import LucianSegmented from '../components/LucianSegmented.vue'
import LucianSwitch from '../components/LucianSwitch.vue'
import LucianSideRail, { type SideRailItem } from '../components/LucianSideRail.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { categories, formatPrice, type Product } from '../data/products'
import { useShopStore, type DemoOrder } from '../stores/shop'

const shop = useShopStore()

const activeTab = ref<'dashboard' | 'products' | 'orders' | 'licenses' | 'customers'>('dashboard')

// Side Rail Items (Lucian UX/UI Prompt #040)
const sideRailItems = computed<SideRailItem[]>(() => [
  {
    id: 'dashboard',
    label: 'Tổng quan (KPIs)',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
  },
  {
    id: 'products',
    label: 'Quản lý sản phẩm',
    badge: shop.productList.length,
    badgeLabel: `${shop.productList.length} sản phẩm`,
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  },
  {
    id: 'orders',
    label: 'Quản lý đơn hàng',
    badge: shop.orders.length,
    badgeLabel: `${shop.orders.length} đơn hàng`,
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  },
  {
    id: 'licenses',
    label: 'Kho License Key',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/></svg>',
  },
  {
    id: 'customers',
    label: 'Khách hàng',
    badge: filteredCustomers.value?.length || 0,
    badgeLabel: `${filteredCustomers.value?.length || 0} khách hàng`,
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
])

// Automation System Switches
const autoIssueKey = ref(true)
const autoVerifyPayment = ref(true)
const alertTelegram = ref(true)
const sandboxGateway = ref(false)

// 1. Products Tab State & Pagination
const searchQuery = ref('')
const selectedCategoryFilter = ref('all')
const productPage = ref(1)
const productPageSize = ref(6)

const categorySegmentItems = computed(() => [
  { value: 'all', label: `Tất cả (${shop.productList.length})` },
  ...categories.map((c) => ({
    value: c.id,
    label: c.name,
    count: shop.productList.filter((p) => p.category === c.id).length,
  })),
])

// 2. Orders Tab State & Pagination
const orderSearchQuery = ref('')
const orderStatusFilter = ref('all')
const orderPage = ref(1)
const orderPageSize = ref(5)

const orderStatusSegments = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Đã cấp phép', label: 'Đã cấp phép' },
  { value: 'Đang xử lý', label: 'Đang xử lý' },
  { value: 'Đã hủy', label: 'Đã hủy' },
]

// 3. Licenses Tab State & Pagination
const licenseSearchQuery = ref('')
const licensePage = ref(1)
const licensePageSize = ref(6)

// 4. Customers Tab State & Pagination
const customerSearchQuery = ref('')
const customerPage = ref(1)
const customerPageSize = ref(6)

// Add product modal state
const showAddProductModal = ref(false)
const newProduct = reactive({
  name: '',
  category: 'software' as Product['category'],
  categoryLabel: 'Phần mềm bản quyền',
  imageUrl: '/products/software.svg',
  description: '',
  price: 490000,
  oldPrice: 790000,
  badge: 'Mới ra mắt',
  license: 'Giấy phép chính hãng',
  term: '12 tháng · 1 thiết bị',
  os: ['Windows', 'macOS'],
  need: 'Công việc',
  features: ['Bản quyền chính hãng kích hoạt online', 'Bảo hành trọn thời hạn', 'Hỗ trợ kỹ thuật 24/7'],
})

// Watch filters to auto-reset pagination
watch([searchQuery, selectedCategoryFilter], () => {
  productPage.value = 1
})
watch([orderSearchQuery, orderStatusFilter], () => {
  orderPage.value = 1
})
watch(licenseSearchQuery, () => {
  licensePage.value = 1
})
watch(customerSearchQuery, () => {
  customerPage.value = 1
})

// Metrics calculation
const totalRevenue = computed(() => shop.orders.reduce((sum, o) => sum + (o.status !== 'Đã hủy' ? o.total : 0), 0))
const totalOrdersCount = computed(() => shop.orders.length)
const pendingOrdersCount = computed(() => shop.orders.filter((o) => o.status === 'Đang xử lý').length)
const activeLicensesCount = computed(() => shop.orders.filter((o) => o.status === 'Đã cấp phép').length)

// Filtered & Paginated Products
const filteredProducts = computed(() => {
  return shop.productList.filter((p) => {
    const matchCat = selectedCategoryFilter.value === 'all' || p.category === selectedCategoryFilter.value
    const matchSearch = !searchQuery.value.trim() || p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || p.categoryLabel.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchSearch
  })
})
const paginatedProducts = computed(() => {
  const start = (productPage.value - 1) * productPageSize.value
  return filteredProducts.value.slice(start, start + productPageSize.value)
})

// Filtered & Paginated Orders
const filteredOrders = computed(() => {
  return shop.orders.filter((o) => {
    const matchStatus = orderStatusFilter.value === 'all' || o.status === orderStatusFilter.value
    const q = orderSearchQuery.value.trim().toLowerCase()
    const matchQuery = !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.licenseCode.toLowerCase().includes(q) ||
      o.items.some((i) => i.product.name.toLowerCase().includes(q))
    return matchStatus && matchQuery
  })
})
const paginatedOrders = computed(() => {
  const start = (orderPage.value - 1) * orderPageSize.value
  return filteredOrders.value.slice(start, start + orderPageSize.value)
})

// Filtered & Paginated Licenses
const filteredLicenses = computed(() => {
  return shop.orders.filter((o) => {
    const q = licenseSearchQuery.value.trim().toLowerCase()
    if (!q) return true
    return (
      o.licenseCode.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.items.some((i) => i.product.name.toLowerCase().includes(q))
    )
  })
})
const paginatedLicenses = computed(() => {
  const start = (licensePage.value - 1) * licensePageSize.value
  return filteredLicenses.value.slice(start, start + licensePageSize.value)
})

// Filtered & Paginated Customers
const filteredCustomers = computed(() => {
  return shop.orders.filter((o) => {
    const q = customerSearchQuery.value.trim().toLowerCase()
    if (!q) return true
    return (
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      (o.companyName && o.companyName.toLowerCase().includes(q)) ||
      (o.customerPhone && o.customerPhone.includes(q))
    )
  })
})
const paginatedCustomers = computed(() => {
  const start = (customerPage.value - 1) * customerPageSize.value
  return filteredCustomers.value.slice(start, start + customerPageSize.value)
})

function handleAddProductSubmit() {
  if (!newProduct.name.trim()) {
    alert('Vui lòng nhập tên sản phẩm')
    return
  }
  const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  shop.adminAddProduct({
    ...newProduct,
    slug,
  })
  showAddProductModal.value = false
  // Reset form
  newProduct.name = ''
  newProduct.description = ''
  newProduct.price = 490000
}

function handleStatusChange(order: DemoOrder, newStatus: 'Đã cấp phép' | 'Đang xử lý' | 'Đã hủy') {
  shop.adminUpdateOrderStatus(order.id, newStatus)
}

function deleteProduct(id: number, name: string) {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi danh mục?`)) {
    shop.adminDeleteProduct(id)
  }
}
</script>

<template>
  <div class="admin-layout">
    <!-- Admin Expanding Side Rail (Lucian UX/UI #040) -->
    <LucianSideRail
      v-model="activeTab"
      :items="sideRailItems"
      brand-name="DXTechs"
      brand-subtitle="DXTechs SaaS Hub"
      :user="{ name: 'Admin DXTechs', role: 'Super Admin' }"
      store-link="/"
      full-layout
      default-wide
    />

    <!-- Admin Main Content -->
    <main class="admin-main">
      <!-- Top header bar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <h1 class="topbar-heading">
            {{ activeTab === 'dashboard' ? 'Bảng Điều Khiển Tổng Quan' : activeTab === 'products' ? 'Quản Lý Danh Mục Sản Phẩm' : activeTab === 'orders' ? 'Danh Sách Đơn Hàng Khách Hàng' : activeTab === 'licenses' ? 'Kho Giấy Phép & License Keys' : 'Quản Lý Khách Hàng' }}
          </h1>
          <span class="topbar-sub">DXTechs Cloud & Software Licensing Hub · Light SaaS Console</span>
        </div>

        <div class="topbar-right">
          <LucianButton
            v-if="activeTab === 'products'"
            variant="primary"
            size="md"
            @click="showAddProductModal = true"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Thêm sản phẩm</span>
          </LucianButton>
          <div class="admin-user-pill">
            <span class="user-avatar-circle">AD</span>
            <div class="user-meta">
              <strong>Admin DXTechs</strong>
              <small>admin@dxtechs.vn</small>
            </div>
          </div>
        </div>
      </header>

      <!-- TAB 1: DASHBOARD -->
      <section v-if="activeTab === 'dashboard'" class="tab-pane">
        <!-- Automation System Controls (Lucian UX/UI Stretchy Switches) -->
        <div class="admin-card automation-card">
          <div class="card-header-flex">
            <div>
              <span class="eyebrow-cyan">HỆ THỐNG TỰ ĐỘNG HÓA &amp; AN NINH</span>
              <h3 class="automation-title">Cấu hình Vận hành Bản quyền Số Realtime (Lucian Controls)</h3>
            </div>
            <span class="system-status-chip">
              <span class="pulse-dot"></span>
              API Gateway Online · 99.99% SLA
            </span>
          </div>

          <div class="switches-grid">
            <div class="switch-box-item">
              <LucianSwitch
                v-model="autoIssueKey"
                subtext-off="Yêu cầu Admin xét duyệt thủ công"
                subtext-on="Tự động gửi key qua Email & Vault sau 3s"
              >
                <template #label>
                  <span class="switch-label-with-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: #0062ff; margin-right: 6px;">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                    <span>Tự động cấp phát License Key</span>
                  </span>
                </template>
              </LucianSwitch>
            </div>
            <div class="switch-box-item">
              <LucianSwitch
                v-model="autoVerifyPayment"
                label="Webhook đối soát VietQR / Thẻ"
                subtext-off="Kiểm tra sao kê ngân hàng bằng tay"
                subtext-on="Khớp mã giao dịch tự động 24/7"
              />
            </div>
            <div class="switch-box-item">
              <LucianSwitch
                v-model="alertTelegram"
                subtext-off="Chỉ ghi log vào hệ thống"
                subtext-on="Báo động tức thì tới ban vận hành"
              >
                <template #label>
                  <span class="switch-label-with-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: #0062ff; margin-right: 6px;">
                      <path d="m22 2-7 20-4-9-9-4Z"/>
                      <path d="M22 2 11 13"/>
                    </svg>
                    <span>Cảnh báo sự cố Telegram</span>
                  </span>
                </template>
              </LucianSwitch>
            </div>
            <div class="switch-box-item">
              <LucianSwitch
                v-model="sandboxGateway"
                label="Cổng thanh toán Sandbox Demo"
                subtext-off="Chế độ Live Production"
                subtext-on="Môi trường Sandbox kiểm thử an toàn"
              />
            </div>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon-wrap blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="kpi-data">
              <span class="kpi-label">Tổng doanh thu demo</span>
              <strong class="kpi-value">{{ formatPrice(totalRevenue) }}</strong>
              <span class="kpi-trend positive">+18.4% tháng này</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap cyan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
              </svg>
            </div>
            <div class="kpi-data">
              <span class="kpi-label">Tổng đơn hàng</span>
              <strong class="kpi-value">{{ totalOrdersCount }}</strong>
              <span class="kpi-trend">{{ pendingOrdersCount }} đơn đang xử lý</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap emerald">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div class="kpi-data">
              <span class="kpi-label">Bản quyền đã cấp</span>
              <strong class="kpi-value">{{ activeLicensesCount }} key</strong>
              <span class="kpi-trend positive">100% tự động</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="kpi-data">
              <span class="kpi-label">Khách hàng số</span>
              <strong class="kpi-value">182</strong>
              <span class="kpi-trend positive">32 B2B Enterprise</span>
            </div>
          </div>
        </div>

        <!-- Live Analytics & Category Revenue Distribution (UI/UX Pro Max Standard) -->
        <div class="admin-card analytics-breakdown-card">
          <div class="card-header-flex">
            <div>
              <span class="eyebrow-cyan">PHÂN TÍCH DOANH THU &amp; DANH MỤC</span>
              <h3 class="breakdown-title">Cơ cấu Doanh số &amp; Tỉ trọng Bản quyền Số</h3>
            </div>
            <div class="analytics-badges">
              <span class="analytics-badge-pill">
                <span class="pulse-dot"></span>
                Thời gian thực
              </span>
              <span class="analytics-badge-muted">30 ngày qua</span>
            </div>
          </div>

          <!-- Multi-segment Progress Bar -->
          <div class="distribution-bar-track" role="progressbar" aria-label="Tỉ trọng doanh thu theo mảng">
            <div class="bar-segment software" style="width: 58%;" title="Phần mềm bản quyền: 58%"></div>
            <div class="bar-segment cloud" style="width: 26%;" title="Hạ tầng Cloud &amp; Hosting: 26%"></div>
            <div class="bar-segment solution" style="width: 16%;" title="Giải pháp doanh nghiệp &amp; AI: 16%"></div>
          </div>

          <!-- Metric Breakdown Grid -->
          <div class="breakdown-legend-grid">
            <div class="legend-box software">
              <span class="legend-color-dot software"></span>
              <div class="legend-meta">
                <span class="legend-name">Phần mềm bản quyền</span>
                <strong class="legend-val">58% · 128 giấy phép</strong>
                <small class="legend-sub text-positive">+12.8% so với tháng trước</small>
              </div>
            </div>

            <div class="legend-box cloud">
              <span class="legend-color-dot cloud"></span>
              <div class="legend-meta">
                <span class="legend-name">Hạ tầng Cloud &amp; Hosting</span>
                <strong class="legend-val">26% · 42 máy chủ</strong>
                <small class="legend-sub text-positive">+8.4% tăng trưởng đều</small>
              </div>
            </div>

            <div class="legend-box solution">
              <span class="legend-color-dot solution"></span>
              <div class="legend-meta">
                <span class="legend-name">Giải pháp Doanh nghiệp</span>
                <strong class="legend-val">16% · 12 hợp đồng B2B</strong>
                <small class="legend-sub text-positive">Giá trị đơn trung bình cao</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders table in dashboard -->
        <div class="admin-card mt-6">
          <div class="card-header-flex">
            <h3>Đơn hàng mới nhất cần theo dõi</h3>
            <button class="btn-text-link" @click="activeTab = 'orders'">Xem tất cả đơn hàng →</button>
          </div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in shop.orders.slice(0, 5)" :key="order.id">
                  <td><code class="order-id-code">{{ order.id }}</code></td>
                  <td>
                    <strong>{{ order.customerName }}</strong>
                    <div class="text-muted text-xs">{{ order.customerEmail }}</div>
                  </td>
                  <td>{{ order.items.map((i) => i.product.name).join(', ') }}</td>
                  <td class="font-bold text-accent">{{ formatPrice(order.total) }}</td>
                  <td><span class="badge-payment">{{ order.paymentMethod }}</span></td>
                  <td>
                    <span
                      class="status-pill"
                      :class="{
                        success: order.status === 'Đã cấp phép',
                        warning: order.status === 'Đang xử lý',
                        danger: order.status === 'Đã hủy',
                      }"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <select
                      :value="order.status"
                      class="status-select"
                      @change="(e) => handleStatusChange(order, (e.target as HTMLSelectElement).value as any)"
                    >
                      <option value="Đã cấp phép">Đã cấp phép</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đã hủy">Hủy đơn</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- TAB 2: PRODUCTS MANAGER -->
      <section v-if="activeTab === 'products'" class="tab-pane">
        <div class="admin-filter-bar">
          <div class="search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm, danh mục..."
            />
          </div>

          <div class="filter-segmented-wrap">
            <LucianSegmented
              v-model="selectedCategoryFilter"
              :items="categorySegmentItems"
              ariaLabel="Lọc danh mục sản phẩm"
            />
          </div>
        </div>

        <div class="admin-card">
          <div v-if="paginatedProducts.length" class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá niêm yết</th>
                  <th>Thời hạn</th>
                  <th>Hệ điều hành</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in paginatedProducts" :key="product.id">
                  <td>
                    <div class="product-cell-flex">
                      <img :src="product.imageUrl" class="product-mini-thumb" :alt="product.name" />
                      <div>
                        <strong>{{ product.name }}</strong>
                        <div class="badge-tag-mini">{{ product.badge }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="cat-pill">{{ product.categoryLabel }}</span></td>
                  <td>
                    <strong class="text-accent">{{ formatPrice(product.price) }}</strong>
                    <div v-if="product.oldPrice" class="text-xs text-muted">
                      <del>{{ formatPrice(product.oldPrice) }}</del>
                    </div>
                  </td>
                  <td class="text-sm">{{ product.term }}</td>
                  <td>
                    <span v-for="os in product.os" :key="os" class="os-mini-tag">{{ os }}</span>
                  </td>
                  <td>
                    <LucianButton
                      variant="danger"
                      size="sm"
                      @click="deleteProduct(product.id, product.name)"
                    >
                      Xóa
                    </LucianButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin-empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h4 class="empty-state-title">Không tìm thấy sản phẩm phù hợp</h4>
            <p class="empty-state-desc">Hãy thử thay đổi từ khóa tìm kiếm hoặc lọc theo danh mục khác.</p>
            <LucianButton
              variant="outline"
              size="sm"
              @click="searchQuery = ''; selectedCategoryFilter = 'all'"
            >
              Đặt lại bộ lọc
            </LucianButton>
          </div>

          <!-- Awesome Pagination Bar -->
          <PaginationBar
            v-if="filteredProducts.length > 0"
            v-model:currentPage="productPage"
            v-model:pageSize="productPageSize"
            :totalItems="filteredProducts.length"
            :pageSizeOptions="[4, 6, 8, 12]"
            itemLabel="sản phẩm"
            theme="light"
            style="margin-top: 1.25rem;"
          />
        </div>
      </section>

      <!-- TAB 3: ORDERS MANAGER -->
      <section v-if="activeTab === 'orders'" class="tab-pane">
        <div class="admin-filter-bar">
          <div class="search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="orderSearchQuery"
              type="text"
              placeholder="Tìm theo mã đơn, khách hàng, email, license key..."
            />
          </div>

          <div class="filter-segmented-wrap">
            <LucianSegmented
              v-model="orderStatusFilter"
              :items="orderStatusSegments"
              ariaLabel="Lọc trạng thái đơn hàng"
            />
          </div>
        </div>

        <div class="admin-card">
          <div class="card-header-flex">
            <h3>Lịch sử đặt hàng khách hàng ({{ filteredOrders.length }} đơn)</h3>
          </div>
          <div v-if="paginatedOrders.length" class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Khách hàng</th>
                  <th>Chi tiết mặt hàng</th>
                  <th>License Key</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Duyệt đơn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in paginatedOrders" :key="order.id">
                  <td><code class="order-id-code">{{ order.id }}</code></td>
                  <td class="text-sm text-muted">{{ order.date }}</td>
                  <td>
                    <strong>{{ order.customerName }}</strong>
                    <div class="text-xs text-muted">{{ order.customerEmail }}</div>
                    <div v-if="order.customerPhone" class="text-xs text-cyan">{{ order.customerPhone }}</div>
                  </td>
                  <td>
                    <ul class="order-items-sublist">
                      <li v-for="item in order.items" :key="item.product.id">
                        {{ item.product.name }} (x{{ item.quantity }})
                      </li>
                    </ul>
                  </td>
                  <td>
                    <div class="license-copy-wrap">
                      <code class="license-key-tag">{{ order.licenseCode }}</code>
                      <LucianCopyButton
                        :text="order.licenseCode"
                        feedback-text="Đã chép Key!"
                      />
                    </div>
                  </td>
                  <td><strong class="text-accent">{{ formatPrice(order.total) }}</strong></td>
                  <td>
                    <span
                      class="status-pill"
                      :class="{
                        success: order.status === 'Đã cấp phép',
                        warning: order.status === 'Đang xử lý',
                        danger: order.status === 'Đã hủy',
                      }"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <select
                      :value="order.status"
                      class="status-select"
                      @change="(e) => handleStatusChange(order, (e.target as HTMLSelectElement).value as any)"
                    >
                      <option value="Đã cấp phép">Duyệt & Cấp Key</option>
                      <option value="Đang xử lý">Chờ thanh toán</option>
                      <option value="Đã hủy">Hủy đơn</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin-empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
            </svg>
            <h4 class="empty-state-title">Không tìm thấy đơn hàng nào</h4>
            <p class="empty-state-desc">Thử tìm kiếm với từ khóa khác hoặc bỏ lọc trạng thái.</p>
            <LucianButton
              variant="outline"
              size="sm"
              @click="orderSearchQuery = ''; orderStatusFilter = 'all'"
            >
              Đặt lại bộ lọc
            </LucianButton>
          </div>

          <!-- Awesome Pagination Bar -->
          <PaginationBar
            v-if="filteredOrders.length > 0"
            v-model:currentPage="orderPage"
            v-model:pageSize="orderPageSize"
            :totalItems="filteredOrders.length"
            :pageSizeOptions="[4, 5, 8, 10]"
            itemLabel="đơn hàng"
            theme="light"
            style="margin-top: 1.25rem;"
          />
        </div>
      </section>

      <!-- TAB 4: LICENSES VAULT -->
      <section v-if="activeTab === 'licenses'" class="tab-pane">
        <div class="admin-filter-bar">
          <div class="search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="licenseSearchQuery"
              type="text"
              placeholder="Tìm theo License Key, tên phần mềm hoặc khách hàng..."
            />
          </div>
        </div>

        <div class="admin-card">
          <div class="card-header-flex">
            <h3>Kho Giấy Phép &amp; License Keys Đã Cấp Phát ({{ filteredLicenses.length }})</h3>
          </div>
          <div v-if="paginatedLicenses.length" class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Mã License Key</th>
                  <th>Sản phẩm</th>
                  <th>Khách hàng sở hữu</th>
                  <th>Ngày cấp</th>
                  <th>Trạng thái kích hoạt</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in paginatedLicenses" :key="order.id">
                  <td>
                    <div class="license-copy-wrap">
                      <code class="license-key-highlight">{{ order.licenseCode }}</code>
                      <LucianCopyButton
                        :text="order.licenseCode"
                        feedback-text="Đã chép Key!"
                      />
                    </div>
                  </td>
                  <td>{{ order.items[0]?.product.name || 'Gói giải pháp số' }}</td>
                  <td>{{ order.customerName }} ({{ order.customerEmail }})</td>
                  <td class="text-sm text-muted">{{ order.date }}</td>
                  <td>
                    <span class="status-pill success">Hoạt động (Active)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin-empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h4 class="empty-state-title">Không tìm thấy giấy phép nào</h4>
            <p class="empty-state-desc">Thử tìm kiếm với từ khóa khác.</p>
            <LucianButton
              variant="outline"
              size="sm"
              @click="licenseSearchQuery = ''"
            >
              Xóa tìm kiếm
            </LucianButton>
          </div>

          <!-- Awesome Pagination Bar -->
          <PaginationBar
            v-if="filteredLicenses.length > 0"
            v-model:currentPage="licensePage"
            v-model:pageSize="licensePageSize"
            :totalItems="filteredLicenses.length"
            :pageSizeOptions="[4, 6, 8, 12]"
            itemLabel="giấy phép"
            theme="light"
            style="margin-top: 1.25rem;"
          />
        </div>
      </section>

      <!-- TAB 5: CUSTOMERS -->
      <section v-if="activeTab === 'customers'" class="tab-pane">
        <div class="admin-filter-bar">
          <div class="search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="customerSearchQuery"
              type="text"
              placeholder="Tìm theo tên khách hàng, email, công ty, số điện thoại..."
            />
          </div>
        </div>

        <div class="admin-card">
          <div class="card-header-flex">
            <h3>Danh Sách Khách Hàng Doanh Nghiệp &amp; Cá Nhân ({{ filteredCustomers.length }})</h3>
          </div>
          <div v-if="paginatedCustomers.length" class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Đơn vị / Doanh nghiệp</th>
                  <th>Đơn hàng</th>
                  <th>Hạng tài khoản</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in paginatedCustomers" :key="order.id">
                  <td><strong>{{ order.customerName }}</strong></td>
                  <td>{{ order.customerEmail }}</td>
                  <td>{{ order.customerPhone || '0971 798 186' }}</td>
                  <td>{{ order.companyName || 'Cá nhân' }}</td>
                  <td><span class="badge-count">1 đơn</span></td>
                  <td><span class="badge-vip">DX VIP Member</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin-empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            <h4 class="empty-state-title">Không tìm thấy khách hàng nào</h4>
            <p class="empty-state-desc">Thử tìm kiếm với từ khóa khác.</p>
            <LucianButton
              variant="outline"
              size="sm"
              @click="customerSearchQuery = ''"
            >
              Xóa tìm kiếm
            </LucianButton>
          </div>

          <!-- Awesome Pagination Bar -->
          <PaginationBar
            v-if="filteredCustomers.length > 0"
            v-model:currentPage="customerPage"
            v-model:pageSize="customerPageSize"
            :totalItems="filteredCustomers.length"
            :pageSizeOptions="[4, 6, 8, 12]"
            itemLabel="khách hàng"
            theme="light"
            style="margin-top: 1.25rem;"
          />
        </div>
      </section>
    </main>

    <!-- Modal Add Product -->
    <div v-if="showAddProductModal" class="modal-backdrop" @click="showAddProductModal = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-header">
          <h3>Thêm sản phẩm phần mềm mới</h3>
          <button type="button" class="btn-close" @click="showAddProductModal = false">✕</button>
        </div>
        <form class="modal-body" @submit.prevent="handleAddProductSubmit">
          <div class="form-group">
            <label>Tên sản phẩm (*)</label>
            <input v-model="newProduct.name" type="text" placeholder="VD: Docker Desktop Pro License" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Danh mục</label>
              <select v-model="newProduct.category">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Giá bán (VNĐ)</label>
              <input v-model.number="newProduct.price" type="number" min="10000" step="10000" required />
            </div>
          </div>

          <div class="form-group">
            <label>Mô tả ngắn</label>
            <textarea v-model="newProduct.description" rows="2" placeholder="Thông tin sản phẩm..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Thời hạn bản quyền</label>
              <input v-model="newProduct.term" type="text" placeholder="12 tháng · 1 thiết bị" />
            </div>
            <div class="form-group">
              <label>Huy hiệu (Badge)</label>
              <input v-model="newProduct.badge" type="text" placeholder="Bán chạy, Mới ra mắt..." />
            </div>
          </div>

          <div class="modal-footer">
            <LucianButton variant="secondary" @click="showAddProductModal = false">
              Hủy
            </LucianButton>
            <LucianButton variant="primary" type="submit">
              Lưu sản phẩm
            </LucianButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: #fbf9f5;
  color: #0f224a;
  font-family: var(--font-body, -apple-system, BlinkMacSystemFont, sans-serif);
}

/* Sidebar */
.admin-sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #ebe6dc;
  display: flex;
  flex-direction: column;
}

.admin-brand {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid #ebe6dc;
}

.admin-badge-tag {
  display: inline-block;
  background: #eef5ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
  color: #0062ff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  letter-spacing: -0.01em;
  margin-bottom: 0.35rem;
}

.admin-brand-title {
  font-family: var(--heading);
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #0f224a;
  letter-spacing: -0.015em;
}

.admin-nav {
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-pill, 9999px);
  color: #5a6e8c;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease;
  text-align: left;
}

.admin-nav-item:hover {
  background: #f4efe6;
  color: #0f224a;
}

.admin-nav-item:active {
  transform: scale(0.95);
}

.admin-nav-item.active {
  background: #0062ff;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 98, 255, 0.3);
}

.nav-count {
  margin-left: auto;
  font-size: 11px;
  background: #eef5ff;
  color: #0062ff;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid rgba(0, 98, 255, 0.2);
}

.admin-nav-item.active .nav-count {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  border-color: transparent;
}

.admin-sidebar-footer {
  padding: 1.25rem;
  border-top: 1px solid #ebe6dc;
}

.btn-back-store {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #0062ff;
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  padding: 0.65rem;
  border-radius: var(--radius-pill, 9999px);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}
.btn-back-store:hover {
  background: #0062ff;
  color: #ffffff;
  border-color: #0062ff;
}
.btn-back-store:active {
  transform: scale(0.95);
}

/* Main Content */
.admin-main {
  flex: 1;
  height: 100vh;
  max-height: 100vh;
  padding: 2rem;
  overflow-y: auto;
  background: #fbf9f5;
  scroll-behavior: smooth;
}

.admin-topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem 2rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #ebe6dc;
}

.topbar-left {
  flex: 1 1 340px;
  min-width: 280px;
}

.topbar-heading {
  font-family: var(--heading);
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: #0f224a;
  line-height: 1.2;
  letter-spacing: -0.015em;
}

.topbar-sub {
  color: #5a6e8c;
  font-size: 14px;
}

.topbar-nav-tabs {
  display: flex;
}

/* Automation Card & Lucian Switches */
.automation-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  box-shadow: 0 4px 20px rgba(0, 85, 187, 0.04);
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.automation-title {
  font-family: var(--heading);
  font-size: 17px;
  font-weight: 700;
  color: #0f224a;
  margin: 0.25rem 0 0;
  letter-spacing: -0.015em;
}

.eyebrow-cyan {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #0062ff;
  text-transform: uppercase;
}

.system-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: var(--radius-pill, 9999px);
  background: #eef5ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
  color: #0062ff;
  font-size: 12px;
  font-weight: 600;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-pill, 9999px);
  background: #0062ff;
}

.switches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f2eee6;
}

.switch-box-item {
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md, 11px);
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.switch-box-item:hover {
  background: #ffffff;
  border-color: #0062ff;
  box-shadow: 0 4px 14px rgba(0, 98, 255, 0.08);
}

.filter-segmented-wrap {
  display: flex;
  overflow-x: auto;
  max-width: 100%;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.btn-add-primary {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: #0062ff;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
  box-shadow: 0 4px 14px rgba(0, 98, 255, 0.3);
}
.btn-add-primary:hover {
  background: #004cc8;
}
.btn-add-primary:active {
  transform: scale(0.95);
}

.admin-user-pill {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: #ffffff;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid #ebe6dc;
  box-shadow: 0 2px 8px rgba(0, 85, 187, 0.04);
}

.user-avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-pill, 9999px);
  background: #0062ff;
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-meta strong {
  display: block;
  font-size: 13px;
  color: #0f224a;
  font-weight: 600;
}
.user-meta small {
  color: #5a6e8c;
  font-size: 12px;
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 4px 16px rgba(0, 85, 187, 0.04);
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.kpi-card:hover {
  border-color: #0062ff;
  transform: translateY(-2px);
}

.kpi-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md, 11px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef5ff;
  color: #0062ff;
  border: 1px solid rgba(0, 98, 255, 0.15);
}
.kpi-icon-wrap svg {
  stroke: currentColor;
  fill: none;
  width: 22px;
  height: 22px;
}
.kpi-icon-wrap.blue { background: #eef5ff; color: #0062ff; border-color: rgba(0, 98, 255, 0.2); }
.kpi-icon-wrap.cyan { background: #e0f7ff; color: #0088cc; border-color: rgba(0, 136, 204, 0.2); }
.kpi-icon-wrap.emerald { background: #ecfdf5; color: #059669; border-color: rgba(5, 150, 105, 0.2); }
.kpi-icon-wrap.purple { background: #eef2ff; color: #4f46e5; border-color: rgba(79, 70, 229, 0.2); }

.kpi-data {
  display: flex;
  flex-direction: column;
}

.kpi-label {
  font-size: 13px;
  color: #5a6e8c;
  margin-bottom: 0.25rem;
}

.kpi-value {
  font-family: var(--heading);
  font-size: 22px;
  font-weight: 700;
  color: #0f224a;
  letter-spacing: -0.015em;
}

.kpi-trend {
  font-size: 12px;
  color: #5a6e8c;
  margin-top: 0.25rem;
}
.kpi-trend.positive { color: #0062ff; font-weight: 600; }

/* Analytics Breakdown Card (UI/UX Pro Max) */
.analytics-breakdown-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
}

.breakdown-title {
  font-family: var(--heading);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #0f224a;
  margin: 0.25rem 0 0;
}

.analytics-badges {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.analytics-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-pill, 9999px);
  background: #eef5ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
  color: #0062ff;
  font-size: 12px;
  font-weight: 600;
}

.analytics-badge-muted {
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-pill, 9999px);
  background: #f6f3ec;
  color: #5a6e8c;
  font-size: 12px;
  font-weight: 500;
}

.distribution-bar-track {
  width: 100%;
  height: 10px;
  border-radius: var(--radius-pill, 9999px);
  background: #f0ecdf;
  display: flex;
  overflow: hidden;
  margin: 1.25rem 0 1.5rem;
  gap: 2px;
}

.bar-segment {
  height: 100%;
  transition: width 0.4s ease, opacity 0.2s ease;
}
.bar-segment:hover { opacity: 0.85; }
.bar-segment.software { background: #0062ff; }
.bar-segment.cloud { background: #00c2ff; }
.bar-segment.solution { background: #10b981; }

.breakdown-legend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.legend-box {
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-md, 11px);
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.legend-box:hover {
  border-color: #0062ff;
  transform: translateY(-2px);
  background: #ffffff;
}

.legend-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}
.legend-color-dot.software { background: #0062ff; box-shadow: 0 0 0 3px rgba(0, 98, 255, 0.2); }
.legend-color-dot.cloud { background: #00c2ff; box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.2); }
.legend-color-dot.solution { background: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); }

.legend-meta {
  display: flex;
  flex-direction: column;
}

.legend-name {
  font-size: 13px;
  color: #5a6e8c;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.legend-val {
  font-size: 15px;
  color: #0f224a;
  font-weight: 700;
}

.legend-sub {
  font-size: 12px;
  margin-top: 0.2rem;
}
.text-positive {
  color: #10b981;
  font-weight: 600;
}

/* Admin Card & Table */
.admin-card {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 18px rgba(0, 85, 187, 0.04);
}

.card-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.card-header-flex h3 {
  font-family: var(--heading);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 0;
  color: #0f224a;
}

.btn-text-link {
  background: transparent;
  border: none;
  color: #0062ff;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}
.btn-text-link:hover { text-decoration: underline; }

.table-responsive {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  padding: 0.85rem 1rem;
  font-size: 12px;
  text-transform: uppercase;
  color: #5a6e8c;
  background: #f6f3ec;
  border-bottom: 1px solid #ebe6dc;
  letter-spacing: 0.02em;
  font-weight: 700;
}

.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid #f2eee6;
  font-size: 14px;
  color: #0f224a;
}

.admin-table tbody tr:hover td {
  background-color: #faf8f4;
}

.order-id-code {
  background: #eef5ff;
  color: #0062ff;
  padding: 3px 8px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid rgba(0, 98, 255, 0.2);
  font-size: 13px;
  font-weight: 700;
  font-family: monospace;
}

.license-key-tag, .license-key-highlight {
  background: #eef5ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
  color: #0062ff;
  padding: 3px 8px;
  border-radius: var(--radius-sm, 8px);
  font-family: monospace;
  font-size: 13px;
  font-weight: 600;
}

.status-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 12px;
  font-weight: 600;
}
.status-pill.success { background: #eef5ff; color: #0062ff; border: 1px solid rgba(0, 98, 255, 0.25); }
.status-pill.warning { background: #fbf5ea; color: #b45309; border: 1px solid rgba(180, 83, 9, 0.2); }
.status-pill.danger { background: #faf3f3; color: #c2410c; border: 1px solid rgba(194, 65, 12, 0.2); }

.status-select {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  color: #0f224a;
  padding: 4px 8px;
  border-radius: var(--radius-sm, 8px);
  font-size: 13px;
  cursor: pointer;
  outline: none;
}
.status-select:focus {
  border-color: #0062ff;
  box-shadow: 0 0 0 2px rgba(0, 98, 255, 0.2);
}

.product-cell-flex {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.product-mini-thumb {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm, 8px);
  object-fit: cover;
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  box-shadow: 0 2px 8px rgba(0, 85, 187, 0.08);
}

.badge-tag-mini {
  display: inline-block;
  font-size: 11px;
  background: #eef5ff;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  color: #0062ff;
  font-weight: 600;
  border: 1px solid rgba(0, 98, 255, 0.2);
}

.os-mini-tag {
  display: inline-block;
  background: #fbf9f5;
  padding: 2px 6px;
  border-radius: var(--radius-sm, 8px);
  font-size: 11px;
  margin-right: 0.25rem;
  color: #5a6e8c;
  border: 1px solid #ebe6dc;
}

.btn-action-delete {
  background: #faf3f3;
  color: #c2410c;
  border: 1px solid rgba(194, 65, 12, 0.2);
  padding: 4px 10px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.btn-action-delete:hover {
  background: #c2410c;
  color: #ffffff;
}
.btn-action-delete:active {
  transform: scale(0.95);
}

.license-copy-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-copy-mini {
  background: #eef5ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
  color: #0062ff;
  padding: 3px 8px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}
.btn-copy-mini:hover {
  background: #0062ff;
  color: #ffffff;
}
.btn-copy-mini:active {
  transform: scale(0.95);
}

/* Empty State */
.admin-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1.5rem;
  text-align: center;
}

.empty-state-icon {
  width: 48px;
  height: 48px;
  color: #0062ff;
  opacity: 0.8;
  margin-bottom: 0.85rem;
}

.empty-state-title {
  font-family: var(--heading);
  font-size: 18px;
  font-weight: 700;
  color: #0f224a;
  margin: 0 0 0.35rem;
  letter-spacing: -0.015em;
}

.empty-state-desc {
  font-size: 14px;
  color: #5a6e8c;
  margin: 0 0 1.25rem;
  max-width: 400px;
}

.btn-reset-filter {
  background: #0062ff;
  border: none;
  color: #ffffff;
  padding: 8px 18px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.btn-reset-filter:hover {
  background: #004cc8;
}
.btn-reset-filter:active {
  transform: scale(0.95);
}

/* Filter bar */
.admin-filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  border: 1px solid #ebe6dc;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-pill, 9999px);
}
.search-input-wrap svg {
  color: #0062ff;
  flex-shrink: 0;
  stroke: currentColor;
  fill: none;
}
.search-input-wrap input {
  background: transparent;
  border: none;
  color: #0f224a;
  width: 100%;
}
.search-input-wrap input:focus { outline: none; }

.filter-select-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  border: 1px solid #ebe6dc;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill, 9999px);
  font-size: 13px;
}
.filter-select-wrap select {
  background: transparent;
  border: none;
  color: #0062ff;
  font-weight: 600;
  cursor: pointer;
}
.filter-select-wrap select:focus { outline: none; }

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 34, 74, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-dialog {
  background: #ffffff;
  border: 1px solid #ebe6dc;
  box-shadow: 0 16px 40px rgba(0, 85, 187, 0.12);
  width: 100%;
  max-width: 540px;
  border-radius: var(--radius-lg, 18px);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #ebe6dc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fbf9f5;
}
.modal-header h3 { margin: 0; font-family: var(--heading); font-size: 18px; font-weight: 700; color: #0f224a; letter-spacing: -0.015em; }

.btn-close {
  background: transparent;
  border: none;
  color: #5a6e8c;
  font-size: 1.1rem;
  cursor: pointer;
}
.btn-close:hover {
  color: #0f224a;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #ffffff;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.form-group label {
  font-size: 13px;
  color: #0f224a;
  font-weight: 600;
}
.form-group input, .form-group select, .form-group textarea {
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  color: #0f224a;
  padding: 10px 14px;
  border-radius: var(--radius-md, 11px);
  font-size: 14px;
  outline: none;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #0062ff;
  outline: 2px solid rgba(0, 98, 255, 0.2);
  outline-offset: 1px;
  background: #ffffff;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-secondary {
  background: #fbf9f5;
  border: 1px solid #ebe6dc;
  color: #5a6e8c;
  padding: 8px 18px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.btn-secondary:hover {
  background: #f2eee6;
  color: #0f224a;
}
.btn-secondary:active {
  transform: scale(0.95);
}

.btn-primary {
  background: #0062ff;
  border: none;
  color: #ffffff;
  padding: 8px 20px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
  box-shadow: 0 4px 12px rgba(0, 98, 255, 0.25);
}
.btn-primary:hover { background: #004cc8; }
.btn-primary:active { transform: scale(0.95); }

.badge-count {
  background: #eef5ff;
  color: #0062ff;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 12px;
  border: 1px solid rgba(0, 98, 255, 0.2);
}

.badge-vip {
  background: #eef5ff;
  color: #0062ff;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 12px;
  border: 1px solid rgba(0, 98, 255, 0.2);
}

.text-accent { color: #0062ff; }
.text-cyan { color: #0062ff; }
.text-muted { color: #5a6e8c; }
.text-xs { font-size: 12px; }
.font-bold { font-weight: 600; }
.mt-6 { margin-top: 1.5rem; }

.switch-label-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
