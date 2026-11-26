<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import ProductCard from '../components/ProductCard.vue'
import {
  getCategoryTree,
  listItemToLegacyProduct,
  listProducts,
  platformFromLabel,
  rootSlugMap,
  type CategoryNode,
  type ProductQuery,
} from '../api/catalog'
import { ApiError } from '../api'
import type { Product } from '../data/products'
import CategoryCarousel, { type CategoryCarouselItem } from '../components/CategoryCarousel.vue'

const route = useRoute()

// Dữ liệu từ API (PR-6): cây danh mục + danh sách sản phẩm theo bộ lọc. Danh mục, danh mục con, hệ điều hành,
// mức giá, từ khoá lọc ở SERVER; "nhu cầu" và "loại giấy phép" lọc trên tập đã tải (tối đa 100 — catalog nhỏ,
// giao diện chưa có phân trang).
const PAGE_SIZE = 100
const categoryTree = ref<CategoryNode[]>([])
const activeProductList = ref<Product[]>([])
const isLoading = ref(true)
const loadError = ref('')
let productsController: AbortController | undefined

const categories = computed(() =>
  categoryTree.value.map((node) => ({
    id: node.slug,
    name: node.name,
    description: node.description ?? '',
    subcategories: node.children.map((child) => child.name),
  })),
)
const subcategorySlugByName = computed(() => {
  const map = new Map<string, string>()
  categoryTree.value.forEach((root) => root.children.forEach((child) => map.set(child.name, child.slug)))
  return map
})

// 1. Reactive state quản lý danh mục con đang chọn ('all', 'Văn phòng', 'Thiết kế', 'Bảo mật', 'Lập trình'...)
const activeCategory = ref<string>(
  typeof route.query.subcategory === 'string' && route.query.subcategory
    ? route.query.subcategory
    : 'all'
)

// Reactive state quản lý danh mục chính (dành cho trang /dich-vu)
const selectedMainCategory = ref<string>(
  typeof route.query.category === 'string' && route.query.category
    ? route.query.category
    : 'all'
)

// Các bộ lọc bên trái (giữ nguyên tĩnh, không bị reset hay tải lại khi bấm tab danh mục)
const operatingSystem = ref('')
const need = ref('')
const license = ref('')
const maxPrice = ref('')

// Trạng thái tra cứu tên miền
const domainInput = ref('')
const domainChecked = ref<{ name: string; status: 'registered' | 'not-found' } | null>(null)
const domainCheckError = ref('')
const domainChecking = ref(false)
let domainLookupController: AbortController | undefined

const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const isSoftwarePage = computed(() => route.name === 'software')

// Danh mục chính hiện tại
const currentMainCategory = computed(() => {
  if (selectedMainCategory.value === 'all') return null
  return categories.value.find((item) => item.id === selectedMainCategory.value)
})

const isDomainCategory = computed(() => selectedMainCategory.value === 'domain')

// Danh sách danh mục con hiển thị theo ngữ cảnh
const visibleSubcategories = computed(() => {
  if (isSoftwarePage.value) {
    return categories.value.find((item) => item.id === 'software')?.subcategories ?? []
  }
  if (currentMainCategory.value) {
    return currentMainCategory.value.subcategories
  }
  return []
})

const pageTitle = computed(() => (isSoftwarePage.value ? 'Phần mềm bản quyền' : currentMainCategory.value?.name || 'Dịch vụ số'))
const pageDescription = computed(() =>
  isSoftwarePage.value
    ? 'Lựa chọn phần mềm đúng nhu cầu, rõ loại giấy phép, thời hạn và thiết bị tương thích.'
    : currentMainCategory.value?.description || 'Khám phá giải pháp số được tuyển chọn cho cá nhân và doanh nghiệp.'
)

// Hàm chọn danh mục con - cập nhật state reactive tại chỗ, không reload router hay tải lại khung
function selectCategory(cat: string) {
  activeCategory.value = cat
  syncUrlQuery()
}

// Hàm chọn danh mục chính (cho trang Dịch vụ số)
function selectMainCategory(catId: string) {
  selectedMainCategory.value = catId
  activeCategory.value = 'all'
  syncUrlQuery()
}

// Đồng bộ URL query ngầm (replaceState) để người dùng copy/refresh link vẫn giữ nguyên bộ lọc mà KHÔNG kích hoạt router reload
function syncUrlQuery() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)

  if (activeCategory.value && activeCategory.value !== 'all') {
    url.searchParams.set('subcategory', activeCategory.value)
  } else {
    url.searchParams.delete('subcategory')
  }

  if (!isSoftwarePage.value && selectedMainCategory.value && selectedMainCategory.value !== 'all') {
    url.searchParams.set('category', selectedMainCategory.value)
  } else {
    url.searchParams.delete('category')
  }

  window.history.replaceState(null, '', url.toString())
}

function handlePopState() {
  const params = new URLSearchParams(window.location.search)
  activeCategory.value = params.get('subcategory') || 'all'
  selectedMainCategory.value = params.get('category') || 'all'
}

onMounted(() => {
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})

// Chỉ reset bộ lọc khi chuyển hẳn sang một URL path khác (ví dụ: chuyển từ /dich-vu sang /phan-mem)
watch(
  () => route.path,
  () => {
    domainLookupController?.abort()
    domainLookupController = undefined
    activeCategory.value = typeof route.query.subcategory === 'string' && route.query.subcategory ? route.query.subcategory : 'all'
    selectedMainCategory.value = typeof route.query.category === 'string' && route.query.category ? route.query.category : 'all'
    operatingSystem.value = ''
    need.value = ''
    license.value = ''
    maxPrice.value = ''
    domainInput.value = ''
    domainChecked.value = null
    domainCheckError.value = ''
    domainChecking.value = false
  }
)

function resetFilters() {
  activeCategory.value = 'all'
  operatingSystem.value = ''
  need.value = ''
  license.value = ''
  maxPrice.value = ''
  syncUrlQuery()
}

function clearDomainResult() {
  domainLookupController?.abort()
  domainLookupController = undefined
  domainChecked.value = null
  domainCheckError.value = ''
  domainChecking.value = false
}

async function checkDomain() {
  const domain = domainInput.value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
  const validDomain = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/

  if (!validDomain.test(domain)) {
    clearDomainResult()
    domainCheckError.value = 'Vui lòng nhập tên miền hợp lệ, ví dụ: thuonghieu.vn'
    return
  }

  clearDomainResult()
  const controller = new AbortController()
  domainLookupController = controller
  domainChecking.value = true
  domainCheckError.value = ''
  let timedOut = false
  const timeoutId = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, 12000)

  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { Accept: 'application/rdap+json, application/json' },
      signal: controller.signal,
    })

    if (controller.signal.aborted) return

    if (response.status === 200) {
      domainChecked.value = { name: domain, status: 'registered' }
      return
    }

    if (response.status === 429) {
      domainCheckError.value = 'Dịch vụ tra cứu đang nhận quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.'
      return
    }

    if (response.status !== 404) {
      domainCheckError.value = 'Dịch vụ tra cứu tên miền đang gặp sự cố. Vui lòng thử lại sau.'
      return
    }

    const responseBody = await response.text()
    const payload: unknown = responseBody ? JSON.parse(responseBody) : null

    const errorTitle =
      typeof payload === 'object' && payload !== null && 'title' in payload && typeof payload.title === 'string'
        ? payload.title.toLowerCase()
        : ''
    const errorDescription =
      typeof payload === 'object' && payload !== null && 'description' in payload && typeof payload.description === 'string'
        ? payload.description.toLowerCase()
        : ''

    if (
      errorTitle.includes('no rdap service') ||
      errorDescription.includes('no rdap service') ||
      new URL(response.url).hostname === 'rdap.org'
    ) {
      domainCheckError.value = `Chưa thể tra cứu đuôi tên miền “.${domain.split('.').pop()}” qua cơ sở dữ liệu RDAP công khai. Vui lòng kiểm tra trực tiếp với nhà đăng ký tên miền.`
      return
    }

    domainChecked.value = { name: domain, status: 'not-found' }
  } catch (error) {
    if (controller.signal.aborted) {
      if (timedOut) domainCheckError.value = 'Dịch vụ tra cứu phản hồi quá lâu. Vui lòng thử lại sau.'
      return
    }
    domainCheckError.value =
      error instanceof TypeError
        ? 'Không thể kết nối dịch vụ tra cứu. Hãy kiểm tra kết nối Internet rồi thử lại.'
        : 'Không thể hoàn tất tra cứu tên miền. Vui lòng thử lại sau.'
  } finally {
    clearTimeout(timeoutId)
    if (domainLookupController === controller) {
      domainChecking.value = false
      domainLookupController = undefined
    }
  }
}

// Bộ lọc gửi lên server. Danh mục con được chọn thắng danh mục chính; trang /phan-mem luôn giới hạn trong "software".
function buildQuery(): ProductQuery {
  const query: ProductQuery = { pageSize: PAGE_SIZE }
  const subcategorySlug = activeCategory.value !== 'all' ? subcategorySlugByName.value.get(activeCategory.value) : undefined
  if (subcategorySlug) query.category = subcategorySlug
  else if (isSoftwarePage.value) query.category = 'software'
  else if (selectedMainCategory.value !== 'all') query.category = selectedMainCategory.value

  const platform = operatingSystem.value ? platformFromLabel(operatingSystem.value) : undefined
  if (platform) query.platform = platform
  if (maxPrice.value) query.maxPrice = Number(maxPrice.value)
  if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
  return query
}

async function loadProducts() {
  productsController?.abort()
  const controller = new AbortController()
  productsController = controller
  isLoading.value = true
  loadError.value = ''
  try {
    const roots = rootSlugMap(categoryTree.value)
    const page = await listProducts(buildQuery(), controller.signal)
    activeProductList.value = page.items.map((item) => listItemToLegacyProduct(item, roots))
  } catch (error) {
    if (controller.signal.aborted) return
    activeProductList.value = []
    // Danh mục trong URL không còn tồn tại (đã ẩn/đổi tên) ⇒ hiện trạng thái rỗng thay vì báo lỗi hệ thống.
    if (error instanceof ApiError && error.problem?.code === 'catalog.category_not_found') return
    loadError.value = error instanceof ApiError ? error.message : 'Không tải được danh sách sản phẩm.'
  } finally {
    if (productsController === controller) {
      isLoading.value = false
      productsController = undefined
    }
  }
}

async function loadCatalog() {
  try {
    categoryTree.value = await getCategoryTree()
  } catch (error) {
    // Không có cây danh mục vẫn hiển thị được sản phẩm (chỉ thiếu tab danh mục) — không chặn trang.
    loadError.value = error instanceof ApiError ? error.message : 'Không tải được danh mục.'
  }
  await loadProducts()
}

onMounted(loadCatalog)
onUnmounted(() => productsController?.abort())

watch([activeCategory, selectedMainCategory, operatingSystem, maxPrice, searchQuery, () => route.path], () => {
  if (categoryTree.value.length) void loadProducts()
})

// 2. Lọc phần còn lại trên tập đã tải từ server: nhu cầu (danh mục con) và loại giấy phép.
const filteredProducts = computed(() =>
  activeProductList.value.filter((product) => {
    const matchesNeed = !need.value || product.need === need.value
    const matchesLicense = !license.value || product.license === license.value
    return matchesNeed && matchesLicense
  }),
)

const needs = ['Văn phòng', 'Thiết kế', 'Bảo mật', 'Lập trình', 'Website', 'Thương hiệu', 'Lưu trữ', 'Sao lưu']

const isMobileFilterOpen = ref(true)

function toggleMobileFilter() {
  isMobileFilterOpen.value = !isMobileFilterOpen.value
}

const activeFiltersCount = computed(() => {
  let count = 0
  if (operatingSystem.value) count++
  if (need.value) count++
  if (license.value) count++
  if (maxPrice.value) count++
  return count
})

function setOperatingSystem(val: string) {
  operatingSystem.value = operatingSystem.value === val ? '' : val
}

function setNeed(val: string) {
  need.value = need.value === val ? '' : val
}

function setLicense(val: string) {
  license.value = license.value === val ? '' : val
}

function setMaxPrice(val: string) {
  maxPrice.value = maxPrice.value === val ? '' : val
}

function resetLeftFilters() {
  operatingSystem.value = ''
  need.value = ''
  license.value = ''
  maxPrice.value = ''
}

function formatPriceLabel(price: string) {
  if (price === '500000') return 'Đến 500.000₫'
  if (price === '1000000') return 'Đến 1.000.000₫'
  if (price === '2000000') return 'Đến 2.000.000₫'
  return price
}

const osList = [
  { label: 'Windows', value: 'Windows', icon: 'windows' },
  { label: 'macOS', value: 'macOS', icon: 'apple' },
  { label: 'Linux', value: 'Linux', icon: 'linux' },
]

const priceOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Đến 500k', value: '500000' },
  { label: 'Đến 1tr', value: '1000000' },
  { label: 'Đến 2tr', value: '2000000' },
]

const availableNeeds = computed(() => {
  const pool = activeProductList.value
  const poolNeeds = new Set(pool.map((p) => p.need))
  const filtered = needs.filter((n) => poolNeeds.has(n))
  return filtered.length > 0 ? filtered : needs
})

const availableLicenses = computed(() => {
  const pool = activeProductList.value
  return [...new Set(pool.map((product) => product.license))]
})

const productCategoryImages: Record<string, string> = {
  software: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  cloud: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
  domain: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  ssl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  storage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
  backup: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
}

const softwareSubcategoryImages: Record<string, string> = {
  'Hệ điều hành': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  'Văn phòng': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  'Thiết kế': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
  'Bảo mật': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  'Lập trình': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
}

const softwareSubcategoryDescriptions: Record<string, string> = {
  'Hệ điều hành': 'Hệ điều hành bản quyền chính hãng Windows, macOS, Linux an toàn và ổn định.',
  'Văn phòng': 'Ứng dụng văn phòng Microsoft 365, Office Home tối ưu hóa năng suất làm việc.',
  'Thiết kế': 'Bộ công cụ đồ họa, dựng phim và sáng tạo chuyên nghiệp Adobe, Autodesk.',
  'Bảo mật': 'Giải pháp diệt virus, tường lửa và bảo vệ điểm cuối doanh nghiệp tin cậy.',
  'Lập trình': 'Môi trường phát triển IDE, cơ sở dữ liệu và công cụ tối ưu cho lập trình viên.',
}

const catalogCarouselItems = computed<CategoryCarouselItem[]>(() => {
  if (isSoftwarePage.value) {
    const subs = categories.value.find((c) => c.id === 'software')?.subcategories || []
    return subs.map((sub) => ({
      id: sub,
      title: sub,
      eyebrow: 'PHẦN MỀM BẢN QUYỀN',
      description: softwareSubcategoryDescriptions[sub] || 'Phần mềm bản quyền chính hãng, hỗ trợ cài đặt và kích hoạt trọn gói.',
      image: softwareSubcategoryImages[sub] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      to: { name: 'software', query: { subcategory: sub } },
      ctaText: 'Khám phá ngay',
    }))
  }

  return categories.value.map((cat) => ({
    id: cat.id,
    title: cat.name,
    eyebrow: 'DỊCH VỤ SỐ',
    description: cat.description,
    image: productCategoryImages[cat.id] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    to: { name: 'services', query: { category: cat.id } },
    ctaText: 'Khám phá ngay',
  }))
})
</script>

<template>
  <div class="catalog-view content-wrap">
    <PageIntro category="Danh mục giải pháp số" :title="pageTitle" :description="pageDescription" />

    <!-- Synchronized Category Carousel Showcase -->
    <section class="catalog-carousel-section" aria-label="Danh mục nổi bật">
      <CategoryCarousel
        :items="catalogCarouselItems"
        :default-eyebrow="isSoftwarePage ? 'PHẦN MỀM BẢN QUYỀN' : 'DỊCH VỤ SỐ'"
      />
    </section>

    <div v-if="searchQuery" class="search-summary">
      Kết quả tìm kiếm cho <strong>“{{ searchQuery }}”</strong>
    </div>

    <!-- Danh mục chính (Dịch vụ số) -->
    <div v-if="!isSoftwarePage" class="catalog-category-tabs">
      <button
        type="button"
        :class="{ active: selectedMainCategory === 'all' }"
        @click="selectMainCategory('all')"
      >
        Tất cả
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        :class="{ active: selectedMainCategory === category.id }"
        @click="selectMainCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- Danh mục con (Tất cả, Văn phòng, Thiết kế, Bảo mật, Lập trình...) -->
    <div v-if="visibleSubcategories.length" class="catalog-subcategory-section">
      <span class="subcategory-heading">Danh mục chuyên ngành</span>
      <div class="catalog-subcategory-tabs" aria-label="Lọc theo danh mục con">
        <button
          type="button"
          :class="{ active: activeCategory === 'all' }"
          @click="selectCategory('all')"
        >
          Tất cả
        </button>
        <button
          v-for="subcategory in visibleSubcategories"
          :key="subcategory"
          type="button"
          :class="{ active: activeCategory === subcategory }"
          @click="selectCategory(subcategory)"
        >
          {{ subcategory }}
        </button>
      </div>
    </div>

    <!-- Tra cứu tên miền (khi chọn danh mục Tên miền) -->
    <section v-if="isDomainCategory" class="domain-checker" aria-labelledby="domain-checker-title">
      <div class="domain-checker-copy">
        <span class="domain-tag">Công cụ tra cứu</span>
        <h2 id="domain-checker-title">Tên miền này đã được đăng ký chưa?</h2>
        <p>Tra cứu bản ghi tên miền qua dịch vụ RDAP công khai, không cần nhập thông tin cá nhân.</p>
      </div>
      <form class="domain-checker-form" @submit.prevent="checkDomain">
        <label class="sr-only" for="domain-name">Tên miền cần kiểm tra</label>
        <input
          id="domain-name"
          v-model="domainInput"
          type="text"
          name="domain"
          autocomplete="url"
          placeholder="Ví dụ: thuonghieu.vn"
          aria-describedby="domain-lookup-note"
          :disabled="domainChecking"
          @input="clearDomainResult"
        />
        <button class="button button-primary" type="submit" :disabled="domainChecking">
          {{ domainChecking ? 'Đang kiểm tra...' : 'Kiểm tra' }}
        </button>
      </form>
      <p v-if="domainCheckError" class="domain-check-error" role="alert">{{ domainCheckError }}</p>
      <div
        v-else-if="domainChecked"
        class="domain-check-result"
        :class="{ 'is-registered': domainChecked.status === 'registered' }"
        aria-live="polite"
      >
        <strong>{{ domainChecked.name }}</strong>
        <span v-if="domainChecked.status === 'registered'">Đã có bản ghi RDAP — tên miền đã được đăng ký.</span>
        <span v-else>Không tìm thấy bản ghi RDAP — tên miền có thể chưa được đăng ký.</span>
      </div>
      <p id="domain-lookup-note" class="domain-demo-note">
        Tra cứu qua rdap.org. Kết quả RDAP có thể không khả dụng với một số đuôi tên miền; trạng thái “không tìm thấy” không đảm bảo tên miền còn trống, hãy xác nhận với nhà đăng ký trước khi mua.
      </p>
    </section>

    <!-- Khung chính: Bên trái bộ lọc cố định, bên phải danh sách sản phẩm động -->
    <div class="catalog-layout">
      <!-- 1. BỘ LỌC BÊN TRÁI: DẠNG PILLS/CHIPS HIỆN ĐẠI THEO TIÊU CHUẨN UI-UX-PRO-MAX -->
      <aside class="filter-panel" aria-label="Bộ lọc sản phẩm">
        <div class="filter-panel-header" @click="toggleMobileFilter">
          <div class="filter-panel-title">
            <svg class="filter-panel-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Bộ lọc sản phẩm</span>
            <span v-if="activeFiltersCount > 0" class="filter-count-badge" :aria-label="`${activeFiltersCount} bộ lọc đang chọn`">
              {{ activeFiltersCount }}
            </span>
          </div>
          <div class="filter-header-actions">
            <button
              v-if="activeFiltersCount > 0"
              type="button"
              class="filter-reset-btn"
              @click.stop="resetLeftFilters"
              title="Đặt lại các bộ lọc"
            >
              Đặt lại
            </button>
            <button
              type="button"
              class="filter-mobile-toggle"
              :aria-expanded="isMobileFilterOpen"
              aria-label="Thu gọn hoặc mở rộng bộ lọc"
            >
              <svg
                class="filter-chevron"
                :class="{ 'is-open': isMobileFilterOpen }"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        <div class="filter-panel-body" :class="{ 'is-collapsed-mobile': !isMobileFilterOpen }">
          <!-- 1. Hệ điều hành -->
          <div class="filter-group">
            <div class="filter-group-header">
              <span class="filter-group-title">Hệ điều hành</span>
              <span v-if="operatingSystem" class="filter-group-status">{{ operatingSystem }}</span>
            </div>
            <div class="filter-chip-list" role="group" aria-label="Lọc theo hệ điều hành">
              <button
                type="button"
                class="filter-chip"
                :class="{ active: !operatingSystem }"
                :aria-pressed="!operatingSystem"
                @click="setOperatingSystem('')"
              >
                Tất cả
              </button>
              <button
                v-for="os in osList"
                :key="os.value"
                type="button"
                class="filter-chip"
                :class="{ active: operatingSystem === os.value }"
                :aria-pressed="operatingSystem === os.value"
                @click="setOperatingSystem(os.value)"
              >
                <svg v-if="os.icon === 'windows'" class="chip-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.802" />
                </svg>
                <svg v-else-if="os.icon === 'apple'" class="chip-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.79 1.43-.59.68-1.11 1.76-1.01 2.81 1.07.08 2.17-.62 2.79-1.37z" />
                </svg>
                <svg v-else-if="os.icon === 'linux'" class="chip-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                <span>{{ os.label }}</span>
              </button>
            </div>
          </div>

          <!-- 2. Nhu cầu sử dụng -->
          <div class="filter-group">
            <div class="filter-group-header">
              <span class="filter-group-title">Nhu cầu sử dụng</span>
              <span v-if="need" class="filter-group-status">{{ need }}</span>
            </div>
            <div class="filter-chip-list" role="group" aria-label="Lọc theo nhu cầu sử dụng">
              <button
                type="button"
                class="filter-chip"
                :class="{ active: !need }"
                :aria-pressed="!need"
                @click="setNeed('')"
              >
                Tất cả
              </button>
              <button
                v-for="item in availableNeeds"
                :key="item"
                type="button"
                class="filter-chip"
                :class="{ active: need === item }"
                :aria-pressed="need === item"
                @click="setNeed(item)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <!-- 3. Mức giá tối đa -->
          <div class="filter-group">
            <div class="filter-group-header">
              <span class="filter-group-title">Mức giá tối đa</span>
              <span v-if="maxPrice" class="filter-group-status">{{ formatPriceLabel(maxPrice) }}</span>
            </div>
            <div class="filter-chip-list" role="group" aria-label="Lọc theo mức giá tối đa">
              <button
                v-for="opt in priceOptions"
                :key="opt.value"
                type="button"
                class="filter-chip"
                :class="{ active: maxPrice === opt.value }"
                :aria-pressed="maxPrice === opt.value"
                @click="setMaxPrice(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- 4. Loại giấy phép -->
          <div class="filter-group">
            <div class="filter-group-header">
              <span class="filter-group-title">Loại giấy phép</span>
              <span v-if="license" class="filter-group-status">{{ license }}</span>
            </div>
            <div class="filter-chip-list" role="group" aria-label="Lọc theo loại giấy phép">
              <button
                type="button"
                class="filter-chip"
                :class="{ active: !license }"
                :aria-pressed="!license"
                @click="setLicense('')"
              >
                Tất cả
              </button>
              <button
                v-for="item in availableLicenses"
                :key="item"
                type="button"
                class="filter-chip"
                :class="{ active: license === item }"
                :aria-pressed="license === item"
                @click="setLicense(item)"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <div class="filter-help">
            <span aria-hidden="true">?</span>
            <p>Chưa biết chọn gì?<RouterLink to="/lien-he"> Nhờ tư vấn</RouterLink></p>
          </div>
        </div>
      </aside>

      <!-- 2. KHUNG DANH SÁCH SẢN PHẨM BÊN PHẢI ĐƯỢC CẬP NHẬT MƯỢT MÀ -->
      <div class="catalog-results">
        <!-- Thanh hiển thị các tag đang lọc (Active filter pills) -->
        <div v-if="activeFiltersCount > 0" class="active-filters-summary">
          <span class="active-filters-title">Đang lọc:</span>
          <div class="active-tag-list">
            <button v-if="operatingSystem" type="button" class="active-tag-pill" @click="setOperatingSystem('')" title="Bỏ lọc Hệ điều hành">
              <span>HĐH: {{ operatingSystem }}</span>
              <span class="active-tag-x" aria-hidden="true">×</span>
            </button>
            <button v-if="need" type="button" class="active-tag-pill" @click="setNeed('')" title="Bỏ lọc Nhu cầu">
              <span>Nhu cầu: {{ need }}</span>
              <span class="active-tag-x" aria-hidden="true">×</span>
            </button>
            <button v-if="maxPrice" type="button" class="active-tag-pill" @click="setMaxPrice('')" title="Bỏ lọc Mức giá">
              <span>{{ formatPriceLabel(maxPrice) }}</span>
              <span class="active-tag-x" aria-hidden="true">×</span>
            </button>
            <button v-if="license" type="button" class="active-tag-pill" @click="setLicense('')" title="Bỏ lọc Loại giấy phép">
              <span>License: {{ license }}</span>
              <span class="active-tag-x" aria-hidden="true">×</span>
            </button>
            <button type="button" class="active-tag-clear" @click="resetLeftFilters">
              Xóa tất cả
            </button>
          </div>
        </div>

        <div class="results-bar">
          <span v-if="isLoading" aria-live="polite">Đang tải sản phẩm…</span>
          <span v-else aria-live="polite">{{ filteredProducts.length }} sản phẩm phù hợp</span>
          <span>Giá đã bao gồm thông tin thời hạn</span>
        </div>
        <div v-if="isLoading && !filteredProducts.length" class="product-grid" aria-busy="true">
          <div v-for="n in 6" :key="n" class="product-card product-card-skeleton" aria-hidden="true" />
        </div>
        <div v-else-if="loadError" class="empty-state" role="alert">
          <div class="empty-icon">!</div>
          <h2>Chưa tải được danh sách sản phẩm</h2>
          <p>{{ loadError }}</p>
          <button type="button" class="button button-primary" @click="loadCatalog">Thử lại</button>
        </div>
        <div v-else-if="filteredProducts.length" class="product-grid" :aria-busy="isLoading">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">⌕</div>
          <h2>Chưa tìm thấy sản phẩm phù hợp</h2>
          <p>Thử thay đổi từ khóa hoặc bộ lọc để xem thêm lựa chọn.</p>
          <button type="button" class="button button-primary" @click="resetFilters">Xóa bộ lọc</button>
        </div>
      </div>
    </div>

    <div class="catalog-legal">
      <span>✓</span> Thông tin giấy phép và điều kiện sử dụng được hiển thị trên trang chi tiết từng sản phẩm.
    </div>
  </div>
</template>

<style scoped>
.product-card-skeleton {
  min-height: 360px;
  border-radius: 16px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.12) 25%, rgba(148, 163, 184, 0.24) 37%, rgba(148, 163, 184, 0.12) 63%);
  background-size: 400% 100%;
  animation: catalog-skeleton 1.4s ease infinite;
}
@keyframes catalog-skeleton {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .product-card-skeleton { animation: none; }
}
</style>
