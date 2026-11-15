<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import LucianButton from '../components/LucianButton.vue'
import PageIntro from '../components/PageIntro.vue'
import { articles } from '../data/articles.ts'
import { resourceSections } from '../data/resources.ts'
import { useShopStore } from '../stores/shop.ts'

const route = useRoute()
const shop = useShopStore()

const section = computed(() => String(route.params.section || ''))
const topic = computed(() => String(route.params.topic || ''))

const searchQuery = ref('')
const selectedGlossaryCategory = ref('all')

const books = [
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    detail: 'Tư duy thử nghiệm tinh gọn, kiểm chứng giả thuyết sản phẩm và rút ngắn chu kỳ phát triển cho doanh nghiệp công nghệ.',
    link: 'https://books.google.com/books?q=The+Lean+Startup+Eric+Ries',
    label: 'Khởi nghiệp & Sản phẩm',
    tag: 'Bán chạy toàn cầu',
    pages: '336 trang',
    color: '#0066cc',
  },
  {
    title: 'Inspired: How to Create Tech Products Customers Love',
    author: 'Marty Cagan',
    detail: 'Phương pháp xây dựng sản phẩm công nghệ lấy khách hàng làm trọng tâm từ các tập đoàn công nghệ hàng đầu thế giới.',
    link: 'https://books.google.com/books?q=Inspired+Marty+Cagan',
    label: 'Quản trị sản phẩm',
    tag: 'Chuyên gia khuyên đọc',
    pages: '368 trang',
    color: '#2997ff',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    detail: 'Kiến thức nền tảng và chuyên sâu về hệ thống dữ liệu lớn, kiến trúc phân tán, độ tin cậy và khả năng mở rộng của ứng dụng.',
    link: 'https://books.google.com/books?q=Designing+Data-Intensive+Applications',
    label: 'Kiến trúc & Kỹ thuật',
    tag: 'Kỹ sư phần mềm',
    pages: '616 trang',
    color: '#0066cc',
  },
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    detail: 'Các nguyên lý, mẫu hình thiết kế và kỹ thuật viết mã sạch, dễ bảo trì, dễ kiểm thử cho lập trình viên chuyên nghiệp.',
    link: 'https://books.google.com/books?q=Clean+Code+Robert+C+Martin',
    label: 'Lập trình chuyên nghiệp',
    tag: 'Kinh điển',
    pages: '464 trang',
    color: '#0066cc',
  },
]

const downloads = [
  {
    title: 'Bảng Tra Cứu Tối Ưu SEO Kỹ Thuật (SEO Technical Cheat Sheet)',
    detail: 'Checklist toàn diện rà soát Core Web Vitals, Schema markup, robots.txt, canonical và tối ưu cấu trúc website doanh nghiệp.',
    link: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
    label: 'Google Search Central',
    format: 'PDF · 4.2 MB',
    downloads: '1.240 lượt tải',
  },
  {
    title: 'Cẩm Nang Hiệu Năng & Khả Năng Truy Cập Web 2026',
    detail: 'Tài liệu hướng dẫn tối ưu thời gian tải trang, Lighthouse 100/100, tối ưu hình ảnh và khả năng truy cập (a11y).',
    link: 'https://web.dev/learn/',
    label: 'Web.dev & Google',
    format: 'Ebook PDF · 6.8 MB',
    downloads: '980 lượt tải',
  },
  {
    title: 'OWASP Top 10 — Hướng Dẫn Phòng Ngừa Lỗ Hổng Bảo Mật Web',
    detail: 'Tổng hợp 10 nhóm rủi ro an ninh mạng phổ biến nhất và giải pháp mã hóa, phòng vệ từ các chuyên gia an toàn thông tin.',
    link: 'https://owasp.org/www-project-top-ten/',
    label: 'OWASP Foundation',
    format: 'Whitepaper PDF · 3.5 MB',
    downloads: '2.150 lượt tải',
  },
  {
    title: 'Sổ Tay Kiến Trúc Điện Toán Đám Mây & Microservices',
    detail: 'Mô hình triển khai Cloud, container Docker, Kubernetes và thiết kế hệ thống có tính sẵn sàng cao (High Availability).',
    link: 'https://vuejs.org/guide/introduction.html',
    label: 'DXTechs Architecture',
    format: 'Tài liệu PDF · 8.1 MB',
    downloads: '1.820 lượt tải',
  },
]

const glossary = [
  { term: 'API', fullName: 'Application Programming Interface', description: 'Giao diện lập trình ứng dụng giúp các hệ thống trao đổi dữ liệu và thực thi tác vụ với nhau một cách bảo mật.', category: 'Phần mềm' },
  { term: 'Cloud Computing', fullName: 'Điện toán đám mây', description: 'Mô hình cung cấp tài nguyên máy chủ, mạng, lưu trữ và dịch vụ qua Internet theo nhu cầu thực tế.', category: 'Hạ tầng' },
  { term: 'SaaS', fullName: 'Software as a Service', description: 'Mô hình phân phối phần mềm qua đám mây, người dùng trả phí định kỳ và truy cập qua trình duyệt mà không cần cài đặt phức tạp.', category: 'Giải pháp' },
  { term: 'PaaS', fullName: 'Platform as a Service', description: 'Nền tảng đám mây cung cấp môi trường hoàn chỉnh để phát triển, chạy và quản lý ứng dụng mà không cần quản trị máy chủ bên dưới.', category: 'Hạ tầng' },
  { term: 'CI/CD', fullName: 'Continuous Integration / Continuous Delivery', description: 'Quy trình tự động hóa tích hợp mã nguồn, kiểm thử tự động và triển khai phần mềm liên tục lên môi trường sản xuất.', category: 'DevOps' },
  { term: 'SSL / TLS', fullName: 'Secure Sockets Layer / Transport Layer Security', description: 'Giao thức mã hóa dữ liệu giữa trình duyệt người dùng và máy chủ web, đảm bảo thông tin cá nhân và thanh toán không bị đánh cắp.', category: 'Bảo mật' },
  { term: 'CDN', fullName: 'Content Delivery Network', description: 'Mạng lưới máy chủ phân tán toàn cầu lưu trữ bản sao dữ liệu tĩnh, giúp website tải nhanh hơn đối với người dùng ở mọi vị trí địa lý.', category: 'Hạ tầng' },
  { term: 'ERP', fullName: 'Enterprise Resource Planning', description: 'Hệ thống hoạch định nguồn lực doanh nghiệp, kết nối tài chính, nhân sự, chuỗi cung ứng và bán hàng trên một cơ sở dữ liệu duy nhất.', category: 'Doanh nghiệp' },
  { term: 'CRM', fullName: 'Customer Relationship Management', description: 'Hệ thống quản lý thông tin khách hàng, quy trình bán hàng và chăm sóc hậu mãi giúp tối ưu hóa doanh thu.', category: 'Doanh nghiệp' },
  { term: 'CMS', fullName: 'Content Management System', description: 'Hệ quản trị nội dung giúp doanh nghiệp tạo, chỉnh sửa và xuất bản nội dung số lên website dễ dàng không cần biết lập trình.', category: 'Website' },
  { term: 'SEO', fullName: 'Search Engine Optimization', description: 'Tối ưu hóa công cụ tìm kiếm giúp website cải thiện thứ hạng tự nhiên trên Google, thu hút lượt truy cập khách hàng tiềm năng.', category: 'Marketing' },
  { term: 'Docker & K8s', fullName: 'Containers & Kubernetes', description: 'Công nghệ đóng gói ứng dụng độc lập trong các container và hệ thống điều phối tự động giúp mở rộng linh hoạt theo quy mô.', category: 'DevOps' },
]

const glossaryCategories = ['all', 'Phần mềm', 'Hạ tầng', 'Giải pháp', 'DevOps', 'Bảo mật', 'Doanh nghiệp']

const selectedSection = computed(() => resourceSections.find((item) => item.slug === section.value))
const selectedTopic = computed(() => selectedSection.value?.topics.find((item) => item.slug === topic.value))
const title = computed(() => selectedTopic.value?.name || selectedSection.value?.name || 'Kho Tài Nguyên DXTechs')
const intro = computed(() => selectedTopic.value?.description || selectedSection.value?.description || 'Tuyển tập tài liệu kỹ thuật, sách chuyên ngành, cẩm nang tải về và từ điển thuật ngữ CNTT chuẩn mực.')
const isNewsPage = computed(() => section.value === 'goc-nhin' && topic.value === 'tin-tuc')

const filteredGlossary = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return glossary.filter((item) => {
    const matchesCategory = selectedGlossaryCategory.value === 'all' || item.category === selectedGlossaryCategory.value
    const matchesQuery = !query
      || item.term.toLowerCase().includes(query)
      || item.fullName.toLowerCase().includes(query)
      || item.description.toLowerCase().includes(query)
      || item.category.toLowerCase().includes(query)
    return matchesCategory && matchesQuery
  })
})

function triggerDownload(itemTitle: string) {
  shop.notify(`Đang tải xuống tài liệu: ${itemTitle}`)
}

// License Key Verifier Simulator
const verifyKeyInput = ref('')
const verifyState = ref<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
const verifiedInfo = ref<{ product: string; type: string; status: string } | null>(null)

function runLicenseCheck() {
  const key = verifyKeyInput.value.trim()
  if (!key) return
  verifyState.value = 'checking'
  setTimeout(() => {
    if (key.length >= 10 && (key.includes('-') || key.length === 25)) {
      verifyState.value = 'valid'
      verifiedInfo.value = {
        product: key.toUpperCase().includes('WIN') ? 'Windows 11 Pro Retail' : 'Microsoft 365 Family CSP',
        type: 'Chính hãng (Official ESD License)',
        status: 'Kích hoạt trực tuyến thành công · 100% Hợp lệ',
      }
    } else {
      verifyState.value = 'invalid'
      verifiedInfo.value = null
    }
  }, 450)
}

function pasteSampleKey(sample: string) {
  verifyKeyInput.value = sample
  runLicenseCheck()
}
</script>

<template>
  <div class="content-wrap resource-view">
    <PageIntro eyebrow="DXTECHS · KHO TRI THỨC SỐ" :title="title" :description="intro" />

    <!-- Subcategory Tabs Navigation -->
    <div class="resource-nav-bar">
      <RouterLink to="/tai-nguyen" class="resource-tab" :class="{ active: !section }">Tất cả tài nguyên</RouterLink>
      <RouterLink to="/tai-nguyen/tai-lieu" class="resource-tab" :class="{ active: section === 'tai-lieu' && !topic }">Tài Liệu</RouterLink>
      <RouterLink to="/tai-nguyen/tai-lieu/sach" class="resource-tab" :class="{ active: section === 'tai-lieu' && topic === 'sach' }">
        <svg class="tab-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 5px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        <span>Sách chuyên khảo 3D</span>
      </RouterLink>
      <RouterLink to="/tai-nguyen/tai-lieu/download" class="resource-tab" :class="{ active: section === 'tai-lieu' && topic === 'download' }">
        <svg class="tab-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 5px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        <span>File Tải Về</span>
      </RouterLink>
      <RouterLink to="/tai-nguyen/goc-nhin/thuat-ngu-cntt" class="resource-tab" :class="{ active: section === 'goc-nhin' && topic === 'thuat-ngu-cntt' }">
        <svg class="tab-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 5px;"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
        <span>Thuật ngữ CNTT</span>
      </RouterLink>
      <RouterLink to="/tai-nguyen/goc-nhin/tin-tuc" class="resource-tab" :class="{ active: isNewsPage }">
        <svg class="tab-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 5px;"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
        <span>Tin tức &amp; Xu hướng</span>
      </RouterLink>
    </div>

    <!-- Interactive License Integrity Checker Simulator Strip -->
    <section class="license-verifier-widget-3d" aria-labelledby="verifier-title">
      <div class="verifier-content">
        <span class="eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 6px; color: #0062ff;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          TIỆN ÍCH TRỰC TUYẾN
        </span>
        <h2 id="verifier-title">Kiểm tra tính toàn vẹn của mã bản quyền (License Key Verifier)</h2>
        <p>Mô phỏng xác thực định dạng Product Key thông qua cổng đối chiếu Microsoft CSP &amp; KMS Gateway thời gian thực.</p>

        <form class="verifier-form-row" @submit.prevent="runLicenseCheck">
          <input
            v-model="verifyKeyInput"
            type="text"
            class="verifier-input"
            placeholder="Nhập mã Product Key (Ví dụ: DXT25-A8F9-94BE-7C21-DXTECH)"
            aria-label="Nhập mã bản quyền"
          />
          <LucianButton
            type="submit"
            variant="primary"
            :loading="verifyState === 'checking'"
          >
            Kiểm tra bản quyền <span>→</span>
          </LucianButton>
        </form>

        <div class="sample-keys-row">
          <span>Mã mẫu thử nghiệm:</span>
          <button type="button" class="btn-sample-chip" @click="pasteSampleKey('WIN11-PRO-RETAIL-9842-DXTECH')">Windows 11 Pro</button>
          <button type="button" class="btn-sample-chip" @click="pasteSampleKey('M365-FAMILY-SUB-7721-DXTECH')">Microsoft 365</button>
          <button type="button" class="btn-sample-chip" @click="pasteSampleKey('JETBRAINS-ALL-PACK-5512-DX')">JetBrains Pack</button>
        </div>

        <div v-if="verifyState === 'valid' && verifiedInfo" class="verifier-result-box valid" role="status">
          <div class="result-icon">✓</div>
          <div class="result-details">
            <strong>Bản quyền hợp lệ: {{ verifiedInfo.product }}</strong>
            <p>{{ verifiedInfo.type }} · {{ verifiedInfo.status }}</p>
          </div>
        </div>
        <div v-else-if="verifyState === 'invalid'" class="verifier-result-box invalid" role="alert">
          <div class="result-icon">✕</div>
          <div class="result-details">
            <strong>Định dạng mã chưa đúng tiêu chuẩn</strong>
            <p>Mã bản quyền chính hãng thường có định dạng gồm các khối ký tự phân cách bằng dấu gạch ngang (-). Vui lòng kiểm tra lại.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ROOT SECTION -->
    <template v-if="!section">
      <div class="resource-section-grid">
        <RouterLink v-for="group in resourceSections" :key="group.slug" class="resource-section-card-modern" :to="`/tai-nguyen/${group.slug}`">
          <div class="resource-card-img-wrap">
            <img :src="group.image" :alt="`Minh họa ${group.name}`" loading="lazy" />
            <span class="resource-img-tag">{{ group.topics.length }} chủ đề</span>
          </div>
          <div class="resource-card-body">
            <span class="eyebrow">CHUYÊN MỤC</span>
            <h2>{{ group.name }}</h2>
            <p>{{ group.description }}</p>
            <div class="resource-topics-mini">
              <span v-for="t in group.topics" :key="t.slug" class="topic-chip">{{ t.name }}</span>
            </div>
            <span class="resource-card-link">Khám phá chuyên mục <b aria-hidden="true">↗</b></span>
          </div>
        </RouterLink>
      </div>
    </template>

    <!-- SECTION BUT NO TOPIC -->
    <template v-else-if="selectedSection && !topic">
      <div class="resource-topic-grid">
        <RouterLink v-for="item in selectedSection.topics" :key="item.slug" class="resource-topic-card-modern" :to="`/tai-nguyen/${selectedSection.slug}/${item.slug}`">
          <span class="resource-topic-icon" aria-hidden="true">
            <svg v-if="selectedSection.slug === 'tai-lieu'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </span>
          <span class="eyebrow">{{ selectedSection.name }}</span>
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <span class="resource-card-link">Mở nội dung chi tiết <b aria-hidden="true">↗</b></span>
        </RouterLink>
      </div>
    </template>

    <!-- NEWS/ARTICLES -->
    <template v-else-if="isNewsPage">
      <div class="news-list">
        <RouterLink v-for="(article, index) in articles" :key="article.slug" class="news-row" :to="`/tin-tuc/${article.slug}`">
          <span class="news-number">0{{ index + 1 }}</span>
          <div>
            <span class="article-index">{{ article.label }} · {{ article.date }} · {{ article.readTime }}</span>
            <h2>{{ article.title }}</h2>
            <p>{{ article.excerpt }}</p>
          </div>
          <span class="news-arrow">↗</span>
        </RouterLink>
      </div>
    </template>

    <!-- 3D BOOKS WITH DEPTH & REALISTIC SPINE -->
    <template v-else-if="section === 'tai-lieu' && topic === 'sach'">
      <div class="resource-item-grid books-grid-3d">
        <article v-for="(book, index) in books" :key="book.title" class="book-card-3d">
          <div class="book-cover-stage">
            <div class="book-3d-model" :style="{ borderColor: book.color }">
              <span class="book-spine" :style="{ background: book.color }"></span>
              <div class="book-front-face" :style="{ background: `linear-gradient(145deg, #0b1e42, ${book.color}44)` }">
                <span class="book-spine-brand">DXTECHS LIBRARY</span>
                <h4 class="book-face-title">{{ book.title }}</h4>
                <small class="book-face-author">{{ book.author }}</small>
              </div>
            </div>
          </div>
          <div class="book-details">
            <div class="book-card-header">
              <span class="book-index">0{{ index + 1 }}</span>
              <span class="book-tag-pill">{{ book.tag }}</span>
            </div>
            <span class="eyebrow">{{ book.label }} · {{ book.pages }}</span>
            <h2>{{ book.title }}</h2>
            <span class="book-author">Tác giả: <strong>{{ book.author }}</strong></span>
            <p>{{ book.detail }}</p>
            <div class="book-actions">
              <a class="button button-outline" :href="book.link" target="_blank" rel="noopener noreferrer">
                Tra cứu Google Books <span>↗</span>
              </a>
            </div>
          </div>
        </article>
      </div>
      <p class="resource-note">Tài liệu và tác phẩm thuộc bản quyền của tác giả và nhà xuất bản. DXTechs giới thiệu nhằm mục đích chia sẻ tri thức công nghệ.</p>
    </template>

    <!-- DOWNLOADS -->
    <template v-else-if="section === 'tai-lieu' && topic === 'download'">
      <div class="resource-item-grid downloads-grid">
        <article v-for="resource in downloads" :key="resource.title" class="download-card-modern">
          <div class="download-card-header">
            <span class="download-file-type">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 4px;">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              {{ resource.format }}
            </span>
            <span class="download-count">{{ resource.downloads }}</span>
          </div>
          <span class="eyebrow">{{ resource.label }}</span>
          <h2>{{ resource.title }}</h2>
          <p>{{ resource.detail }}</p>
          <div class="download-actions-row">
            <LucianButton variant="primary" @click="triggerDownload(resource.title)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 6px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
              Tải xuống miễn phí
            </LucianButton>
            <a class="button button-outline" :href="resource.link" target="_blank" rel="noopener noreferrer">
              Tài liệu gốc <span>↗</span>
            </a>
          </div>
        </article>
      </div>
      <p class="resource-note">Toàn bộ tài liệu được chọn lọc từ các nguồn phát hành uy tín của ngành công nghệ. Bản quyền thuộc đơn vị xuất bản tương ứng.</p>
    </template>

    <!-- GLOSSARY WITH CATEGORY FILTER -->
    <template v-else-if="section === 'goc-nhin' && topic === 'thuat-ngu-cntt'">
      <div class="glossary-search-filter">
        <div class="glossary-search-box">
          <span class="search-icon-inside" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tra cứu thuật ngữ (Ví dụ: API, Cloud, Docker, SSL, ERP, CI/CD...)"
            aria-label="Tìm kiếm thuật ngữ CNTT"
          />
          <button v-if="searchQuery" type="button" class="clear-btn" @click="searchQuery = ''">×</button>
        </div>

        <div class="glossary-category-chips" role="group" aria-label="Lọc theo lĩnh vực">
          <button
            v-for="cat in glossaryCategories"
            :key="cat"
            type="button"
            class="filter-chip"
            :class="{ active: selectedGlossaryCategory === cat }"
            @click="selectedGlossaryCategory = cat"
          >
            {{ cat === 'all' ? 'Tất cả' : cat }}
          </button>
        </div>

        <span class="glossary-results-stat">Tìm thấy <strong>{{ filteredGlossary.length }}</strong> thuật ngữ chuyên ngành</span>
      </div>

      <div class="resource-glossary-grid">
        <article v-for="item in filteredGlossary" :key="item.term" class="glossary-card-modern">
          <div class="glossary-card-top">
            <span class="glossary-term-badge">{{ item.term }}</span>
            <span class="glossary-category-pill">{{ item.category }}</span>
          </div>
          <h2>{{ item.fullName }}</h2>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </template>

    <!-- 404 STATE -->
    <div v-else class="not-found-state">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #0062ff;">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      </div>
      <h2>Không tìm thấy tài nguyên</h2>
      <p>Mục tài nguyên này không tồn tại hoặc đã được cập nhật đường dẫn mới.</p>
      <RouterLink class="button button-primary" to="/tai-nguyen">Về trang chủ Tài Nguyên</RouterLink>
    </div>

    <!-- Breadcrumb -->
    <nav class="resource-breadcrumb" aria-label="Điều hướng tài nguyên">
      <RouterLink to="/tai-nguyen">Tài Nguyên</RouterLink>
      <template v-if="selectedSection">
        <span aria-hidden="true">/</span>
        <RouterLink :to="`/tai-nguyen/${selectedSection.slug}`">{{ selectedSection.name }}</RouterLink>
      </template>
      <template v-if="selectedTopic">
        <span aria-hidden="true">/</span>
        <span>{{ selectedTopic.name }}</span>
      </template>
    </nav>
  </div>
</template>
