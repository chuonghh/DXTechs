<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import CartDrawer from '../components/CartDrawer.vue'
</script>

<template>
  <div class="app-shell full-store-shell">
    <!-- 1. FIXED TOP HEADER (STICKY SHELL NAVBAR) -->
    <header class="shell-fixed-header">
      <SiteHeader />
    </header>

    <!-- 2. DYNAMIC FULL-WIDTH MAIN VIEWPORT (CHUYỂN TRANG MƯỢT MÀ) -->
    <main class="main-content shell-dynamic-viewport" id="shell-main-content">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition name="shell-page-fade" mode="out-in">
          <component :is="Component" :key="currentRoute.path" />
        </Transition>
      </RouterView>
    </main>

    <!-- 3. FOOTER DOANH NGHIỆP ĐỒNG BỘ -->
    <SiteFooter />

    <!-- 4. GLOBAL SLIDE-OUT CART DRAWER -->
    <CartDrawer />
  </div>
</template>

<style scoped>
.full-store-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #ffffff;
  width: 100%;
  overflow-x: hidden;
}

.shell-fixed-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(15, 34, 74, 0.08);
  box-shadow: 0 4px 20px rgba(7, 14, 36, 0.04);
}

.shell-dynamic-viewport {
  flex: 1 0 auto;
  position: relative;
  width: 100%;
  min-width: 0;
}

/* Hiệu ứng chuyển trang mượt mà giữa các trang bán hàng và dịch vụ */
.shell-page-fade-enter-active,
.shell-page-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.shell-page-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.shell-page-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .shell-page-fade-enter-active,
  .shell-page-fade-leave-active {
    transition: none;
  }
}
</style>
