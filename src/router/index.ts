import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import CatalogView from '../views/CatalogView.vue'
import ProductView from '../views/ProductView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import AuthView from '../views/AuthView.vue'
import AccountView from '../views/AccountView.vue'
import AdminView from '../views/AdminView.vue'
import AboutView from '../views/AboutView.vue'
import InfoView from '../views/InfoView.vue'
import ContactView from '../views/ContactView.vue'
import SolutionView from '../views/SolutionView.vue'
import ResourceView from '../views/ResourceView.vue'
import SearchView from '../views/SearchView.vue'

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
        { path: 'thanh-toan', name: 'checkout', component: CheckoutView },
        { path: 'dang-nhap', name: 'login', component: AuthView },
        { path: 'dang-ky', name: 'register', component: AuthView },
        { path: 'tai-khoan', name: 'account', component: AccountView },
        { path: 'don-hang', name: 'orders', component: AccountView },
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

export default router
