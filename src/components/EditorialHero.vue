<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const isPaused = ref(false)
const isEntered = ref(false)

function onTouchStart() {
  isPaused.value = true
}

function onTouchEnd() {
  isPaused.value = false
}

onMounted(() => {
  // Release overflow mask after entrance animation finishes (1.4s)
  setTimeout(() => {
    isEntered.value = true
  }, 1400)
})
</script>

<template>
  <section class="editorial-hero" :class="{ 'is-entered': isEntered }" aria-label="Kiến tạo nền tảng công nghệ tương lai">
    <div class="editorial-hero-container">
      <!-- LEFT CONTENT COLUMN -->
      <div class="editorial-hero-content">
        <div class="hero-eyebrow">
          <span class="eyebrow-dot" aria-hidden="true"></span>
          <span>Đối tác công nghệ &amp; chuyển đổi số</span>
        </div>

        <h1 class="editorial-title" aria-label="Kiến tạo nền tảng công nghệ tương lai">
          <div class="ln blue"><span>KIẾN TẠO</span></div>
          <div class="ln blue"><span>NỀN TẢNG</span></div>
          <div class="ln blue"><span>CÔNG NGHỆ</span></div>
          <div class="ln blue"><span>TƯƠNG LAI</span></div>
        </h1>

        <p class="editorial-desc">
          Tư vấn kiến trúc phần mềm, chuyển giao hệ thống ERP/MES may đo và đào tạo ứng dụng AI thực chiến theo bài toán quản trị vận hành của doanh nghiệp.
        </p>

        <div class="editorial-acts">
          <div class="hero-cta-duo">
            <RouterLink to="/lien-he" class="pill-cta">Tư Vấn Ngay</RouterLink>
            <RouterLink to="/lien-he" class="circle-cta-icon" aria-label="Liên hệ trực tiếp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </RouterLink>
          </div>

          <RouterLink to="/giai-phap/dao-tao" class="act-secondary">
            <span>Khóa học AI &amp; Quản trị</span>
            <span class="arrow-disc">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          </RouterLink>
        </div>

        <!-- Trust Badges -->
        <div class="editorial-proofs">
          <div class="proof-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Kiến trúc may đo linh hoạt</span>
          </div>
          <div class="proof-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Đồng hành triển khai 1-1</span>
          </div>
          <div class="proof-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Bảo mật chuẩn ngân hàng</span>
          </div>
        </div>
      </div>

      <!-- RIGHT MOSAIC MARQUEE GRID -->
      <div
        class="editorial-mosaic"
        :class="{ 'is-paused': isPaused }"
        aria-hidden="true"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <!-- COLUMN 1 (ColDown 14.6s loop) -->
        <div class="col-track col-c1">
          <div class="col-loop">
            <!-- 1. Photo: Smart Factory Robotics -->
            <RouterLink to="/giai-phap/tu-van-trien-khai/he-thong-mes" class="mosaic-cell cell-photo photo-robot">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">ROBOTICS & MES</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">TỰ ĐỘNG HÓA PHÂN XƯỞNG</span>
                  <h3 class="cell-heading">Hệ Thống Điều Độ & Giám Sát Sản Xuất</h3>
                </div>
              </div>
            </RouterLink>

            <!-- 2. Training: AI Practical -->
            <RouterLink to="/giai-phap/dao-tao/ai-cho-doanh-nghiep-x10-hieu-suat" class="mosaic-cell cell-training">
              <div class="cell-top">
                <span class="cell-tag tag-training">ĐÀO TẠO THỰC CHIẾN</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Ứng Dụng AI Trong Vận Hành Doanh Nghiệp</h3>
                <p class="cell-desc">Tự động hóa xử lý tác vụ kế toán, kho vận và phân tích báo cáo quản trị.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Dành cho cấp quản lý</span>
                <span class="cell-action">Lộ trình →</span>
              </div>
            </RouterLink>

            <!-- 3. Photo: Cloud Datacenter -->
            <RouterLink to="/giai-phap/dich-vu" class="mosaic-cell cell-photo photo-datacenter">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">CLOUD INFRA</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">HẠ TẦNG DOANH NGHIỆP</span>
                  <h3 class="cell-heading">Trung Tâm Dữ Liệu &amp; Điện Toán Đám Mây</h3>
                </div>
              </div>
            </RouterLink>

            <!-- 4. Career: AI Engineer -->
            <RouterLink to="/lien-he" class="mosaic-cell cell-career">
              <div class="cell-top">
                <span class="cell-tag tag-career">ĐỘI NGŨ KỸ SƯ</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Kỹ Sư AI &amp; Automation Pipeline</h3>
                <p class="cell-desc">Xây dựng RAG, LangChain và tối ưu hóa mô hình phục vụ ERP.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Kiến trúc chuẩn mực</span>
                <span class="cell-action">Ứng tuyển ngay →</span>
              </div>
            </RouterLink>

            <!-- 5. Brand Card -->
            <div class="mosaic-cell cell-primary">
              <div class="cell-top">
                <span class="cell-tag tag-brand">ĐỒNG HÀNH 1-1</span>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Hệ Sinh Thái DXTechs</h3>
                <p class="cell-desc">Giải pháp số toàn diện kết nối con người, dữ liệu và quy trình sản xuất.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Cam kết bảo mật NDA</span>
              </div>
            </div>

            <!-- DUPLICATE 5 ITEMS FOR CONTINUOUS 50% MARQUEE LOOP -->
            <RouterLink to="/giai-phap/tu-van-trien-khai/he-thong-mes" class="mosaic-cell cell-photo photo-robot" aria-hidden="true">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">ROBOTICS & MES</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">TỰ ĐỘNG HÓA PHÂN XƯỞNG</span>
                  <h3 class="cell-heading">Hệ Thống Điều Độ & Giám Sát Sản Xuất</h3>
                </div>
              </div>
            </RouterLink>

            <RouterLink to="/giai-phap/dao-tao/ai-cho-doanh-nghiep-x10-hieu-suat" class="mosaic-cell cell-training" aria-hidden="true">
              <div class="cell-top">
                <span class="cell-tag tag-training">ĐÀO TẠO THỰC CHIẾN</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Ứng Dụng AI Trong Vận Hành Doanh Nghiệp</h3>
                <p class="cell-desc">Tự động hóa xử lý tác vụ kế toán, kho vận và phân tích báo cáo quản trị.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Dành cho cấp quản lý</span>
                <span class="cell-action">Lộ trình →</span>
              </div>
            </RouterLink>

            <RouterLink to="/giai-phap/dich-vu" class="mosaic-cell cell-photo photo-datacenter" aria-hidden="true">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">CLOUD INFRA</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">HẠ TẦNG DOANH NGHIỆP</span>
                  <h3 class="cell-heading">Trung Tâm Dữ Liệu &amp; Điện Toán Đám Mây</h3>
                </div>
              </div>
            </RouterLink>

            <RouterLink to="/lien-he" class="mosaic-cell cell-career" aria-hidden="true">
              <div class="cell-top">
                <span class="cell-tag tag-career">ĐỘI NGŨ KỸ SƯ</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Kỹ Sư AI &amp; Automation Pipeline</h3>
                <p class="cell-desc">Xây dựng RAG, LangChain và tối ưu hóa mô hình phục vụ ERP.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Kiến trúc chuẩn mực</span>
                <span class="cell-action">Ứng tuyển ngay →</span>
              </div>
            </RouterLink>

            <div class="mosaic-cell cell-primary" aria-hidden="true">
              <div class="cell-top">
                <span class="cell-tag tag-brand">ĐỒNG HÀNH 1-1</span>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Hệ Sinh Thái DXTechs</h3>
                <p class="cell-desc">Giải pháp số toàn diện kết nối con người, dữ liệu và quy trình sản xuất.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Cam kết bảo mật NDA</span>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMN 2 (ColUp 14.6s loop) -->
        <div class="col-track col-c2">
          <div class="col-loop">
            <!-- 1. ERP May Đo -->
            <RouterLink to="/giai-phap/tu-van-trien-khai/he-thong-erp" class="mosaic-cell cell-erp">
              <div class="cell-top">
                <span class="cell-tag tag-erp">TƯ VẤN TRIỂN KHAI</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Hệ Thống ERP May Đo Cho Doanh Nghiệp</h3>
                <p class="cell-desc">Đồng bộ tài chính, bán hàng, kho bãi và chuỗi cung ứng tức thời.</p>
              </div>
              <div class="cell-bottom-row">
                <span>May đo theo quy trình thực tế</span>
                <span class="cell-action">Chi tiết →</span>
              </div>
            </RouterLink>

            <!-- 2. Photo: Architecture Tower -->
            <RouterLink to="/giai-phap/dich-vu" class="mosaic-cell cell-photo photo-tower">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">SYSTEM ARCH</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">KIẾN TRÚC DOANH NGHIỆP</span>
                  <h3 class="cell-heading">Nền Tảng Vững Chắc Cho Quy Mô Lớn</h3>
                </div>
              </div>
            </RouterLink>

            <!-- 3. Training: Kaizen 5S -->
            <RouterLink to="/giai-phap/dao-tao/kaizen" class="mosaic-cell cell-training">
              <div class="cell-top">
                <span class="cell-tag tag-training">PHÁT TRIỂN NĂNG LỰC</span>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Phương Pháp Kaizen & Cải Tiến Năng Suất</h3>
                <p class="cell-desc">Chuẩn hóa công việc, giảm thiểu hao phí trong vận hành sản xuất 5S.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Thực hành tại phân xưởng</span>
                <span class="cell-action">Xem lịch →</span>
              </div>
            </RouterLink>

            <!-- 4. Photo: Silicon Microchip -->
            <RouterLink to="/giai-phap/dich-vu/nghien-cuu-va-phat-trien-cong-nghe-rd" class="mosaic-cell cell-photo photo-silicon">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">DEEP TECH</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">PHẦN CỨNG & LÕI PHẦN MỀM</span>
                  <h3 class="cell-heading">Tối Ưu Hiệu Năng & Điện Toán Cao</h3>
                </div>
              </div>
            </RouterLink>

            <!-- 5. Career: ERP Specialist -->
            <RouterLink to="/lien-he" class="mosaic-cell cell-career">
              <div class="cell-top">
                <span class="cell-tag tag-career">TUYỂN DỤNG GẤP</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Chuyên Viên Khảo Sát & Triển Khai ERP</h3>
                <p class="cell-desc">Phân tích quy trình sản xuất, may đo phân hệ tài chính và chuỗi cung ứng.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Thu nhập 25 - 45M</span>
                <span class="cell-action">Xem JD →</span>
              </div>
            </RouterLink>

            <!-- DUPLICATE 5 ITEMS FOR CONTINUOUS 50% MARQUEE LOOP -->
            <RouterLink to="/giai-phap/tu-van-trien-khai/he-thong-erp" class="mosaic-cell cell-erp" aria-hidden="true">
              <div class="cell-top">
                <span class="cell-tag tag-erp">TƯ VẤN TRIỂN KHAI</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Hệ Thống ERP May Đo Cho Doanh Nghiệp</h3>
                <p class="cell-desc">Đồng bộ tài chính, bán hàng, kho bãi và chuỗi cung ứng tức thời.</p>
              </div>
              <div class="cell-bottom-row">
                <span>May đo theo quy trình thực tế</span>
                <span class="cell-action">Chi tiết →</span>
              </div>
            </RouterLink>

            <RouterLink to="/giai-phap/dich-vu" class="mosaic-cell cell-photo photo-tower" aria-hidden="true">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">SYSTEM ARCH</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">KIẾN TRÚC DOANH NGHIỆP</span>
                  <h3 class="cell-heading">Nền Tảng Vững Chắc Cho Quy Mô Lớn</h3>
                </div>
              </div>
            </RouterLink>

            <RouterLink to="/giai-phap/dao-tao/kaizen" class="mosaic-cell cell-training" aria-hidden="true">
              <div class="cell-top">
                <span class="cell-tag tag-training">PHÁT TRIỂN NĂNG LỰC</span>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Phương Pháp Kaizen & Cải Tiến Năng Suất</h3>
                <p class="cell-desc">Chuẩn hóa công việc, giảm thiểu hao phí trong vận hành sản xuất 5S.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Thực hành tại phân xưởng</span>
                <span class="cell-action">Xem lịch →</span>
              </div>
            </RouterLink>

            <RouterLink to="/giai-phap/dich-vu/nghien-cuu-va-phat-trien-cong-nghe-rd" class="mosaic-cell cell-photo photo-silicon" aria-hidden="true">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">DEEP TECH</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">PHẦN CỨNG & LÕI PHẦN MỀM</span>
                  <h3 class="cell-heading">Tối Ưu Hiệu Năng & Điện Toán Cao</h3>
                </div>
              </div>
            </RouterLink>

            <RouterLink to="/lien-he" class="mosaic-cell cell-career" aria-hidden="true">
              <div class="cell-top">
                <span class="cell-tag tag-career">TUYỂN DỤNG GẤP</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Chuyên Viên Khảo Sát & Triển Khai ERP</h3>
                <p class="cell-desc">Phân tích quy trình sản xuất, may đo phân hệ tài chính và chuỗi cung ứng.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Thu nhập 25 - 45M</span>
                <span class="cell-action">Xem JD →</span>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- COLUMN 3 (ColDown 14.6s loop) -->
        <div class="col-track col-c3">
          <div class="col-loop">
            <!-- 1. Photo: Executive Training -->
            <RouterLink to="/giai-phap/dao-tao" class="mosaic-cell cell-photo photo-training">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">EXECUTIVE WORKSHOP</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">ĐÀO TẠO THỰC CHIẾN</span>
                  <h3 class="cell-heading">Nâng Cao Năng Lực Lãnh Đạo Số</h3>
                </div>
              </div>
            </RouterLink>

            <!-- 2. Thẻ Trắng LMS -->
            <RouterLink to="/giai-phap/dao-tao/dao-tao-phat-trien-nang-luc" class="mosaic-cell cell-light">
              <div class="cell-top">
                <span class="cell-tag tag-light">HỆ THỐNG LMS</span>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Hệ Thống Đào Tạo Nội Bộ LMS</h3>
                <p class="cell-desc" style="color: #64748b;">Khảo sát năng lực, bài giảng số hóa và cấp chứng nhận tự động chuẩn hóa.</p>
              </div>
              <div class="cell-bottom-row">
                <span style="color: #64748b;">Chuyển giao công nghệ</span>
                <span class="cell-action">Dùng thử →</span>
              </div>
            </RouterLink>

            <!-- 3. Photo: Global Network Telemetry -->
            <RouterLink to="/giai-phap/dich-vu" class="mosaic-cell cell-photo photo-network">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">DATA PIPELINE</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">KẾT NỐI TOÀN CẦU</span>
                  <h3 class="cell-heading">Đồng Bộ Dữ Liệu Thời Gian Thực</h3>
                </div>
              </div>
            </RouterLink>

            <!-- 4. Training: Quản Trị Rủi Ro -->
            <RouterLink to="/giai-phap/dao-tao/quan-tri-rui-ro" class="mosaic-cell cell-training">
              <div class="cell-top">
                <span class="cell-tag tag-training">QUẢN TRỊ RỦI RO</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Quản Trị Rủi Ro & Dòng Tiền Doanh Nghiệp</h3>
                <p class="cell-desc">Thiết lập kịch bản ứng phó, kiểm soát công nợ và điểm hòa vốn cho CEO & CFO.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Dành cho cấp lãnh đạo</span>
                <span class="cell-action">Chi tiết →</span>
              </div>
            </RouterLink>

            <!-- 5. Photo: Precision Machine -->
            <RouterLink to="/giai-phap/tu-van-trien-khai/he-thong-mes" class="mosaic-cell cell-photo photo-robot">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">SMART FACTORY</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">HỆ THỐNG MES</span>
                  <h3 class="cell-heading">Giám Sát Máy Móc & Chỉ Số OEE</h3>
                </div>
              </div>
            </RouterLink>

            <!-- DUPLICATE 5 ITEMS FOR CONTINUOUS 50% MARQUEE LOOP -->
            <RouterLink to="/giai-phap/dao-tao" class="mosaic-cell cell-photo photo-training" aria-hidden="true">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">EXECUTIVE WORKSHOP</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">ĐÀO TẠO THỰC CHIẾN</span>
                  <h3 class="cell-heading">Nâng Cao Năng Lực Lãnh Đạo Số</h3>
                </div>
              </div>
            </RouterLink>

            <RouterLink to="/giai-phap/dao-tao/dao-tao-phat-trien-nang-luc" class="mosaic-cell cell-light" aria-hidden="true">
              <div class="cell-top">
                <span class="cell-tag tag-light">HỆ THỐNG LMS</span>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Hệ Thống Đào Tạo Nội Bộ LMS</h3>
                <p class="cell-desc" style="color: #64748b;">Khảo sát năng lực, bài giảng số hóa và cấp chứng nhận tự động chuẩn hóa.</p>
              </div>
              <div class="cell-bottom-row">
                <span style="color: #64748b;">Chuyển giao công nghệ</span>
                <span class="cell-action">Dùng thử →</span>
              </div>
            </RouterLink>

            <RouterLink to="/giai-phap/dich-vu" class="mosaic-cell cell-photo photo-network" aria-hidden="true">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">DATA PIPELINE</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">KẾT NỐI TOÀN CẦU</span>
                  <h3 class="cell-heading">Đồng Bộ Dữ Liệu Thời Gian Thực</h3>
                </div>
              </div>
            </RouterLink>

            <RouterLink to="/giai-phap/dao-tao/quan-tri-rui-ro" class="mosaic-cell cell-training" aria-hidden="true">
              <div class="cell-top">
                <span class="cell-tag tag-training">QUẢN TRỊ RỦI RO</span>
                <div class="cell-icon-bubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
              </div>
              <div class="cell-body">
                <h3 class="cell-heading">Quản Trị Rủi Ro & Dòng Tiền Doanh Nghiệp</h3>
                <p class="cell-desc">Thiết lập kịch bản ứng phó, kiểm soát công nợ và điểm hòa vốn cho CEO & CFO.</p>
              </div>
              <div class="cell-bottom-row">
                <span>Dành cho cấp lãnh đạo</span>
                <span class="cell-action">Chi tiết →</span>
              </div>
            </RouterLink>

            <RouterLink to="/giai-phap/tu-van-trien-khai/he-thong-mes" class="mosaic-cell cell-photo photo-robot" aria-hidden="true">
              <div class="cell-overlay"></div>
              <div class="cell-content">
                <span class="cell-tag">SMART FACTORY</span>
                <div class="cell-bottom">
                  <span class="cell-kicker">HỆ THỐNG MES</span>
                  <h3 class="cell-heading">Giám Sát Máy Móc & Chỉ Số OEE</h3>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* -------------------------------------------------------------
   EDITORIAL HERO COMPONENT · UNSLOP & TASTE DESIGN SYSTEM
   ------------------------------------------------------------- */
.editorial-hero {
  position: relative;
  width: 100%;
  background: #f8fafc;
  overflow: hidden;
  border-bottom: 1px solid rgba(7, 14, 36, 0.08);
  padding: 40px 0 60px 0;
}

.editorial-hero-container {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  position: relative;
  min-height: 640px;
}

/* 1. LEFT CONTENT AREA */
.editorial-hero-content {
  flex: 1 1 500px;
  max-width: 540px;
  z-index: 5;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(7, 14, 36, 0.05);
  border: 1px solid rgba(7, 14, 36, 0.12);
  color: #070e24;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #070e24;
}

/* 2. HEADLINE (INTERMIXED BLUE & BLACK · BALANCED RHYTHM · MASKED ENTRANCE) */
@keyframes titleLineSlideUp {
  0% {
    transform: translateY(32px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeSlideUpElem {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.editorial-title {
  font-family: var(--font-heading, "Be Vietnam Pro", sans-serif);
  font-size: clamp(38px, 5.2vw, 68px);
  font-weight: 900;
  line-height: 1.25; /* Khoảng cách thông thoáng chuẩn xác: tuyệt đối không bị đè dấu tiếng Việt */
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editorial-title .ln {
  display: block;
  overflow: visible !important; /* Luôn giữ thoáng, không cắt gọt dấu mũ hay dấu sắc */
  padding: 2px 0;
}

.editorial-hero.is-entered .editorial-title .ln {
  overflow: visible !important;
}

.editorial-title .ln span {
  display: block;
  color: #070e24; /* Tiêu đề màu đen chuẩn nhận diện sang trọng */
  text-shadow: none;
  animation: titleLineSlideUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
  will-change: transform, opacity;
}

.editorial-title .ln.ink span,
.editorial-title .ln.blue span {
  color: #070e24;
}

.editorial-title .ln:nth-child(1) span { animation-delay: 0.12s; }
.editorial-title .ln:nth-child(2) span { animation-delay: 0.22s; }
.editorial-title .ln:nth-child(3) span { animation-delay: 0.32s; }
.editorial-title .ln:nth-child(4) span { animation-delay: 0.42s; }

.editorial-desc {
  font-size: 16.5px;
  line-height: 1.6;
  color: #334155;
  margin-bottom: 30px;
  max-width: 480px;
  animation: fadeSlideUpElem 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.54s both;
  will-change: transform, opacity;
}

.editorial-desc strong {
  color: #070e24;
  font-weight: 700;
}

/* 3. ACTION CTAS & PROOFS */
.editorial-acts {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  animation: fadeSlideUpElem 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.66s both;
  will-change: transform, opacity;
}

.hero-cta-duo {
  display: inline-flex;
  align-items: center;
}

.pill-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 26px;
  background: #070e24;
  color: #ffffff;
  border-radius: 999px 0 0 999px;
  font-family: var(--font-heading, "Be Vietnam Pro", sans-serif);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(7, 14, 36, 0.18);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.circle-cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 0 999px 999px 0;
  background: #070e24;
  color: #ffffff;
  text-decoration: none;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(7, 14, 36, 0.18);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-cta-duo:hover .pill-cta {
  background: #1e293b;
}

.hero-cta-duo:hover .circle-cta-icon {
  background: #1e293b;
}

.hero-cta-duo:hover .circle-cta-icon svg {
  transform: translate(2px, -2px);
}

.circle-cta-icon svg {
  transition: transform 0.25s ease;
}

.act-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 18px 0 22px;
  background: #ffffff;
  border: 1.5px solid #070e24;
  border-radius: 999px;
  color: #070e24;
  font-family: var(--font-heading, "Be Vietnam Pro", sans-serif);
  font-size: 14.5px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(7, 14, 36, 0.04);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.act-secondary:hover {
  border-color: #070e24;
  background: #070e24;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(7, 14, 36, 0.15);
}

.arrow-disc {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #070e24;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.act-secondary:hover .arrow-disc {
  transform: translateX(3px);
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.editorial-proofs {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  animation: fadeSlideUpElem 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.76s both;
  will-change: transform, opacity;
}

.proof-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-family: var(--font-body, "Inter", sans-serif);
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  line-height: 1;
  transition: border-color 0.2s ease;
}

.proof-pill:hover {
  border-color: #cbd5e1;
  background: #ffffff;
}

.proof-pill svg {
  color: #0062ff;
  flex-shrink: 0;
}

/* 5. RIGHT MOSAIC MARQUEE */
.editorial-mosaic {
  flex: 0 0 680px;
  height: 620px;
  display: flex;
  gap: 14px;
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%);
  animation: fadeSlideUpElem 1.0s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
  will-change: transform, opacity;
}

.editorial-mosaic.is-paused .col-loop {
  animation-play-state: paused !important;
}

.col-track {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.col-loop {
  display: flex;
  flex-direction: column;
  gap: 14px;
  will-change: transform;
}

@keyframes colDownLoop {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

@keyframes colUpLoop {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}

.col-c1 .col-loop, .col-c3 .col-loop {
  animation: colDownLoop 14.6s linear infinite;
}

.col-c2 .col-loop {
  animation: colUpLoop 14.6s linear infinite;
}

@media (hover: hover) and (pointer: fine) {
  .editorial-mosaic:hover .col-loop {
    animation-play-state: paused;
  }
}

/* 6. MOSAIC CELLS STYLING */
.mosaic-cell {
  width: 100%;
  height: 270px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px;
  text-decoration: none;
  color: #ffffff;
  background-color: #070e24;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 14px rgba(7, 14, 36, 0.08);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
}

.mosaic-cell:hover {
  transform: scale(1.02);
  box-shadow: 0 16px 36px -8px rgba(7, 14, 36, 0.32);
  z-index: 2;
}

.cell-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.cell-tag {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.tag-training {
  background: rgba(0, 194, 255, 0.16);
  color: #00c2ff;
  border: 1px solid rgba(0, 194, 255, 0.32);
}

.tag-career {
  background: rgba(0, 98, 255, 0.2);
  color: #93c5fd;
  border: 1px solid rgba(147, 197, 253, 0.35);
}

.tag-erp {
  background: rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tag-light {
  background: #f1f5f9;
  color: #070e24;
  border: 1px solid #cbd5e1;
}

.tag-brand {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
}

.cell-icon-bubble {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
}

.cell-body {
  position: relative;
  z-index: 2;
  margin: 12px 0;
}

.cell-heading {
  font-family: var(--font-heading, "Be Vietnam Pro", sans-serif);
  font-size: 14.5px;
  font-weight: 700;
  line-height: 1.35;
  margin-bottom: 6px;
  color: #ffffff;
}

.cell-desc {
  font-family: var(--font-body, "Inter", sans-serif);
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
}

.cell-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);
  position: relative;
  z-index: 2;
  margin-top: auto;
  min-width: 0;
}

.cell-bottom-row > span:first-child {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-action {
  color: #00c2ff;
  font-weight: 700;
  flex: 0 0 auto;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Card Type Treatments */
.cell-training {
  background: linear-gradient(145deg, #0d2253 0%, #070e24 100%);
  border: 1px solid rgba(0, 194, 255, 0.25);
}

.cell-career {
  background: linear-gradient(145deg, #091a38 0%, #050a1b 100%);
  border: 1px solid rgba(0, 98, 255, 0.3);
}

.cell-erp {
  background: linear-gradient(145deg, #0c1936 0%, #070e24 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.cell-light {
  background: #ffffff;
  color: #070e24;
  border: 1px solid #e2e8f0;
}

.cell-light .cell-heading {
  color: #070e24;
}

.cell-light .cell-desc {
  color: #64748b;
}

.cell-primary {
  background: linear-gradient(145deg, #0062ff 0%, #0045b5 100%);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

/* Photo Cards */
.cell-photo {
  padding: 0;
  background-color: #070e24;
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.cell-photo::before {
  content: "";
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
  z-index: 0;
  filter: brightness(0.85) contrast(1.1);
}

.cell-photo:hover::before {
  transform: scale(1.06);
  filter: brightness(0.95) contrast(1.15);
}

.cell-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(7, 14, 36, 0.42) 0%,
    rgba(7, 14, 36, 0.10) 35%,
    rgba(7, 14, 36, 0.82) 72%,
    rgba(7, 14, 36, 0.98) 100%
  );
  z-index: 1;
}

.cell-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px;
}

.cell-bottom {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cell-kicker {
  font-size: 9.5px;
  font-weight: 700;
  color: #00c2ff;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Photo bindings */
.photo-robot::before {
  background-image: url('/images/tech/smart-factory-robot.webp'), url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80');
}

.photo-datacenter::before {
  background-image: url('/images/tech/cloud-datacenter.webp'), url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80');
}

.photo-silicon::before {
  background-image: url('/images/tech/silicon-microchip.webp'), url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80');
}

.photo-tower::before {
  background-image: url('/images/tech/brutalist-glass-tower.webp'), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80');
}

.photo-training::before {
  background-image: url('/images/tech/executive-ai-training.webp'), url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80');
}

.photo-network::before {
  background-image: url('/images/tech/global-network-data.webp'), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80');
}

/* 7. RESPONSIVE BREAKPOINTS */
@media (max-width: 1180px) {
  .editorial-hero-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 36px;
    padding: 0 20px;
  }

  .editorial-hero-content {
    max-width: 100%;
    flex: 1 1 auto;
  }

  .editorial-mosaic {
    width: 100%;
    flex: 0 0 460px;
    height: 460px;
  }

  .mosaic-cell {
    height: 220px;
  }
}

@media (max-width: 640px) {
  .editorial-hero {
    padding: 24px 0 40px 0;
  }

  .editorial-title {
    font-size: clamp(30px, 8.5vw, 42px);
    line-height: 1.26; /* Hoàn toàn thông thoáng cho dấu tiếng Việt trên màn hình nhỏ */
    letter-spacing: -0.015em;
    gap: 6px;
  }

  .editorial-desc {
    font-size: 15px;
  }

  .editorial-mosaic {
    flex: 0 0 380px;
    height: 380px;
    gap: 8px;
  }

  .mosaic-cell {
    height: 180px;
    padding: 12px;
  }

  .cell-heading {
    font-size: 13px;
  }

  .cell-desc {
    display: none;
  }

  .proof-pill {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .editorial-title .ln span,
  .editorial-desc,
  .editorial-acts,
  .editorial-proofs,
  .editorial-mosaic {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
  .editorial-title .ln {
    overflow: visible !important;
  }
}
</style>
