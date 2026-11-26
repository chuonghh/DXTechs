<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  solutionCategories,
  solutionCategoryPath,
  solutionItemPath,
  solutionSlug,
  solutionSubcategoryPath,
} from '../data/solutions'
import { resourceSections } from '../data/resources'
import { formatPrice } from '../data/products'
import { findSearchResults, normalizeSearch, searchEntries, type SearchResult } from '../data/search'
import { useShopStore } from '../stores/shop'

const shop = useShopStore()
const route = useRoute()
const router = useRouter()
const navCategories = computed(() => solutionCategories.filter(c => c.name !== 'Sản phẩm'))
const mobileNavToggle = ref<HTMLDetailsElement | null>(null)
const servicesOpen = ref<string | false>(false)
const resourceMenuOpen = ref(false)
const activeResourceSection = ref(resourceSections[0].slug)
const activeSubcategories = ref<Record<string, string>>({})
const searchText = ref(typeof route.query.q === 'string' ? route.query.q : '')
const searchOpen = ref(false)
const language = ref(localStorage.getItem('dxtechs-language') === 'en' ? 'en' : 'vi')
const langOpen = ref(false)
const userMenuOpen = ref(false)

async function signOut() {
  userMenuOpen.value = false
  await shop.signOut()
  if (route.meta.requiresAuth || route.meta.requiresAdmin) router.push('/')
}
const menuImages = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=960&q=80',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=960&q=80',
]

watch(() => route.fullPath, () => {
  if (mobileNavToggle.value) mobileNavToggle.value.open = false
})

function search() {
  searchOpen.value = false
  router.push({ name: 'search', query: searchText.value.trim() ? { q: searchText.value.trim() } : {} })
}

const matchingResults = computed(() => searchText.value.trim()
  ? findSearchResults(searchText.value, 5)
  : searchEntries.filter((entry) => entry.kind === 'product' && ['Bán chạy', 'Phổ biến'].includes(entry.badge || '')).slice(0, 4))

const searchSuggestions = computed(() => {
  const query = searchText.value.trim()
  if (!query) return []
  return [...new Set(matchingResults.value
    .map((result) => result.title)
    .filter((title) => normalizeSearch(title) !== normalizeSearch(query)))].slice(0, 3)
})

function openSearch() {
  searchOpen.value = true
}

function closeSearch() {
  searchOpen.value = false
}

function clearSearch() {
  searchText.value = ''
  searchOpen.value = true
}

function handleHeaderOutsideClick(event: PointerEvent) {
  if (!(event.target instanceof Element)) return
  if (!event.target.closest('.header-search-wrap')) {
    closeSearch()
  }
  if (!event.target.closest('.top-user-menu-container')) {
    userMenuOpen.value = false
  }
  if (!event.target.closest('.lang-switcher-wrap')) {
    langOpen.value = false
  }
}

onMounted(() => document.addEventListener('pointerdown', handleHeaderOutsideClick))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleHeaderOutsideClick))

function openSearchResult(result: SearchResult) {
  closeSearch()
  router.push(result.path)
}

function selectLanguage(val: 'vi' | 'en') {
  language.value = val
  localStorage.setItem('dxtechs-language', val)
  document.documentElement.lang = val
  langOpen.value = false
}

function selectedSubcategory(category: typeof solutionCategories[number]) {
  return category.subcategories.find((subcategory) => subcategory.name === activeSubcategories.value[category.name])
    || category.subcategories[0]
}

function selectSubcategory(categoryName: string, subcategoryName: string) {
  activeSubcategories.value[categoryName] = subcategoryName
}

function subcategoryImage(category: typeof solutionCategories[number], subcategory: typeof solutionCategories[number]['subcategories'][number]) {
  const index = category.subcategories.indexOf(subcategory)
  return menuImages[index % menuImages.length]
}

function subcategoryDescription(subcategory: typeof solutionCategories[number]['subcategories'][number]) {
  return subcategory.items.length
    ? `Giải pháp linh hoạt cho ${subcategory.name.toLocaleLowerCase('vi')}, được thiết kế theo mục tiêu và quy trình thực tế của doanh nghiệp.`
    : `Tìm hiểu giải pháp ${subcategory.name.toLocaleLowerCase('vi')} và trao đổi phương án phù hợp với quy mô, quy trình của tổ chức bạn.`
}

function resourcePath(sectionSlug: string, topicSlug?: string) {
  return `/tai-nguyen/${sectionSlug}${topicSlug ? `/${topicSlug}` : ''}`
}

</script>

<template>
  <div class="announcement">
    <div class="announcement-inner">
      <div class="announcement-contacts">
        <a href="tel:1900886628">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>Hotline: <b>1900 886 628</b></span>
        </a>
        <a href="tel:0971798186">
          <span>Kỹ thuật: <b>0971 798 186</b></span>
        </a>
        <a href="mailto:support@dxtechs.vn">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span>support@dxtechs.vn</span>
        </a>
      </div>
      <div class="header-actions">

        <!-- User Profile Dropdown -->
        <div v-if="shop.user" class="top-user-menu-container">
          <button
            type="button"
            class="top-account-link user-trigger-btn"
            :aria-expanded="userMenuOpen"
            @click="userMenuOpen = !userMenuOpen"
          >
            <span class="user-avatar-dot">{{ shop.user.name.charAt(0).toUpperCase() }}</span>
            <span>{{ shop.user.name.split(' ')[0] }}</span>
            <span v-if="shop.user.role === 'admin'" class="user-role-badge">Admin</span>
            <svg class="dropdown-chevron" viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
              <path d="m3.5 6 4.5 4 4.5-4" />
            </svg>
          </button>

          <!-- Dropdown Popover -->
          <div v-if="userMenuOpen" class="user-menu-popover" @click="userMenuOpen = false">
            <div class="user-popover-meta">
              <strong>{{ shop.user.name }}</strong>
              <small>{{ shop.user.email }}</small>
              <div class="role-pill" :class="shop.user.role">
                <svg v-if="shop.user.role === 'admin'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M6 20a6 6 0 0 1 12 0"/></svg>
                <span>{{ shop.user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Khách hàng xác thực' }}</span>
              </div>
            </div>

            <div class="user-popover-links">
              <RouterLink to="/tai-khoan" class="popover-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                <span>Tổng quan tài khoản</span>
              </RouterLink>
              <RouterLink to="/don-hang" class="popover-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3"/></svg>
                <span>Kho Giấy phép &amp; Đơn hàng</span>
              </RouterLink>
              <RouterLink v-if="shop.user.role === 'admin'" to="/admin" class="popover-link admin-link-highlight">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>Trang Quản trị Admin</span>
                <span class="tag-live">PRO</span>
              </RouterLink>
            </div>

            <div class="user-popover-footer">
              <button
                type="button"
                class="sign-out-btn"
                @click.stop="signOut"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <RouterLink v-else class="top-account-link" to="/dang-nhap">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20a7 7 0 0 1 14 0"></path></svg>
          <span>Đăng nhập</span>
        </RouterLink>

        <!-- Language Switcher with Crisp Vector Flags -->
        <div class="lang-switcher-wrap">
          <button
            type="button"
            class="lang-toggle-btn"
            :aria-expanded="langOpen"
            aria-label="Chọn ngôn ngữ hiển thị"
            @click="langOpen = !langOpen"
          >
            <span class="flag-icon-badge" aria-hidden="true">
              <!-- Cờ Việt Nam chuẩn 3:2 sắc nét -->
              <svg v-if="language === 'vi'" class="vector-flag" viewBox="0 0 24 16" width="20" height="13.33">
                <rect width="24" height="16" fill="#DA251D" rx="2"/>
                <polygon fill="#FFFF00" points="12,3.2 13.48,7.77 18.28,7.77 14.4,10.59 15.88,15.17 12,12.35 8.12,15.17 9.6,10.59 5.72,7.77 10.52,7.77"/>
              </svg>
              <!-- Cờ UK / English chuẩn 3:2 sắc nét -->
              <svg v-else class="vector-flag" viewBox="0 0 24 16" width="20" height="13.33">
                <clipPath id="uk-flag-clip"><rect width="24" height="16" rx="2"/></clipPath>
                <g clip-path="url(#uk-flag-clip)">
                  <rect width="24" height="16" fill="#012169"/>
                  <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFFFFF" stroke-width="2.8"/>
                  <path d="M0,0 L24,16" stroke="#C8102E" stroke-width="1.6"/>
                  <path d="M24,0 L0,16" stroke="#C8102E" stroke-width="1.6"/>
                  <path d="M12,0 V16 M0,8 H24" stroke="#FFFFFF" stroke-width="4.8"/>
                  <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" stroke-width="2.8"/>
                </g>
              </svg>
            </span>
            <span class="lang-text">{{ language.toUpperCase() }}</span>
            <svg class="lang-chevron" :class="{ 'is-flipped': langOpen }" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <Transition name="lang-pop-fade">
            <div v-if="langOpen" class="lang-dropdown-menu" role="menu">
              <button
                type="button"
                role="menuitem"
                class="lang-menu-option"
                :class="{ active: language === 'vi' }"
                @click="selectLanguage('vi')"
              >
                <span class="flag-icon-badge" aria-hidden="true">
                  <svg class="vector-flag" viewBox="0 0 24 16" width="20" height="13.33">
                    <rect width="24" height="16" fill="#DA251D" rx="2"/>
                    <polygon fill="#FFFF00" points="12,3.2 13.48,7.77 18.28,7.77 14.4,10.59 15.88,15.17 12,12.35 8.12,15.17 9.6,10.59 5.72,7.77 10.52,7.77"/>
                  </svg>
                </span>
                <span class="lang-name">Tiếng Việt</span>
                <span class="lang-badge">VI</span>
              </button>

              <button
                type="button"
                role="menuitem"
                class="lang-menu-option"
                :class="{ active: language === 'en' }"
                @click="selectLanguage('en')"
              >
                <span class="flag-icon-badge" aria-hidden="true">
                  <svg class="vector-flag" viewBox="0 0 24 16" width="20" height="13.33">
                    <clipPath id="uk-flag-opt-clip"><rect width="24" height="16" rx="2"/></clipPath>
                    <g clip-path="url(#uk-flag-opt-clip)">
                      <rect width="24" height="16" fill="#012169"/>
                      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFFFFF" stroke-width="2.8"/>
                      <path d="M0,0 L24,16" stroke="#C8102E" stroke-width="1.6"/>
                      <path d="M24,0 L0,16" stroke="#C8102E" stroke-width="1.6"/>
                      <path d="M12,0 V16 M0,8 H24" stroke="#FFFFFF" stroke-width="4.8"/>
                      <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" stroke-width="2.8"/>
                    </g>
                  </svg>
                </span>
                <span class="lang-name">English</span>
                <span class="lang-badge">EN</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="DXtechs - Trang chủ">
        <span class="brand-logo-frame"><img class="brand-logo" src="/dxtechs-logo.png" alt="DXtechs" /></span>
      </RouterLink>
      <nav class="main-nav" aria-label="Điều hướng chính">
        <RouterLink to="/gioi-thieu">Giới thiệu</RouterLink>
        <div
          v-for="category in navCategories"
          :key="category.name"
          class="solution-nav-menu"
          :class="{ 'is-open': servicesOpen === category.name }"
          @mouseenter="servicesOpen = category.name"
          @mouseleave="servicesOpen = false"
          @focusin="servicesOpen = category.name"
        >
          <RouterLink :to="solutionCategoryPath(category)">{{ category.name }}</RouterLink>
          <button
            class="services-menu-toggle"
            type="button"
            :aria-label="`Mở danh mục con ${category.name}`"
            :aria-controls="`solution-menu-${solutionSlug(category.name)}`"
            :aria-expanded="servicesOpen === category.name"
            @click="servicesOpen = servicesOpen === category.name ? false : category.name"
          ><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4"></path></svg></button>
          <div
            :id="`solution-menu-${solutionSlug(category.name)}`"
            class="solution-nav-dropdown"
            @mouseenter="selectSubcategory(category.name, selectedSubcategory(category).name)"
          >
            <div class="solution-mega-categories" :aria-label="`Danh mục con ${category.name}`">
              <button
                v-for="subcategory in category.subcategories"
                :key="subcategory.name"
                type="button"
                :class="{ active: selectedSubcategory(category).name === subcategory.name }"
                @mouseenter="selectSubcategory(category.name, subcategory.name)"
                @focus="selectSubcategory(category.name, subcategory.name)"
                @click="selectSubcategory(category.name, subcategory.name)"
              >
                <svg
                  v-if="subcategory.name.includes('AI')"
                  class="menu-ai-sparkle text-cyan-400"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
                <span>{{ subcategory.name }}</span>
              </button>
            </div>
            <section v-if="selectedSubcategory(category)" class="solution-mega-detail" aria-live="polite">
              <img
                class="solution-mega-image"
                :src="subcategoryImage(category, selectedSubcategory(category))"
                :alt="`Hình minh họa ${selectedSubcategory(category).name}`"
              />
              <RouterLink
                class="solution-mega-title"
                :to="solutionSubcategoryPath(category, selectedSubcategory(category))"
                @click="servicesOpen = false"
              >{{ selectedSubcategory(category).name }}</RouterLink>
              <p class="solution-mega-description">{{ subcategoryDescription(selectedSubcategory(category)) }}</p>
              <div v-if="selectedSubcategory(category).items.length" class="solution-mega-items">
                <RouterLink
                  v-for="item in selectedSubcategory(category).items"
                  :key="item"
                  class="solution-item-link"
                  :to="solutionItemPath(category, selectedSubcategory(category), item)"
                  @click="servicesOpen = false"
                >
                  <span class="solution-item-text">
                    <svg
                      v-if="item.includes('AI') || item.includes('chatbot') || item.includes('trợ lý')"
                      class="item-ai-sparkle text-cyan-400"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                    <span class="item-text-label">{{ item }}</span>
                  </span>
                  <span class="solution-item-arrow" aria-hidden="true">↗</span>
                </RouterLink>
              </div>
              <RouterLink
                v-else
                class="solution-mega-cta"
                :to="solutionSubcategoryPath(category, selectedSubcategory(category))"
                @click="servicesOpen = false"
              >Khám phá giải pháp</RouterLink>
            </section>
          </div>
        </div>
        <RouterLink to="/du-an">Dự Án</RouterLink>
        <div class="resource-nav-menu" :class="{ 'is-open': resourceMenuOpen }" @mouseenter="resourceMenuOpen = true" @mouseleave="resourceMenuOpen = false" @focusin="resourceMenuOpen = true">
          <RouterLink to="/tai-nguyen">Tài Nguyên</RouterLink>
          <button type="button" class="services-menu-toggle" aria-label="Mở danh mục Tài Nguyên" :aria-expanded="resourceMenuOpen" @click="resourceMenuOpen = !resourceMenuOpen"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4"></path></svg></button>
          <div class="resource-nav-dropdown" @mouseenter="resourceMenuOpen = true">
            <div class="resource-mega-categories" aria-label="Danh mục con Tài Nguyên">
              <button
                v-for="group in resourceSections"
                :key="group.slug"
                type="button"
                :class="{ active: activeResourceSection === group.slug }"
                @mouseenter="activeResourceSection = group.slug"
                @focus="activeResourceSection = group.slug"
                @click="activeResourceSection = group.slug"
              >{{ group.name }}</button>
            </div>
            <section v-for="group in resourceSections.filter((item) => item.slug === activeResourceSection)" :key="group.slug" class="resource-mega-detail" aria-live="polite">
              <img class="resource-mega-image" :src="group.image" :alt="`Minh họa ${group.name}`" />
              <RouterLink class="resource-mega-title" :to="resourcePath(group.slug)" @click="resourceMenuOpen = false">{{ group.name }}</RouterLink>
              <p class="resource-mega-description">{{ group.description }}</p>
              <div class="resource-mega-items">
                <RouterLink v-for="topic in group.topics" :key="topic.slug" :to="resourcePath(group.slug, topic.slug)" @click="resourceMenuOpen = false">{{ topic.name }}</RouterLink>
              </div>
            </section>
          </div>
        </div>
        <RouterLink to="/lien-he">Liên hệ</RouterLink>

        <!-- Admin Portal Nav Shortcut if Admin -->
        <RouterLink
          v-if="shop.user?.role === 'admin'"
          to="/admin"
          class="nav-admin-link"
          title="Trang quản trị hệ thống"
        >
          <span class="admin-link-dot"></span>
          <span>Admin Portal</span>
        </RouterLink>
      </nav>
      <div class="header-search-wrap">
        <form class="header-search" role="search" @submit.prevent="search">
          <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 4.5 4.5"></path></svg>
          <input v-model="searchText" aria-label="Tìm sản phẩm" placeholder="Bạn đang tìm gì?" @focus="openSearch" @keydown.esc.prevent="closeSearch" />
          <button v-if="searchText.trim()" type="button" class="header-search-clear" aria-label="Xóa nội dung tìm kiếm" @click="clearSearch">×</button>
          <button type="submit" aria-label="Tìm kiếm">Tìm</button>
        </form>
        <section v-if="searchOpen" class="search-dialog" role="region" aria-label="Gợi ý tìm kiếm">
          <section v-if="searchSuggestions.length" class="search-suggestions" aria-labelledby="search-suggestions-title">
            <h2 id="search-suggestions-title">Có phải bạn tìm</h2>
            <button v-for="suggestion in searchSuggestions" :key="suggestion" type="button" @click="searchText = suggestion; search()">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 4.5 4.5"></path></svg>
              <span>{{ suggestion }}</span>
            </button>
          </section>
          <section class="search-products" aria-labelledby="search-products-title">
            <h2 id="search-products-title">{{ searchText.trim() ? 'Kết quả gợi ý' : 'Sản phẩm phổ biến' }}</h2>
            <button
              v-for="result in matchingResults"
              :key="result.id"
              class="search-product"
              type="button"
              @click="openSearchResult(result)"
            >
              <img v-if="result.imageUrl" :src="result.imageUrl" :alt="result.title" />
              <span v-else class="search-result-icon" aria-hidden="true">DX</span>
              <span class="search-product-info">
                <span class="search-product-name">{{ result.title }}</span>
                <span class="search-product-category">{{ result.category }}<template v-if="result.badge"> · {{ result.badge }}</template></span>
                <strong v-if="result.price">{{ formatPrice(result.price) }}</strong>
                <span v-else class="search-result-description">{{ result.description }}</span>
              </span>
            </button>
            <p v-if="!matchingResults.length" class="search-empty">Chưa tìm thấy kết quả phù hợp. Thử từ khóa khác nhé.</p>
          </section>
          <button v-if="searchText.trim()" class="search-all-results" type="button" @click="search">Xem tất cả kết quả</button>
        </section>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <details ref="mobileNavToggle" class="mobile-nav-toggle">
      <summary class="mobile-nav-toggle-summary" aria-label="Mở điều hướng">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        <span class="sr-only">Mở điều hướng</span>
      </summary>
      <nav class="mobile-nav" aria-label="Điều hướng trên thiết bị di động">
        <RouterLink
          v-if="shop.user?.role === 'admin'"
          to="/admin"
          class="mobile-admin-link"
        >
          <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>Quản trị Admin</span>
        </RouterLink>

        <RouterLink
          :to="shop.user ? '/tai-khoan' : '/dang-nhap'"
          class="mobile-account-link"
        >
          <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>{{ shop.user ? `${shop.user.name} (${shop.user.role})` : 'Đăng nhập / Đăng ký' }}</span>
        </RouterLink>

        <RouterLink to="/gioi-thieu">Giới thiệu</RouterLink>
        <details v-for="category in navCategories" :key="category.name" class="mobile-services-menu">
          <summary>{{ category.name }}</summary>
          <div class="mobile-services-options">
            <RouterLink v-if="category.name !== 'Dịch vụ'" :to="solutionCategoryPath(category)">Tổng quan {{ category.name }}</RouterLink>
            <template v-for="subcategory in category.subcategories" :key="subcategory.name">
              <RouterLink class="mobile-subcategory-link" :to="solutionSubcategoryPath(category, subcategory)">{{ subcategory.name }}</RouterLink>
              <RouterLink
                v-for="item in subcategory.items"
                :key="item"
                class="mobile-solution-item-link"
                :to="solutionItemPath(category, subcategory, item)"
              >{{ item }}</RouterLink>
            </template>
          </div>
        </details>
        <RouterLink to="/du-an">Dự Án</RouterLink>
        <details class="mobile-services-menu mobile-resource-menu">
          <summary>Tài Nguyên</summary>
          <div class="mobile-services-options">
            <RouterLink class="mobile-subcategory-link" to="/tai-nguyen/tai-lieu">Tài Liệu</RouterLink>
            <RouterLink class="mobile-solution-item-link" to="/tai-nguyen/tai-lieu/sach">Sách</RouterLink>
            <RouterLink class="mobile-solution-item-link" to="/tai-nguyen/tai-lieu/download">Download</RouterLink>
            <RouterLink class="mobile-subcategory-link" to="/tai-nguyen/goc-nhin">Góc nhìn</RouterLink>
            <RouterLink class="mobile-solution-item-link" to="/tai-nguyen/goc-nhin/tin-tuc">Tin Tức</RouterLink>
            <RouterLink class="mobile-solution-item-link" to="/tai-nguyen/goc-nhin/thuat-ngu-cntt">Thuật Ngữ CNTT</RouterLink>
          </div>
        </details>
        <RouterLink to="/lien-he">Liên hệ</RouterLink>
        <RouterLink to="/tai-nguyen/goc-nhin/tin-tuc">Tin Tức</RouterLink>
      </nav>
    </details>
  </header>
</template>

<style scoped>
/* Top Cart & Account Button Resets */
.top-cart-link,
.top-account-link.user-trigger-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  color: var(--apple-body-muted, #cccccc);
  transition: color 0.18s ease;
}

.top-cart-link:hover,
.top-account-link.user-trigger-btn:hover {
  color: var(--apple-body-on-dark, #ffffff);
}

/* User Profile Menu Container */
.top-user-menu-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.user-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--apple-body-muted, #cccccc);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.12px;
  transition: opacity 0.2s ease, color 0.18s ease;
}

.user-avatar-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--apple-primary, #0066cc);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 600;
  box-shadow: none;
}

.user-role-badge {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  background: var(--apple-surface-tile-1, #272729);
  color: var(--apple-primary-on-dark, #2997ff);
  padding: 1px 6px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--apple-dark-hairline, #424245);
}

.dropdown-chevron {
  opacity: 0.7;
}

/* User Popover Panel */
.user-menu-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 260px;
  background: var(--apple-canvas, #ffffff);
  border-radius: var(--radius-lg, 18px);
  border: 1px solid var(--apple-hairline, #e0e0e0);
  box-shadow: rgba(0, 0, 0, 0.12) 0 8px 24px 0;
  padding: 16px;
  z-index: 1000;
  color: var(--apple-ink, #1d1d1f);
  text-align: left;
  animation: popoverFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popoverFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-popover-meta {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--apple-divider-soft, #f0f0f0);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-popover-meta strong {
  font-size: 14px;
  font-weight: 600;
  color: var(--apple-ink, #1d1d1f);
  letter-spacing: -0.224px;
}

.user-popover-meta small {
  font-size: 11px;
  color: var(--apple-ink-muted-48, #7a7a7a);
  word-break: break-all;
  letter-spacing: -0.12px;
}

.role-pill {
  display: inline-block;
  align-self: flex-start;
  margin-top: 6px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
  background: var(--apple-canvas-parchment, #f5f5f7);
  color: var(--apple-ink, #1d1d1f);
  border: 1px solid var(--apple-hairline, #e0e0e0);
}

.role-pill.admin {
  background: var(--apple-canvas-parchment, #f5f5f7);
  color: var(--apple-primary, #0066cc);
  border-color: var(--apple-hairline, #e0e0e0);
}

.user-popover-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 0;
  border-bottom: 1px solid var(--apple-divider-soft, #f0f0f0);
}

.popover-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm, 8px);
  font-size: 13px;
  font-weight: 400;
  color: var(--apple-ink, #1d1d1f);
  text-decoration: none;
  transition: all 0.15s ease;
}

.popover-link:hover {
  background: var(--apple-canvas-parchment, #f5f5f7);
  color: var(--apple-primary, #0066cc);
}

.popover-link.admin-link-highlight {
  background: var(--apple-canvas-parchment, #f5f5f7);
  color: var(--apple-primary, #0066cc);
  font-weight: 600;
}

.tag-live {
  margin-left: auto;
  font-size: 9px;
  font-weight: 600;
  background: var(--apple-primary, #0066cc);
  color: #ffffff;
  padding: 2px 6px;
  border-radius: var(--radius-pill, 9999px);
}

.user-popover-footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 10px;
}

.role-toggle-btn {
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--apple-hairline, #e0e0e0);
  background: var(--apple-canvas-parchment, #f5f5f7);
  color: var(--apple-ink, #1d1d1f);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.role-toggle-btn:hover {
  background: var(--apple-canvas, #ffffff);
  border-color: var(--apple-ink-muted-48, #7a7a7a);
}

.role-toggle-btn:active {
  transform: scale(0.95);
}

.sign-out-btn {
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid transparent;
  background: transparent;
  color: var(--apple-ink-muted-48, #7a7a7a);
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.sign-out-btn:hover {
  background: var(--apple-canvas-parchment, #f5f5f7);
  color: var(--apple-ink, #1d1d1f);
}

.sign-out-btn:active {
  transform: scale(0.95);
}

/* Nav Admin Link */
.nav-admin-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--radius-pill, 9999px);
  background: var(--apple-canvas-parchment, #f5f5f7);
  border: 1px solid var(--apple-hairline, #e0e0e0);
  color: var(--apple-primary, #0066cc) !important;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.18s ease;
}

.nav-admin-link:hover {
  background: var(--apple-primary, #0066cc);
  border-color: var(--apple-primary, #0066cc);
  color: #ffffff !important;
}

.nav-admin-link:active {
  transform: scale(0.95);
}

.admin-link-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--apple-primary, #0066cc);
}

.mobile-cart-link,
.mobile-admin-link,
.mobile-account-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.mobile-nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.mobile-admin-link {
  color: var(--apple-primary, #0066cc) !important;
  font-weight: 600 !important;
  background: var(--apple-canvas-parchment, #f5f5f7);
  border-radius: var(--radius-sm, 8px);
  padding: 8px 12px !important;
}

.mobile-account-link {
  font-weight: 400 !important;
  color: var(--apple-ink, #1d1d1f) !important;
}

.menu-ai-sparkle,
.item-ai-sparkle {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  margin-top: 2px;
  flex-shrink: 0;
}

.solution-item-text {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  flex: 1 1 auto;
  min-width: 0;
  white-space: normal;
  word-break: normal;
  overflow-wrap: break-word;
}

.item-text-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  color: #070e24;
  white-space: normal;
  word-break: normal;
  overflow-wrap: break-word;
}

.solution-item-arrow {
  flex-shrink: 0;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
  transition: transform 0.18s ease, color 0.18s ease;
}

.solution-item-link:hover .item-text-label {
  color: #0062ff;
}

.solution-item-link:hover .solution-item-arrow {
  color: #0062ff;
  transform: translate(2px, -2px);
}

/* ==========================================================================
   POLISHED LANGUAGE SWITCHER WITH VECTOR FLAGS
   ========================================================================== */
.lang-switcher-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.lang-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  padding: 4px 10px 4px 6px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.lang-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.28);
}

.flag-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.vector-flag {
  display: block;
  border-radius: 2px;
}

.lang-text {
  line-height: 1;
}

.lang-chevron {
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.2s ease;
}

.lang-chevron.is-flipped {
  transform: rotate(180deg);
}

.lang-dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 136px;
  background: #0f1c3d;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.45);
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  z-index: 100;
}

.lang-menu-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.lang-menu-option:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.lang-menu-option.active {
  background: rgba(0, 98, 255, 0.28);
  color: #60a5fa;
  font-weight: 600;
}

.lang-item-name {
  flex: 1;
}

.lang-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.lang-menu-option.active .lang-badge {
  background: #0062ff;
  color: #ffffff;
}

.lang-pop-fade-enter-active,
.lang-pop-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.lang-pop-fade-enter-from,
.lang-pop-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.96);
}
</style>
