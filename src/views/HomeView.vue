<script setup lang="ts">
import { computed } from 'vue'
import {
  solutionCategories,
  solutionCategoryPath,
  solutionSubcategoryPath,
} from '../data/solutions'
import { articles } from '../data/articles'
import EditorialHero from '../components/EditorialHero.vue'
import CategoryCarousel, { type CategoryCarouselItem } from '../components/CategoryCarousel.vue'

// Categories from solutions.ts
const serviceCategory = computed(() => solutionCategories.find((c) => c.name === 'Dịch vụ'))
const implementationCategory = computed(() => solutionCategories.find((c) => c.name === 'Tư vấn triển khai'))

// Curated Unsplash images for services
const serviceImages = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
]

// Service carousel items mapped to standard Horizontal Card Carousel format
const serviceCarouselItems = computed<CategoryCarouselItem[]>(() => {
  if (!serviceCategory.value) return []
  return serviceCategory.value.subcategories.map((sub, index) => ({
    id: sub.name,
    title: sub.name,
    eyebrow: 'HỆ SINH THÁI DỊCH VỤ SỐ',
    description: sub.description || 'Giải pháp công nghệ chuyên sâu theo quy trình và bài toán của doanh nghiệp.',
    image: serviceImages[index % serviceImages.length],
    imageAlt: `Hình minh họa ${sub.name}`,
    to: solutionSubcategoryPath(serviceCategory.value!, sub),
    ctaText: 'Khám phá ngay',
  }))
})

// Specific custom content & images for implementation subcategories matching reference design
const implCardMetadata: Record<string, { title?: string; desc: string; image: string }> = {
  'Quản trị doanh nghiệp': {
    title: 'Quản trị doanh nghiệp',
    desc: 'Giải pháp quản trị toàn diện, tối ưu vận hành.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },
  'Kinh doanh và thương mại': {
    title: 'Kinh doanh và thương mại',
    desc: 'Kết nối thị trường, bứt phá doanh thu.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  'Sản xuất và chất lượng': {
    title: 'Sản xuất và chất lượng',
    desc: 'Nâng cao chất lượng, tối ưu sản xuất.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  'Vận hành và Logistics': {
    title: 'Vận hành và Logistics',
    desc: 'Tối ưu chuỗi cung ứng, vận hành hiệu quả.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  },
  'AI và tự động hóa doanh nghiệp': {
    title: 'AI và tự động hóa',
    desc: 'Ứng dụng công nghệ, kiến tạo tương lai.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
  'Hệ thống ERP': {
    title: 'Hệ thống ERP',
    desc: 'Tích hợp toàn diện các quy trình cốt lõi và dữ liệu doanh nghiệp.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  'Hệ thống MES': {
    title: 'Hệ thống MES',
    desc: 'Điều hành và kiểm soát hoạt động sản xuất tại xưởng theo thời gian thực.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
  },
  'Hệ thống MRP': {
    title: 'Hệ thống MRP',
    desc: 'Hoạch định và điều độ nhu cầu nguyên vật liệu thông minh.',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
  },
}

// Implementation carousel items ordered exactly as the user's reference mockup
const implementationCarouselItems = computed<CategoryCarouselItem[]>(() => {
  if (!implementationCategory.value) return []
  const order = [
    'Quản trị doanh nghiệp',
    'Kinh doanh và thương mại',
    'Sản xuất và chất lượng',
    'Vận hành và Logistics',
    'AI và tự động hóa doanh nghiệp',
    'Hệ thống ERP',
    'Hệ thống MES',
    'Hệ thống MRP',
  ]
  const list = [...implementationCategory.value.subcategories].sort((a, b) => {
    const idxA = order.indexOf(a.name)
    const idxB = order.indexOf(b.name)
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99)
  })

  return list.map((sub) => {
    const meta = implCardMetadata[sub.name]
    return {
      id: sub.name,
      title: meta?.title || sub.name,
      eyebrow: 'TƯ VẤN TRIỂN KHAI',
      description: meta?.desc || sub.description || 'Chuẩn hóa quy trình vận hành và nâng cao năng lực quản trị doanh nghiệp.',
      image: meta?.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      imageAlt: `Hình minh họa ${sub.name}`,
      to: solutionSubcategoryPath(implementationCategory.value!, sub),
      ctaText: 'Khám phá ngay',
    }
  })
})

const sampleCustomers = [
  { name: 'AN PHÁT STUDIO', type: 'Sáng tạo & thiết kế', mark: 'AP' },
  { name: 'MỘC NHIÊN', type: 'Bán lẻ & phong cách sống', mark: 'MN' },
  { name: 'NOVACARE', type: 'Chăm sóc sức khỏe', mark: 'NC' },
  { name: 'EDUBRIDGE', type: 'Giáo dục & đào tạo', mark: 'EB' },
  { name: 'GREENWAY', type: 'Giải pháp môi trường', mark: 'GW' },
  { name: 'BẾP NHÀ', type: 'Ẩm thực & nhà hàng', mark: 'BN' },
  { name: 'SAIGON CRAFT', type: 'Thương mại & thủ công', mark: 'SC' },
  { name: 'MÂY CLOUD', type: 'Công nghệ & dịch vụ số', mark: 'MC' },
]
</script>

<template>
  <div class="home-view">
    <!-- EDITORIAL UNSLOP HERO (KIẾN TẠO / NỀN TẢNG / CÔNG NGHỆ / TƯƠNG LAI) -->
    <EditorialHero />

    <!-- TRUST STRIP -->
    <section class="trust-strip" aria-label="Cam kết dịch vụ">
      <div>
        <span class="trust-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </span>
        <p><b>Phát triển có trách nhiệm</b><small>Tư vấn đúng bài toán và lộ trình</small></p>
      </div>
      <div>
        <span class="trust-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </span>
        <p><b>Kiến trúc chuẩn mực</b><small>Mã nguồn rõ ràng, mở rộng linh hoạt</small></p>
      </div>
      <div>
        <span class="trust-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </span>
        <p><b>Đồng hành chuyển giao</b><small>Đào tạo và hỗ trợ trực tiếp 24/7</small></p>
      </div>
      <div>
        <span class="trust-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </span>
        <p><b>Bảo mật toàn diện</b><small>Cam kết NDA và an toàn dữ liệu</small></p>
      </div>
    </section>

    <!-- SECTION 1: DỊCH VỤ CÔNG NGHỆ TRỌNG TÂM -->
    <section v-if="serviceCategory" class="section-block categories-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Hệ sinh thái dịch vụ số</span>
          <h2>Dịch vụ công nghệ trọng tâm</h2>
        </div>
        <RouterLink class="text-link" :to="solutionCategoryPath(serviceCategory)">
          Xem tất cả dịch vụ <span>→</span>
        </RouterLink>
      </div>
      <CategoryCarousel :items="serviceCarouselItems" default-eyebrow="HỆ SINH THÁI DỊCH VỤ SỐ" />
    </section>

    <!-- SECTION 2: TƯ VẤN TRIỂN KHAI HỆ THỐNG -->
    <section v-if="implementationCategory" class="section-block categories-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Quản trị &amp; vận hành doanh nghiệp</span>
          <h2>Tư vấn triển khai hệ thống</h2>
        </div>
        <RouterLink class="text-link" :to="solutionCategoryPath(implementationCategory)">
          Xem tất cả giải pháp triển khai <span>→</span>
        </RouterLink>
      </div>
      <CategoryCarousel :items="implementationCarouselItems" default-eyebrow="TƯ VẤN TRIỂN KHAI" />
    </section>

    <!-- LEGIT BANNER -->
    <section class="legit-banner">
      <div class="legit-seal" aria-hidden="true">✓</div>
      <div>
        <span class="eyebrow">Đồng hành thực chiến · Bảo đảm kết quả</span>
        <h2>Quy trình chuẩn mực,<br />vận hành tự tin.</h2>
        <p>Chúng tôi khảo sát hiện trạng thực tế, thiết kế giải pháp may đo và chuyển giao trọn gói đến khi đội ngũ làm chủ hệ thống.</p>
        <RouterLink class="button button-light" to="/gioi-thieu">Tìm hiểu cam kết của DXtechs <span>→</span></RouterLink>
      </div>
      <div class="legit-visual">
        <div class="license-card">
          <span class="license-logo-frame"><img src="/dxtechs-logo.png" alt="DXtechs" /></span>
          <span>DXTECHS ENTERPRISE</span>
          <strong>TƯ VẤN &amp;<br />TRIỂN KHAI MAY ĐO</strong>
          <i>● DỊCH VỤ DOANH NGHIỆP B2B</i>
        </div>
      </div>
      <span class="legit-footnote">* Hỗ trợ kỹ thuật và cam kết SLA theo thỏa thuận dịch vụ</span>
    </section>

    <!-- ARTICLES PREVIEW -->
    <section class="section-block articles-preview">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Góc kiến thức &amp; kinh nghiệm</span>
          <h2>Góc nhìn chuyên gia</h2>
          <p class="articles-intro">Các bài phân tích thực tế về quản trị doanh nghiệp, bảo mật hạ tầng và kinh nghiệm triển khai phần mềm.</p>
        </div>
        <RouterLink class="text-link" to="/tai-nguyen/goc-nhin/tin-tuc">Xem tất cả bài viết <span>→</span></RouterLink>
      </div>
      <div class="article-grid">
        <RouterLink v-for="(article, index) in articles" :key="article.slug" class="article-card" :to="`/tin-tuc/${article.slug}`">
          <div class="article-card-image">
            <img :src="article.imageUrl" :alt="article.imageAlt" loading="lazy" />
            <span>0{{ index + 1 }} / {{ article.label }}</span>
          </div>
          <div class="article-card-content">
            <h3>{{ article.title }}</h3>
            <p>{{ article.excerpt }}</p>
            <ul><li v-for="point in article.keyPoints" :key="point">{{ point }}</li></ul>
            <small>{{ article.readTime }} <span>Đọc chi tiết ↗</span></small>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- CLIENT SHOWCASE -->
    <section class="client-showcase" aria-labelledby="client-showcase-title">
      <div class="client-showcase-heading">
        <span class="eyebrow">Cùng phát triển trong kỷ nguyên số</span>
        <h2 id="client-showcase-title">Khách hàng &amp; Đối tác đồng hành</h2>
        <p>Một số thương hiệu và đối tác tiêu biểu cùng hợp tác phát triển giải pháp số.</p>
      </div>
      <div class="client-marquee" aria-label="Danh sách thương hiệu khách hàng minh họa">
        <div class="client-marquee-track">
          <ul class="client-marquee-group">
            <li v-for="customer in sampleCustomers" :key="customer.name" class="client-card">
              <span class="client-mark" aria-hidden="true">{{ customer.mark }}</span>
              <span class="client-card-copy"><b>{{ customer.name }}</b><small>{{ customer.type }}</small></span>
            </li>
          </ul>
          <ul class="client-marquee-group" aria-hidden="true">
            <li v-for="customer in sampleCustomers" :key="customer.name" class="client-card">
              <span class="client-mark">{{ customer.mark }}</span>
              <span class="client-card-copy"><b>{{ customer.name }}</b><small>{{ customer.type }}</small></span>
            </li>
          </ul>
        </div>
      </div>
      <p class="client-showcase-note">Tên thương hiệu và nội dung trình bày là dữ liệu minh họa cho năng lực triển khai.</p>
    </section>
  </div>
</template>
