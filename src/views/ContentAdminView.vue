<script setup lang="ts">
// Quản trị nội dung (CT-C2, ADR-015): biên tập viên và admin soạn/đăng bài, quản lý ảnh, xử lý đăng ký tư vấn.
// Quyền thật do server kiểm (policy `content`); editor không thấy đơn hàng/thanh toán/người dùng.
import { onMounted, ref, watch } from 'vue'
import { ApiError, contentAdmin, type AdminPost, type AdminPostRow, type PostStatus, type PostType } from '../api'
import LeadsPanel from '../content-admin/LeadsPanel.vue'
import MediaLibrary from '../content-admin/MediaLibrary.vue'
import PostEditor from '../content-admin/PostEditor.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const tab = ref<'posts' | 'media' | 'leads'>('posts')

const TYPE_LABELS: Record<PostType, string> = {
  news: 'Tin tức', solution: 'Giải pháp', training: 'Đào tạo', resource: 'Tài nguyên', glossary: 'Thuật ngữ', page: 'Trang',
}
const STATUS_LABELS: Record<PostStatus, string> = { draft: 'Nháp', published: 'Đã đăng', archived: 'Lưu trữ' }

const type = ref<PostType | ''>('news')
const status = ref<PostStatus | ''>('')
const q = ref('')
const rows = ref<AdminPostRow[]>([])
const cursor = ref<string | null>(null)
const loading = ref(false)
const error = ref('')
// `session` cố định suốt một lần mở form: tạo bài xong (có id) KHÔNG được dựng lại form — nếu dùng id làm key, Vue dựng lại
// component và mất thông báo "Đã đăng"/trạng thái đang sửa.
const editing = ref<{ id: string | null; session: number } | null>(null)
let editorSession = 0
function open(id: string | null) {
  editing.value = { id, session: ++editorSession }
}

async function load(more = false) {
  loading.value = true
  error.value = ''
  try {
    const page = await contentAdmin.listPosts({
      type: type.value || undefined, status: status.value || undefined, q: q.value.trim() || undefined,
      cursor: more ? cursor.value ?? undefined : undefined, limit: 30,
    })
    rows.value = more ? [...rows.value, ...page.items] : page.items
    cursor.value = page.nextCursor
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Không tải được danh sách bài.'
  } finally {
    loading.value = false
  }
}

function isScheduled(row: AdminPostRow) {
  return row.status === 'published' && !!row.publishedAt && new Date(row.publishedAt) > new Date()
}

function onSaved(post: AdminPost) {
  if (editing.value && editing.value.id === null) editing.value = { ...editing.value, id: post.id }
}

function closeEditor() {
  editing.value = null
  void load()
}

let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(q, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => void load(), 300)
})
watch([type, status], () => void load())
onMounted(() => void load())
</script>

<template>
  <div class="content-wrap content-admin">
    <header class="ca-head">
      <div>
        <span class="eyebrow">Quản trị nội dung · {{ auth.user?.role === 'admin' ? 'Quản trị viên' : 'Biên tập viên' }}</span>
        <h1>Nội dung website</h1>
      </div>
      <nav class="ca-tabs" aria-label="Khu vực quản trị nội dung">
        <button type="button" :class="{ active: tab === 'posts' }" @click="tab = 'posts'">Bài viết</button>
        <button type="button" :class="{ active: tab === 'media' }" @click="tab = 'media'">Thư viện ảnh</button>
        <button type="button" :class="{ active: tab === 'leads' }" @click="tab = 'leads'">Đăng ký tư vấn</button>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="ca-tab-link">Admin bán hàng →</RouterLink>
        <RouterLink to="/" class="ca-tab-link">← Về website</RouterLink>
      </nav>
    </header>

    <template v-if="tab === 'posts'">
      <PostEditor v-if="editing" :key="editing.session" :post-id="editing.id" :new-type="type || 'news'"
        @saved="onSaved" @deleted="closeEditor" @close="closeEditor" />

      <section v-else class="ca-list">
        <div class="ca-filters">
          <select v-model="type" aria-label="Loại nội dung"><option value="">Mọi loại</option><option v-for="(l, t) in TYPE_LABELS" :key="t" :value="t">{{ l }}</option></select>
          <select v-model="status" aria-label="Trạng thái"><option value="">Mọi trạng thái</option><option v-for="(l, s) in STATUS_LABELS" :key="s" :value="s">{{ l }}</option></select>
          <input v-model="q" type="search" placeholder="Tìm theo tiêu đề, nội dung (không dấu cũng được)" aria-label="Tìm bài" />
          <button type="button" class="button button-primary" @click="open(null)">+ Bài mới</button>
        </div>
        <p v-if="error" class="ca-error" role="alert">{{ error }}</p>
        <table class="ca-table">
          <thead><tr><th>Tiêu đề</th><th>Loại</th><th>Trạng thái</th><th>Sửa lần cuối</th></tr></thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id" tabindex="0" @click="open(row.id)" @keydown.enter="open(row.id)">
              <td><strong>{{ row.title }}</strong><small>/{{ row.slug }}{{ row.parentId ? ' · hạng mục con' : '' }}{{ row.isFeatured ? ' · nổi bật' : '' }}</small></td>
              <td>{{ TYPE_LABELS[row.type] }}</td>
              <td><span class="ca-status" :class="isScheduled(row) ? 'scheduled' : row.status">{{ isScheduled(row) ? 'Hẹn giờ' : STATUS_LABELS[row.status] }}</span></td>
              <td>{{ new Date(row.updatedAt).toLocaleString('vi-VN') }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!rows.length && !loading" class="ca-empty">Không có bài nào khớp bộ lọc.</p>
        <button v-if="cursor" type="button" class="button button-outline" :disabled="loading" @click="load(true)">Tải thêm</button>
      </section>
    </template>

    <MediaLibrary v-else-if="tab === 'media'" />
    <LeadsPanel v-else />
  </div>
</template>

<style scoped>
.content-admin { display: grid; gap: 1.25rem; padding-top: 1.5rem; padding-bottom: 3rem; }
.ca-head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; }
.ca-head h1 { margin: .25rem 0 0; }
.ca-tabs { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; }
.ca-tabs button { padding: .5rem 1rem; border: 1px solid rgba(127, 127, 127, .3); border-radius: 999px; background: transparent; cursor: pointer; font: inherit; }
.ca-tabs button.active { background: #0066cc; border-color: #0066cc; color: #fff; }
.ca-tab-link { margin-left: .5rem; font-size: .9rem; }
.ca-list { display: grid; gap: .75rem; }
.ca-filters { display: flex; flex-wrap: wrap; gap: .5rem; }
.ca-filters select, .ca-filters input { padding: .5rem .65rem; border: 1px solid rgba(127, 127, 127, .35); border-radius: 8px; font: inherit; }
.ca-filters input { flex: 1 1 260px; }
.ca-table { width: 100%; border-collapse: collapse; font-size: .9rem; }
.ca-table th { text-align: left; padding: .5rem; border-bottom: 2px solid rgba(127, 127, 127, .3); font-size: .8rem; text-transform: uppercase; opacity: .7; }
.ca-table td { padding: .6rem .5rem; border-bottom: 1px solid rgba(127, 127, 127, .15); vertical-align: top; }
.ca-table td small { display: block; opacity: .6; font-size: .78rem; }
.ca-table tbody tr { cursor: pointer; }
.ca-table tbody tr:hover, .ca-table tbody tr:focus { background: rgba(0, 102, 204, .06); outline: none; }
.ca-status { padding: .15rem .55rem; border-radius: 999px; font-size: .78rem; background: rgba(127, 127, 127, .15); white-space: nowrap; }
.ca-status.published { background: rgba(22, 163, 74, .15); color: #15803d; }
.ca-status.scheduled { background: rgba(234, 140, 0, .15); color: #b45309; }
.ca-status.archived { opacity: .6; }
.ca-error { margin: 0; padding: .6rem .9rem; border-radius: 8px; background: rgba(220, 38, 38, .1); color: #b91c1c; }
.ca-empty { opacity: .7; }
@media (max-width: 700px) { .ca-table th:nth-child(4), .ca-table td:nth-child(4) { display: none; } }
</style>
