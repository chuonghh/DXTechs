<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import { findSearchResults, type SearchResult } from '../data/search.ts'
import { ApiError } from '../api'
import { searchProducts } from '../api/catalog'

const route = useRoute()
const query = computed(() => typeof route.query.q === 'string' ? route.query.q.trim() : '')

// Sản phẩm: tìm trên server (không dấu, khớp tiền tố, xếp theo độ liên quan — PR-6).
// Trang, giải pháp, tài nguyên, bài viết: nội dung tĩnh của website, vẫn tìm tại chỗ như trước.
const productResults = ref<SearchResult[]>([])
const productsLoading = ref(false)
const productsError = ref('')
let controller: AbortController | undefined

const contentResults = computed(() => findSearchResults(query.value).filter((result) => result.kind !== 'product'))
const results = computed(() => [...productResults.value, ...contentResults.value])

watch(query, async (q) => {
  controller?.abort()
  productResults.value = []
  productsError.value = ''
  // Không có chữ/số nào (chỉ ký tự đặc biệt) thì server trả 400 — bỏ qua, không gọi.
  if (!/[\p{L}\p{N}]/u.test(q)) return

  const current = new AbortController()
  controller = current
  productsLoading.value = true
  try {
    const page = await searchProducts(q, { pageSize: 20 }, current.signal)
    productResults.value = page.items.map((item) => ({
      id: `product-${item.slug}`,
      title: item.name,
      description: item.shortDescription ?? '',
      category: item.category.name,
      path: `/san-pham/${item.slug}`,
      imageUrl: item.imageUrl ?? undefined,
      price: item.minPriceVnd,
      badge: item.badge ?? undefined,
      kind: 'product',
    }))
  } catch (error) {
    if (current.signal.aborted) return
    productsError.value = error instanceof ApiError ? error.message : 'Không tìm được sản phẩm lúc này.'
  } finally {
    if (controller === current) {
      productsLoading.value = false
      controller = undefined
    }
  }
}, { immediate: true })

onUnmounted(() => controller?.abort())
</script>

<template>
  <div class="content-wrap search-results-view">
    <PageIntro
      eyebrow="TÌM KIẾM DXTECHS"
      :title="query ? `Kết quả cho “${query}”` : 'Tìm kiếm giải pháp số'"
      description="Tìm trong sản phẩm, danh mục dịch vụ, giải pháp triển khai, tài nguyên và nội dung trên website."
    />

    <div v-if="query" class="search-results-summary" aria-live="polite">
      <template v-if="productsLoading">Đang tìm sản phẩm…</template>
      <template v-else><strong>{{ results.length }}</strong> kết quả phù hợp với <b>“{{ query }}”</b></template>
    </div>

    <p v-if="productsError" class="search-results-summary" role="alert">
      Chưa tìm được sản phẩm: {{ productsError }} — các nội dung khác vẫn hiển thị bên dưới.
    </p>

    <div v-if="results.length" class="search-results-list">
      <RouterLink v-for="result in results" :key="result.id" class="search-result-card" :to="result.path">
        <img v-if="result.imageUrl" :src="result.imageUrl" :alt="result.title" loading="lazy" />
        <span v-else class="search-result-icon" aria-hidden="true">⌕</span>
        <span class="search-result-card-copy">
          <span class="search-result-card-category">{{ result.category }}<template v-if="result.badge"> · {{ result.badge }}</template></span>
          <strong>{{ result.title }}</strong>
          <span class="search-result-card-description">{{ result.description }}</span>
        </span>
        <span class="search-result-card-action">
          <strong v-if="result.price">{{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(result.price) }}</strong>
          <span aria-hidden="true">↗</span>
        </span>
      </RouterLink>
    </div>

    <div v-else-if="!productsLoading" class="search-results-empty">
      <span class="search-results-empty-icon" aria-hidden="true">⌕</span>
      <h2>{{ query ? 'Chưa tìm thấy kết quả phù hợp' : 'Nhập từ khóa để bắt đầu tìm kiếm' }}</h2>
      <p>{{ query ? 'Thử từ khóa khác như ERP, phần mềm, hosting, tên miền, SEO hoặc tài liệu.' : 'Bạn có thể tìm tên sản phẩm, danh mục, giải pháp hoặc nội dung hướng dẫn.' }}</p>
      <RouterLink class="button button-primary" to="/dich-vu">Khám phá danh mục dịch vụ</RouterLink>
    </div>
  </div>
</template>
