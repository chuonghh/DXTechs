<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import { findSearchResults } from '../data/search.ts'

const route = useRoute()
const query = computed(() => typeof route.query.q === 'string' ? route.query.q.trim() : '')
const results = computed(() => findSearchResults(query.value))
</script>

<template>
  <div class="content-wrap search-results-view">
    <PageIntro
      eyebrow="TÌM KIẾM DXTECHS"
      :title="query ? `Kết quả cho “${query}”` : 'Tìm kiếm giải pháp số'"
      description="Tìm trong sản phẩm, danh mục dịch vụ, giải pháp triển khai, tài nguyên và nội dung trên website."
    />

    <div v-if="query" class="search-results-summary">
      <strong>{{ results.length }}</strong> kết quả phù hợp với <b>“{{ query }}”</b>
    </div>

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

    <div v-else class="search-results-empty">
      <span class="search-results-empty-icon" aria-hidden="true">⌕</span>
      <h2>{{ query ? 'Chưa tìm thấy kết quả phù hợp' : 'Nhập từ khóa để bắt đầu tìm kiếm' }}</h2>
      <p>{{ query ? 'Thử từ khóa khác như ERP, phần mềm, hosting, tên miền, SEO hoặc tài liệu.' : 'Bạn có thể tìm tên sản phẩm, danh mục, giải pháp hoặc nội dung hướng dẫn.' }}</p>
      <RouterLink class="button button-primary" to="/dich-vu">Khám phá danh mục dịch vụ</RouterLink>
    </div>
  </div>
</template>
