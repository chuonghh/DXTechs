import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

// Trang chủ tải ngay; các trang còn lại tách thành chunk riêng và chỉ tải khi người dùng mở,
// để lần tải đầu không phải kéo toàn bộ ứng dụng (Admin, Checkout, Account... rất lớn).
const CatalogView = () => import('../views/CatalogView.vue')
const ProductView = () => import('../views/ProductView.vue')
const CartView = () => import('../views/CartView.vue')
const CheckoutView = () => import('../views/CheckoutView.vue')
const AuthView = () => import('../views/AuthView.vue')
const AccountView = () => import('../views/AccountView.vue')
const AdminView = () => import('../views/AdminView.vue')
const ContentAdminView = () => import('../views/ContentAdminView.vue')
const OrderView = () => import('../views/OrderView.vue')
const AboutView = () => import('../views/AboutView.vue')
const InfoView = () => import('../views/InfoView.vue')
const ContactView = () => import('../views/ContactView.vue')
const SolutionView = () => import('../views/SolutionView.vue')
const ResourceView = () => import('../views/ResourceView.vue')
const SearchView = () => import('../views/SearchView.vue')

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) return savedPosition
    if (to.path === from.path) return false
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAdmin: true },
    },
    {
      // CT-C2 (ADR-015): quản trị nội dung — biên tập viên và admin.
      path: '/quan-tri-noi-dung',
      name: 'content-admin',
      component: ContentAdminView,
      meta: { requiresContent: true },
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'store', redirect: '/' },
        { path: 'giai-phap/:categorySlug/:subcategorySlug?/:itemSlug?', name: 'solution', component: SolutionView },
        { path: 'dich-vu', name: 'services', component: CatalogView },
        { path: 'phan-mem', name: 'software', component: CatalogView },
        { path: 'tim-kiem', name: 'search', component: SearchView },
        { path: 'san-pham/:slug', name: 'product', component: ProductView },
        { path: 'du-an', name: 'projects', component: InfoView },
        { path: 'bang-gia', redirect: '/du-an' },
        { path: 'gio-hang', name: 'cart', component: CartView },
        { path: 'thanh-toan', name: 'checkout', component: CheckoutView, meta: { requiresAuth: true } },
        { path: 'dang-nhap', name: 'login', component: AuthView, meta: { guestOnly: true } },
        { path: 'dang-ky', name: 'register', component: AuthView, meta: { guestOnly: true } },
        { path: 'tai-khoan', name: 'account', component: AccountView, meta: { requiresAuth: true } },
        { path: 'don-hang', name: 'orders', component: AccountView, meta: { requiresAuth: true } },
        { path: 'don-hang/:code', name: 'order', component: OrderView, meta: { requiresAuth: true } },
        { path: 'gioi-thieu', name: 'about', component: AboutView },
        { path: 'chinh-sach', name: 'policies', component: InfoView },
        { path: 'tin-tuc/:slug?', name: 'news', component: InfoView },
        { path: 'tai-nguyen/:section?/:topic?', name: 'resources', component: ResourceView },
        { path: 'lien-he', name: 'contact', component: ContactView },
        { path: ':pathMatch(.*)*', name: 'not-found', component: InfoView },
      ],
    },
  ],
})

// Route guard (ADR-012 §5): chỉ để giao diện đúng — quyền thật do server kiểm tra (API admin trả 403 với customer).
// Chờ khôi phục phiên từ cookie (lần đầu mở trang) rồi mới quyết định, tránh đá người đã đăng nhập về trang login.
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()
  if ((to.meta.requiresAuth || to.meta.requiresAdmin || to.meta.requiresContent) && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'account', query: { denied: 'admin' } }
  }
  if (to.meta.requiresContent && !auth.canManageContent) {
    return { name: 'account', query: { denied: 'content' } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'account' }
  }
  return true
})

// Sau mỗi lần deploy, release cũ trên VPS bị thay bằng release mới nên các chunk cũ không còn.
// Tab đang mở từ trước sẽ lỗi khi mở một trang chưa từng tải → tải lại đúng trang đó để nhận
// bản mới. Chỉ thử một lần (đánh dấu trong sessionStorage) để không lặp vô hạn nếu server lỗi thật.
const CHUNK_RELOAD_KEY = 'dxtechs:chunk-reload'
const CHUNK_ERROR_PATTERN =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS/i

router.onError((error, to) => {
  const message = error instanceof Error ? error.message : String(error)
  if (!CHUNK_ERROR_PATTERN.test(message)) return
  try {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
  } catch {
    // sessionStorage bị chặn: vẫn tải lại một lần
  }
  window.location.assign(to.fullPath)
})

router.afterEach(() => {
  try {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY)
  } catch {
    // bỏ qua
  }
})

export default router
