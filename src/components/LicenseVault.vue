<script setup lang="ts">
// Kho license key thật (PR-C4): key của mọi đơn đã giao, kèm nút sao chép và link về đơn.
import { onMounted } from 'vue'
import LucianCopyButton from './LucianCopyButton.vue'
import { useOrdersStore } from '../stores/orders'

const orders = useOrdersStore()
onMounted(() => void orders.loadLicenses())
</script>

<template>
  <section class="license-vault">
    <p v-if="orders.licensesLoading && !orders.licenses.length" role="status">Đang tải key…</p>
    <p v-else-if="!orders.licenses.length" class="lv-empty">Chưa có key nào. Key xuất hiện tại đây ngay khi đơn được thanh toán.</p>
    <article v-for="(lic, i) in orders.licenses" :key="`${lic.orderCode}-${i}`" class="lv-card">
      <div>
        <strong>{{ lic.productName }}</strong>
        <small>{{ lic.variantName }} · Đơn <RouterLink :to="`/don-hang/${lic.orderCode}`">{{ lic.orderCode }}</RouterLink>
          <template v-if="lic.fulfilledAt"> · {{ new Date(lic.fulfilledAt).toLocaleDateString('vi-VN') }}</template></small>
      </div>
      <code>{{ lic.key }}</code>
      <LucianCopyButton :text="lic.key" label="Sao chép" feedback-text="Đã chép key!" />
    </article>
  </section>
</template>

<style scoped>
.license-vault { display: grid; gap: .6rem; }
.lv-card { display: grid; grid-template-columns: 1fr auto auto; gap: 1rem; align-items: center; padding: .9rem 1rem; border: 1px solid rgba(127, 127, 127, .2); border-radius: 12px; background: #fff; }
@media (max-width: 720px) { .lv-card { grid-template-columns: 1fr; } }
.lv-card small { display: block; opacity: .7; font-size: .82rem; }
.lv-card code { padding: .25rem .5rem; border-radius: 8px; background: rgba(0, 102, 204, .08); letter-spacing: .03em; word-break: break-all; }
.lv-empty { opacity: .8; }
</style>
