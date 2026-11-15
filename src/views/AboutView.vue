<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import LucianButton from '../components/LucianButton.vue'
import LucianSegmented from '../components/LucianSegmented.vue'

// 3D Tilt Card Effect on Hero Emblem
const emblemRef = ref<HTMLElement | null>(null)
const tiltX = ref(0)
const tiltY = ref(0)
const glareX = ref(50)
const glareY = ref(50)
const isHovering = ref(false)

function handleMouseMove(e: MouseEvent) {
  if (!emblemRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = emblemRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  tiltX.value = -((y - centerY) / centerY) * 12
  tiltY.value = ((x - centerX) / centerX) * 12
  glareX.value = (x / rect.width) * 100
  glareY.value = (y / rect.height) * 100
}

function handleMouseEnter() {
  isHovering.value = true
}

function handleMouseLeave() {
  isHovering.value = false
  tiltX.value = 0
  tiltY.value = 0
  glareX.value = 50
  glareY.value = 50
}

// Interactive Milestones Timeline
const selectedYear = ref('2026')
const yearOptions = [
  { value: '2020', label: 'Năm 2020' },
  { value: '2022', label: 'Năm 2022' },
  { value: '2024', label: 'Năm 2024' },
  { value: '2026', label: 'Năm 2026' },
]

const milestonesData: Record<string, {
  title: string
  subtitle: string
  tag: string
  points: string[]
  stat: string
  statLabel: string
}> = {
  '2020': {
    title: 'Khởi đầu từ khát vọng chuẩn hóa bản quyền số',
    subtitle: 'Thành lập DXTechs tại TP. Hồ Chí Minh với nhóm 5 kỹ sư đam mê phần mềm chính hãng và hạ tầng web.',
    tag: 'GIAI ĐOẠN KHỞI TẠO',
    points: [
      'Thành lập văn phòng đầu tiên tại Quận 1, TP. Hồ Chí Minh.',
      'Cung cấp bản quyền phần mềm Microsoft và dịch vụ Hosting SSD ban đầu.',
      'Đạt mốc 1.000 khách hàng cá nhân và doanh nghiệp khởi nghiệp đầu tiên.',
    ],
    stat: '1.000+',
    statLabel: 'Người dùng ban đầu',
  },
  '2022': {
    title: 'Mở rộng hệ sinh thái Cloud & Đối tác ủy quyền quốc tế',
    subtitle: 'Ký kết thỏa thuận hợp tác chính thức cùng Microsoft (CSP Direct) và JetBrains Authorized Partner.',
    tag: 'BỨT PHÁ TĂNG TRƯỞNG',
    points: [
      'Trở thành đối tác ủy quyền Microsoft Cloud Solution Provider (CSP).',
      'Đưa vào vận hành cụm máy chủ Cloud VPS NVMe tốc độ cao tại Viettel IDC.',
      'Xây dựng trung tâm hỗ trợ kỹ thuật UltraViewer trực chiến 24/7/365.',
      'Mở rộng danh mục lên hơn 30 dịch vụ công nghệ và giải pháp tư vấn triển khai doanh nghiệp.',
    ],
    stat: '25.000+',
    statLabel: 'Bản quyền bàn giao',
  },
  '2024': {
    title: 'Chuẩn hóa an toàn thông tin ISO 27001 & Tự động hóa',
    subtitle: 'Đạt chứng nhận an toàn thông tin quốc tế ISO/IEC 27001:2022 và ra mắt cổng kích hoạt key tự động dưới 30 giây.',
    tag: 'CHUẨN HÓA QUỐC TẾ',
    points: [
      'Đạt chứng nhận tiêu chuẩn bảo mật ISO/IEC 27001:2022 cho hệ thống quản trị dữ liệu.',
      'Tích hợp hệ sinh thái cổng thanh toán VietQR và xuất hóa đơn điện tử tự động 100%.',
      'Khai trương chi nhánh Hà Nội tại Tòa nhà CMC Creative, Cầu Giấy.',
      'Hơn 500 khách hàng doanh nghiệp vừa và lớn tin tưởng hợp tác.',
    ],
    stat: '50.000+',
    statLabel: 'Khách hàng toàn quốc',
  },
  '2026': {
    title: 'Tiên phong AI Gateway & Điện toán đám mây thế hệ mới',
    subtitle: 'Nâng cấp toàn diện hạ tầng AI Gateway, mở rộng dịch vụ Hybrid Cloud và củng cố vị thế nền tảng số tin cậy.',
    tag: 'DẪN ĐẦU KỶ NGUYÊN MỚI',
    points: [
      'Ứng dụng AI Gateway phân tích và điều phối bản quyền tự động thời gian thực.',
      'Cam kết SLA hạ tầng đạt 99.98% với kiến trúc cụm máy chủ phân tán đa trung tâm dữ liệu.',
      'Chiết khấu doanh nghiệp B2B tới 35% với giải pháp thanh toán công nợ linh hoạt.',
      'Tiếp tục phụng sự hơn 65.000 cá nhân, kỹ sư và tổ chức công nghệ trên toàn quốc.',
    ],
    stat: '65.000+',
    statLabel: 'Bản quyền kích hoạt',
  },
}

const currentMilestone = computed(() => milestonesData[selectedYear.value])

// Core Values
const coreValues = [
  {
    idx: '01',
    title: 'Chính Hãng & Minh Bạch 100%',
    badge: 'INTEGRITY FIRST',
    description: 'Nói không hoàn toàn với phần mềm bẻ khóa, key lậu hoặc tài khoản dùng chung. Mọi giấy phép đều có chứng nhận xuất xứ (CO) và hóa đơn GTGT hợp pháp.',
    iconType: 'shield',
  },
  {
    idx: '02',
    title: 'Kích Hoạt Tức Thì & Tự Động',
    badge: 'INSTANT DELIVERY',
    description: 'Hệ thống AI Gateway kết nối trực tiếp đến KMS và Cloud Vault, bàn giao Product Key về email và tài khoản của khách hàng chỉ trong vòng 30 giây.',
    iconType: 'ai-gateway',
  },
  {
    idx: '03',
    title: 'Kỹ Sư Trực Chiến 24/7/365',
    badge: 'UNMATCHED SUPPORT',
    description: 'Đội ngũ kỹ thuật túc trực xuyên ngày đêm, sẵn sàng kết nối hỗ trợ cài đặt và kích hoạt từ xa qua UltraViewer / AnyDesk với cam kết phản hồi dưới 15 phút.',
    iconType: 'support',
  },
  {
    idx: '04',
    title: 'Tối Ưu Chi Phí Cho Người Việt',
    badge: 'BEST VALUE',
    description: 'Tận dụng chương trình đối tác khối lượng lớn (Volume Licensing) để đem lại mức chiết khấu tiết kiệm đến 45% cho cá nhân, học sinh sinh viên và doanh nghiệp.',
    iconType: 'value',
  },
]

// Leadership Team
const leadershipTeam = [
  {
    name: 'Nguyễn Hoàng Dũng',
    role: 'SÁNG LẬP & TỔNG GIÁM ĐỐC (CEO)',
    bio: '15 năm kinh nghiệm trong ngành CNTT và kiến trúc hạ tầng Cloud. Từng giữ vị trí Tech Director tại các tập đoàn công nghệ khu vực Singapore & Việt Nam.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85',
    tag: 'Chiến lược & Tăng trưởng',
  },
  {
    name: 'Trần Minh Khang',
    role: 'GIÁM ĐỐC CÔNG NGHỆ (CTO)',
    bio: 'Chuyên gia an toàn thông tin và hệ thống phân tán. Trực tiếp chỉ đạo kiến trúc bảo mật đạt chuẩn ISO 27001 và hệ thống cấp phép tự động AI Gateway của DXTechs.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=85',
    tag: 'Kiến trúc & Bảo mật',
  },
  {
    name: 'Lê Thùy Dương',
    role: 'GIÁM ĐỐC QUAN HỆ ĐỐI TÁC (HEAD OF PARTNERSHIPS)',
    bio: 'Hơn 10 năm phụ trách kênh đối tác ủy quyền với Microsoft, Adobe và JetBrains, bảo đảm chính sách giá và nguồn bản quyền chính thống bền vững cho khách hàng.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85',
    tag: 'Đối tác Quốc tế',
  },
  {
    name: 'Vũ Tuấn Kiệt',
    role: 'TRƯỞNG PHÒNG KỸ THUẬT & DỊCH VỤ KHÁCH HÀNG',
    bio: 'Quản lý đội ngũ 25 kỹ sư túc trực 24/7. Cam kết duy trì tỷ lệ hài lòng dịch vụ khách hàng (CSAT) trên 98.8% qua kênh hỗ trợ UltraViewer và Hotline.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85',
    tag: 'Vận hành & Hỗ trợ 24/7',
  },
]

// Partner Certifications
const partnerCertifications = [
  { name: 'Microsoft CSP Direct Partner', desc: 'Đối tác Cung cấp Giải pháp Đám mây Cấp 1', icon: 'M' },
  { name: 'JetBrains Authorized Reseller', desc: 'Đại lý ủy quyền bộ công cụ lập trình viên', icon: 'J' },
  { name: 'Adobe Certified Reseller', desc: 'Đại lý phân phối Creative Cloud bản quyền', icon: 'A' },
  { name: 'VMware Cloud Verified', desc: 'Hạ tầng ảo hóa máy chủ đạt chuẩn quốc tế', icon: 'V' },
  { name: 'Sectigo Certificate Authority', desc: 'Tổ chức cấp phát chứng chỉ số SSL an toàn', icon: 'S' },
  { name: 'VNNIC .VN Registrar', desc: 'Nhà đăng ký tên miền quốc gia Việt Nam', icon: 'VN' },
]

// Office Gallery Slideshow
const officePhotos = [
  {
    title: 'Trụ sở chính — Tòa nhà DXTechs Tower TP.HCM',
    desc: 'Không gian làm việc mở chuẩn Agile kết hợp phòng Lab nghiên cứu bảo mật và hạ tầng đám mây.',
    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Chi nhánh Hà Nội — Tòa nhà CMC Creative Center',
    desc: 'Trung tâm tiếp đón đối tác B2B và trung tâm kiểm thử bản quyền hệ thống phía Bắc.',
    img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Hạ tầng Trung tâm Dữ liệu Viettel IDC & FPT',
    desc: 'Cụm máy chủ chuyên dụng NVMe Tier 3 với đường truyền cáp quang băng thông cao 40Gbps.',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
  },
]
const activePhotoIndex = ref(0)
let photoTimer: ReturnType<typeof setInterval> | undefined

function nextPhoto() {
  activePhotoIndex.value = (activePhotoIndex.value + 1) % officePhotos.length
}

function prevPhoto() {
  activePhotoIndex.value = (activePhotoIndex.value - 1 + officePhotos.length) % officePhotos.length
}

function startPhotoTimer() {
  stopPhotoTimer()
  photoTimer = setInterval(nextPhoto, 5000)
}

function stopPhotoTimer() {
  if (photoTimer) {
    clearInterval(photoTimer)
    photoTimer = undefined
  }
}

onMounted(startPhotoTimer)
onUnmounted(stopPhotoTimer)
</script>

<template>
  <div class="content-wrap about-view-awesome">
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs" aria-label="Đường dẫn">
      <RouterLink to="/">Trang chủ</RouterLink>
      <span aria-hidden="true">/</span>
      <span class="breadcrumb-current">Giới thiệu DXTechs</span>
    </nav>

    <!-- 1. Hero 3D Narrative Section -->
    <section class="about-hero-3d">
      <div class="about-hero-copy">
        <div class="about-hero-tag">
          <svg class="about-hero-sparkle text-cyan-400 animate-pulse icon-ai-glow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          <span>NỀN TẢNG CÔNG NGHỆ &amp; BẢN QUYỀN SỐ</span>
        </div>
        <h1 class="about-hero-title">
          Định hình tương lai <span class="text-gradient">công nghệ số</span> bền vững tại Việt Nam
        </h1>
        <p class="about-hero-lead">
          Được thành lập với sứ mệnh đưa phần mềm bản quyền chính hãng và hạ tầng điện toán đám mây chuẩn quốc tế đến gần hơn với mọi cá nhân, lập trình viên và doanh nghiệp Việt Nam.
        </p>

        <div class="about-hero-points">
          <div class="hero-point-pill">
            <span class="point-check">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span>100% Bản quyền chính hãng có VAT</span>
          </div>
          <div class="hero-point-pill">
            <span class="point-check point-ai-check text-cyan-400">
              <svg class="animate-pulse icon-ai-glow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </span>
            <span>AI Gateway kích hoạt dưới 30 giây</span>
          </div>
          <div class="hero-point-pill">
            <span class="point-check">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span>Kỹ sư UltraViewer 24/7/365</span>
          </div>
        </div>

        <div class="about-hero-cta">
          <RouterLink to="/giai-phap/dich-vu">
            <LucianButton variant="primary" size="lg">
              Khám phá Dịch vụ số <span>→</span>
            </LucianButton>
          </RouterLink>
          <RouterLink to="/giai-phap/tu-van-trien-khai">
            <LucianButton variant="outline" size="lg">
              Tư vấn triển khai ERP & MES
            </LucianButton>
          </RouterLink>
        </div>
      </div>

      <!-- 3D Interactive Brand Emblem Card -->
      <div class="about-hero-visual">
        <div
          ref="emblemRef"
          class="emblem-3d-card"
          :style="{
            transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }"
          @mousemove="handleMouseMove"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <!-- Specular Sheen Glare -->
          <div
            class="emblem-glare"
            :style="{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 65%)`,
              opacity: isHovering ? 1 : 0
            }"
            aria-hidden="true"
          ></div>

          <div class="emblem-header">
            <span class="emblem-cert-badge">ISO/IEC 27001:2022</span>
            <span class="emblem-status-badge">
              <span class="pulse-dot-green"></span>
              Hệ thống Online 100%
            </span>
          </div>

          <!-- Central Shield Graphic -->
          <div class="emblem-center-graphic">
            <div class="emblem-logo-circle">
              <span class="emblem-logo-text">DX</span>
            </div>
            <div class="emblem-holo-rings" aria-hidden="true"></div>
            <h3 class="emblem-company-name">DXTECHS ENTERPRISE</h3>
            <p class="emblem-tagline">Cloud, License &amp; Digital Infrastructure</p>
          </div>

          <!-- Verification strip -->
          <div class="emblem-license-strip">
            <div class="strip-item">
              <span class="strip-label">ĐỐI TÁC CHIẾN LƯỢC</span>
              <strong>Microsoft CSP Tier 1</strong>
            </div>
            <div class="strip-divider"></div>
            <div class="strip-item">
              <span class="strip-label">ĐỘ TRỄ TRUY VẤN</span>
              <strong class="text-cyan">12ms · Viettel IDC</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Real-World Impact Counters (4 3D Glass Cards) -->
    <section class="about-stats-section" aria-label="Thành tựu và con số nổi bật">
      <div class="stats-grid-4">
        <div class="stat-card-3d">
          <span class="stat-num">65.000+</span>
          <span class="stat-title">Bản quyền đã kích hoạt</span>
          <p class="stat-desc">Được cá nhân và doanh nghiệp trên toàn quốc tin dùng với cam kết 1 đổi 1.</p>
        </div>
        <div class="stat-card-3d">
          <span class="stat-num">99.98%</span>
          <span class="stat-title">Cam kết Uptime SLA</span>
          <p class="stat-desc">Hạ tầng Cloud VPS NVMe, máy chủ và mạng phân phối CDN vận hành liên tục.</p>
        </div>
        <div class="stat-card-3d">
          <span class="stat-num">&lt; 15 Phút</span>
          <span class="stat-title">Tốc độ phản hồi kỹ thuật</span>
          <p class="stat-desc">Kỹ sư UltraViewer túc trực 24/7/365 sẵn sàng cài đặt và gỡ lỗi từ xa miễn phí.</p>
        </div>
        <div class="stat-card-3d">
          <span class="stat-num">100%</span>
          <span class="stat-title">Xuất hóa đơn GTGT (VAT)</span>
          <p class="stat-desc">Hóa đơn điện tử hợp pháp theo tiêu chuẩn Tổng cục Thuế cho toàn bộ đơn hàng.</p>
        </div>
      </div>
    </section>

    <!-- 3. Core Values & Mission (Bento Grid) -->
    <section class="about-values-section" aria-labelledby="values-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">GIÁ TRỊ CỐT LÕI &amp; NGUYÊN TẮC</span>
          <h2 id="values-heading">Bốn cam kết kiến tạo niềm tin bền vững</h2>
          <p>Mỗi quyết định công nghệ và dịch vụ tại DXTechs đều dựa trên sự minh bạch, an toàn pháp lý và trải nghiệm người dùng.</p>
        </div>
      </div>

      <div class="values-bento-grid">
        <article v-for="val in coreValues" :key="val.idx" class="value-bento-card">
          <div class="value-card-top">
            <span class="value-icon" :class="{ 'text-cyan-400': val.iconType === 'ai-gateway' }">
              <svg v-if="val.iconType === 'ai-gateway'" class="ai-value-svg text-cyan-400 animate-pulse icon-ai-glow" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 8V4H8"/>
                <rect width="16" height="12" x="4" y="8" rx="2"/>
                <path d="M2 14h2"/>
                <path d="M20 14h2"/>
                <path d="M15 13v2"/>
                <path d="M9 13v2"/>
              </svg>
              <svg v-else-if="val.iconType === 'shield'" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <svg v-else-if="val.iconType === 'support'" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="20" height="14" x="2" y="3" rx="2"/>
                <line x1="8" x2="16" y1="21" y2="21"/>
                <line x1="12" x2="12" y1="17" y2="21"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 3h12l4 6-10 12L2 9z"/>
                <path d="M11 3 8 9l4 12 4-12-3-6"/>
                <path d="M2 9h20"/>
              </svg>
            </span>
            <span class="value-badge" :class="{ 'ai-badge text-cyan-400': val.iconType === 'ai-gateway' }">
              <svg v-if="val.iconType === 'ai-gateway'" class="badge-ai-sparkle animate-pulse text-cyan-400" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              {{ val.badge }}
            </span>
          </div>
          <span class="value-idx">{{ val.idx }}</span>
          <h3>{{ val.title }}</h3>
          <p>{{ val.description }}</p>
        </article>
      </div>
    </section>

    <!-- 4. Interactive Timeline & Milestones (2020 - 2026) -->
    <section id="about-timeline" class="about-timeline-section" aria-labelledby="timeline-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">HÀNH TRÌNH PHÁT TRIỂN</span>
          <h2 id="timeline-heading">Các mốc son lịch sử của DXTechs</h2>
          <p>Từ một văn phòng khởi nghiệp nhỏ đến hệ sinh thái bản quyền và hạ tầng đám mây phục vụ hàng chục ngàn khách hàng.</p>
        </div>

        <div class="timeline-year-tabs">
          <LucianSegmented
            v-model="selectedYear"
            :items="yearOptions"
            aria-label="Chọn năm lịch sử phát triển"
          />
        </div>
      </div>

      <!-- Milestone Interactive Card -->
      <div class="milestone-showcase-card">
        <div class="milestone-copy">
          <span class="milestone-tag" :class="{ 'ai-badge text-cyan-400': selectedYear === '2026' }">
            <svg v-if="selectedYear === '2026'" class="badge-ai-sparkle animate-pulse text-cyan-400" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
            {{ currentMilestone.tag }}
          </span>
          <h3 class="milestone-title">
            <svg v-if="selectedYear === '2026'" class="text-cyan-400 animate-pulse icon-ai-glow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 6px;">
              <path d="M12 8V4H8"/>
              <rect width="16" height="12" x="4" y="8" rx="2"/>
              <path d="M2 14h2"/>
              <path d="M20 14h2"/>
              <path d="M15 13v2"/>
              <path d="M9 13v2"/>
            </svg>
            {{ currentMilestone.title }}
          </h3>
          <p class="milestone-sub">{{ currentMilestone.subtitle }}</p>

          <ul class="milestone-points-list">
            <li v-for="(point, i) in currentMilestone.points" :key="i">
              <span class="point-bullet">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>

        <div class="milestone-visual-badge">
          <span class="badge-year-big">{{ selectedYear }}</span>
          <div class="badge-stat-box">
            <strong class="stat-highlight">{{ currentMilestone.stat }}</strong>
            <span>{{ currentMilestone.statLabel }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Global Tech Partner Certifications -->
    <section class="about-partners-section" aria-labelledby="partners-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">ĐỐI TÁC CHIẾN LƯỢC</span>
          <h2 id="partners-heading">Chứng nhận ủy quyền từ các tập đoàn công nghệ</h2>
          <p>DXTechs vinh dự là cầu nối trực tiếp mang các bản quyền và giải pháp chính thức từ những tên tuổi hàng đầu thế giới.</p>
        </div>
      </div>

      <div class="partners-cert-grid">
        <div v-for="partner in partnerCertifications" :key="partner.name" class="partner-cert-card">
          <div class="partner-avatar-circle">{{ partner.icon }}</div>
          <div class="partner-cert-info">
            <h4>{{ partner.name }}</h4>
            <p>{{ partner.desc }}</p>
          </div>
          <span class="verified-seal">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -1px; margin-right: 4px;"><polyline points="20 6 9 17 4 12"/></svg>
            Ủy quyền
          </span>
        </div>
      </div>
    </section>

    <!-- 6. Leadership & Expert Team Showcase -->
    <section class="about-team-section" aria-labelledby="team-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">ĐỘI NGŨ LÃNH ĐẠO &amp; CHUYÊN GIA</span>
          <h2 id="team-heading">Những người định hướng và trực tiếp phụng sự</h2>
          <p>Sự kết hợp giữa tư duy kiến trúc công nghệ bài bản và lòng nhiệt thành tận tâm vì thành công của khách hàng.</p>
        </div>
      </div>

      <div class="leadership-grid">
        <article v-for="leader in leadershipTeam" :key="leader.name" class="leader-card-3d">
          <div class="leader-avatar-wrap">
            <img :src="leader.avatar" :alt="leader.name" loading="lazy" class="leader-img" />
            <span class="leader-tag-pill">{{ leader.tag }}</span>
          </div>
          <div class="leader-info">
            <span class="leader-role">{{ leader.role }}</span>
            <h3 class="leader-name">{{ leader.name }}</h3>
            <p class="leader-bio">{{ leader.bio }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- 7. Interactive Office & Campus Gallery -->
    <section class="about-gallery-section" aria-labelledby="gallery-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">MÔI TRƯỜNG &amp; VĂN PHÒNG</span>
          <h2 id="gallery-heading">Không gian làm việc &amp; Trung tâm dữ liệu</h2>
          <p>Hạ tầng hiện đại tại các trung tâm tài chính hàng đầu giúp đội ngũ tập trung cao độ và sáng tạo giải pháp.</p>
        </div>

        <div class="gallery-controls">
          <button type="button" class="gallery-arrow-btn" aria-label="Ảnh trước" @click="prevPhoto">‹</button>
          <span class="gallery-counter">{{ activePhotoIndex + 1 }} / {{ officePhotos.length }}</span>
          <button type="button" class="gallery-arrow-btn" aria-label="Ảnh tiếp theo" @click="nextPhoto">›</button>
        </div>
      </div>

      <div class="gallery-stage" @mouseenter="stopPhotoTimer" @mouseleave="startPhotoTimer">
        <div class="gallery-photo-card">
          <img
            :key="activePhotoIndex"
            :src="officePhotos[activePhotoIndex].img"
            :alt="officePhotos[activePhotoIndex].title"
            class="gallery-main-img"
          />
          <div class="gallery-caption-overlay">
            <h3>{{ officePhotos[activePhotoIndex].title }}</h3>
            <p>{{ officePhotos[activePhotoIndex].desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Bottom CTA Banner -->
    <section class="about-bottom-cta">
      <div class="cta-banner-content">
        <span class="eyebrow text-cyan">
          <svg class="cta-ai-sparkle text-cyan-400 animate-pulse icon-ai-glow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 6px;">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          ĐỒNG HÀNH CÙNG DXTECHS
        </span>
        <h2>Sẵn sàng bứt phá cùng giải pháp công nghệ chuyên sâu?</h2>
        <p>Đội ngũ chuyên gia DXTechs sẵn sàng đồng hành từ tư vấn chiến lược, phát triển phần mềm may đo đến triển khai ERP, MES, MRP tối ưu chi phí.</p>

        <div class="cta-actions-row">
          <RouterLink to="/giai-phap/dich-vu">
            <LucianButton variant="primary" size="lg">
              Khám phá Dịch vụ số <span>→</span>
            </LucianButton>
          </RouterLink>
          <RouterLink to="/giai-phap/tu-van-trien-khai">
            <LucianButton variant="secondary" size="lg">
              Tư vấn triển khai ERP & MES
            </LucianButton>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
