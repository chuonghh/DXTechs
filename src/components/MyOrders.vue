<script setup lang="ts">
// Danh sách "Đơn của tôi" (PR-C4) — bấm một đơn để xem QR thanh toán / key.
import { onMounted } from 'vue'
import { ORDER_STATUS_LABELS } from '../api'
import { formatPrice } from '../data/products'
import { useOrdersStore } from '../stores/orders'

const orders = useOrdersStore()
onMounted(() => void orders.load())
</script>

<template>
  <section class="my-orders">
    <p v-if="orders.error" class="mo-error" role="alert">{{ orders.error }}</p>
    <p v-if="!orders.items.length && !orders.loading && !orders.error" class="mo-empty">
      Bạn chưa có đơn hàng nào. <RouterLink to="/phan-mem">Khám phá phần mềm bản quyền →</RouterLink>
    </p>
    <RouterLink v-for="o in orders.items" :key="o.code" :to="`/don-hang/${o.code}`" class="mo-row">
      <span class="mo-code">{{ o.code }}</span>
      <span class="mo-status" :class="o.status">{{ ORDER_STATUS_LABELS[o.status] }}</span>
      <span class="mo-meta">{{ new Date(o.createdAt).toLocaleString('vi-VN') }} · {{ o.itemCount }} sản phẩm</span>
      <strong class="mo-total">{{ formatPrice(o.totalVnd) }}</strong>
      <span class="mo-cta">{{ o.status === 'pending_payment' ? 'Thanh toán →' : o.status === 'fulfilled' ? 'Xem key →' : 'Chi tiết →' }}</span>
    </RouterLink>
    <button v-if="orders.nextCursor" type="button" class="button button-outline" :disabled="orders.loading" @click="orders.load(true)">Tải thêm</button>
  </section>
</template>

<style scoped>
.my-orders { display: grid; gap: .6rem; }
.mo-row { display: grid; grid-template-columns: auto auto 1fr auto auto; gap: .9rem; align-items: center; padding: .9rem 1rem; border: 1px solid rgba(127, 127, 127, .2); border-radius: 12px; background: #fff; color: inherit; text-decoration: none; }
.mo-row:hover { border-color: #0066cc; }
@media (max-width: 720px) { .mo-row { grid-template-columns: 1fr auto; } .mo-meta { grid-column: 1 / -1; } }
.mo-code { font-weight: 700; letter-spacing: .04em; }
.mo-status { padding: .15rem .6rem; border-radius: 999px; font-size: .78rem; background: rgba(234, 140, 0, .15); color: #b45309; white-space: nowrap; }
.mo-status.paid, .mo-status.fulfilled { background: rgba(22, 163, 74, .15); color: #15803d; }
.mo-status.cancelled, .mo-status.refunded { background: rgba(127, 127, 127, .15); color: inherit; }
.mo-meta { font-size: .85rem; opacity: .7; }
.mo-cta { color: #0066cc; font-size: .88rem; white-space: nowrap; }
.mo-empty { opacity: .8; }
.mo-error { padding: .6rem .9rem; border-radius: 10px; background: rgba(220, 38, 38, .1); color: #b91c1c; }
</style>
