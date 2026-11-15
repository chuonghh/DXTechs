<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import LucianButton from '../components/LucianButton.vue'
import LucianCopyButton from '../components/LucianCopyButton.vue'
import LucianSegmented from '../components/LucianSegmented.vue'
import LucianSwitch from '../components/LucianSwitch.vue'
import LucianFaqAccordion from '../components/LucianFaqAccordion.vue'
import LucianErrorPlug from '../components/LucianErrorPlug.vue'
import LucianOfflineQueue from '../components/LucianOfflineQueue.vue'
import PageIntro from '../components/PageIntro.vue'
import { categories } from '../data/products.ts'
import { solutionCategories } from '../data/solutions.ts'
import { useShopStore } from '../stores/shop.ts'

const shop = useShopStore()
const route = useRoute()
const sent = ref(false)
const isSubmitting = ref(false)

const requestedService = typeof route.query.service === 'string' ? route.query.service : ''
const requestedPackage = typeof route.query.package === 'string' ? route.query.package : ''

// Customer segmentation
const customerType = ref('b2b')
const customerTypeOptions = [
  { value: 'b2b', label: 'Doanh nghiệp (B2B)' },
  { value: 'individual', label: 'Cá nhân / Chuyên gia' },
  { value: 'urgent_tech', label: 'Cấp cứu kỹ thuật 24/7' },
]

// Time slot segmentation
const preferredTime = ref('morning')
const preferredTimeOptions = [
  { value: 'morning', label: 'Sáng (08:30 – 11:30)' },
  { value: 'afternoon', label: 'Chiều (14:00 – 17:30)' },
  { value: 'evening', label: 'Tối (19:30 – 21:00)' },
  { value: 'urgent', label: 'Khẩn cấp (Trong 15p)' },
]

// Remote support toggle
const needRemoteSupport = ref(false)
const ultraviewerId = ref('')

// Office campus switcher
const activeCampus = ref<'hcm' | 'hn'>('hcm')
const campuses = {
  hcm: {
    name: 'Trụ sở chính TP. Hồ Chí Minh',
    building: 'Tòa nhà DXTechs Tower',
    address: '128 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    hotline: '1900 886 628 (Phím 1)',
    hours: 'Thứ Hai – Thứ Bảy: 08:00 – 21:00',
    facilities: 'Trung tâm Demo giải pháp đám mây, Phòng hội thảo 80 chỗ, Bãi đỗ xe ô tô miễn phí',
    mapUrl: 'https://maps.google.com/maps?q=Ben%20Nghe%20District%201%20Ho%20Chi%20Minh%20City&output=embed',
  },
  hn: {
    name: 'Văn phòng Chi nhánh Hà Nội',
    building: 'Tòa nhà CMC Creative Center',
    address: 'Phố Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội',
    hotline: '1900 886 628 (Phím 2)',
    hours: 'Thứ Hai – Thứ Sáu: 08:30 – 18:00',
    facilities: 'Trung tâm Nghiên cứu AI & Bảo mật, Phòng kiểm thử License Server, Tiếp đón đối tác B2B',
    mapUrl: 'https://maps.google.com/maps?q=Duy%20Tan%20Cau%20Giay%20Hanoi&output=embed',
  },
}

const currentCampus = computed(() => campuses[activeCampus.value])

const form = reactive({
  name: '',
  email: '',
  phone: '',
  service: requestedService,
  message: requestedService
    ? `Tôi quan tâm đến ${requestedService}${requestedPackage ? `, gói ${requestedPackage}` : ''}. Vui lòng tư vấn thêm.`
    : '',
})

const contactServices = [...new Set([
  ...categories.map((category) => category.name),
  ...solutionCategories.flatMap((category) => category.subcategories.flatMap((subcategory) => [
    subcategory.name,
    ...subcategory.items,
  ])),
])]

const supportMetrics = [
  { label: 'Cấp phép tự động', value: '< 30 Giây', sub: 'Hệ thống AI Gateway hoạt động 100%', status: 'online' },
  { label: 'Kỹ sư trực ban', value: '4/4 Chuyên viên', sub: 'Trực chiến UltraViewer & AnyDesk 24/7', status: 'active' },
  { label: 'SLA Phản hồi', value: '12 Phút', sub: 'Cam kết tiếp nhận cuộc gọi & email', status: 'fast' },
  { label: 'Xuất hóa đơn VAT', value: '100% Hợp lệ', sub: 'Chuẩn hóa đơn điện tử Tổng cục Thuế', status: 'verified' },
]

const contactCards = [
  {
    role: 'TƯ VẤN DOANH NGHIỆP',
    name: 'Phòng Giải Pháp & Cấp Phép Doanh Nghiệp',
    description: 'Báo giá bản quyền số lượng lớn (Volume Licensing), chiết khấu B2B, tối ưu hạ tầng Cloud và tích hợp hệ thống.',
    contact: '1900 886 628 (Nhánh 1)',
    email: 'sales@dxtechs.vn',
    iconType: 'building',
    tag: 'Báo giá nhanh 30p',
  },
  {
    role: 'HỖ TRỢ KỸ THUẬT',
    name: 'Trung Tâm Kỹ Thuật & Cấp Phép 24/7',
    description: 'Cài đặt và kích hoạt từ xa qua UltraViewer / AnyDesk, xử lý lỗi bản quyền, cam kết SLA phản hồi dưới 15 phút.',
    contact: '0971 798 186',
    email: 'support@dxtechs.vn',
    iconType: 'ai-tech',
    tag: 'Trực chiến 24/7',
  },
  {
    role: 'HẠ TẦNG CLOUD & BẢO MẬT',
    name: 'Đội Ngũ DevOps & An Toàn Thông Tin',
    description: 'Khởi tạo Cloud VPS NVMe, cấu hình chứng chỉ SSL doanh nghiệp, triển khai sao lưu thảm họa và phòng vệ DDoS.',
    contact: 'cloud@dxtechs.vn',
    email: 'cloud@dxtechs.vn',
    iconType: 'shield',
    tag: 'Uptime 99.98%',
  },
]

const faqs = ref([
  {
    q: 'Thời gian cấp mã bản quyền phần mềm mất bao lâu?',
    a: 'Tại DXTechs, toàn bộ mã giấy phép phần mềm (Office, Windows, JetBrains, Antivirus...) được hệ thống tự động kích hoạt và gửi qua email cũng như lưu trong mục Tài khoản trong vòng 30 - 60 giây sau khi xác nhận thanh toán thành công.',
    open: true,
  },
  {
    q: 'DXTechs có xuất hóa đơn điện tử GTGT (VAT) không?',
    a: 'Có. 100% đơn hàng phần mềm và giải pháp số tại DXTechs đều được hỗ trợ xuất hóa đơn điện tử VAT hợp pháp theo quy định của Tổng cục Thuế. Bạn chỉ cần tích chọn "Yêu cầu hóa đơn VAT" khi thanh toán hoặc cung cấp mã số thuế cho chuyên viên hỗ trợ.',
    open: false,
  },
  {
    q: 'Tôi có được nhân viên hỗ trợ cài đặt từ xa qua UltraViewer không?',
    a: 'Chắc chắn. Đội ngũ kỹ sư DXTechs luôn sẵn sàng hỗ trợ cài đặt, cấu hình và kích hoạt bản quyền qua UltraViewer hoặc AnyDesk hoàn toàn miễn phí, đảm bảo phần mềm hoạt động ổn định trên thiết bị của bạn.',
    open: false,
  },
  {
    q: 'Chính sách bảo hành và đổi trả bản quyền thế nào?',
    a: 'Chúng tôi cam kết bảo hành trọn đời theo thời hạn của gói sản phẩm. Nếu key bản quyền gặp bất kỳ sự cố kỹ thuật nào từ hệ thống máy chủ kích hoạt, bạn sẽ được đổi mã mới hoặc hoàn tiền 100% trong vòng 24 giờ làm việc.',
    open: false,
  },
  {
    q: 'Doanh nghiệp có nhu cầu mua số lượng lớn hoặc hợp đồng riêng được chiết khấu ra sao?',
    a: 'Đối với khách hàng doanh nghiệp, trường học và đại lý, DXTechs áp dụng chính sách chiết khấu khối lượng linh hoạt từ 10% đến 35%, đồng thời hỗ trợ hợp đồng mua sắm trọn gói, thanh toán công nợ 30 ngày và xuất hóa đơn theo kỳ kế toán.',
    open: false,
  },
])

function submitRequest() {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    sent.value = true
    shop.notify(`Cảm ơn ${form.name}, yêu cầu tư vấn đã được tiếp nhận thành công!`)
  }, 400)
}

function resetForm() {
  sent.value = false
  form.name = ''
  form.email = ''
  form.phone = ''
  form.service = ''
  form.message = ''
  ultraviewerId.value = ''
  needRemoteSupport.value = false
}
</script>

<template>
  <div class="content-wrap contact-view">
    <PageIntro
      eyebrow="ĐỒNG HÀNH 24/7 CHUYÊN NGHIỆP"
      title="Kết nối cùng chuyên gia DXTechs"
      description="Chúng tôi luôn sẵn sàng lắng nghe bài toán công nghệ của bạn. Chọn hình thức liên hệ, đặt lịch tư vấn hoặc nhận hỗ trợ kỹ thuật UltraViewer tức thì."
    />

    <!-- 1. Real-time SLA Status Bar (3D Glass Cards) -->
    <section class="contact-metrics-bar" aria-label="Chỉ số phản hồi thời gian thực">
      <div v-for="metric in supportMetrics" :key="metric.label" class="metric-card-3d">
        <div class="metric-status-dot" :class="metric.status" aria-hidden="true"></div>
        <div class="metric-content">
          <span class="metric-value">{{ metric.value }}</span>
          <span class="metric-label">{{ metric.label }}</span>
          <small class="metric-sub">{{ metric.sub }}</small>
        </div>
      </div>
    </section>

    <!-- 2. Main Contact Layout -->
    <div class="contact-layout">
      <!-- Left: Contact Information Cards -->
      <aside class="contact-information">
        <div class="contact-info-header">
          <span class="eyebrow">KÊNH HỖ TRỢ TRỰC TIẾP</span>
          <h2>Chúng tôi luôn sẵn sàng hỗ trợ bạn</h2>
          <p>Chọn đúng kênh liên hệ để đội ngũ kỹ sư và chuyên viên tư vấn tiếp nhận nhanh nhất.</p>
        </div>

        <div class="contact-methods-stack">
          <!-- Hotline B2B -->
          <div class="contact-method-card-3d">
            <div class="method-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div class="method-body">
              <span class="method-kicker">TỔNG ĐÀI TƯ VẤN DOANH NGHIỆP</span>
              <a href="tel:1900886628" class="contact-phone-link">1900 886 628</a>
              <p class="method-desc">Nhánh 1: Kinh doanh &amp; Báo giá · Nhánh 2: Kế toán &amp; VAT</p>
              <div class="method-action-row">
                <span class="status-badge available">Đang tiếp nhận</span>
                <span class="method-time">Thứ 2 – Thứ 7 (08:00 – 21:00)</span>
              </div>
            </div>
          </div>

          <!-- Emergency Tech 24/7 -->
          <div class="contact-method-card-3d urgent-card">
            <div class="method-icon-circle urgent-icon">
              <svg class="text-cyan-400 animate-pulse icon-ai-glow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <div class="method-body">
              <span class="method-kicker urgent-text">HOTLINE CẤP CỨU KỸ THUẬT &amp; ULTRAVIEWER 24/7</span>
              <div class="urgent-phone-wrap">
                <a href="tel:0971798186" class="contact-phone-link">0971 798 186</a>
                <LucianCopyButton text="0971798186" />
              </div>
              <p class="method-desc">Xử lý sự cố máy chủ, bản quyền và kích hoạt phần mềm từ xa xuyên suốt 24/7/365.</p>
              <div class="method-action-row">
                <span class="status-badge live-pulse">Trực chiến 24/7</span>
                <span class="method-time">Phản hồi &lt; 5 phút</span>
              </div>
            </div>
          </div>

          <!-- Official Email -->
          <div class="contact-method-card-3d">
            <div class="method-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <div class="method-body">
              <span class="method-kicker">EMAIL HỖ TRỢ CHÍNH THỨC</span>
              <div class="urgent-phone-wrap">
                <a href="mailto:support@dxtechs.vn" class="contact-email-link">support@dxtechs.vn</a>
                <LucianCopyButton text="support@dxtechs.vn" />
              </div>
              <p class="method-desc">Kinh doanh: <a href="mailto:sales@dxtechs.vn">sales@dxtechs.vn</a> · Kế toán: <a href="mailto:billing@dxtechs.vn">billing@dxtechs.vn</a></p>
            </div>
          </div>

          <!-- Headquarters -->
          <div class="contact-method-card-3d">
            <div class="method-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="method-body">
              <span class="method-kicker">TRỤ SỞ CHÍNH &amp; PHÒNG LAB</span>
              <b class="contact-addr">Tòa nhà DXTechs Tower, 128 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh</b>
              <p class="method-desc">Chi nhánh miền Bắc: Tòa nhà CMC Creative, Phố Duy Tân, Cầu Giấy, Hà Nội</p>
            </div>
          </div>
        </div>

        <!-- Quick Remote Support Box -->
        <div class="remote-support-promo-card">
          <div class="promo-header">
            <span class="promo-badge">CẤP CỨU TỪ XA</span>
            <h4>Kích hoạt bản quyền qua UltraViewer</h4>
          </div>
          <p>Kỹ sư DXTechs kết nối trực tiếp đến màn hình máy tính của bạn để nhập key và cấu hình phần mềm an toàn.</p>
          <div class="promo-actions">
            <a href="https://ultraviewer.net/vi/download.html" target="_blank" rel="noopener noreferrer" class="link-download-tool">
              Tải UltraViewer miễn phí ↗
            </a>
          </div>
        </div>
      </aside>

      <!-- Right: Advanced Interactive Form Panel -->
      <section class="contact-form-panel">
        <div v-if="sent" class="form-success-card" role="status">
          <div class="success-ring-icon" aria-hidden="true">✓</div>
          <span class="eyebrow">YÊU CẦU ĐÃ ĐƯỢC TIẾP NHẬN</span>
          <h2>Cảm ơn bạn đã liên hệ DXTechs!</h2>
          <p>
            Chuyên viên giải pháp đã nhận thông tin từ <strong>{{ form.name }}</strong>. Chúng tôi sẽ chủ động liên hệ qua số điện thoại <strong>{{ form.phone }}</strong> hoặc email <strong>{{ form.email }}</strong> theo đúng khung giờ bạn đã chọn.
          </p>

          <div class="success-detail-box">
            <div><span>Dịch vụ quan tâm:</span> <strong>{{ form.service || 'Tư vấn tổng thể' }}</strong></div>
            <div><span>Khung giờ ưu tiên:</span> <strong>{{ preferredTimeOptions.find(o => o.value === preferredTime)?.label }}</strong></div>
            <div v-if="needRemoteSupport && ultraviewerId"><span>ID UltraViewer:</span> <code>{{ ultraviewerId }}</code></div>
          </div>

          <div class="success-actions">
            <LucianButton variant="primary" @click="resetForm">
              Gửi thêm yêu cầu khác
            </LucianButton>
            <RouterLink to="/" class="button button-outline">
              Về trang chủ
            </RouterLink>
          </div>
        </div>

        <form v-else class="stacked-form contact-form-3d" @submit.prevent="submitRequest">
          <div class="form-header-badge">
            <span class="eyebrow">BIỂU MẪU TƯ VẤN CHUYÊN SÂU</span>
            <h2>Gửi yêu cầu giải pháp &amp; Báo giá</h2>
            <p>Điền thông tin bên dưới để chuyên viên chuẩn bị giải pháp và báo giá chiết khấu tối ưu nhất.</p>
          </div>

          <!-- Customer Type Segmentation -->
          <div class="form-segmented-group">
            <label class="form-group-label">Phân loại khách hàng</label>
            <LucianSegmented
              v-model="customerType"
              :items="customerTypeOptions"
              aria-label="Chọn nhóm khách hàng"
            />
          </div>

          <!-- Service Selection -->
          <label class="form-field">
            <span class="field-label">Dịch vụ hoặc giải pháp bạn quan tâm <span class="required-star">*</span></span>
            <select v-model="form.service" class="form-select-enhanced" required>
              <option disabled value="">-- Vui lòng chọn giải pháp cần tư vấn --</option>
              <option v-for="service in contactServices" :key="service" :value="service">{{ service }}</option>
              <option value="Tư vấn tổng thể">Tư vấn bản quyền doanh nghiệp trọn gói</option>
              <option value="Hạ tầng Cloud & Máy chủ">Khảo sát &amp; Di chuyển hạ tầng lên Cloud VPS</option>
            </select>
          </label>

          <!-- Name & Email Grid -->
          <div class="form-grid-two">
            <label class="form-field">
              <span class="field-label">Họ và tên người đại diện <span class="required-star">*</span></span>
              <input
                v-model="form.name"
                class="form-input-enhanced"
                required
                minlength="2"
                placeholder="Ví dụ: Nguyễn Văn An"
              />
            </label>
            <label class="form-field">
              <span class="field-label">Địa chỉ email nhận báo giá <span class="required-star">*</span></span>
              <input
                v-model="form.email"
                class="form-input-enhanced"
                required
                type="email"
                placeholder="an.nguyen@congty.com"
              />
            </label>
          </div>

          <!-- Phone & Time Slot -->
          <div class="form-grid-two">
            <label class="form-field">
              <span class="field-label">Số điện thoại liên hệ <span class="required-star">*</span></span>
              <input
                v-model="form.phone"
                class="form-input-enhanced"
                required
                type="tel"
                autocomplete="tel"
                inputmode="tel"
                pattern="[0-9+\s-]{9,16}"
                placeholder="Ví dụ: 0971 798 186"
              />
            </label>
            <div class="form-field">
              <span class="field-label">Khung giờ tiếp nhận cuộc gọi thuận tiện</span>
              <select v-model="preferredTime" class="form-select-enhanced">
                <option v-for="opt in preferredTimeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Remote Support Option -->
          <div class="form-remote-box">
            <div class="remote-toggle-row">
              <LucianSwitch
                v-model="needRemoteSupport"
                label="Cần kỹ sư UltraViewer hỗ trợ kích hoạt trực tiếp"
                subtext-on="Đang bật — Kỹ sư sẵn sàng kết nối hỗ trợ từ xa"
                subtext-off="Tắt — Bạn chỉ cần nhận mã bản quyền và tài liệu hướng dẫn"
              />
            </div>
            <div v-if="needRemoteSupport" class="remote-id-field">
              <label class="form-field">
                <span class="field-label">ID UltraViewer hoặc AnyDesk (Tùy chọn)</span>
                <input
                  v-model="ultraviewerId"
                  class="form-input-enhanced"
                  placeholder="Ví dụ: 45 123 789 (Mật khẩu cung cấp trực tiếp qua điện thoại)"
                />
              </label>
              <small class="remote-security-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -1px; margin-right: 4px;">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                DXTechs không bao giờ yêu cầu mật khẩu UltraViewer qua biểu mẫu web để bảo đảm an toàn dữ liệu của bạn.
              </small>
            </div>
          </div>

          <!-- Message -->
          <label class="form-field">
            <span class="field-label">Mô tả chi tiết mục tiêu / Số lượng bản quyền / Vấn đề cần xử lý <span class="required-star">*</span></span>
            <textarea
              v-model="form.message"
              class="form-textarea-enhanced"
              required
              minlength="10"
              rows="4"
              placeholder="Chia sẻ rõ bài toán của bạn để chuyên viên chuẩn bị giải pháp và báo giá cụ thể..."
            ></textarea>
          </label>

          <!-- Submit Button -->
          <div class="form-submit-row">
            <LucianButton
              variant="primary"
              size="lg"
              type="submit"
              :loading="isSubmitting"
              class="contact-submit-btn-lucian"
            >
              Gửi yêu cầu tư vấn miễn phí <span>→</span>
            </LucianButton>
          </div>

          <div class="form-guarantee-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 5px;">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>Cam kết bảo mật: Thông tin của bạn được mã hóa và bảo mật theo tiêu chuẩn ISO/IEC 27001, không chia sẻ với bên thứ ba.</span>
          </div>
        </form>
      </section>
    </div>

    <!-- 3. Specialized Departments Section -->
    <section class="contact-team-section" aria-labelledby="team-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">ĐỘI NGŨ CHUYÊN GIA TRỰC TIẾP</span>
          <h2 id="team-heading">Kết nối đúng bộ phận phụ trách</h2>
          <p>Mỗi bộ phận tại DXTechs chuyên trách một mảng nghiệp vụ chuyên sâu nhằm đem lại giải pháp chuẩn xác và tiết kiệm nhất cho bạn.</p>
        </div>
      </div>
      <div class="contact-team-grid">
        <article v-for="(card, index) in contactCards" :key="card.role" class="contact-team-card-3d">
          <div class="team-card-top">
            <span class="team-icon-avatar" aria-hidden="true">
              <svg v-if="card.iconType === 'ai-tech'" class="text-cyan-400 animate-pulse icon-ai-glow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              <svg v-else-if="card.iconType === 'shield'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                <path d="M10 6h4"/>
                <path d="M10 10h4"/>
                <path d="M10 14h4"/>
                <path d="M10 18h4"/>
              </svg>
            </span>
            <span class="team-tag" :class="{ 'ai-badge text-cyan-400': card.iconType === 'ai-tech' }">{{ card.tag }}</span>
          </div>
          <span class="contact-team-index">0{{ index + 1 }}</span>
          <span class="team-role-label">{{ card.role }}</span>
          <h3>{{ card.name }}</h3>
          <p>{{ card.description }}</p>
          <div class="team-contact-actions">
            <div class="team-contact-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -1px; margin-right: 4px;">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <strong>{{ card.contact }}</strong>
            </div>
            <a :href="`mailto:${card.email}`" class="team-email-link">
              {{ card.email }} <span>↗</span>
            </a>
          </div>
        </article>
      </div>
    </section>

    <!-- 4. Interactive Campus Switcher & Map Section -->
    <section class="contact-map-section" aria-labelledby="map-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">VĂN PHÒNG &amp; TRUNG TÂM KỸ THUẬT</span>
          <h2 id="map-heading">Mạng lưới trụ sở DXTechs</h2>
          <p class="contact-map-caption">Tọa lạc tại các trung tâm tài chính và công nghệ trọng điểm của TP. Hồ Chí Minh và Thủ đô Hà Nội.</p>
        </div>

        <!-- Campus Switcher Tabs -->
        <div class="campus-segmented-wrap">
          <LucianSegmented
            v-model="activeCampus"
            :items="[
              { value: 'hcm', label: 'TP. Hồ Chí Minh (Trụ sở chính)' },
              { value: 'hn', label: 'Hà Nội (Chi nhánh)' },
            ]"
            aria-label="Chọn trụ sở văn phòng"
          />
        </div>
      </div>

      <!-- Campus Details Card + Interactive Map -->
      <div class="campus-showcase-grid">
        <div class="campus-info-card">
          <span class="campus-kicker">VĂN PHÒNG ĐƯỢC CHỌN</span>
          <h3>{{ currentCampus.name }}</h3>
          <p class="campus-bldg"><strong>{{ currentCampus.building }}</strong></p>
          <p class="campus-address">{{ currentCampus.address }}</p>

          <div class="campus-features-list">
            <div class="campus-feature-item">
              <span class="feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
              <div>
                <strong>Thời gian làm việc:</strong>
                <p>{{ currentCampus.hours }}</p>
              </div>
            </div>
            <div class="campus-feature-item">
              <span class="feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <div>
                <strong>Đường dây nóng:</strong>
                <p>{{ currentCampus.hotline }}</p>
              </div>
            </div>
            <div class="campus-feature-item">
              <span class="feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                  <path d="M10 6h4"/>
                  <path d="M10 10h4"/>
                  <path d="M10 14h4"/>
                  <path d="M10 18h4"/>
                </svg>
              </span>
              <div>
                <strong>Tiện ích tiếp đón:</strong>
                <p>{{ currentCampus.facilities }}</p>
              </div>
            </div>
          </div>

          <div class="campus-directions-action">
            <a
              class="button button-outline button-wide"
              :href="`https://maps.google.com/?q=${encodeURIComponent(currentCampus.address)}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chỉ đường qua Google Maps <span>↗</span>
            </a>
          </div>
        </div>

        <div class="campus-map-wrapper">
          <iframe
            :key="activeCampus"
            class="contact-map-iframe"
            :title="`Bản đồ ${currentCampus.name}`"
            :src="currentCampus.mapUrl"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- 4.5. Real-time Resilience & System Health Section -->
    <section class="contact-resilience-section" aria-labelledby="resilience-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">KHẢ NĂNG CHỐNG CHỊU &amp; KẾT NỐI LIÊN TỤC</span>
          <h2 id="resilience-heading">Trạng thái hạ tầng &amp; Kênh hỗ trợ đa mạng</h2>
          <p>Hệ thống hỗ trợ tin nhắn ngoại tuyến tự động xếp hàng và cơ chế tự động khôi phục kết nối API cổng cấp phép.</p>
        </div>
      </div>

      <div class="contact-resilience-grid">
        <div class="resilience-card-wrap">
          <span class="resilience-kicker">KÊNH HỖ TRỢ OFFLINE RESILIENT (091)</span>
          <LucianOfflineQueue
            channel-title="Hỗ trợ kỹ sư DXTechs"
            :default-online="false"
          />
        </div>

        <div class="resilience-card-wrap">
          <span class="resilience-kicker">GIÁM SÁT KẾT NỐI API &amp; CẮM NGUỒN TỰ ĐỘNG (090)</span>
          <LucianErrorPlug
            widget-title="Cổng đối tác Microsoft &amp; AWS"
            error-title="Mất đồng bộ giấy phép máy chủ"
            error-subtitle="Hệ thống tự động thử lại sau chu kỳ đếm ngược"
            endpoint="GET /api/v1/licenses/sync-gateway\n503 Service Unavailable\nTrace ID: dx-8f4b-229c · lần thử "
            success-total-prefix="99.9"
            success-growth="+0.8% SLA tuần này"
          />
        </div>
      </div>
    </section>

    <!-- 5. FAQ Accordion Section -->
    <section class="contact-faq-section" aria-labelledby="faq-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">HỎI ĐÁP &amp; CHÍNH SÁCH</span>
          <h2 id="faq-heading">Giải đáp nhanh các thắc mắc phổ biến</h2>
          <p>Mọi thông tin bạn cần về bản quyền chính hãng, hóa đơn GTGT và chính sách hỗ trợ kỹ thuật.</p>
        </div>
      </div>

      <!-- Lucian UX/UI Prompt #044: FAQ accordion with plus-to-minus physics & smooth grid unfolding -->
      <LucianFaqAccordion :items="faqs" :default-open-index="0" />
    </section>
  </div>
</template>

<style scoped>
.contact-resilience-section {
  margin-top: 48px;
}
.contact-resilience-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  margin-top: 24px;
}
.resilience-card-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.resilience-kicker {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-primary, #0066cc);
  text-transform: uppercase;
}
</style>
