<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  solutionCategories,
  solutionCategoryPath,
  solutionSubcategoryPath,
} from '../data/solutions'
import { articles } from '../data/articles'

const heroSlides = [
  {
    eyebrow: 'ĐỐI TÁC CÔNG NGHỆ & CHUYỂN ĐỔI SỐ',
    title: 'Công nghệ số.',
    accent: 'Bứt phá quy mô.',
    description: 'Đội ngũ chuyên gia DXtechs đồng hành phát triển phần mềm may đo, tích hợp AI thông minh và tư vấn triển khai hệ thống quản trị chuyên sâu.',
    primaryLabel: 'Khám phá dịch vụ',
    primaryTo: '/giai-phap/dich-vu',
    secondaryLabel: 'Tư vấn triển khai',
    secondaryTo: '/giai-phap/tu-van-trien-khai',
    proof: ['Kiến trúc may đo linh hoạt', 'Đồng hành triển khai 1-1', 'Bảo mật tiêu chuẩn doanh nghiệp'],
    artLabel: 'Minh họa hệ sinh thái công nghệ DXtechs',
    footer: 'CÔNG NGHỆ MAY ĐO CHO DOANH NGHIỆP',
  },
  {
    eyebrow: 'GIẢI PHÁP PHẦN MỀM THEO QUY TRÌNH',
    title: 'Vận hành đồng bộ.',
    accent: 'Tăng trưởng vững vàng.',
    description: 'Thiết kế và phát triển hệ thống ERP, MES, MRP theo quy trình thực tế, kết nối dữ liệu xuyên suốt doanh nghiệp.',
    primaryLabel: 'Tư vấn triển khai ERP',
    primaryTo: '/giai-phap/tu-van-trien-khai/he-thong-erp',
    secondaryLabel: 'Xem giải pháp triển khai',
    secondaryTo: '/giai-phap/tu-van-trien-khai',
    proof: ['Phân tích quy trình', 'Tích hợp theo nhu cầu', 'Đồng hành triển khai'],
    artLabel: 'Minh họa hệ thống ERP, MES và MRP tích hợp',
    footer: 'KẾT NỐI TOÀN BỘ DOANH NGHIỆP',
  },
  {
    eyebrow: 'TỰ ĐỘNG HÓA THÔNG MINH',
    title: 'AI đồng hành.',
    accent: 'Quy trình tự động.',
    description: 'Ứng dụng AI Automation để giảm thao tác lặp lại, kết nối công cụ và hỗ trợ đội ngũ tập trung vào công việc giá trị hơn.',
    primaryLabel: 'Tư vấn AI Automation',
    primaryTo: '/giai-phap/dich-vu/tri-tue-nhan-tao-ai-va-phan-tich-du-lieu',
    secondaryLabel: 'Khám phá giải pháp AI',
    secondaryTo: '/giai-phap/dich-vu/tri-tue-nhan-tao-ai-va-phan-tich-du-lieu',
    proof: ['Tự động hóa linh hoạt', 'Tích hợp hệ thống', 'Kiểm soát quy trình'],
    artLabel: 'Minh họa luồng AI Automation cho doanh nghiệp',
    footer: 'TỰ ĐỘNG HÓA CÔNG VIỆC LẶP LẠI',
  },
]

const activeHeroSlide = ref(0)
let heroSlideTimer: ReturnType<typeof setInterval> | undefined
const currentHeroSlide = () => heroSlides[activeHeroSlide.value]

function showHeroSlide(index: number) {
  activeHeroSlide.value = (index + heroSlides.length) % heroSlides.length
}

function startHeroSlideTimer() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  heroSlideTimer = setInterval(() => showHeroSlide(activeHeroSlide.value + 1), 7000)
}

onMounted(startHeroSlideTimer)
onUnmounted(() => {
  if (heroSlideTimer) clearInterval(heroSlideTimer)
})

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

// Curated Unsplash images for implementation subcategories
const implImages = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
]

const implementationSubcategories = computed(() => {
  if (!implementationCategory.value) return []
  // Select top key pillars: ERP, MES, MRP, and AI Automation
  const priority = ['Hệ thống ERP', 'Hệ thống MES', 'Hệ thống MRP', 'AI và tự động hóa doanh nghiệp']
  return implementationCategory.value.subcategories.filter((s) => priority.includes(s.name))
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
    <!-- HERO CAROUSEL -->
    <section class="hero-section" aria-roledescription="carousel" aria-label="Giải pháp DXtechs">
      <div :key="activeHeroSlide" class="hero-content">
        <span class="eyebrow"><span class="eyebrow-dot"></span> {{ currentHeroSlide().eyebrow }}</span>
        <h1>{{ currentHeroSlide().title }}<br /><em>{{ currentHeroSlide().accent }}</em></h1>
        <p>{{ currentHeroSlide().description }}</p>
        <div class="hero-actions">
          <RouterLink class="button button-primary" :to="currentHeroSlide().primaryTo">{{ currentHeroSlide().primaryLabel }} <span>↗</span></RouterLink>
          <RouterLink class="button button-quiet" :to="currentHeroSlide().secondaryTo"><span class="play-icon">▶</span> {{ currentHeroSlide().secondaryLabel }}</RouterLink>
        </div>
        <div class="hero-proof">
          <span v-for="proof in currentHeroSlide().proof" :key="proof"><b>✓</b> {{ proof }}</span>
        </div>
      </div>
      <div :key="activeHeroSlide" class="hero-art" role="img" :aria-label="currentHeroSlide().artLabel">
        <template v-if="activeHeroSlide === 0">
          <div class="hero-orbit orbit-one"></div>
          <div class="hero-orbit orbit-two"></div>
          <div class="hero-panel panel-main">
            <div class="panel-top">
              <span class="mini-logo-frame"><img src="/dxtechs-logo.png" alt="DXtechs" /></span>
              <span class="panel-live"><i></i> HỆ THỐNG SẴN SÀNG</span>
            </div>
            <div class="panel-shield">✓</div>
            <strong>Công nghệ may đo.<br />Đồng hành tin cậy.</strong>
            <span class="panel-caption">Giải pháp số chuẩn hóa theo doanh nghiệp</span>
            <div class="panel-lines"><i></i><i></i><i></i></div>
          </div>
          <div class="floating-note note-license">
            <span>✓</span>
            <div><b>Chuyên gia thực chiến</b><small>Tư vấn giải pháp 1-1</small></div>
          </div>
          <div class="floating-note note-support">
            <span>♡</span>
            <div><b>Bảo hành & SLA 24/7</b><small>Hỗ trợ kỹ thuật chuyên sâu</small></div>
          </div>
          <div class="hero-sparkle sparkle-one">✳</div>
          <div class="hero-sparkle sparkle-two">✦</div>
        </template>
        <template v-else-if="activeHeroSlide === 1">
          <div class="hero-orbit orbit-one"></div>
          <div class="hero-orbit orbit-two"></div>
          <div class="erp-dashboard">
            <div class="erp-dashboard-top">
              <span class="erp-brand"><i></i> DXtechs <small>BUSINESS SUITE</small></span>
              <span class="erp-live"><i></i> ĐANG ĐỒNG BỘ</span>
            </div>
            <div class="erp-dashboard-heading">
              <b>Toàn cảnh vận hành</b>
              <small>Dữ liệu doanh nghiệp · Thời gian thực</small>
            </div>
            <div class="erp-metrics">
              <div><small>Đơn hàng</small><b>1.284</b><i>+12,8%</i></div>
              <div><small>Sản xuất</small><b>94%</b><i>Đúng tiến độ</i></div>
            </div>
            <div class="erp-chart">
              <span v-for="height in [35, 55, 42, 72, 50, 84, 64, 96, 74, 88]" :key="height" :style="{ height: `${height}%` }"></span>
            </div>
            <div class="erp-dashboard-footer">
              <span>ERP <i>Quản trị nguồn lực</i></span>
              <span>MES <i>Điều hành sản xuất</i></span>
              <span>MRP <i>Kế hoạch vật tư</i></span>
            </div>
          </div>
          <div class="floating-note erp-note-top">
            <span>↗</span>
            <div><b>Dữ liệu kết nối</b><small>Một nguồn thông tin thống nhất</small></div>
          </div>
          <div class="floating-note erp-note-bottom">
            <span>✓</span>
            <div><b>Quy trình rõ ràng</b><small>Thiết kế theo doanh nghiệp</small></div>
          </div>
          <div class="hero-sparkle sparkle-one">✳</div>
          <div class="hero-sparkle sparkle-two">✦</div>
        </template>
        <template v-else>
          <div class="hero-orbit orbit-one"></div>
          <div class="hero-orbit orbit-two"></div>
          <div class="ai-automation-board">
            <div class="ai-board-top">
              <span><i></i> DXtechs <small>AUTOMATION FLOW</small></span>
              <b><i></i> Quy trình đang chạy</b>
            </div>
            <div class="ai-flow">
              <div class="ai-flow-node"><span>✉</span><b>Tiếp nhận</b><small>Email / biểu mẫu</small></div>
              <i class="ai-flow-line"></i>
              <div class="ai-core"><span>AI</span><small>PHÂN TÍCH</small></div>
              <i class="ai-flow-line"></i>
              <div class="ai-flow-node"><span>↗</span><b>Tự động xử lý</b><small>Phân loại / phản hồi</small></div>
            </div>
            <div class="ai-board-status">
              <span>✓ Dữ liệu được xử lý theo quy tắc doanh nghiệp</span>
              <span>Hiệu suất <b>+38%</b></span>
            </div>
          </div>
          <div class="floating-note ai-note-top">
            <span>✦</span>
            <div><b>AI hỗ trợ thông minh</b><small>Giảm thao tác lặp lại</small></div>
          </div>
          <div class="floating-note ai-note-bottom">
            <span>↔</span>
            <div><b>Kết nối công cụ</b><small>Luồng việc liền mạch</small></div>
          </div>
          <div class="hero-sparkle sparkle-one">✳</div>
          <div class="hero-sparkle sparkle-two">✦</div>
        </template>
      </div>
      <div class="hero-side-note">
        <button type="button" class="hero-slide-arrow" aria-label="Slide trước" @click="showHeroSlide(activeHeroSlide - 1)">‹</button>
        <div class="hero-slide-dots" aria-label="Chọn slide">
          <button
            v-for="(slide, index) in heroSlides"
            :key="slide.eyebrow"
            type="button"
            :class="{ active: activeHeroSlide === index }"
            :aria-label="`Hiển thị slide ${index + 1}: ${slide.eyebrow}`"
            :aria-current="activeHeroSlide === index ? 'true' : undefined"
            @click="showHeroSlide(index)"
          ></button>
        </div>
        <span>0{{ activeHeroSlide + 1 }} — 0{{ heroSlides.length }}</span><i></i><span class="hero-slide-caption">{{ currentHeroSlide().footer }}</span>
        <button type="button" class="hero-slide-arrow" aria-label="Slide tiếp theo" @click="showHeroSlide(activeHeroSlide + 1)">›</button>
      </div>
    </section>

    <!-- TRUST STRIP -->
    <section class="trust-strip" aria-label="Cam kết dịch vụ">
      <div><span class="trust-icon">◈</span><p><b>Phát triển có trách nhiệm</b><small>Tư vấn đúng bài toán và lộ trình</small></p></div>
      <div><span class="trust-icon">⌁</span><p><b>Kiến trúc chuẩn mực</b><small>Mã nguồn rõ ràng, mở rộng linh hoạt</small></p></div>
      <div><span class="trust-icon">↗</span><p><b>Đồng hành chuyển giao</b><small>Đào tạo và hỗ trợ trực tiếp 24/7</small></p></div>
      <div><span class="trust-icon">◎</span><p><b>Bảo mật toàn diện</b><small>Cam kết NDA và an toàn dữ liệu</small></p></div>
    </section>

    <!-- SECTION 1: DỊCH VỤ CÔNG NGHỆ TRỌNG TÂM -->
    <section v-if="serviceCategory" class="section-block categories-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">HỆ SINH THÁI DỊCH VỤ SỐ</span>
          <h2>Dịch vụ công nghệ trọng tâm</h2>
        </div>
        <RouterLink class="text-link" :to="solutionCategoryPath(serviceCategory)">
          Xem tất cả dịch vụ <span>→</span>
        </RouterLink>
      </div>
      <div class="category-grid">
        <RouterLink
          v-for="(sub, index) in serviceCategory.subcategories"
          :key="sub.name"
          class="category-card"
          :to="solutionSubcategoryPath(serviceCategory, sub)"
        >
          <div class="category-card-image">
            <img
              :src="serviceImages[index % serviceImages.length]"
              :alt="`Hình minh họa ${sub.name}`"
              loading="lazy"
            />
            <span class="category-number">0{{ index + 1 }}</span>
          </div>
          <div class="category-card-content">
            <b>{{ sub.name }}</b>
            <p>{{ sub.description || 'Giải pháp công nghệ chuyên sâu theo quy trình và bài toán của doanh nghiệp.' }}</p>
            <div class="category-card-meta">
              <span>{{ sub.items.length }} hạng mục giải pháp</span>
              <span>{{ sub.items.slice(0, 2).join(' · ') }}</span>
            </div>
          </div>
          <span class="category-arrow" aria-hidden="true">↗</span>
        </RouterLink>
      </div>
    </section>

    <!-- SECTION 2: TƯ VẤN TRIỂN KHAI HỆ THỐNG -->
    <section v-if="implementationCategory" class="section-block categories-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">QUẢN TRỊ & VẬN HÀNH DOANH NGHIỆP</span>
          <h2>Tư vấn triển khai hệ thống</h2>
        </div>
        <RouterLink class="text-link" :to="solutionCategoryPath(implementationCategory)">
          Xem tất cả giải pháp triển khai <span>→</span>
        </RouterLink>
      </div>
      <div class="category-grid">
        <RouterLink
          v-for="(sub, index) in implementationSubcategories"
          :key="sub.name"
          class="category-card"
          :to="solutionSubcategoryPath(implementationCategory, sub)"
        >
          <div class="category-card-image">
            <img
              :src="implImages[index % implImages.length]"
              :alt="`Hình minh họa ${sub.name}`"
              loading="lazy"
            />
            <span class="category-number">0{{ index + 1 }}</span>
          </div>
          <div class="category-card-content">
            <b>{{ sub.name }}</b>
            <p>{{ sub.description || 'Chuẩn hóa quy trình vận hành và nâng cao năng lực quản trị doanh nghiệp.' }}</p>
            <div class="category-card-meta">
              <span>{{ sub.highlights ? sub.highlights[0] : 'Chuẩn hóa quy trình' }}</span>
              <span>{{ sub.highlights ? sub.highlights.slice(1, 3).join(' · ') : sub.items.slice(0, 2).join(' · ') }}</span>
            </div>
          </div>
          <span class="category-arrow" aria-hidden="true">↗</span>
        </RouterLink>
      </div>
    </section>

    <!-- LEGIT BANNER -->
    <section class="legit-banner">
      <div class="legit-seal">✓</div>
      <div>
        <span class="eyebrow">ĐỒNG HÀNH THỰC CHIẾN · BẢO ĐẢM KẾT QUẢ</span>
        <h2>Quy trình chuẩn mực,<br />vận hành tự tin.</h2>
        <p>Chúng tôi khảo sát hiện trạng thực tế, thiết kế giải pháp may đo và chuyển giao trọn gói đến khi đội ngũ làm chủ hệ thống.</p>
        <RouterLink class="button button-light" to="/gioi-thieu">Tìm hiểu cam kết của DXtechs <span>→</span></RouterLink>
      </div>
      <div class="legit-visual">
        <div class="license-card">
          <span class="license-logo-frame"><img src="/dxtechs-logo.png" alt="DXtechs" /></span>
          <span>DXTECHS ENTERPRISE</span>
          <strong>CONSULTING<br />& DEPLOYMENT</strong>
          <i>● PROFESSIONAL B2B SERVICE</i>
        </div>
        <div class="legit-orbit"></div>
      </div>
      <span class="legit-footnote">* Hỗ trợ kỹ thuật và cam kết SLA theo thỏa thuận dịch vụ</span>
    </section>

    <!-- ARTICLES PREVIEW -->
    <section class="section-block articles-preview">
      <div class="section-heading">
        <div>
          <span class="eyebrow">GÓC KIẾN THỨC & KINH NGHIỆM</span>
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
        <span class="eyebrow">CÙNG PHÁT TRIỂN TRONG KỶ NGUYÊN SỐ</span>
        <h2 id="client-showcase-title">Khách hàng & Đối tác đồng hành</h2>
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
