import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { products as defaultProducts, type Product } from '../data/products'

export interface CartItem {
  product: Product
  quantity: number
}

export interface DemoOrder {
  id: string
  date: string
  total: number
  items: CartItem[]
  status: 'Đã cấp phép' | 'Đang xử lý' | 'Đã hủy'
  licenseCode: string
  paymentMethod: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  vatRequested?: boolean
  companyName?: string
  taxCode?: string
}

export interface DemoUser {
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  company?: string
  avatar?: string
}

const DEFAULT_ORDERS: DemoOrder[] = [
  {
    id: 'DH98234102',
    date: '04/11/2026',
    total: 2040000,
    items: [
      { product: defaultProducts[0], quantity: 1 }, // Windows 11 Pro
      { product: defaultProducts[1], quantity: 1 }, // Microsoft 365
    ],
    status: 'Đã cấp phép',
    licenseCode: 'W11P-DXT9-8821-VK29',
    paymentMethod: 'VietQR (MB Bank)',
    customerName: 'Nguyễn Văn An',
    customerEmail: 'an.nguyen@dxtechs.vn',
    customerPhone: '0971 798 186',
    companyName: 'DXTechs Digital Corp',
    taxCode: '0318299102',
  },
  {
    id: 'DH98172938',
    date: '01/11/2026',
    total: 2490000,
    items: [
      { product: defaultProducts[2], quantity: 1 }, // JetBrains All Products
    ],
    status: 'Đã cấp phép',
    licenseCode: 'JB-ALL-DXT7-9021',
    paymentMethod: 'Thẻ Quốc tế Visa',
    customerName: 'Trần Minh Hoàng',
    customerEmail: 'hoang.dev@gmail.com',
    customerPhone: '0988 123 456',
    companyName: 'VNG Games Studio',
  },
  {
    id: 'DH98091823',
    date: '28/10/2026',
    total: 3990000,
    items: [
      { product: defaultProducts[3] || defaultProducts[0], quantity: 1 }, // Adobe CC
    ],
    status: 'Đã cấp phép',
    licenseCode: 'ADOBE-CC-9941-TK82',
    paymentMethod: 'VietQR (Techcombank)',
    customerName: 'Lê Thị Hương Thảo',
    customerEmail: 'thao.le@creativestudio.vn',
    customerPhone: '0903 556 789',
    companyName: 'Thao Studio Design',
    taxCode: '0316781290',
  },
  {
    id: 'DH97982144',
    date: '25/10/2026',
    total: 1450000,
    items: [
      { product: defaultProducts[5] || defaultProducts[1], quantity: 1 }, // GitHub Copilot
    ],
    status: 'Đang xử lý',
    licenseCode: 'GH-CP-ENT-8819-VN',
    paymentMethod: 'Chuyển khoản VietinBank',
    customerName: 'Vũ Đình Phong',
    customerEmail: 'phong.vu@fpt.com',
    customerPhone: '0912 345 678',
    companyName: 'FPT Software Da Nang',
  },
  {
    id: 'DH97891205',
    date: '22/10/2026',
    total: 1250000,
    items: [
      { product: defaultProducts[4] || defaultProducts[0], quantity: 1 }, // Figma Pro
    ],
    status: 'Đã cấp phép',
    licenseCode: 'FIGMA-PRO-4421-DXT',
    paymentMethod: 'Ví MoMo Doanh Nghiệp',
    customerName: 'Phạm Quốc Bảo',
    customerEmail: 'bao.pham@fintech.vn',
    customerPhone: '0934 987 654',
    companyName: 'Momo FinTech Labs',
  },
  {
    id: 'DH97712398',
    date: '18/10/2026',
    total: 1800000,
    items: [
      { product: defaultProducts[6] || defaultProducts[2], quantity: 1 }, // Cloud VPS NVMe
    ],
    status: 'Đã cấp phép',
    licenseCode: 'VPS-NVME-FPT-0012',
    paymentMethod: 'VietQR (BIDV)',
    customerName: 'Ngô Đăng Khoa',
    customerEmail: 'khoa.ngo@viettel.vn',
    customerPhone: '0966 223 344',
    companyName: 'Viettel Telecom Solutions',
    taxCode: '0100109106',
  },
  {
    id: 'DH97654110',
    date: '15/10/2026',
    total: 490000,
    items: [
      { product: defaultProducts[6] || defaultProducts[1], quantity: 1 }, // Canva Pro
    ],
    status: 'Đã cấp phép',
    licenseCode: 'CANVA-PRO-7712-ENT',
    paymentMethod: 'VietQR (VPBank)',
    customerName: 'Bùi Hoàng Oanh',
    customerEmail: 'oanh.bui@agency.vn',
    customerPhone: '0977 445 566',
    companyName: 'Oanh Media & Marketing',
  },
  {
    id: 'DH97541299',
    date: '10/10/2026',
    total: 1590000,
    items: [
      { product: defaultProducts[7] || defaultProducts[0], quantity: 1 }, // Synology C2 Backup
    ],
    status: 'Đang xử lý',
    licenseCode: 'SYNO-C2-8812-BK01',
    paymentMethod: 'Chuyển khoản VCB',
    customerName: 'Đặng Tuấn Kiệt',
    customerEmail: 'kiet.dang@hcmut.edu.vn',
    customerPhone: '0908 112 233',
    companyName: 'Đại Học Bách Khoa TP.HCM',
  },
  {
    id: 'DH97410287',
    date: '05/10/2026',
    total: 1490000,
    items: [
      { product: defaultProducts[0], quantity: 1 },
    ],
    status: 'Đã hủy',
    licenseCode: 'MS-OFF-PRO-9921-X',
    paymentMethod: 'VietQR (MB Bank)',
    customerName: 'Hoàng Nhật Minh',
    customerEmail: 'minh.hn@startuphub.vn',
    customerPhone: '0944 889 900',
    companyName: 'NextGen Startup Hub',
  },
]

export const useShopStore = defineStore('shop', () => {
  // 1. Cart State (Persistent)
  const savedCart = localStorage.getItem('dxtechs_cart')
  const cart = ref<CartItem[]>(savedCart ? JSON.parse(savedCart) : [])

  // 2. Orders State (Persistent with multi-record default fallback for pagination)
  const savedOrders = localStorage.getItem('dxtechs_orders')
  let initialOrders: DemoOrder[] = DEFAULT_ORDERS
  if (savedOrders) {
    try {
      const parsed = JSON.parse(savedOrders)
      if (Array.isArray(parsed) && parsed.length >= 4) {
        initialOrders = parsed
      }
    } catch {
      initialOrders = DEFAULT_ORDERS
    }
  }
  const orders = ref<DemoOrder[]>(initialOrders)

  // 3. User Auth State (Persistent)
  const savedUser = localStorage.getItem('dxtechs_user')
  const user = ref<DemoUser | null>(
    savedUser
      ? JSON.parse(savedUser)
      : {
          name: 'Nguyễn Văn An',
          email: 'an.nguyen@dxtechs.vn',
          role: 'customer',
          phone: '0971 798 186',
          company: 'DXTechs Digital Corp',
        },
  )

  // 4. Products State (Allows Admin to Add/Edit/Delete products)
  const savedProducts = localStorage.getItem('dxtechs_admin_products')
  const productList = ref<Product[]>(savedProducts ? JSON.parse(savedProducts) : defaultProducts)

  // 5. UI Drawer & Notice States
  const isCartDrawerOpen = ref(false)
  const notice = ref('')
  const couponCode = ref('')
  const discountPercent = ref(0)
  let noticeTimer: ReturnType<typeof setTimeout> | undefined

  // Save to localStorage automatically on changes
  watch(cart, (newVal) => {
    localStorage.setItem('dxtechs_cart', JSON.stringify(newVal))
  }, { deep: true })

  watch(orders, (newVal) => {
    localStorage.setItem('dxtechs_orders', JSON.stringify(newVal))
  }, { deep: true })

  watch(user, (newVal) => {
    if (newVal) localStorage.setItem('dxtechs_user', JSON.stringify(newVal))
    else localStorage.removeItem('dxtechs_user')
  }, { deep: true })

  watch(productList, (newVal) => {
    localStorage.setItem('dxtechs_admin_products', JSON.stringify(newVal))
  }, { deep: true })

  // Computed Calculations
  const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
  const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
  const discountAmount = computed(() => Math.round((subtotal.value * discountPercent.value) / 100))
  const finalTotal = computed(() => Math.max(0, subtotal.value - discountAmount.value))

  // Notifications
  function notify(message: string) {
    notice.value = message
    if (noticeTimer) clearTimeout(noticeTimer)
    noticeTimer = setTimeout(() => {
      notice.value = ''
      noticeTimer = undefined
    }, 3500)
  }

  function clearNotice() {
    notice.value = ''
    if (noticeTimer) clearTimeout(noticeTimer)
    noticeTimer = undefined
  }

  // Drawer toggles
  function openCartDrawer() {
    isCartDrawerOpen.value = true
  }

  function closeCartDrawer() {
    isCartDrawerOpen.value = false
  }

  // Cart actions
  function addToCart(product: Product, quantity: number = 1, openDrawer: boolean = true) {
    const existing = cart.value.find((item) => item.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      cart.value.push({ product, quantity })
    }
    notify(`Đã thêm "${product.name}" vào giỏ hàng`)
    if (openDrawer) {
      openCartDrawer()
    }
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = cart.value.find((cartItem) => cartItem.product.id === productId)
    if (!item) return
    if (quantity <= 0) removeFromCart(productId)
    else item.quantity = Math.min(quantity, 99)
  }

  function removeFromCart(productId: number) {
    cart.value = cart.value.filter((item) => item.product.id !== productId)
    notify('Đã cập nhật giỏ hàng')
  }

  function clearCart() {
    cart.value = []
    couponCode.value = ''
    discountPercent.value = 0
    notify('Đã làm trống giỏ hàng')
  }

  // Coupon handling
  function applyCoupon(code: string): { success: boolean; message: string } {
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) return { success: false, message: 'Vui lòng nhập mã ưu đãi' }

    if (cleanCode === 'DXTECHS2025' || cleanCode === 'DXTECH') {
      couponCode.value = cleanCode
      discountPercent.value = 15
      notify(`Đã áp dụng mã ${cleanCode}: Giảm 15%`)
      return { success: true, message: 'Áp dụng mã DXTechs thành công (-15%)' }
    } else if (cleanCode === 'VIP20') {
      couponCode.value = cleanCode
      discountPercent.value = 20
      notify(`Đã áp dụng mã VIP: Giảm 20%`)
      return { success: true, message: 'Áp dụng mã Đối tác VIP thành công (-20%)' }
    } else if (cleanCode === 'WELCOME10' || cleanCode === 'START') {
      couponCode.value = cleanCode
      discountPercent.value = 10
      notify(`Đã áp dụng mã Người dùng mới (-10%)`)
      return { success: true, message: 'Áp dụng mã Người dùng mới thành công (-10%)' }
    }

    return { success: false, message: 'Mã ưu đãi không hợp lệ hoặc đã hết hạn' }
  }

  function removeCoupon() {
    couponCode.value = ''
    discountPercent.value = 0
    notify('Đã hủy áp dụng mã ưu đãi')
  }

  // Auth actions
  function signIn(name: string, email: string, role: 'customer' | 'admin' = 'customer', phone: string = '', company: string = '') {
    user.value = { name, email, role, phone, company }
    notify(`Xin chào ${name}, bạn đã đăng nhập thành công với vai trò ${role === 'admin' ? 'Quản trị viên (Admin)' : 'Khách hàng'}`)
  }

  function signOut() {
    user.value = null
    notify('Bạn đã đăng xuất khỏi tài khoản')
  }

  function switchRole(newRole: 'customer' | 'admin') {
    if (!user.value) {
      user.value = {
        name: newRole === 'admin' ? 'Admin DXTechs' : 'Nguyễn Văn An',
        email: newRole === 'admin' ? 'admin@dxtechs.vn' : 'an.nguyen@dxtechs.vn',
        role: newRole,
      }
    } else {
      user.value.role = newRole
    }
    notify(`Đã chuyển đổi sang chế độ: ${newRole === 'admin' ? 'Quản trị viên (Admin)' : 'Khách hàng'}`)
  }

  // Checkout actions
  function completeCheckout(details: {
    customerName: string
    customerEmail: string
    customerPhone?: string
    paymentMethod: string
    vatRequested?: boolean
    companyName?: string
    taxCode?: string
  }): DemoOrder | null {
    if (!cart.value.length) return null

    const orderId = `DH${Date.now().toString().slice(-8)}`
    const licensePrefix = cart.value[0]?.product.slug.slice(0, 4).toUpperCase() || 'DXT'
    const licenseCode = `${licensePrefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    const order: DemoOrder = {
      id: orderId,
      date: new Intl.DateTimeFormat('vi-VN').format(new Date()),
      total: finalTotal.value,
      items: cart.value.map((item) => ({ ...item })),
      status: 'Đã cấp phép',
      licenseCode,
      paymentMethod: details.paymentMethod,
      customerName: details.customerName,
      customerEmail: details.customerEmail,
      customerPhone: details.customerPhone,
      vatRequested: details.vatRequested,
      companyName: details.companyName,
      taxCode: details.taxCode,
    }

    orders.value.unshift(order)

    // Update current user if needed
    if (!user.value) {
      user.value = {
        name: details.customerName,
        email: details.customerEmail,
        role: 'customer',
        phone: details.customerPhone,
        company: details.companyName,
      }
    }

    cart.value = []
    couponCode.value = ''
    discountPercent.value = 0
    closeCartDrawer()
    notify(`Thanh toán thành công! Mã đơn hàng: ${order.id}`)
    return order
  }

  // Admin Actions
  function adminUpdateOrderStatus(orderId: string, newStatus: 'Đã cấp phép' | 'Đang xử lý' | 'Đã hủy') {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = newStatus
      notify(`Đã cập nhật đơn hàng ${orderId} sang trạng thái: ${newStatus}`)
    }
  }

  function adminAddProduct(newProduct: Omit<Product, 'id'>) {
    const newId = Math.max(...productList.value.map((p) => p.id), 0) + 1
    const product: Product = { ...newProduct, id: newId }
    productList.value.unshift(product)
    notify(`Đã thêm sản phẩm mới: ${product.name}`)
  }

  function adminUpdateProduct(id: number, updates: Partial<Product>) {
    const idx = productList.value.findIndex((p) => p.id === id)
    if (idx !== -1) {
      productList.value[idx] = { ...productList.value[idx], ...updates }
      notify(`Đã cập nhật sản phẩm: ${productList.value[idx].name}`)
    }
  }

  function adminDeleteProduct(id: number) {
    productList.value = productList.value.filter((p) => p.id !== id)
    notify(`Đã xóa sản phẩm khỏi danh mục`)
  }

  return {
    cart,
    orders,
    user,
    productList,
    isCartDrawerOpen,
    notice,
    couponCode,
    discountPercent,
    discountAmount,
    cartCount,
    subtotal,
    finalTotal,
    notify,
    clearNotice,
    openCartDrawer,
    closeCartDrawer,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    signIn,
    signOut,
    switchRole,
    completeCheckout,
    adminUpdateOrderStatus,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
  }
})
