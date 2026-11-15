<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import LucianPaymentRing from '../components/LucianPaymentRing.vue'
import { formatPrice } from '../data/products'
import { useShopStore, type DemoOrder } from '../stores/shop'

const shop = useShopStore()
const router = useRouter()

// Customer form state
const customer = reactive({
  name: shop.user?.name || 'Nguyễn Văn An',
  email: shop.user?.email || 'an.nguyen@dxtechs.vn',
  phone: shop.user?.phone || '0971 798 186',
  company: shop.user?.company || 'DXTechs Digital Corp',
  note: '',
})

// Validation state
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  terms: '',
  vatCompany: '',
  vatTaxCode: '',
  vatInvoiceEmail: '',
  vatAddress: '',
})

const touched = reactive({
  name: false,
  email: false,
  phone: false,
  terms: false,
  vatCompany: false,
  vatTaxCode: false,
  vatInvoiceEmail: false,
  vatAddress: false,
})

const selectedPaymentMethod = ref<'vietqr' | 'momo' | 'card' | 'corporate'>('vietqr')
const requestVatInvoice = ref(false)
const vatInfo = reactive({
  companyName: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ SỐ DXTECHS',
  taxCode: '0318299102',
  address: 'Tầng 18, Tòa nhà Bitexco Financial, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  invoiceEmail: 'invoice@dxtechs.vn',
})

const cardInfo = reactive({
  cardNumber: '4532 •••• •••• 8899',
  holderName: 'NGUYEN VAN AN',
  expiry: '12/28',
  cvv: '789',
})

const agreeTerms = ref(true)
const isProcessing = ref(false)
const processingStep = ref('')
const completedOrder = ref<DemoOrder | null>(null)
const copiedKey = ref(false)
const copiedOrderId = ref(false)

const total = computed(() => shop.finalTotal)
const mockOrderCode = ref(`DXT${Math.floor(100000 + Math.random() * 900000)}`)

const vietQrUrl = computed(() => {
  return `https://img.vietqr.io/image/MB-0971798186-compact2.png?amount=${total.value}&addInfo=${mockOrderCode.value}&accountName=CONG%20TY%20CP%20CONG%20NGHE%20DXTECHS`
})

// RFC Standard Email Regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// Vietnamese Phone Number Regex (10 digits starting with 03, 05, 07, 08, 09 or +84)
const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/
// Tax Code Regex (10 digits or 13 digits with optional hyphen)
const taxCodeRegex = /^[0-9]{10}(-[0-9]{3})?$|^[0-9]{13}$/

function validateField(field: keyof typeof errors) {
  switch (field) {
    case 'name':
      if (!customer.name.trim()) {
        errors.name = 'Vui lòng nhập họ và tên người nhận giấy phép bản quyền.'
      } else if (customer.name.trim().length < 2) {
        errors.name = 'Họ và tên người nhận cần tối thiểu 2 ký tự.'
      } else {
        errors.name = ''
      }
      break

    case 'email':
      if (!customer.email.trim()) {
        errors.email = 'Vui lòng nhập địa chỉ email nhận mã bản quyền.'
      } else if (!emailRegex.test(customer.email.trim())) {
        errors.email = 'Email không đúng định dạng. Ví dụ: an.nguyen@company.com'
      } else {
        errors.email = ''
      }
      break

    case 'phone':
      if (customer.phone.trim()) {
        const cleanPhone = customer.phone.replace(/[\s.-]/g, '')
        if (!vnPhoneRegex.test(cleanPhone)) {
          errors.phone = 'Số điện thoại không hợp lệ (Ví dụ: 0971 798 186 hoặc 0912345678).'
        } else {
          errors.phone = ''
        }
      } else {
        errors.phone = ''
      }
      break

    case 'terms':
      if (!agreeTerms.value) {
        errors.terms = 'Vui lòng tích chọn đồng ý với Điều khoản dịch vụ và Chính sách bản quyền để tiếp tục.'
      } else {
        errors.terms = ''
      }
      break

    case 'vatCompany':
      if (requestVatInvoice.value && !vatInfo.companyName.trim()) {
        errors.vatCompany = 'Vui lòng nhập tên công ty / đơn vị nhận hóa đơn.'
      } else {
        errors.vatCompany = ''
      }
      break

    case 'vatTaxCode':
      if (requestVatInvoice.value) {
        const cleanTax = vatInfo.taxCode.trim().replace(/\s/g, '')
        if (!cleanTax) {
          errors.vatTaxCode = 'Vui lòng nhập mã số thuế doanh nghiệp.'
        } else if (!taxCodeRegex.test(cleanTax)) {
          errors.vatTaxCode = 'Mã số thuế phải gồm 10 hoặc 13 chữ số hợp lệ.'
        } else {
          errors.vatTaxCode = ''
        }
      } else {
        errors.vatTaxCode = ''
      }
      break

    case 'vatInvoiceEmail':
      if (requestVatInvoice.value) {
        if (!vatInfo.invoiceEmail.trim()) {
          errors.vatInvoiceEmail = 'Vui lòng nhập email nhận hóa đơn điện tử.'
        } else if (!emailRegex.test(vatInfo.invoiceEmail.trim())) {
          errors.vatInvoiceEmail = 'Email nhận hóa đơn không đúng định dạng.'
        } else {
          errors.vatInvoiceEmail = ''
        }
      } else {
        errors.vatInvoiceEmail = ''
      }
      break

    case 'vatAddress':
      if (requestVatInvoice.value && !vatInfo.address.trim()) {
        errors.vatAddress = 'Vui lòng nhập địa chỉ công ty đăng ký trên ĐKKD.'
      } else {
        errors.vatAddress = ''
      }
      break
  }
}

function onFieldBlur(field: keyof typeof errors) {
  touched[field] = true
  validateField(field)
}

function onFieldInput(field: keyof typeof errors) {
  if (touched[field]) {
    validateField(field)
  }
}

function validateAll(): boolean {
  touched.name = true
  touched.email = true
  touched.phone = true
  touched.terms = true

  validateField('name')
  validateField('email')
  validateField('phone')
  validateField('terms')

  if (requestVatInvoice.value) {
    touched.vatCompany = true
    touched.vatTaxCode = true
    touched.vatInvoiceEmail = true
    touched.vatAddress = true

    validateField('vatCompany')
    validateField('vatTaxCode')
    validateField('vatInvoiceEmail')
    validateField('vatAddress')
  }

  const hasErrors = Object.values(errors).some((err) => !!err)
  return !hasErrors
}

function fillDemoCard() {
  cardInfo.cardNumber = '4532 9012 3456 8899'
  cardInfo.holderName = customer.name ? customer.name.toUpperCase() : 'NGUYEN VAN AN'
  cardInfo.expiry = '12/28'
  cardInfo.cvv = '789'
  shop.notify('Đã điền thông tin thẻ Visa Test (Mô phỏng Sandbox)')
}

function copyLicenseKey(code: string) {
  navigator.clipboard?.writeText(code)
  copiedKey.value = true
  shop.notify(`Đã sao chép License Key: ${code}`)
  setTimeout(() => {
    copiedKey.value = false
  }, 2500)
}

function copyOrderId(id: string) {
  navigator.clipboard?.writeText(id)
  copiedOrderId.value = true
  shop.notify(`Đã sao chép Mã đơn hàng: ${id}`)
  setTimeout(() => {
    copiedOrderId.value = false
  }, 2500)
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard?.writeText(text)
  shop.notify(`Đã sao chép ${label}: ${text}`)
}

async function submitOrder() {
  const isValid = validateAll()
  if (!isValid) {
    // Smooth scroll and focus to the first invalid field
    nextTick(() => {
      const firstInvalidElement = document.querySelector('.is-invalid, .terms-error-alert') as HTMLElement | null
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (typeof (firstInvalidElement as HTMLInputElement).focus === 'function') {
          ;(firstInvalidElement as HTMLInputElement).focus()
        }
      }
    })
    return
  }

  isProcessing.value = true
  processingStep.value = 'Đang xác thực thông tin và kiểm tra kho bản quyền...'
  await new Promise((resolve) => setTimeout(resolve, 500))

  processingStep.value = 'Đang khởi tạo mã License Key chính hãng từ cổng đối tác...'
  await new Promise((resolve) => setTimeout(resolve, 600))

  processingStep.value = 'Đang hoàn tất giao dịch mô phỏng Sandbox và kích hoạt tài khoản...'
  await new Promise((resolve) => setTimeout(resolve, 500))

  const paymentMethodLabel =
    selectedPaymentMethod.value === 'vietqr'
      ? 'VietQR Tự động (MB Bank)'
      : selectedPaymentMethod.value === 'momo'
      ? 'Ví Điện Tử MoMo'
      : selectedPaymentMethod.value === 'card'
      ? 'Thẻ Quốc Tế Visa / Mastercard (Demo)'
      : 'Hợp Đồng Doanh Nghiệp B2B (Net-30)'

  const order = shop.completeCheckout({
    customerName: customer.name.trim(),
    customerEmail: customer.email.trim(),
    customerPhone: customer.phone.trim(),
    paymentMethod: paymentMethodLabel,
    vatRequested: requestVatInvoice.value,
    companyName: requestVatInvoice.value ? vatInfo.companyName.trim() : undefined,
    taxCode: requestVatInvoice.value ? vatInfo.taxCode.trim() : undefined,
  })

  isProcessing.value = false
  if (order) {
    completedOrder.value = order
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function finishAndGoToAccount() {
  completedOrder.value = null
  router.push('/don-hang')
}
</script>

<template>
  <div class="content-wrap checkout-view">
    <PageIntro
      category="Thanh toán an toàn"
      title="Thanh toán &amp; Nhận bản quyền tức thì"
      description="Điền thông tin nhận giấy phép và lựa chọn hình thức thanh toán thuận tiện. License key chính hãng sẽ được kích hoạt tự động ngay sau khi hoàn tất giao dịch."
    />

    <!-- ============================================================ -->
    <!-- EDGE CASE 1: GIỎ HÀNG TRỐNG (EMPTY CART STATE)               -->
    <!-- ============================================================ -->
    <div v-if="!shop.cart.length && !completedOrder" class="checkout-empty-state">
      <div class="empty-icon-circle">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="8" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          <line x1="16" y1="9" x2="16" y2="13"></line>
        </svg>
      </div>
      <span class="empty-tag">Giỏ hàng thanh toán</span>
      <h3 class="empty-title">Giỏ hàng thanh toán đang trống</h3>
      <p class="empty-desc">
        Bạn hiện chưa chọn sản phẩm bản quyền phần mềm hoặc giải pháp đám mây nào để thanh toán. Hãy chọn sản phẩm phù hợp trong danh mục của DXTechs để nhận giấy phép kích hoạt tự động tức thì.
      </p>

      <div class="empty-actions">
        <RouterLink to="/phan-mem" class="btn-primary-explore">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          Khám phá Phần mềm Bản quyền
        </RouterLink>
        <RouterLink to="/dich-vu" class="btn-secondary-explore">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Xem Dịch vụ &amp; Giải pháp Số
        </RouterLink>
      </div>

      <!-- Trust Strip in Empty State -->
      <div class="empty-trust-strip">
        <div class="empty-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>100% Bản quyền chính hãng có cam kết bảo hành</span>
        </div>
        <div class="empty-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          <span>Cấp License Key tự động sau khi giao dịch hoàn tất</span>
        </div>
        <div class="empty-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Hỗ trợ kỹ thuật kích hoạt từ xa 24/7 từ kỹ sư</span>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- CHECKOUT FORM WITH RESILIENT VALIDATION                      -->
    <!-- ============================================================ -->
    <form v-else-if="!completedOrder" class="checkout-grid" novalidate @submit.prevent="submitOrder">
      <!-- Left Column: Customer & Payment Details -->
      <div class="checkout-form-column">
        <!-- 1. Customer Information Card -->
        <section class="checkout-card" aria-labelledby="customer-info-heading">
          <div class="card-title-group">
            <span class="step-badge">1</span>
            <h3 id="customer-info-heading">Thông tin nhận giấy phép bản quyền</h3>
          </div>
          <p class="section-desc">Mã kích hoạt bản quyền chính hãng và tài liệu hướng dẫn cài đặt sẽ được bàn giao tự động về email này.</p>

          <div class="form-row-2">
            <!-- Full Name -->
            <div class="form-group" :class="{ 'has-error': errors.name && touched.name }">
              <label for="cust-name">
                Họ và tên người nhận <span class="required-star" aria-hidden="true">*</span>
              </label>
              <input
                id="cust-name"
                v-model="customer.name"
                type="text"
                placeholder="Ví dụ: Nguyễn Văn An"
                :class="{ 'is-invalid': errors.name && touched.name }"
                :aria-invalid="errors.name && touched.name ? 'true' : 'false'"
                aria-describedby="cust-name-error"
                @input="onFieldInput('name')"
                @blur="onFieldBlur('name')"
              />
              <span
                v-if="errors.name && touched.name"
                id="cust-name-error"
                class="field-error-msg"
                role="alert"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {{ errors.name }}
              </span>
            </div>

            <!-- Email (EDGE CASE 2: NHẬP SAI EMAIL) -->
            <div class="form-group" :class="{ 'has-error': errors.email && touched.email }">
              <label for="cust-email">
                Email nhận mã bản quyền <span class="required-star" aria-hidden="true">*</span>
              </label>
              <input
                id="cust-email"
                v-model="customer.email"
                type="email"
                placeholder="Ví dụ: an.nguyen@company.com"
                :class="{ 'is-invalid': errors.email && touched.email }"
                :aria-invalid="errors.email && touched.email ? 'true' : 'false'"
                aria-describedby="cust-email-error"
                @input="onFieldInput('email')"
                @blur="onFieldBlur('email')"
              />
              <span
                v-if="errors.email && touched.email"
                id="cust-email-error"
                class="field-error-msg"
                role="alert"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {{ errors.email }}
              </span>
            </div>
          </div>

          <div class="form-row-2">
            <!-- Phone Number -->
            <div class="form-group" :class="{ 'has-error': errors.phone && touched.phone }">
              <label for="cust-phone">Số điện thoại liên hệ (nhận SMS OTP / Zalo OA)</label>
              <input
                id="cust-phone"
                v-model="customer.phone"
                type="tel"
                placeholder="Ví dụ: 0971 798 186"
                :class="{ 'is-invalid': errors.phone && touched.phone }"
                :aria-invalid="errors.phone && touched.phone ? 'true' : 'false'"
                aria-describedby="cust-phone-error"
                @input="onFieldInput('phone')"
                @blur="onFieldBlur('phone')"
              />
              <span
                v-if="errors.phone && touched.phone"
                id="cust-phone-error"
                class="field-error-msg"
                role="alert"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {{ errors.phone }}
              </span>
            </div>

            <!-- Organization / Company (Optional) -->
            <div class="form-group">
              <label for="cust-company">Tổ chức / Doanh nghiệp sử dụng (tùy chọn)</label>
              <input
                id="cust-company"
                v-model="customer.company"
                type="text"
                placeholder="Ví dụ: DXTechs Digital Corp"
              />
            </div>
          </div>

          <!-- VAT invoice toggle & section -->
          <div class="vat-invoice-toggle">
            <label class="checkbox-label">
              <input
                v-model="requestVatInvoice"
                type="checkbox"
                @change="errors.vatCompany = ''; errors.vatTaxCode = ''; errors.vatInvoiceEmail = ''; errors.vatAddress = ''"
              />
              <span>Yêu cầu xuất Hóa đơn điện tử VAT 10% (Dành cho Doanh nghiệp)</span>
            </label>

            <div v-if="requestVatInvoice" class="vat-inputs-box">
              <div class="form-group" :class="{ 'has-error': errors.vatCompany && touched.vatCompany }">
                <label>Tên công ty / Đơn vị mua hàng trên ĐKKD <span class="required-star">*</span></label>
                <input
                  v-model="vatInfo.companyName"
                  type="text"
                  placeholder="CÔNG TY CỔ PHẦN CÔNG NGHỆ SỐ DXTECHS"
                  :class="{ 'is-invalid': errors.vatCompany && touched.vatCompany }"
                  @input="onFieldInput('vatCompany')"
                  @blur="onFieldBlur('vatCompany')"
                />
                <span v-if="errors.vatCompany && touched.vatCompany" class="field-error-msg" role="alert">
                  {{ errors.vatCompany }}
                </span>
              </div>

              <div class="form-row-2">
                <div class="form-group" :class="{ 'has-error': errors.vatTaxCode && touched.vatTaxCode }">
                  <label>Mã số thuế doanh nghiệp <span class="required-star">*</span></label>
                  <input
                    v-model="vatInfo.taxCode"
                    type="text"
                    placeholder="0318299102"
                    :class="{ 'is-invalid': errors.vatTaxCode && touched.vatTaxCode }"
                    @input="onFieldInput('vatTaxCode')"
                    @blur="onFieldBlur('vatTaxCode')"
                  />
                  <span v-if="errors.vatTaxCode && touched.vatTaxCode" class="field-error-msg" role="alert">
                    {{ errors.vatTaxCode }}
                  </span>
                </div>

                <div class="form-group" :class="{ 'has-error': errors.vatInvoiceEmail && touched.vatInvoiceEmail }">
                  <label>Email nhận hóa đơn điện tử <span class="required-star">*</span></label>
                  <input
                    v-model="vatInfo.invoiceEmail"
                    type="email"
                    placeholder="invoice@dxtechs.vn"
                    :class="{ 'is-invalid': errors.vatInvoiceEmail && touched.vatInvoiceEmail }"
                    @input="onFieldInput('vatInvoiceEmail')"
                    @blur="onFieldBlur('vatInvoiceEmail')"
                  />
                  <span v-if="errors.vatInvoiceEmail && touched.vatInvoiceEmail" class="field-error-msg" role="alert">
                    {{ errors.vatInvoiceEmail }}
                  </span>
                </div>
              </div>

              <div class="form-group" :class="{ 'has-error': errors.vatAddress && touched.vatAddress }">
                <label>Địa chỉ doanh nghiệp ghi trên hóa đơn <span class="required-star">*</span></label>
                <input
                  v-model="vatInfo.address"
                  type="text"
                  placeholder="Tầng 18, Tòa nhà Bitexco Financial, Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                  :class="{ 'is-invalid': errors.vatAddress && touched.vatAddress }"
                  @input="onFieldInput('vatAddress')"
                  @blur="onFieldBlur('vatAddress')"
                />
                <span v-if="errors.vatAddress && touched.vatAddress" class="field-error-msg" role="alert">
                  {{ errors.vatAddress }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Payment Method Card with Simulation Banner -->
        <section class="checkout-card mt-6" aria-labelledby="payment-method-heading">
          <div class="card-title-group">
            <span class="step-badge">2</span>
            <h3 id="payment-method-heading">Phương thức thanh toán bảo mật</h3>
          </div>

          <!-- EDGE CASE 3: THÔNG BÁO MÔ PHỎNG THANH TOÁN RÕ RÀNG (SANDBOX DEMO CALLOUT) -->
          <div class="sandbox-simulation-callout" role="note">
            <div class="sandbox-callout-header">
              <span class="sandbox-badge-pulse">
                <span class="pulse-dot"></span>
                CHẾ ĐỘ THANH TOÁN MÔ PHỎNG (SANDBOX DEMO)
              </span>
            </div>
            <p class="sandbox-callout-text">
              Hệ thống thanh toán đang hoạt động trong <strong>môi trường thử nghiệm trực quan (Sandbox)</strong>. Mã bản quyền và giấy phép số sẽ được cấp tự động tức thì ngay khi xác nhận mà <strong>không trừ tiền thật</strong> trong tài khoản ngân hàng hoặc thẻ của quý khách.
            </p>
          </div>

          <!-- Method selector tabs -->
          <div class="payment-tabs-grid" role="tablist" aria-label="Lựa chọn phương thức thanh toán">
            <button
              type="button"
              role="tab"
              :aria-selected="selectedPaymentMethod === 'vietqr'"
              class="payment-tab-btn"
              :class="{ active: selectedPaymentMethod === 'vietqr' }"
              @click="selectedPaymentMethod = 'vietqr'"
            >
              <span class="tab-badge-rec">Khuyên dùng</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <strong>VietQR Tức thì</strong>
              <small>Quét mã qua app ngân hàng</small>
            </button>

            <button
              type="button"
              role="tab"
              :aria-selected="selectedPaymentMethod === 'momo'"
              class="payment-tab-btn"
              :class="{ active: selectedPaymentMethod === 'momo' }"
              @click="selectedPaymentMethod = 'momo'"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="4"></rect>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <strong>Ví MoMo</strong>
              <small>Thanh toán ví điện tử</small>
            </button>

            <button
              type="button"
              role="tab"
              :aria-selected="selectedPaymentMethod === 'card'"
              class="payment-tab-btn"
              :class="{ active: selectedPaymentMethod === 'card' }"
              @click="selectedPaymentMethod = 'card'"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <strong>Thẻ Quốc tế</strong>
              <small>Visa · Mastercard · JCB</small>
            </button>

            <button
              type="button"
              role="tab"
              :aria-selected="selectedPaymentMethod === 'corporate'"
              class="payment-tab-btn"
              :class="{ active: selectedPaymentMethod === 'corporate' }"
              @click="selectedPaymentMethod = 'corporate'"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <strong>Hợp đồng B2B</strong>
              <small>Trả chậm Net-30 ngày</small>
            </button>
          </div>

          <!-- VietQR Details Panel -->
          <div v-if="selectedPaymentMethod === 'vietqr'" class="payment-method-details vietqr-panel">
            <div class="qr-col">
              <div class="qr-frame">
                <img :src="vietQrUrl" alt="Mã VietQR thanh toán tự động qua App Ngân hàng" />
                <span class="qr-pulse-tag">Tự động kích hoạt 24/7 (Sandbox)</span>
              </div>
            </div>
            <div class="bank-info-col">
              <h4>Chuyển khoản liên ngân hàng 24/7 (Mô phỏng)</h4>
              <p class="text-sm text-muted">Mở App ngân hàng bất kỳ (Vietcombank, MB, Techcombank, VPBank...) và chọn <strong>Quét mã QR</strong>.</p>

              <div class="bank-data-list">
                <div class="data-row">
                  <span class="label">Ngân hàng thụ hưởng:</span>
                  <span class="val font-bold">MB Bank (Ngân hàng Quân Đội)</span>
                </div>
                <div class="data-row">
                  <span class="label">Số tài khoản:</span>
                  <div class="copy-val-group">
                    <span class="val highlight">0971 798 186</span>
                    <button type="button" @click="copyToClipboard('0971798186', 'Số tài khoản')">Sao chép</button>
                  </div>
                </div>
                <div class="data-row">
                  <span class="label">Chủ tài khoản:</span>
                  <span class="val">CONG TY CP CONG NGHE DXTECHS</span>
                </div>
                <div class="data-row">
                  <span class="label">Số tiền cần thanh toán:</span>
                  <div class="copy-val-group">
                    <span class="val highlight text-cyan">{{ formatPrice(total) }}</span>
                    <button type="button" @click="copyToClipboard(total.toString(), 'Số tiền')">Sao chép</button>
                  </div>
                </div>
                <div class="data-row">
                  <span class="label">Nội dung chuyển khoản:</span>
                  <div class="copy-val-group">
                    <span class="val highlight text-orange">{{ mockOrderCode }}</span>
                    <button type="button" @click="copyToClipboard(mockOrderCode, 'Nội dung chuyển khoản')">Sao chép</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Credit card details panel -->
          <div v-if="selectedPaymentMethod === 'card'" class="payment-method-details card-panel">
            <div class="card-preview-box">
              <div class="card-chip"></div>
              <div class="card-number-display">{{ cardInfo.cardNumber }}</div>
              <div class="card-meta-flex">
                <div>
                  <small>CHỦ THẺ</small>
                  <strong>{{ cardInfo.holderName || 'CARD HOLDER' }}</strong>
                </div>
                <div>
                  <small>HẠN DÙNG</small>
                  <strong>{{ cardInfo.expiry || 'MM/YY' }}</strong>
                </div>
              </div>
            </div>

            <div class="card-form-inputs">
              <div class="form-group">
                <label>Số thẻ tín dụng / ghi nợ</label>
                <input v-model="cardInfo.cardNumber" type="text" placeholder="4532 9012 3456 8899" />
              </div>
              <div class="form-row-2">
                <div class="form-group">
                  <label>Tên in trên thẻ</label>
                  <input v-model="cardInfo.holderName" type="text" placeholder="NGUYEN VAN AN" />
                </div>
                <div class="form-row-2">
                  <div class="form-group">
                    <label>Hạn dùng</label>
                    <input v-model="cardInfo.expiry" type="text" placeholder="12/28" />
                  </div>
                  <div class="form-group">
                    <label>CVV</label>
                    <input v-model="cardInfo.cvv" type="password" maxlength="4" placeholder="789" />
                  </div>
                </div>
              </div>
              <button type="button" class="btn-fill-demo" @click="fillDemoCard">
                <svg class="text-cyan-400 animate-pulse icon-ai-glow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: inline-block; vertical-align: -2px; margin-right: 5px;">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
                Điền thông tin thẻ Visa Test nhanh (Mô phỏng Sandbox)
              </button>
            </div>
          </div>

          <!-- MoMo details panel -->
          <div v-if="selectedPaymentMethod === 'momo'" class="payment-method-details momo-panel">
            <div class="momo-badge-banner">
              <strong>Thanh toán tiện lợi qua Ví Điện Tử MoMo (Sandbox)</strong>
              <p>Mở ứng dụng MoMo trên điện thoại và quét mã QR để kích hoạt bản quyền tức thì.</p>
            </div>
          </div>

          <!-- Corporate details panel -->
          <div v-if="selectedPaymentMethod === 'corporate'" class="payment-method-details corporate-panel">
            <div class="corporate-banner">
              <strong>Hợp đồng B2B &amp; Xuất hóa đơn công nợ 30 ngày</strong>
              <p>Hỗ trợ đầy đủ hợp đồng kinh tế ba bên, biên bản bàn giao bản quyền và đối soát hóa đơn vào cuối kỳ.</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Order Summary & Place Order Button -->
      <div class="checkout-summary-column">
        <div class="summary-card sticky-card">
          <h3 class="summary-card-title">Tóm tắt đơn hàng ({{ shop.cartCount }})</h3>

          <ul class="summary-items-list" aria-label="Danh sách sản phẩm thanh toán">
            <li v-for="item in shop.cart" :key="item.product.id" class="summary-item">
              <img :src="item.product.imageUrl" class="summary-thumb" :alt="item.product.name" />
              <div class="summary-item-meta">
                <h4>{{ item.product.name }}</h4>
                <div class="text-xs text-muted">Số lượng: x{{ item.quantity }} · {{ item.product.term }}</div>
              </div>
              <div class="summary-item-price">{{ formatPrice(item.product.price * item.quantity) }}</div>
            </li>
          </ul>

          <div class="pricing-breakdown">
            <div class="price-line">
              <span>Tạm tính</span>
              <span>{{ formatPrice(shop.subtotal) }}</span>
            </div>
            <div v-if="shop.discountAmount > 0" class="price-line discount">
              <span>Mã giảm giá ({{ shop.couponCode }})</span>
              <span>-{{ formatPrice(shop.discountAmount) }}</span>
            </div>
            <div class="price-line">
              <span>VAT (10%)</span>
              <span>Đã bao gồm</span>
            </div>
            <div class="price-line final-total">
              <span>Tổng thanh toán</span>
              <strong class="total-big">{{ formatPrice(total) }}</strong>
            </div>
          </div>

          <!-- Terms & Agreement checkbox with inline error -->
          <div class="terms-agreement">
            <label class="checkbox-label" :class="{ 'has-terms-error': errors.terms && touched.terms }">
              <input
                v-model="agreeTerms"
                type="checkbox"
                @change="onFieldInput('terms')"
              />
              <span class="text-xs">
                Tôi đồng ý với <RouterLink to="/chinh-sach" target="_blank">Điều khoản dịch vụ</RouterLink> và cam kết bản quyền chính hãng của DXTechs.
              </span>
            </label>
            <p v-if="errors.terms && touched.terms" class="terms-error-alert" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {{ errors.terms }}
            </p>
          </div>

          <!-- Lucian UX/UI Prompt #081: Payment ring and check -->
          <div class="lucian-payment-wrapper">
            <LucianPaymentRing
              :amount-text="formatPrice(total)"
              :total-amount="formatPrice(total)"
              :items="shop.cart.slice(0, 2).map((it) => ({ name: it.product.name, price: formatPrice(it.product.price * it.quantity) }))"
              :order-code="mockOrderCode"
              :card-title="selectedPaymentMethod === 'card' ? 'Thẻ Visa Doanh Nghiệp' : selectedPaymentMethod === 'vietqr' ? 'VietQR Tự Động MB' : 'MoMo Doanh Nghiệp'"
              card-subtitle="•••• 0818"
              @pay="submitOrder"
              @complete="shop.notify('Đã hoàn tất thanh toán & cấp mã bản quyền')"
              @reset="completedOrder = null"
            />
          </div>

          <div class="trust-badges">
            <div class="trust-badge-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>Bản quyền chính hãng 100% từ NSX</span>
            </div>
            <div class="trust-badge-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Kích hoạt tự động ngay sau 30 giây</span>
            </div>
            <div class="trust-badge-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>Gửi chứng từ &amp; hóa đơn VAT về email</span>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- ============================================================ -->
    <!-- EDGE CASE 3: THÔNG BÁO XÁC NHẬN THANH TOÁN MÔ PHỎNG RÕ RÀNG   -->
    <!-- SUCCESS ORDER & LICENSE GRANT CONFIRMATION MODAL             -->
    <!-- ============================================================ -->
    <div v-if="completedOrder" class="success-order-modal" role="dialog" aria-modal="true" aria-labelledby="modal-success-title">
      <div class="success-card">
        <!-- Close button if user wants to dismiss modal -->
        <button
          type="button"
          class="modal-close-btn"
          aria-label="Đóng thông báo xác nhận"
          @click="completedOrder = null"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div class="success-check-icon">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <!-- Distinct simulation pill -->
        <div class="simulation-status-pill">
          <span class="pill-dot"></span>
          GIAO DỊCH MÔ PHỎNG THÀNH CÔNG (SANDBOX DEMO)
        </div>

        <h2 id="modal-success-title" class="success-title">Đã cấp phép bản quyền số thành công!</h2>
        <p class="success-desc">
          Cảm ơn quý khách <strong>{{ completedOrder.customerName }}</strong>. Hệ thống DXTechs đã ghi nhận giao dịch mô phỏng, cấp mã giấy phép chính hãng và lưu an toàn vào tài khoản của bạn.
        </p>

        <!-- LICENSE KEY BOX -->
        <div class="license-reveal-box">
          <div class="reveal-header">
            <span class="reveal-tag">MÃ GIẤY PHÉP BẢN QUYỀN (LICENSE KEY) ĐÃ CẤP</span>
            <button
              type="button"
              class="license-copy-action-btn"
              :class="{ 'copied': copiedKey }"
              @click="copyLicenseKey(completedOrder.licenseCode)"
            >
              <svg v-if="!copiedKey" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066cc" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              {{ copiedKey ? '✓ Đã sao chép key' : 'Sao chép mã' }}
            </button>
          </div>
          <code class="license-code-big">{{ completedOrder.licenseCode }}</code>
          <div class="reveal-footer-notes">
            <span class="security-seal">✓ Bản quyền chính hãng 100% · Kích hoạt vĩnh viễn / theo gói</span>
            <span class="activation-method">Dán trực tiếp trên phần mềm hoặc website đối tác</span>
          </div>
        </div>

        <!-- ORDER RECEIPT SUMMARY -->
        <div class="order-quick-summary">
          <div class="q-row">
            <span>Mã đơn hàng:</span>
            <div class="copy-val-group">
              <strong class="font-mono">{{ completedOrder.id }}</strong>
              <button
                type="button"
                class="mini-copy-btn"
                @click="copyOrderId(completedOrder.id)"
              >
                {{ copiedOrderId ? '✓ Đã chép' : 'Chép mã' }}
              </button>
            </div>
          </div>
          <div class="q-row">
            <span>Khách hàng:</span>
            <strong>{{ completedOrder.customerName }}</strong>
          </div>
          <div class="q-row">
            <span>Email bàn giao:</span>
            <strong class="text-cyan">{{ completedOrder.customerEmail }}</strong>
          </div>
          <div class="q-row">
            <span>Phương thức:</span>
            <span>{{ completedOrder.paymentMethod }}</span>
          </div>
          <div class="q-row">
            <span>Trạng thái:</span>
            <span class="status-badge-completed">Đã cấp phép (Mô phỏng Sandbox)</span>
          </div>
          <div v-if="completedOrder.vatRequested && completedOrder.companyName" class="q-row">
            <span>Hóa đơn VAT:</span>
            <span class="text-xs text-muted">{{ completedOrder.companyName }} (MST: {{ completedOrder.taxCode }})</span>
          </div>
          <div class="q-row total-highlight">
            <span>Tổng thanh toán:</span>
            <strong class="total-receipt-price">{{ formatPrice(completedOrder.total) }}</strong>
          </div>
        </div>

        <!-- 3-STEP POST PURCHASE ACTIVATION GUIDE (CLARIFY STANDARD) -->
        <div class="next-steps-guide">
          <h4 class="guide-title">3 bước tiếp theo để sử dụng bản quyền:</h4>
          <ol class="steps-list">
            <li>
              <span class="step-num">1</span>
              <div>
                <strong>Kiểm tra hộp thư điện tử:</strong>
                <p>Chi tiết giấy phép và file hướng dẫn kích hoạt <code>.pdf</code> đã được gửi đến <strong>{{ completedOrder.customerEmail }}</strong>.</p>
              </div>
            </li>
            <li>
              <span class="step-num">2</span>
              <div>
                <strong>Kích hoạt phần mềm:</strong>
                <p>Mở ứng dụng hoặc trang quản trị bản quyền, nhập License Key ở trên để kích hoạt ngay lập tức.</p>
              </div>
            </li>
            <li>
              <span class="step-num">3</span>
              <div>
                <strong>Hỗ trợ kỹ thuật 24/7:</strong>
                <p>Cần hỗ trợ cài đặt từ xa qua UltraViewer / AnyDesk? Kỹ sư DXTechs luôn sẵn sàng qua Hotline <strong>0971 798 186</strong>.</p>
              </div>
            </li>
          </ol>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="success-actions">
          <button class="btn-primary-finish" type="button" @click="finishAndGoToAccount">
            Vào Kho Bản Quyền Trong Tài Khoản Của Bạn →
          </button>
          <button class="btn-secondary-continue" type="button" @click="completedOrder = null; router.push('/phan-mem')">
            Tiếp tục mua sắm sản phẩm khác
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-view {
  padding-bottom: 5rem;
}

/* ============================================================
   EDGE CASE 1: EMPTY CART STATE
============================================================ */
.checkout-empty-state {
  text-align: center;
  padding: 4.5rem 2rem;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
  max-width: 680px;
  margin: 2.5rem auto;
  box-shadow: none;
}

.empty-icon-circle {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-pill, 9999px);
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  color: #0066cc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: none;
}

.empty-tag {
  display: inline-block;
  background: #f5f5f7;
  color: #0066cc;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: var(--radius-pill, 9999px);
  letter-spacing: -0.01em;
  margin-bottom: 0.75rem;
}

.empty-title {
  font-family: var(--heading);
  font-size: 28px;
  color: #1d1d1f;
  margin: 0 0 0.85rem;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.empty-desc {
  color: #7a7a7a;
  font-size: 15px;
  line-height: 1.5;
  max-width: 540px;
  margin: 0 auto 2rem;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.btn-primary-explore {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #0066cc;
  color: #ffffff;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.15s ease, transform 0.15s ease;
  box-shadow: none;
  border: none;
}
.btn-primary-explore:hover {
  background: #0066cc;
}
.btn-primary-explore:active {
  transform: scale(0.95);
}

.btn-secondary-explore {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f5f5f7;
  color: #1d1d1f;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  transition: background-color 0.15s ease, transform 0.15s ease;
}
.btn-secondary-explore:hover {
  background: #e0e0e0;
}
.btn-secondary-explore:active {
  transform: scale(0.95);
}

.empty-trust-strip {
  padding-top: 1.75rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  text-align: left;
  max-width: 480px;
  margin: 0 auto;
}

.empty-trust-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 13px;
  color: #7a7a7a;
}

/* ============================================================
   CHECKOUT GRID & CARDS
============================================================ */
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 390px;
  gap: 2rem;
  margin-top: 2rem;
  align-items: start;
}

@media (max-width: 992px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

.checkout-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
  padding: 2rem;
  box-shadow: none;
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.card-title-group h3 {
  font-family: var(--heading);
  font-size: 21px;
  margin: 0;
  color: #1d1d1f;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.step-badge {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-pill, 9999px);
  background: #0066cc;
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-desc {
  color: #7a7a7a;
  font-size: 14px;
  margin: 0 0 1.5rem;
  line-height: 1.47;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .form-row-2 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1.15rem;
}

.form-group label {
  font-size: 13px;
  color: #1d1d1f;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required-star {
  color: #0066cc;
  font-weight: 600;
}

.form-group input,
.form-group select {
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  color: #1d1d1f;
  padding: 12px 14px;
  border-radius: var(--radius-md, 11px);
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  outline: none;
}

.form-group input::placeholder {
  color: #7a7a7a;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #0071e3;
  outline: 2px solid #0071e3;
  outline-offset: 1px;
  background: #ffffff;
  box-shadow: none;
}

/* ============================================================
   EDGE CASE 2: FORM FIELD ERRORS & RESILIENCE
============================================================ */
.form-group input.is-invalid {
  border-color: #1d1d1f !important;
  background: #f5f5f7;
  outline: 2px solid #0071e3;
}

.field-error-msg {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 12px;
  color: #1d1d1f;
  font-weight: 600;
  margin-top: 0.25rem;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-3px); }
  to { opacity: 1; transform: translateY(0); }
}

.vat-invoice-toggle {
  margin-top: 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e0e0e0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  cursor: pointer;
  font-size: 14px;
  color: #1d1d1f;
  line-height: 1.45;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: #0066cc;
  cursor: pointer;
}

.vat-inputs-box {
  margin-top: 1.15rem;
  padding: 1.25rem;
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
}

/* ============================================================
   EDGE CASE 3: SANDBOX CALLOUT & PAYMENT METHOD SELECTOR
============================================================ */
.sandbox-simulation-callout {
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.sandbox-callout-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.45rem;
}

.sandbox-badge-pulse {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 12px;
  font-weight: 600;
  color: #0066cc;
  letter-spacing: -0.01em;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-pill, 9999px);
  background: #0066cc;
}

.sandbox-callout-text {
  font-size: 13px;
  color: #7a7a7a;
  line-height: 1.5;
  margin: 0;
}

.sandbox-callout-text strong {
  color: #1d1d1f;
}

/* Payment tabs */
.payment-tabs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.payment-tab-btn {
  position: relative;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 1.25rem 0.75rem;
  border-radius: var(--radius-md, 11px);
  color: #7a7a7a;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  text-align: center;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  font-family: inherit;
  box-shadow: none;
}

.payment-tab-btn:hover {
  background: #f5f5f7;
  color: #1d1d1f;
  border-color: #0066cc;
}

.payment-tab-btn.active {
  background: #f5f5f7;
  border-color: #0066cc;
  color: #0066cc;
  outline: 2px solid #0066cc;
  outline-offset: -1px;
}

.tab-badge-rec {
  position: absolute;
  top: -8px;
  right: -6px;
  background: #0066cc;
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
}

.payment-tab-btn strong {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
}

.payment-tab-btn.active strong {
  color: #0066cc;
}

.payment-tab-btn small {
  font-size: 12px;
  color: #7a7a7a;
}

.payment-method-details {
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
}

/* VietQR Panel */
.vietqr-panel {
  display: flex;
  gap: 2rem;
  align-items: center;
}

@media (max-width: 640px) {
  .vietqr-panel {
    flex-direction: column;
    text-align: center;
  }
}

.qr-frame {
  background: #ffffff;
  padding: 1rem;
  border-radius: var(--radius-lg, 18px);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none;
  border: 1px solid #e0e0e0;
}

.qr-frame img {
  width: 170px;
  height: 170px;
  display: block;
}

.qr-pulse-tag {
  margin-top: 0.5rem;
  background: #0066cc;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-pill, 9999px);
}

.bank-info-col h4 {
  font-family: var(--heading);
  font-size: 17px;
  margin: 0 0 0.35rem;
  color: #1d1d1f;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.bank-data-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.data-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  gap: 0.5rem;
}

.data-row .label {
  color: #7a7a7a;
}

.copy-val-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.copy-val-group .val.highlight {
  font-family: var(--font-body, -apple-system, BlinkMacSystemFont, sans-serif);
  font-size: 14px;
  font-weight: 600;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #1d1d1f;
  padding: 4px 8px;
  border-radius: var(--radius-sm, 8px);
}

.copy-val-group button {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #0066cc;
  padding: 4px 10px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.copy-val-group button:hover {
  background: #f5f5f7;
  border-color: #0066cc;
}
.copy-val-group button:active {
  transform: scale(0.95);
}

/* Card Panel */
.card-preview-box {
  background: #272729;
  border: 1px solid #424245;
  border-radius: var(--radius-lg, 18px);
  padding: 1.5rem;
  color: #ffffff;
  margin-bottom: 1.5rem;
  box-shadow: none;
}

.card-chip {
  width: 40px;
  height: 28px;
  background: #424245;
  border-radius: var(--radius-sm, 8px);
  margin-bottom: 1.25rem;
}

.card-number-display {
  font-family: monospace;
  font-size: 18px;
  letter-spacing: 0.15em;
  margin-bottom: 1.25rem;
  color: #ffffff;
}

.card-meta-flex {
  display: flex;
  justify-content: space-between;
}
.card-meta-flex small {
  display: block;
  font-size: 11px;
  color: #cccccc;
}

.btn-fill-demo {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #0066cc;
  padding: 10px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  width: 100%;
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.btn-fill-demo:hover {
  background: #f5f5f7;
  border-color: #0066cc;
}
.btn-fill-demo:active {
  transform: scale(0.95);
}

.momo-badge-banner,
.corporate-banner {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 1.25rem;
  border-radius: var(--radius-md, 11px);
  line-height: 1.5;
}
.momo-badge-banner strong,
.corporate-banner strong {
  display: block;
  margin-bottom: 0.35rem;
  color: #1d1d1f;
  font-weight: 600;
}
.momo-badge-banner p,
.corporate-banner p {
  margin: 0;
  color: #7a7a7a;
  font-size: 13px;
}

/* ============================================================
   RIGHT COLUMN: SUMMARY CARD
============================================================ */
.summary-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
  padding: 1.75rem;
  box-shadow: none;
}

.sticky-card {
  position: sticky;
  top: 100px;
}

.summary-card-title {
  font-family: var(--heading);
  font-size: 21px;
  margin: 0 0 1.25rem;
  color: #1d1d1f;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.summary-items-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 240px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.summary-thumb {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm, 8px);
  object-fit: cover;
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  box-shadow: rgba(0, 0, 0, 0.22) 3px 5px 30px 0;
}

.summary-item-meta {
  flex: 1;
  min-width: 0;
}
.summary-item-meta h4 {
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1d1d1f;
  font-weight: 600;
}

.summary-item-price {
  font-weight: 600;
  font-size: 14px;
  color: #1d1d1f;
}

.pricing-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.price-line {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #7a7a7a;
}

.price-line.discount {
  color: #0066cc;
  font-weight: 600;
}

.price-line.final-total {
  font-size: 17px;
  color: #1d1d1f;
  font-weight: 600;
  padding-top: 0.65rem;
  border-top: 1px solid #e0e0e0;
}

.total-big {
  color: #0066cc;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.terms-agreement {
  margin: 1.25rem 0;
}

.terms-agreement a {
  color: #0066cc;
  text-decoration: underline;
}

.terms-error-alert {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 12px;
  color: #1d1d1f;
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-sm, 8px);
  padding: 0.45rem 0.65rem;
  margin-top: 0.5rem;
  animation: fadeIn 0.2s ease-in-out;
}

.btn-place-order {
  width: 100%;
  background: #0066cc;
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
  box-shadow: none;
  font-family: inherit;
}
.btn-place-order:hover:not(:disabled) {
  background: #0066cc;
}
.btn-place-order:active:not(:disabled) {
  transform: scale(0.95);
}
.btn-place-order:disabled {
  opacity: 0.6;
  cursor: wait;
}

.simulation-mini-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-size: 12px;
  color: #7a7a7a;
  margin-top: 0.65rem;
  text-align: center;
}

.processing-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.trust-badges {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding-top: 1.15rem;
  border-top: 1px solid #e0e0e0;
}

.trust-badge-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 13px;
  color: #0066cc;
  font-weight: 600;
}

/* ============================================================
   EDGE CASE 3: SUCCESS ORDER CONFIRMATION MODAL
============================================================ */
.success-order-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.success-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
  padding: 2.5rem 2.25rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: none;
  animation: modalScale 0.25s ease-out;
  margin: auto;
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: transparent;
  border: none;
  color: #7a7a7a;
  cursor: pointer;
  padding: 0.35rem;
  border-radius: var(--radius-sm, 8px);
  transition: color 0.15s ease;
}
.modal-close-btn:hover {
  color: #1d1d1f;
}

.success-check-icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-pill, 9999px);
  background: #f5f5f7;
  border: 2px solid #e0e0e0;
  color: #0066cc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.15rem;
}

.simulation-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  color: #0066cc;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-pill, 9999px);
  margin-bottom: 0.85rem;
}

.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #0066cc;
}

.success-title {
  font-family: var(--heading);
  font-size: 24px;
  margin: 0 0 0.5rem;
  color: #1d1d1f;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.success-desc {
  color: #7a7a7a;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 1.75rem;
}

.success-desc strong {
  color: #1d1d1f;
}

/* License Reveal Box */
.license-reveal-box {
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
  padding: 1.35rem;
  margin-bottom: 1.5rem;
  text-align: left;
  box-shadow: none;
}

.reveal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.65rem;
}

.reveal-tag {
  font-size: 12px;
  color: #7a7a7a;
  font-weight: 600;
}

.license-copy-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #0066cc;
  padding: 4px 12px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.license-copy-action-btn:hover {
  background: #0066cc;
  color: #ffffff;
}
.license-copy-action-btn:active {
  transform: scale(0.95);
}
.license-copy-action-btn.copied {
  background: #f5f5f7;
  border-color: #0066cc;
  color: #0066cc;
}

.license-code-big {
  display: block;
  font-family: monospace;
  font-size: 18px;
  font-weight: 600;
  color: #0066cc;
  letter-spacing: 0.05em;
  background: #ffffff;
  padding: 12px 16px;
  border-radius: var(--radius-md, 11px);
  border: 1px solid #e0e0e0;
  word-break: break-all;
  text-align: center;
}

.reveal-footer-notes {
  margin-top: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 12px;
}

.security-seal {
  color: #0066cc;
  font-weight: 600;
}

.activation-method {
  color: #7a7a7a;
}

/* Quick receipt */
.order-quick-summary {
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.q-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #7a7a7a;
  margin-bottom: 0.45rem;
}
.q-row strong {
  color: #1d1d1f;
  font-weight: 600;
}
.q-row.total-highlight {
  margin-top: 0.65rem;
  padding-top: 0.65rem;
  border-top: 1px solid #e0e0e0;
  font-size: 15px;
}

.total-receipt-price {
  color: #0066cc;
  font-size: 18px;
  font-weight: 600;
}

.mini-copy-btn {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #1d1d1f;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  cursor: pointer;
  transition: transform 0.15s ease;
}
.mini-copy-btn:hover {
  color: #0066cc;
  border-color: #0066cc;
}
.mini-copy-btn:active {
  transform: scale(0.95);
}

.status-badge-completed {
  background: #f5f5f7;
  color: #0066cc;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid #e0e0e0;
}

/* 3-Step Guide */
.next-steps-guide {
  background: #f5f5f7;
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-lg, 18px);
  padding: 1.25rem;
  margin-bottom: 1.75rem;
  text-align: left;
}

.guide-title {
  font-size: 14px;
  font-weight: 600;
  color: #0066cc;
  margin: 0 0 0.75rem;
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.steps-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 13px;
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: var(--radius-pill, 9999px);
  background: #0066cc;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.steps-list li div strong {
  color: #1d1d1f;
  display: block;
  margin-bottom: 0.15rem;
  font-weight: 600;
}

.steps-list li div p {
  margin: 0;
  color: #7a7a7a;
  line-height: 1.45;
}

.steps-list li div code {
  color: #0066cc;
  background: #ffffff;
  padding: 2px 6px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid #e0e0e0;
}

/* Modal Actions */
.success-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-primary-finish {
  background: #0066cc;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease;
  font-family: inherit;
  box-shadow: none;
}
.btn-primary-finish:hover {
  background: #0066cc;
}
.btn-primary-finish:active {
  transform: scale(0.95);
}

.btn-secondary-continue {
  background: #f5f5f7;
  color: #1d1d1f;
  border: 1px solid #e0e0e0;
  padding: 12px 24px;
  border-radius: var(--radius-pill, 9999px);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
  font-family: inherit;
}
.btn-secondary-continue:hover {
  background: #e0e0e0;
  color: #0066cc;
}
.btn-secondary-continue:active {
  transform: scale(0.95);
}

.text-cyan { color: #0066cc; }
.text-orange { color: #0066cc; }
.mt-6 { margin-top: 1.5rem; }
.font-mono { font-family: monospace; }
</style>
