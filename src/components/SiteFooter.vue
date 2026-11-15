<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-brand">
        <RouterLink class="brand brand-light" to="/" aria-label="DXtechs - Trang chủ">
          <span class="brand-logo-frame"><img class="brand-logo" src="/dxtechs-logo.png" alt="DXtechs" /></span>
        </RouterLink>
        <p>Nền tảng công nghệ số &amp; giải pháp doanh nghiệp hàng đầu — Cung cấp phần mềm bản quyền chính hãng, hạ tầng đám mây Cloud VPS, giải pháp ERP và chuyển đổi số toàn diện.</p>
        <div class="footer-contact-mini">
          <div><span>Hotline 24/7:</span> <a href="tel:1900886628">1900 886 628</a> · <a href="tel:0971798186">0971 798 186</a></div>
          <div><span>Email hỗ trợ:</span> <a href="mailto:support@dxtechs.vn">support@dxtechs.vn</a></div>
          <div><span>Trụ sở chính:</span> Tầng 12, Bitexco Financial Tower, Quận 1, TP.HCM</div>
        </div>
      </div>
      <div class="footer-links">
        <h3>Giải pháp &amp; Dịch vụ</h3>
        <RouterLink to="/phan-mem">Phần mềm bản quyền</RouterLink>
        <RouterLink :to="{ name: 'services', query: { category: 'cloud' } }">Cloud VPS &amp; Hạ tầng</RouterLink>
        <RouterLink :to="{ name: 'services', query: { category: 'hosting' } }">Hosting &amp; Tên miền</RouterLink>
        <RouterLink to="/giai-phap/tu-van-trien-khai">Tư vấn ERP Doanh nghiệp</RouterLink>
        <RouterLink to="/du-an">Dự án chuyển đổi số</RouterLink>
      </div>
      <div class="footer-links">
        <h3>Tài nguyên &amp; Hỗ trợ</h3>
        <RouterLink to="/tai-nguyen">Trung tâm tài nguyên</RouterLink>
        <RouterLink to="/tai-nguyen?tab=glossary">Từ điển thuật ngữ CNTT</RouterLink>
        <RouterLink to="/tai-nguyen/goc-nhin/tin-tuc">Tin tức &amp; Xu hướng số</RouterLink>
        <RouterLink to="/don-hang">Tra cứu giấy phép &amp; Đơn hàng</RouterLink>
        <RouterLink to="/tai-khoan">Tài khoản khách hàng</RouterLink>
        <RouterLink to="/lien-he">Liên hệ &amp; Báo giá</RouterLink>
      </div>
      <div class="footer-links">
        <h3>Chính sách &amp; Pháp lý</h3>
        <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'purchase' } }">Chính sách mua hàng</RouterLink>
        <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'refund' } }">Đổi trả &amp; Hoàn tiền 100%</RouterLink>
        <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'vat' } }">Hóa đơn điện tử GTGT</RouterLink>
        <RouterLink :to="{ path: '/chinh-sach', query: { tab: 'renewal' } }">Bảo hành &amp; Gia hạn license</RouterLink>
        <div class="footer-cert-tags">
          <span class="cert-pill">✓ Bản quyền 100%</span>
          <span class="cert-pill">✓ SLA 99.9%</span>
        </div>
      </div>
    </div>

    <div class="footer-trust-strip">
      <div class="footer-trust-group">
        <h3>Cam kết từ DXtechs</h3>
        <div class="footer-trust-items">
          <div class="footer-trust-badge">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>Bản quyền 100%<small>Kích hoạt chính hãng</small></span>
          </div>
          <div class="footer-trust-badge">
            <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            <span>License tức thì<small>Cấp tự động 24/7</small></span>
          </div>
          <div class="footer-trust-badge">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            <span>Hóa đơn VAT<small>Chuẩn Thông tư 78</small></span>
          </div>
        </div>
      </div>
      <div class="footer-trust-group">
        <h3>Phương thức thanh toán</h3>
        <div class="footer-payment-list">
          <span>VietQR</span>
          <span class="payment-momo">MoMo</span>
          <span class="payment-visa">VISA</span>
          <span class="payment-mastercard">Mastercard</span>
          <span class="payment-bank">Chuyển khoản</span>
        </div>
      </div>
      <div class="footer-trust-group">
        <h3>Kết nối cùng DXtechs</h3>
        <div class="footer-social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
            <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube">
            <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          </a>
          <a href="mailto:support@dxtechs.vn" aria-label="Gửi email">
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 DXtechs Corporation. Giấy phép ĐKKD số 0316892415 cấp bởi Sở KH&amp;ĐT TP.HCM.</span>
      <span>Hệ sinh thái chuyển đổi số &amp; Bản quyền phần mềm doanh nghiệp hàng đầu</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 64px;
  background: #f8fafc;
  color: #475569;
  border-top: 1px solid rgba(15, 34, 74, 0.08);
  font-family: 'Inter', -apple-system, sans-serif;
}

.footer-brand > p {
  color: #475569;
  font-size: 13px;
  line-height: 1.6;
}

.footer-contact-mini {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #1e293b !important;
  line-height: 1.55;
}

.footer-contact-mini span {
  color: #0062ff !important;
  font-weight: 700;
  margin-right: 4px;
  font-family: 'Be Vietnam Pro', sans-serif;
}

.footer-contact-mini a {
  color: #070e24 !important;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.18s ease;
}

.footer-contact-mini a:hover {
  color: #0062ff !important;
  text-decoration: underline;
}

.footer-main h3,
.footer-trust-group h3 {
  font-family: 'Be Vietnam Pro', sans-serif;
  color: #070e24;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.footer-main > div:not(:first-child) a {
  color: #475569;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.18s ease;
}

.footer-main > div:not(:first-child) a:hover {
  color: #0062ff;
}

.cert-pill {
  background: #eff6ff;
  border: 1px solid rgba(0, 98, 255, 0.2);
  color: #0062ff;
  font-weight: 700;
  font-size: 11px;
}

.footer-trust-badge {
  background: #ffffff;
  border: 1px solid rgba(15, 34, 74, 0.08);
  color: #070e24;
}

.footer-trust-badge svg {
  color: #0062ff;
}

.footer-trust-badge > span {
  color: #070e24;
}

.footer-trust-badge small {
  color: #64748b;
}

.footer-payment-list > span {
  background: #ffffff;
  border: 1px solid rgba(15, 34, 74, 0.08);
  color: #070e24;
  font-weight: 600;
}

.footer-social-links a {
  background: #ffffff;
  border: 1px solid rgba(15, 34, 74, 0.08);
  color: #64748b;
}

.footer-social-links a:hover {
  background: #eff6ff;
  border-color: #0062ff;
  color: #0062ff;
}

.footer-bottom {
  color: #64748b;
  font-size: 12px;
  border-top: 1px solid rgba(15, 34, 74, 0.08);
}
</style>
