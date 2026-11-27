<script setup lang="ts">
// Hàng chờ đăng ký tư vấn / khoá học (CT-C2). Lead quá 24 tháng được server ẩn danh hoá (không còn tên, liên hệ).
import { onMounted, ref, watch } from 'vue'
import { ApiError, contentAdmin, type AdminLead, type LeadStatus } from '../api'

const status = ref<LeadStatus | ''>('new')
const items = ref<AdminLead[]>([])
const cursor = ref<string | null>(null)
const loading = ref(false)
const error = ref('')
const notes = ref<Record<string, string>>({})

const STATUS_LABELS: Record<LeadStatus, string> = { new: 'Mới', contacted: 'Đã liên hệ', closed: 'Đã xong' }

async function load(more = false) {
  loading.value = true
  error.value = ''
  try {
    const page = await contentAdmin.leads(status.value || undefined, more ? cursor.value ?? undefined : undefined)
    items.value = more ? [...items.value, ...page.items] : page.items
    cursor.value = page.nextCursor
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Không tải được danh sách.'
  } finally {
    loading.value = false
  }
}

async function update(lead: AdminLead, next: LeadStatus) {
  try {
    const saved = await contentAdmin.updateLead(lead.id, next, notes.value[lead.id])
    items.value = items.value.map((l) => (l.id === saved.id ? { ...saved, postTitle: l.postTitle } : l))
    notes.value[lead.id] = ''
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Cập nhật thất bại.'
  }
}

watch(status, () => void load())
onMounted(() => void load())
</script>

<template>
  <section class="leads-panel">
    <div class="lp-filter">
      <label>Trạng thái
        <select v-model="status"><option value="">Tất cả</option><option v-for="(l, s) in STATUS_LABELS" :key="s" :value="s">{{ l }}</option></select>
      </label>
    </div>
    <p v-if="error" class="lp-error" role="alert">{{ error }}</p>
    <p v-if="!items.length && !loading" class="lp-empty">Không có đăng ký nào.</p>
    <article v-for="lead in items" :key="lead.id" class="lp-item">
      <header>
        <strong>{{ lead.fullName }}</strong>
        <span class="lp-badge" :class="lead.status">{{ STATUS_LABELS[lead.status] }}</span>
        <small>{{ new Date(lead.createdAt).toLocaleString('vi-VN') }} · {{ lead.kind === 'course' ? 'Khoá học' : 'Tư vấn' }}{{ lead.postTitle ? ` · ${lead.postTitle}` : '' }}</small>
      </header>
      <p v-if="lead.anonymized" class="lp-empty">Đã ẩn danh hoá (quá 24 tháng).</p>
      <template v-else>
        <p class="lp-contact">
          <a v-if="lead.phone" :href="`tel:${lead.phone}`">{{ lead.phone }}</a>
          <a v-if="lead.email" :href="`mailto:${lead.email}`">{{ lead.email }}</a>
          <span v-if="lead.company">{{ lead.company }}</span>
        </p>
        <pre v-if="lead.message" class="lp-message">{{ lead.message }}</pre>
      </template>
      <p v-if="lead.note" class="lp-note">Ghi chú: {{ lead.note }}</p>
      <div class="lp-actions">
        <input v-model="notes[lead.id]" maxlength="2000" placeholder="Ghi chú xử lý (tuỳ chọn)" />
        <button v-if="lead.status !== 'contacted'" type="button" class="button button-outline" @click="update(lead, 'contacted')">Đã liên hệ</button>
        <button v-if="lead.status !== 'closed'" type="button" class="button button-outline" @click="update(lead, 'closed')">Đã xong</button>
      </div>
      <small class="lp-consent">Đồng ý xử lý dữ liệu: phiên bản {{ lead.consentVersion }} · {{ new Date(lead.consentAt).toLocaleString('vi-VN') }}</small>
    </article>
    <button v-if="cursor" type="button" class="button button-outline" :disabled="loading" @click="load(true)">Tải thêm</button>
  </section>
</template>

<style scoped>
.leads-panel { display: grid; gap: .75rem; }
.lp-filter label { display: inline-grid; gap: .25rem; font-size: .85rem; font-weight: 600; }
.lp-filter select, .lp-actions input { padding: .45rem .6rem; border: 1px solid rgba(127, 127, 127, .35); border-radius: 8px; font: inherit; }
.lp-item { display: grid; gap: .4rem; padding: .9rem; border: 1px solid rgba(127, 127, 127, .25); border-radius: 12px; background: rgba(255, 255, 255, .7); }
.lp-item header { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
.lp-badge { padding: .1rem .5rem; border-radius: 999px; font-size: .75rem; background: rgba(0, 102, 204, .12); }
.lp-badge.closed { background: rgba(22, 163, 74, .15); }
.lp-contact { display: flex; flex-wrap: wrap; gap: .75rem; margin: 0; font-size: .9rem; }
.lp-message { margin: 0; white-space: pre-wrap; font: inherit; font-size: .88rem; padding: .5rem; border-radius: 8px; background: rgba(127, 127, 127, .08); }
.lp-note, .lp-empty, .lp-consent { margin: 0; font-size: .82rem; opacity: .75; }
.lp-actions { display: flex; flex-wrap: wrap; gap: .5rem; }
.lp-actions input { flex: 1 1 220px; }
.lp-error { margin: 0; padding: .6rem .9rem; border-radius: 8px; background: rgba(220, 38, 38, .1); color: #b91c1c; }
</style>
