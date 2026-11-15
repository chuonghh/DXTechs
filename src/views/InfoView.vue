<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import LucianNotFoundTypo from '../components/LucianNotFoundTypo.vue'
import { articles } from '../data/articles.ts'
import { categories } from '../data/products.ts'

const route = useRoute()
const page = computed(() => String(route.name || 'not-found'))

const selectedArticle = computed(() => articles.find((article) => article.slug === route.params.slug))
const activePolicyTab = ref('purchase')
const selectedProjectCategory = ref('all')
const newsCategory = ref('all')
const newsSearch = ref('')

const aboutSlides = [
  {
    eyebrow: 'CÔNG NGHỆ CHO HÀNH TRÌNH SỐ',
    title: 'Giải pháp phù hợp, bắt đầu từ sự thấu hiểu.',
    description: 'DXTechs đồng hành cùng cá nhân và doanh nghiệp trong từng bước tiếp cận công nghệ số hiện đại.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
    alt: 'Không gian làm việc hiện đại với ánh sáng tự nhiên',
  },
  {
    eyebrow: 'SỨ MỆNH · ĐỒNG HÀNH',
    title: 'Đưa công nghệ bản quyền đến gần hơn với mọi người.',
    description: 'Chọn đúng công cụ, cấp phép tức thì và luôn có đội ngũ kỹ thuật đồng hành hỗ trợ 24/7.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=85',
    alt: 'Nhóm đồng nghiệp cùng trao đổi và làm việc',
  },
  {
    eyebrow: 'TẦM NHÌN · ĐỔI MỚI',
    title: 'Cùng xây dựng hệ sinh thái số bền vững.',
    description: 'Một nền tảng phần mềm và dịch vụ điện toán đám mây linh hoạt giúp doanh nghiệp tự tin bứt phá.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
    alt: 'Hình ảnh địa cầu và các kết nối công nghệ',
  },
]
const activeAboutSlide = ref(0)
let aboutSlideshowTimer: ReturnType<typeof setInterval> | undefined

function showAboutSlide(index: number) {
  activeAboutSlide.value = (index + aboutSlides.length) % aboutSlides.length
}

function startAboutSlideshow() {
  stopAboutSlideshow()
  aboutSlideshowTimer = setInterval(() => showAboutSlide(activeAboutSlide.value + 1), 6000)
}

function stopAboutSlideshow() {
  if (!aboutSlideshowTimer) return
  clearInterval(aboutSlideshowTimer)
  aboutSlideshowTimer = undefined
}

onMounted(startAboutSlideshow)
onUnmounted(stopAboutSlideshow)

const infoPages: Record<string, { eyebrow: string; title: string; description: string }> = {
  about: {
    eyebrow: 'VỀ DXTECHS',
    title: 'Nền tảng công nghệ cho hành trình số',
    description: 'Tìm hiểu về sứ mệnh, tầm nhìn, đội ngũ lãnh đạo và giá trị cốt lõi đưa DXTechs trở thành đối tác số tin cậy.',
  },
  projects: {
    eyebrow: 'NĂNG LỰC TRIỂN KHAI',
    title: 'Dự án tiêu biểu & Khách hàng thành công',
    description: 'Khám phá các mô hình dự án thực tế về chuyển đổi số, hạ tầng điện toán đám mây và cổng thông tin doanh nghiệp.',
  },
  policies: {
    eyebrow: 'MUA HÀNG AN TÂM',
    title: 'Chính sách bản quyền & Bảo hành',
    description: 'Quy trình cấp phép minh bạch, cam kết bảo hành trọn đời theo gói, hỗ trợ đổi trả và xuất hóa đơn điện tử VAT.',
  },
  news: {
    eyebrow: selectedArticle.value ? 'GÓC KIẾN THỨC · HƯỚNG DẪN' : 'GÓC TRI THỨC SỐ',
    title: selectedArticle.value?.title || 'Tin tức công nghệ & Hướng dẫn kỹ thuật',
    description: selectedArticle.value?.excerpt || 'Mẹo kích hoạt bản quyền, thủ thuật tối ưu hiệu năng và xu hướng công nghệ mới nhất.',
  },
  'not-found': {
    eyebrow: 'KHÔNG TÌM THẤY TRANG',
    title: '404 — Trang không tồn tại',
    description: 'Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ mới.',
  },
}

const currentPage = computed(() => infoPages[page.value] || infoPages['not-found'])

const projectShowcases = [
  {
    name: 'Cổng thông tin & Hệ thống số Doanh nghiệp',
    category: 'web',
    categoryLabel: 'WEBSITE · UX/UI',
    description: 'Thiết kế trải nghiệm đa thiết bị, kiến trúc micro-frontend, cấu trúc dữ liệu chuẩn SEO và nền tảng quản trị headless CMS.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85',
    alt: 'Giao diện phân tích và cổng thông tin trên màn hình',
    techs: ['Vue 3', 'TypeScript', 'Tailwind', 'Cloudflare CDN', 'Headless CMS'],
    stats: 'Tăng 250% lưu lượng truy cập',
  },
  {
    name: 'Hệ thống Quản trị Vận hành & Phân tích Dữ liệu (ERP)',
    category: 'erp',
    categoryLabel: 'ERP · TỰ ĐỘNG HÓA',
    description: 'Tự động hóa luồng bán hàng, kho vận, tài chính và phân tích doanh thu thời gian thực trên nền tảng đám mây.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85',
    alt: 'Bảng điều khiển dữ liệu vận hành doanh nghiệp',
    techs: ['PostgreSQL', 'Docker', 'FastAPI', 'Redis', 'PowerBI'],
    stats: 'Tiết kiệm 40% chi phí vận hành',
  },
  {
    name: 'Hạ tầng Điện toán Đám mây & Bảo mật Doanh nghiệp',
    category: 'cloud',
    categoryLabel: 'CLOUD & SECURITY',
    description: 'Triển khai cụm Kubernetes phân tán đa vùng, tích hợp tường lửa WAF, bảo mật Zero-Trust và sao lưu tự động hàng ngày.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85',
    alt: 'Hệ thống máy chủ đám mây',
    techs: ['Kubernetes', 'Terraform', 'AWS / Azure', 'WAF Cloudflare', 'Vault'],
    stats: 'Đạt chuẩn SLA Uptime 99.99%',
  },
  {
    name: 'Tối ưu Hiện diện số & Trải nghiệm Tìm kiếm (SEO)',
    category: 'web',
    categoryLabel: 'SEO · PERFORMANCE',
    description: 'Tối ưu Core Web Vitals đạt điểm xanh 95+, cấu trúc dữ liệu Schema và tối ưu trải nghiệm người dùng theo mục tiêu chuyển đổi.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85',
    alt: 'Nhóm làm việc cùng phân tích hiệu quả website',
    techs: ['Google Analytics 4', 'Search Console', 'Schema.org', 'Lighthouse 100'],
    stats: 'Top 3 ngành hàng trong 4 tháng',
  },
]

const filteredProjects = computed(() => {
  if (selectedProjectCategory.value === 'all') return projectShowcases
  return projectShowcases.filter((p) => p.category === selectedProjectCategory.value)
})

const filteredArticles = computed(() => {
  const query = newsSearch.value.trim().toLowerCase()
  return articles.filter((a) => {
    const matchesSearch = !query || a.title.toLowerCase().includes(query) || a.excerpt.toLowerCase().includes(query)
    const matchesCat = newsCategory.value === 'all' || a.label.toLowerCase().includes(newsCategory.value.toLowerCase())
    return matchesSearch && matchesCat
  })
})
</script>

<template>
  <div class="content-wrap info-view">
    <PageIntro :eyebrow="currentPage.eyebrow" :title="currentPage.title" :description="currentPage.description" />

    <!-- PAGE: ABOUT -->
    <template v-if="page === 'about'">
      <section
        class="about-slideshow"
        aria-label="DXTechs: công ty, sứ mệnh và tầm nhìn"
        @mouseenter="stopAboutSlideshow"
        @mouseleave="startAboutSlideshow"
      >
        <div :key="activeAboutSlide" class="about-slide">
          <img :src="aboutSlides[activeAboutSlide].image" :alt="aboutSlides[activeAboutSlide].alt" />
          <div class="about-slide-shade"></div>
          <div class="about-slide-content">
            <span class="about-slide-eyebrow">{{ aboutSlides[activeAboutSlide].eyebrow }}</span>
            <h2>{{ aboutSlides[activeAboutSlide].title }}</h2>
            <p>{{ aboutSlides[activeAboutSlide].description }}</p>
            <RouterLink class="about-slide-link" to="/dich-vu">Khám phá dịch vụ số <span aria-hidden="true">→</span></RouterLink>
          </div>
        </div>
        <div class="about-slide-controls">
          <button type="button" aria-label="Ảnh trước" @click="showAboutSlide(activeAboutSlide - 1)">‹</button>
          <div class="about-slide-dots">
            <button
              v-for="(slide, index) in aboutSlides"
              :key="slide.eyebrow"
              type="button"
              :class="{ active: activeAboutSlide === index }"
              @click="showAboutSlide(index)"
            ></button>
          </div>
          <button type="button" aria-label="Ảnh tiếp theo" @click="showAboutSlide(activeAboutSlide + 1)">›</button>
        </div>
      </section>

      <!-- Metrics Counter Grid -->
      <div class="company-metrics-grid">
        <div class="metric-card">
          <strong>5.000+</strong>
          <span>Khách hàng tin tưởng</span>
          <small>Cá nhân &amp; Doanh nghiệp toàn quốc</small>
        </div>
        <div class="metric-card">
          <strong>99.9%</strong>
          <span>Cam kết Uptime SLA</span>
          <small>Hạ tầng Cloud &amp; Hosting vận hành liên tục</small>
        </div>
        <div class="metric-card">
          <strong>150+</strong>
          <span>Đối tác công nghệ</span>
          <small>Microsoft, Adobe, JetBrains, Autodesk...</small>
        </div>
        <div class="metric-card">
          <strong>&lt; 15 Phút</strong>
          <span>Tốc độ hỗ trợ kỹ thuật</span>
          <small>Phản hồi và cài đặt từ xa 24/7</small>
        </div>
      </div>

      <section class="about-story">
        <div class="about-number">01<span> / VỀ CHÚNG TÔI</span></div>
        <div>
          <span class="eyebrow">GIỚI THIỆU DOANH NGHIỆP</span>
          <h2>DXTechs — Nền tảng số khởi đầu cho mọi bước tiến công nghệ.</h2>
          <p>Được thành lập với mục tiêu đơn giản hóa việc tiếp cận phần mềm bản quyền và hạ tầng số, DXTechs cung cấp hệ sinh thái toàn diện bao gồm: Bản quyền phần mềm văn phòng, đồ họa, bảo mật, dịch vụ Cloud VPS, máy chủ, tên miền và giải pháp chuyển đổi số cho doanh nghiệp. Chúng tôi cam kết 100% tính minh bạch, hỗ trợ tận tâm và đồng hành dài hạn.</p>
        </div>
      </section>

      <div class="values-grid">
        <article>
          <span>02 / SỨ MỆNH</span>
          <h3>Đưa công nghệ đến gần hơn</h3>
          <p>Giúp mọi người dùng cá nhân và doanh nghiệp Việt Nam tiếp cận phần mềm bản quyền chính hãng với chi phí hợp lý nhất, quy trình kích hoạt tự động và hỗ trợ kỹ thuật tận tình.</p>
        </article>
        <article>
          <span>03 / TẦM NHÌN</span>
          <h3>Trở thành đối tác số hàng đầu</h3>
          <p>Xây dựng hệ sinh thái công nghệ linh hoạt và đáng tin cậy, nơi doanh nghiệp có thể tìm thấy mọi công cụ số cần thiết để phát triển bền vững trong kỷ nguyên số.</p>
        </article>
        <article>
          <span>04 / GIÁ TRỊ</span>
          <h3>Minh bạch · Tốc độ · Đổi mới</h3>
          <p>Lấy sự hài lòng của khách hàng làm thước đo cao nhất. Cam kết bảo hành trọn đời, thông tin rõ ràng và liên tục cập nhật các giải pháp công nghệ tiên tiến nhất.</p>
        </article>
      </div>

      <!-- Purchase Process -->
      <section class="process-section">
        <span class="eyebrow">QUY TRÌNH MUA HÀNG ĐƠN GIẢN</span>
        <h2>Ba bước sở hữu bản quyền số</h2>
        <div class="process-steps">
          <div>
            <b>01</b>
            <h3>Chọn giải pháp &amp; Gói</h3>
            <p>So sánh tính năng, thời hạn, số lượng thiết bị và mức giá minh bạch.</p>
          </div>
          <div>
            <b>02</b>
            <h3>Thanh toán an toàn</h3>
            <p>Quét mã VietQR hoặc thanh toán trực tuyến bảo mật, nhận thông tin tức thì.</p>
          </div>
          <div>
            <b>03</b>
            <h3>Nhận key &amp; Kích hoạt</h3>
            <p>Key bản quyền được gửi về email ngay lập tức kèm hướng dẫn kích hoạt chi tiết.</p>
          </div>
        </div>
      </section>
    </template>

    <!-- PAGE: PROJECTS -->
    <template v-else-if="page === 'projects'">
      <!-- Category Filter Tabs -->
      <div class="project-filter-bar">
        <button type="button" class="project-tab" :class="{ active: selectedProjectCategory === 'all' }" @click="selectedProjectCategory = 'all'">Tất cả dự án</button>
        <button type="button" class="project-tab" :class="{ active: selectedProjectCategory === 'web' }" @click="selectedProjectCategory = 'web'">Cổng thông tin &amp; Website</button>
        <button type="button" class="project-tab" :class="{ active: selectedProjectCategory === 'erp' }" @click="selectedProjectCategory = 'erp'">Quản trị ERP &amp; Dữ liệu</button>
        <button type="button" class="project-tab" :class="{ active: selectedProjectCategory === 'cloud' }" @click="selectedProjectCategory = 'cloud'">Hạ tầng Cloud &amp; Bảo mật</button>
      </div>

      <div class="project-showcase-grid">
        <article v-for="(project, index) in filteredProjects" :key="project.name" class="project-showcase-card-modern">
          <div class="project-showcase-image">
            <img :src="project.image" :alt="project.alt" loading="lazy" />
            <span class="project-badge-num">0{{ index + 1 }}</span>
            <span class="project-stats-pill">{{ project.stats }}</span>
          </div>
          <div class="project-showcase-copy">
            <span class="eyebrow">{{ project.categoryLabel }}</span>
            <h2>{{ project.name }}</h2>
            <p>{{ project.description }}</p>
            <div class="project-tech-chips">
              <span v-for="tech in project.techs" :key="tech" class="tech-chip">{{ tech }}</span>
            </div>
            <RouterLink class="text-link project-cta" :to="{ name: 'contact', query: { service: project.name } }">
              Tư vấn dự án tương tự <span>→</span>
            </RouterLink>
          </div>
        </article>
      </div>

      <section class="project-contact-cta">
        <div>
          <span class="eyebrow">BẠN CÓ BÀI TOÁN CÔNG NGHỆ RIÊNG?</span>
          <h2>Cùng DXTechs kiến tạo giải pháp tối ưu</h2>
          <p>Chia sẻ mục tiêu chuyển đổi số và hiện trạng của bạn. Đội ngũ chuyên gia sẽ khảo sát và đề xuất lộ trình triển khai chi tiết.</p>
        </div>
        <RouterLink class="button button-primary" to="/lien-he">
          Đăng ký tư vấn giải pháp <span>→</span>
        </RouterLink>
      </section>
    </template>

    <!-- PAGE: POLICIES -->
    <template v-else-if="page === 'policies'">
      <div class="policy-layout">
        <aside class="policy-index">
          <button type="button" :class="{ active: activePolicyTab === 'purchase' }" @click="activePolicyTab = 'purchase'">
            01 · Quy trình mua hàng &amp; Cấp phép
          </button>
          <button type="button" :class="{ active: activePolicyTab === 'renewal' }" @click="activePolicyTab = 'renewal'">
            02 · Chính sách gia hạn dịch vụ
          </button>
          <button type="button" :class="{ active: activePolicyTab === 'returns' }" @click="activePolicyTab = 'returns'">
            03 · Đổi trả &amp; Hoàn tiền 100%
          </button>
          <button type="button" :class="{ active: activePolicyTab === 'vat' }" @click="activePolicyTab = 'vat'">
            04 · Xuất hóa đơn GTGT &amp; Bảo mật
          </button>
        </aside>

        <div class="policy-content">
          <section v-if="activePolicyTab === 'purchase'" class="policy-card-panel">
            <span class="policy-number">01 / QUY TRÌNH MUA HÀNG</span>
            <h2>Quy trình mua hàng &amp; Bàn giao bản quyền</h2>
            <p>Khách hàng lựa chọn sản phẩm phần mềm hoặc gói dịch vụ phù hợp, kiểm tra kỹ các thông số: Số lượng thiết bị kích hoạt, thời hạn sử dụng và hệ điều hành tương thích (Windows, macOS, Linux).</p>
            <div class="policy-bullets">
              <div>✓ <b>Kích hoạt tự động:</b> Toàn bộ mã bản quyền được sinh tự động và gửi qua email khách hàng trong vòng 60 giây sau khi xác nhận thanh toán.</div>
              <div>✓ <b>Hỗ trợ cài đặt:</b> Kỹ thuật viên sẵn sàng kết nối từ xa qua UltraViewer hoặc AnyDesk để cài đặt và kích hoạt miễn phí.</div>
              <div>✓ <b>Lưu trữ vĩnh viễn:</b> Lịch sử đơn hàng và key bản quyền được lưu an toàn tại trang Quản lý tài khoản.</div>
            </div>
          </section>

          <section v-else-if="activePolicyTab === 'renewal'" class="policy-card-panel">
            <span class="policy-number">02 / CHÍNH SÁCH GIA HẠN</span>
            <h2>Gia hạn dịch vụ &amp; Bản quyền định kỳ</h2>
            <p>Đối với các gói dịch vụ có thời hạn (1 năm, 2 năm hoặc thuê bao Cloud), hệ thống sẽ gửi thông báo nhắc gia hạn trước 15 ngày qua email và tin nhắn SMS để đảm bảo công việc không bị gián đoạn.</p>
            <div class="policy-bullets">
              <div>✓ <b>Ưu đãi khách hàng cũ:</b> Giảm ngay 10% – 15% khi gia hạn các gói phần mềm bản quyền hoặc dịch vụ VPS.</div>
              <div>✓ <b>Không gián đoạn:</b> Thời hạn mới sẽ được cộng dồn nối tiếp vào ngày hết hạn cũ của bạn.</div>
              <div>✓ <b>Hỗ trợ nâng cấp:</b> Dễ dàng chuyển đổi từ gói cá nhân lên gói doanh nghiệp không mất phí chênh lệch.</div>
            </div>
          </section>

          <section v-else-if="activePolicyTab === 'returns'" class="policy-card-panel">
            <span class="policy-number">03 / ĐỔI TRẢ &amp; HOÀN TIỀN</span>
            <h2>Cam kết đổi trả và hoàn tiền 100%</h2>
            <p>DXTechs cam kết cung cấp 100% bản quyền phần mềm chính hãng từ các nhà phát triển toàn cầu. Quyền lợi của khách hàng được bảo vệ bằng chính sách cam kết chất lượng:</p>
            <div class="policy-bullets">
              <div>✓ <b>Đổi mã mới ngay lập tức:</b> Nếu mã bản quyền gặp sự cố kích hoạt từ máy chủ hãng, kỹ thuật viên sẽ cấp mã mới trong vòng 15 phút.</div>
              <div>✓ <b>Hoàn tiền 100%:</b> Trường hợp lỗi kỹ thuật không thể khắc phục trên thiết bị của khách hàng, DXTechs hoàn lại 100% số tiền trong 24 giờ.</div>
              <div>✓ <b>Bảo hành trọn đời gói:</b> Bất kỳ sự cố nào xảy ra trong suốt thời hạn bản quyền đều được hỗ trợ kiểm tra và xử lý triệt để.</div>
            </div>
          </section>

          <section v-else-if="activePolicyTab === 'vat'" class="policy-card-panel">
            <span class="policy-number">04 / HÓA ĐƠN &amp; BẢO MẬT</span>
            <h2>Xuất hóa đơn GTGT &amp; Bảo mật thông tin</h2>
            <p>Mọi giao dịch phần mềm và giải pháp tại DXTechs đều tuân thủ đầy đủ quy định pháp luật về thương mại điện tử và thuế tại Việt Nam.</p>
            <div class="policy-bullets">
              <div>✓ <b>Hóa đơn điện tử hợp lệ:</b> Hóa đơn VAT (XML + PDF) được gửi về email kế toán của quý doanh nghiệp trong 24 giờ làm việc.</div>
              <div>✓ <b>Bảo mật SSL 256-bit:</b> Thông tin cá nhân và dữ liệu thanh toán được mã hóa an toàn tuyệt đối.</div>
              <div>✓ <b>Cam kết không chia sẻ:</b> DXTechs không bao giờ cung cấp dữ liệu khách hàng cho bất kỳ bên thứ ba nào.</div>
            </div>
          </section>
        </div>
      </div>
    </template>

    <!-- PAGE: NEWS & ARTICLES -->
    <template v-else-if="page === 'news'">
      <template v-if="selectedArticle">
        <article class="article-detail">
          <div class="article-meta">
            <span class="article-tag-badge">{{ selectedArticle.label }}</span>
            <span>{{ selectedArticle.date }}</span>
            <span>·</span>
            <span>{{ selectedArticle.readTime }}</span>
          </div>
          <h1 class="article-detail-title">{{ selectedArticle.title }}</h1>
          <img class="article-detail-image" :src="selectedArticle.imageUrl" :alt="selectedArticle.imageAlt" />
          <p class="article-lead">{{ selectedArticle.excerpt }}</p>
          <section v-for="sec in selectedArticle.sections" :key="sec.heading" class="article-detail-section">
            <h2>{{ sec.heading }}</h2>
            <p v-for="paragraph in sec.paragraphs" :key="paragraph">{{ paragraph }}</p>
            <ul v-if="sec.bullets">
              <li v-for="bullet in sec.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </section>
          <div class="article-cta-box">
            <div>
              <h3>Cần hỗ trợ về bài viết này?</h3>
              <p>Đội ngũ chuyên viên kỹ thuật DXTechs sẵn sàng giải đáp thắc mắc và hỗ trợ cài đặt cho bạn.</p>
            </div>
            <RouterLink class="button button-primary" to="/lien-he">Liên hệ hỗ trợ <span>→</span></RouterLink>
          </div>
          <RouterLink class="back-to-shop" to="/tin-tuc">← Quay lại danh sách tin tức &amp; kiến thức</RouterLink>
        </article>
      </template>

      <template v-else>
        <!-- News Filter & Search Bar -->
        <div class="news-filter-search">
          <div class="news-search-input-wrap">
            <input v-model="newsSearch" placeholder="Tìm kiếm bài viết, hướng dẫn..." aria-label="Tìm bài viết" />
          </div>
          <div class="news-categories-chips">
            <button type="button" class="news-chip" :class="{ active: newsCategory === 'all' }" @click="newsCategory = 'all'">Tất cả</button>
            <button type="button" class="news-chip" :class="{ active: newsCategory === 'Bản quyền' }" @click="newsCategory = 'Bản quyền'">Bản quyền phần mềm</button>
            <button type="button" class="news-chip" :class="{ active: newsCategory === 'Bảo mật' }" @click="newsCategory = 'Bảo mật'">Bảo mật &amp; An ninh</button>
            <button type="button" class="news-chip" :class="{ active: newsCategory === 'Hạ tầng' }" @click="newsCategory = 'Hạ tầng'">Hạ tầng Cloud</button>
          </div>
        </div>

        <div v-if="filteredArticles.length" class="news-list">
          <RouterLink v-for="(article, index) in filteredArticles" :key="article.slug" class="news-row-modern" :to="`/tin-tuc/${article.slug}`">
            <span class="news-number">0{{ index + 1 }}</span>
            <div class="news-row-body">
              <span class="article-index">{{ article.label }} · {{ article.date }} · {{ article.readTime }}</span>
              <h2>{{ article.title }}</h2>
              <p>{{ article.excerpt }}</p>
            </div>
            <span class="news-arrow-circle">↗</span>
          </RouterLink>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">⌕</div>
          <h2>Không tìm thấy bài viết phù hợp</h2>
          <p>Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
          <button type="button" class="button button-primary" @click="newsSearch = ''; newsCategory = 'all'">Xem tất cả bài viết</button>
        </div>
      </template>
    </template>

    <!-- PAGE: 404 NOT FOUND (Lucian UX/UI Prompt #089 404 typo compass) -->
    <template v-else>
      <LucianNotFoundTypo />
      <div class="info-disclaimer">
        <b>Danh mục dịch vụ chính của DXTechs</b>
        <div class="info-category-links">
          <RouterLink v-for="category in categories" :key="category.id" :to="{ name: 'services', query: { category: category.id } }">
            {{ category.name }} →
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>
