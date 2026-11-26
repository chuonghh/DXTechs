<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const newsletterEmail = ref('')
const subscribeSuccess = ref(false)

function handleSubscribe() {
  if (!newsletterEmail.value.trim() || !newsletterEmail.value.includes('@')) return
  subscribeSuccess.value = true
  setTimeout(() => {
    subscribeSuccess.value = false
    newsletterEmail.value = ''
  }, 4000)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="site-footer-modern" role="contentinfo">
    <!-- AI-Engineered High-Res Enterprise Tech Background Graphic -->
    <div class="footer-bg-canvas" aria-hidden="true">
      <img
        src="/images/footer-tech-bg.jpg"
        alt=""
        class="footer-bg-image"
        loading="lazy"
      />
      <div class="footer-bg-overlay"></div>
    </div>

    <!-- Main Footer Grid (5 Columns) -->
    <div class="footer-main-container">
      <!-- Column 1: Brand & Vision & Contacts -->
      <div class="footer-col-brand">
        <RouterLink to="/" class="footer-brand-link" aria-label="DXTechs - Trang chủ">
          <img src="/dxtechs-logo.png" alt="DXTechs" class="footer-logo-img" />
        </RouterLink>

        <h2 class="footer-tagline">
          Innovating Today.<br />
          <span class="tagline-highlight">Empowering Tomorrow.</span>
        </h2>

        <p class="footer-mission-text">
          We provide cutting-edge technology and strategic solutions to help businesses thrive in the digital age.
        </p>

        <!-- Contact Items with Round Badges -->
        <div class="footer-contact-list">
          <!-- Phone -->
          <div class="footer-contact-item">
            <div class="contact-badge" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Hotline 24/7</span>
              <div class="contact-value">
                <a href="tel:1900888628">1900 888 628</a> - <a href="tel:0971798186">0971 798 186</a>
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="footer-contact-item">
            <div class="contact-badge" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Email hỗ trợ</span>
              <div class="contact-value">
                <a href="mailto:support@dxtechs.vn">support@dxtechs.vn</a>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="footer-contact-item">
            <div class="contact-badge" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Trụ sở chính</span>
              <span class="contact-value address-value">Tầng 12, Bitexco Financial Tower, Quận 1, TP.HCM</span>
            </div>
          </div>
        </div>

        <!-- Social Icons Pill Row -->
        <div class="footer-social-row" aria-label="Mạng xã hội DXTechs">
          <a href="https://facebook.com" target="_blank" rel="noopener" class="social-circle-btn" aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-circle-btn" aria-label="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener" class="social-circle-btn" aria-label="YouTube">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#ffffff"></polygon>
            </svg>
          </a>
          <a href="/lien-he" class="social-circle-btn" aria-label="Tin nhắn trực tiếp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </a>
        </div>
      </div>

      <!-- Column 2: Giải pháp & Dịch vụ -->
      <div class="footer-col-nav">
        <div class="col-heading-wrap">
          <span class="col-dash" aria-hidden="true"></span>
          <h3 class="col-title">Giải pháp &amp; Dịch vụ</h3>
        </div>
        <ul class="col-links-list">
          <li>
            <RouterLink to="/phan-mem" class="footer-nav-item">
              <span>Phần mềm bản quyền</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'services', query: { category: 'cloud' } }" class="footer-nav-item">
              <span>Cloud VPS &amp; Hạ tầng</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'services', query: { category: 'domain' } }" class="footer-nav-item">
              <span>Hosting &amp; Tên miền</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/giai-phap/tu-van-trien-khai/he-thong-erp" class="footer-nav-item">
              <span>Tư vấn ERP Doanh nghiệp</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/du-an" class="footer-nav-item">
              <span>Dự án chuyển đổi số</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Column 3: Tài nguyên & Hỗ trợ -->
      <div class="footer-col-nav">
        <div class="col-heading-wrap">
          <span class="col-dash" aria-hidden="true"></span>
          <h3 class="col-title">Tài nguyên &amp; Hỗ trợ</h3>
        </div>
        <ul class="col-links-list">
          <li>
            <RouterLink to="/tai-nguyen" class="footer-nav-item">
              <span>Trung tâm tài nguyên</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/tai-nguyen?tab=glossary" class="footer-nav-item">
              <span>Từ điển thuật ngữ CNTT</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/tai-nguyen/goc-nhin/tin-tuc" class="footer-nav-item">
              <span>Tin tức &amp; Xu hướng số</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/don-hang" class="footer-nav-item">
              <span>Tra cứu giấy phép &amp; Đơn hàng</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/tai-khoan" class="footer-nav-item">
              <span>Tài khoản khách hàng</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/lien-he" class="footer-nav-item">
              <span>Liên hệ &amp; Báo giá</span>
              <span class="nav-chevron" aria-hidden="true">›</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Column 4: Chính sách & Pháp lý -->
      <div class="footer-col-nav">
        <div class="col-heading-wrap">
          <span class="col-dash" aria-hidden="true"></span>
          <h3 class="col-title">Chính sách &amp; Pháp lý</h3>
        </div>
        <ul class="col-links-list plain-links">
          <li>
            <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'purchase' } }">Chính sách mua hàng</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'refund' } }">Đổi trả &amp; Hoàn tiền 100%</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'vat' } }">Hóa đơn điện tử GTGT</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'renewal' } }">Bảo hành &amp; Gia hạn license</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Column 5: Đăng ký nhận tin (Glass Card) -->
      <div class="footer-col-newsletter">
        <div class="newsletter-card">
          <!-- Card Header with Paper Airplane Circle Badge -->
          <div class="newsletter-header">
            <div class="newsletter-badge" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
            <h3 class="newsletter-title">Đăng ký nhận tin</h3>
          </div>

          <p class="newsletter-desc">
            Cập nhật những xu hướng công nghệ, ưu đãi mới nhất từ DXTechs.
          </p>

          <!-- Input Pill Form -->
          <form class="newsletter-form" @submit.prevent="handleSubscribe">
            <div class="newsletter-input-wrap">
              <span class="newsletter-mail-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                v-model="newsletterEmail"
                type="email"
                required
                placeholder="Nhập email của bạn"
                class="newsletter-input"
                aria-label="Địa chỉ email nhận tin"
              />
              <button type="submit" class="newsletter-submit-btn" aria-label="Gửi đăng ký">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <p v-if="subscribeSuccess" class="newsletter-success-msg" role="status">
              ✓ Đã đăng ký thành công! Cảm ơn bạn.
            </p>
          </form>

          <!-- Security Assurance -->
          <div class="newsletter-security">
            <div class="security-shield-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div class="security-copy">
              <strong>Cam kết bảo mật</strong>
              <small>Thông tin của bạn luôn được bảo vệ</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Strip: Payment Methods & Social Connectivity -->
    <div class="footer-middle-strip">
      <div class="footer-middle-container">
        <!-- Payment Methods Group -->
        <div class="payment-methods-group">
          <div class="payment-label-wrap">
            <svg class="payment-card-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            <span class="middle-strip-label">Phương thức thanh toán</span>
          </div>

          <div class="middle-divider" aria-hidden="true"></div>

          <div class="payment-logos-row">
            <!-- VietQR -->
            <div class="payment-logo-item" title="VietQR">
              <svg width="78" height="24" viewBox="0 0 78 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4.5L10.5 20L17 4.5H13L10.5 14L8 4.5H4Z" fill="#ED1C24"/>
                <path d="M7.5 4.5L10.5 11.5L13.5 4.5H17L10.5 20L4 4.5H7.5Z" fill="#ED1C24"/>
                <text x="18" y="17" font-family="'Inter', sans-serif" font-size="14" font-weight="900" fill="#004B8D" letter-spacing="-0.02em">IETQR</text>
              </svg>
            </div>

            <!-- MoMo -->
            <div class="payment-logo-item" title="Ví MoMo">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="26" height="26" rx="6" fill="#A50064"/>
                <text x="13" y="11" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8" font-weight="800" fill="#FFFFFF">mo</text>
                <text x="13" y="20" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8" font-weight="800" fill="#FFFFFF">mo</text>
              </svg>
            </div>

            <!-- VISA -->
            <div class="payment-logo-item" title="VISA">
              <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="2" y="16.5" font-family="'Inter', sans-serif" font-size="17" font-style="italic" font-weight="900" fill="#1A1F71" letter-spacing="-0.04em">VISA</text>
                <path d="M2.5 4L7 4L5.2 8H2.5L2.5 4Z" fill="#F7B600" />
              </svg>
            </div>

            <!-- Mastercard -->
            <div class="payment-logo-item" title="Mastercard">
              <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="10" fill="#EB001B"/>
                <circle cx="23" cy="11" r="10" fill="#F79E1B"/>
                <path d="M17 4.2A10 10 0 0 1 17 17.8A10 10 0 0 1 17 4.2Z" fill="#FF5F00"/>
              </svg>
            </div>

            <!-- Chuyển khoản -->
            <div class="bank-transfer-item" title="Chuyển khoản ngân hàng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#004B8D" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M14 10v11M12 2L2 7h20L12 2z"/>
              </svg>
              <span>Chuyển khoản</span>
            </div>
          </div>
        </div>

        <div class="middle-divider middle-divider-right" aria-hidden="true"></div>

        <!-- Social Connectivity -->
        <div class="connect-group">
          <span class="middle-strip-label">Kết nối cùng DXTechs</span>
          <div class="connect-social-row">
            <a href="https://facebook.com" target="_blank" rel="noopener" class="connect-circle-btn" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" class="connect-circle-btn" aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener" class="connect-circle-btn" aria-label="YouTube">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#ffffff"></polygon>
              </svg>
            </a>
            <a href="https://zalo.me" target="_blank" rel="noopener" class="connect-circle-btn zalo-btn" aria-label="Zalo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#0068FF"/>
                <text x="12" y="16.5" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8" font-weight="900" fill="#FFFFFF">Zalo</text>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Dark Navy Bar -->
    <div class="footer-bottom-dark">
      <div class="footer-bottom-container">
        <!-- Left: Logo & Copyright -->
        <div class="bottom-left-group">
          <RouterLink to="/" class="bottom-brand" aria-label="DXTechs">
            <img src="/dxtechs-logo.png" alt="DXTechs" class="bottom-logo-img" />
          </RouterLink>

          <span class="bottom-v-divider" aria-hidden="true"></span>

          <span class="bottom-copyright">
            © 2026 DXTechs Corporation. All rights reserved.
          </span>
        </div>

        <!-- Right: Legal Links & Back To Top -->
        <div class="bottom-right-group">
          <nav class="bottom-nav-links" aria-label="Liên kết pháp lý chân trang">
            <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'terms' } }">Điều khoản sử dụng</RouterLink>
            <span class="bottom-link-sep" aria-hidden="true">|</span>
            <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'privacy' } }">Chính sách bảo mật</RouterLink>
            <span class="bottom-link-sep" aria-hidden="true">|</span>
            <RouterLink to="/tai-nguyen">Sitemap</RouterLink>
          </nav>

          <!-- Back to Top Button -->
          <button type="button" class="back-to-top-btn" @click="scrollToTop">
            <span class="top-icon-circle" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </span>
            <span>Lên đầu trang</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ==========================================================================
   MODERN FOOTER COMPONENT - EXACT MATCH TO REFERENCE SPECIFICATION
   ========================================================================== */

.site-footer-modern {
  position: relative;
  overflow: hidden;
  margin-top: 80px;
  background-color: #F8FAFD;
  color: #334155;
  font-family: 'Inter', -apple-system, sans-serif;
  border-top: 1px solid rgba(0, 98, 255, 0.08);
}

/* AI-Engineered High-Res Enterprise Tech Background Graphic */
.footer-bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.footer-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  opacity: 0.92;
  transition: opacity 0.3s ease;
}

.footer-bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 18% 40%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.35) 55%, transparent 100%),
              linear-gradient(to top, rgba(255, 255, 255, 0.45) 0%, transparent 65%);
  pointer-events: none;
}

/* Main Container */
.footer-main-container {
  position: relative;
  z-index: 2;
  max-width: 1340px;
  margin: 0 auto;
  padding: 64px 32px 36px 32px;
  display: grid;
  grid-template-columns: 1.35fr 0.95fr 1fr 0.9fr 1.35fr;
  gap: 36px;
}

@media (max-width: 1200px) {
  .footer-main-container {
    grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
  }
  .footer-col-nav:nth-child(4) {
    grid-column: span 1;
  }
}

@media (max-width: 992px) {
  .footer-main-container {
    grid-template-columns: 1fr 1fr;
    gap: 36px 24px;
  }
  .footer-col-brand,
  .footer-col-newsletter {
    grid-column: span 2;
  }
}

@media (max-width: 600px) {
  .footer-main-container {
    grid-template-columns: 1fr;
    padding: 44px 20px 24px 20px;
  }
  .footer-col-brand,
  .footer-col-newsletter {
    grid-column: span 1;
  }
}

/* Column 1: Brand & Vision */
.footer-col-brand {
  display: flex;
  flex-direction: column;
}

.footer-brand-link {
  display: inline-block;
  margin-bottom: 20px;
}

.footer-logo-img {
  height: 48px;
  width: auto;
  object-fit: contain;
}

.footer-tagline {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.25;
  color: #070E24;
  margin: 0 0 14px 0;
  letter-spacing: -0.02em;
}

.tagline-highlight {
  color: #0062FF;
}

.footer-mission-text {
  font-size: 13.5px;
  line-height: 1.6;
  color: #64748B;
  margin: 0 0 24px 0;
  max-width: 320px;
}

/* Contacts List with Round Badges */
.footer-contact-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.footer-contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-badge {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #EFF6FF;
  border: 1px solid rgba(0, 98, 255, 0.15);
  color: #0062FF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-text {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.contact-label {
  font-size: 11px;
  color: #64748B;
  font-weight: 500;
}

.contact-value {
  font-size: 13px;
  font-weight: 700;
  color: #070E24;
}

.contact-value a {
  color: #070E24;
  text-decoration: none;
  transition: color 0.18s ease;
}

.contact-value a:hover {
  color: #0062FF;
}

.address-value {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  line-height: 1.4;
}

/* Social Icons Row */
.footer-social-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.social-circle-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 1px solid rgba(15, 34, 74, 0.08);
  box-shadow: 0 2px 6px rgba(7, 14, 36, 0.04);
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.social-circle-btn:hover {
  background: #EFF6FF;
  color: #0062FF;
  border-color: rgba(0, 98, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 98, 255, 0.15);
}

/* Navigation Columns & Newsletter Card lowered down on Desktop as in reference */
.footer-col-nav {
  display: flex;
  flex-direction: column;
}

.footer-col-newsletter {
  display: flex;
  flex-direction: column;
}

@media (min-width: 993px) {
  .footer-col-nav {
    padding-top: 130px;
  }

  .footer-col-newsletter {
    padding-top: 106px;
  }
}

.col-heading-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.col-dash {
  display: inline-block;
  width: 16px;
  height: 2.5px;
  border-radius: 999px;
  background-color: #0062FF;
}

.col-title {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #070E24;
  margin: 0;
  letter-spacing: -0.01em;
}

.col-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #334155;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.18s ease;
  padding: 2px 0;
}

.nav-chevron {
  font-size: 15px;
  color: #94A3B8;
  transition: transform 0.2s ease, color 0.2s ease;
}

.footer-nav-item:hover {
  color: #0062FF;
}

.footer-nav-item:hover .nav-chevron {
  color: #0062FF;
  transform: translateX(4px);
}

.plain-links a {
  color: #334155;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.18s ease;
  display: inline-block;
  padding: 2px 0;
}

.plain-links a:hover {
  color: #0062FF;
}

/* Column 5: Newsletter Glass Card */
.footer-col-newsletter {
  display: flex;
  flex-direction: column;
}

.newsletter-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 36px -4px rgba(0, 98, 255, 0.08), 0 4px 12px rgba(7, 14, 36, 0.03);
  padding: 24px;
}

.newsletter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.newsletter-badge {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #0062FF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 98, 255, 0.25);
  flex-shrink: 0;
}

.newsletter-title {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #070E24;
  margin: 0;
}

.newsletter-desc {
  font-size: 13px;
  line-height: 1.55;
  color: #64748B;
  margin: 0 0 16px 0;
}

/* Pill Form */
.newsletter-form {
  margin-bottom: 18px;
}

.newsletter-input-wrap {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 9999px;
  padding: 4px 4px 4px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.newsletter-input-wrap:focus-within {
  border-color: #0062FF;
  box-shadow: 0 0 0 3px rgba(0, 98, 255, 0.12);
}

.newsletter-mail-icon {
  color: #94A3B8;
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.newsletter-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #070E24;
  flex: 1;
  min-width: 0;
  font-family: inherit;
}

.newsletter-input::placeholder {
  color: #94A3B8;
}

.newsletter-submit-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #0062FF;
  border: none;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.newsletter-submit-btn:hover {
  background: #1D4ED8;
  transform: scale(1.05);
}

.newsletter-success-msg {
  font-size: 12px;
  color: #16A34A;
  font-weight: 600;
  margin: 6px 0 0 4px;
}

/* Security Row */
.newsletter-security {
  display: flex;
  align-items: center;
  gap: 10px;
}

.security-shield-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #EFF6FF;
  color: #0062FF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.security-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.security-copy strong {
  font-size: 12px;
  font-weight: 700;
  color: #070E24;
}

.security-copy small {
  font-size: 11px;
  color: #64748B;
}

/* Middle Strip: Payment Methods & Social Connectivity */
.footer-middle-strip {
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(0, 98, 255, 0.08);
  padding: 24px 32px;
}

.footer-middle-container {
  max-width: 1340px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px 32px;
}

.payment-methods-group,
.connect-group {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.payment-label-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.payment-card-icon {
  color: #070E24;
  flex-shrink: 0;
}

.middle-strip-label {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #070E24;
}

.payment-logos-row {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}

.payment-logo-item {
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.payment-logo-item:hover {
  transform: translateY(-2px);
}

.bank-transfer-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #334155;
  font-size: 13.5px;
  font-weight: 600;
  transition: color 0.2s ease, transform 0.2s ease;
}

.bank-transfer-item:hover {
  color: #004B8D;
  transform: translateY(-1px);
}

.middle-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(15, 34, 74, 0.15);
}

@media (max-width: 900px) {
  .middle-divider-right {
    display: none;
  }
}

.connect-social-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.connect-circle-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 1px solid rgba(15, 34, 74, 0.1);
  box-shadow: 0 2px 8px rgba(7, 14, 36, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.connect-circle-btn:hover {
  transform: translateY(-2px) scale(1.06);
  box-shadow: 0 4px 14px rgba(0, 98, 255, 0.16);
  border-color: rgba(0, 98, 255, 0.3);
}

.zalo-btn {
  overflow: hidden;
  border: none;
}

/* Bottom Dark Navy Bar */
.footer-bottom-dark {
  background: #070E24;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 22px clamp(20px, 4vw, 48px);
  color: #94A3B8;
  position: relative;
  z-index: 3;
}

.footer-bottom-container {
  max-width: 1340px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px 24px;
}

.bottom-left-group {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.bottom-brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.bottom-logo-img {
  height: 24px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.95;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.bottom-brand:hover .bottom-logo-img {
  opacity: 1;
  transform: scale(1.04);
}

.bottom-v-divider {
  width: 1px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.2);
}

.bottom-copyright {
  font-size: 13px;
  color: #94A3B8;
}

.bottom-right-group {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.bottom-nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.bottom-nav-links a {
  color: #94A3B8;
  text-decoration: none;
  transition: color 0.18s ease;
}

.bottom-nav-links a:hover {
  color: #FFFFFF;
}

.bottom-link-sep {
  color: rgba(255, 255, 255, 0.25);
  font-size: 11px;
}

/* Scroll To Top Button */
.back-to-top-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  padding: 6px 14px 6px 8px;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.top-icon-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top-btn:hover {
  background: rgba(0, 98, 255, 0.25);
  border-color: #0062FF;
  transform: translateY(-2px);
}
</style>
