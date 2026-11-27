<script setup lang="ts">
// Soạn một bài (CT-C2): tạo nháp → sửa (mỗi lần lưu là một phiên bản) → đăng ngay / hẹn giờ → huỷ đăng / lưu trữ / xoá.
// Hai người sửa cùng lúc: server trả 409 cho người lưu sau ⇒ báo và cho tải lại bản mới (không ghi đè lặng lẽ).
import { computed, onMounted, ref, watch } from 'vue'
import ContentBlocks from '../components/ContentBlocks.vue'
import {
  ApiError,
  contentAdmin,
  type AdminPost,
  type AdminPostRow,
  type AdminTopic,
  type CourseSession,
  type MediaItem,
  type MediaRef,
  type PostInput,
  type PostType,
  type RevisionRow,
} from '../api'
import BlockEditor from './BlockEditor.vue'
import MediaLibrary from './MediaLibrary.vue'
import { suggestSlug, toContentBlocks, toEditBlock, type EditBlock } from './blocks'

const props = defineProps<{ postId: string | null; newType: PostType }>()
const emit = defineEmits<{ saved: [post: AdminPost]; deleted: []; close: [] }>()

const TYPE_LABELS: Record<PostType, string> = {
  news: 'Tin tức', solution: 'Giải pháp', training: 'Đào tạo', resource: 'Tài nguyên', glossary: 'Thuật ngữ', page: 'Trang',
}
const PUBLIC_PATH: Partial<Record<PostType, string>> = { news: '/tin-tuc/' }

const post = ref<AdminPost | null>(null)
const type = ref<PostType>(props.newType)
const slug = ref('')
const slugTouched = ref(false)
const title = ref('')
const excerpt = ref('')
const label = ref('')
const keyPoints = ref('')
const topicId = ref<string | null>(null)
const parentId = ref<string | null>(null)
const coverMediaId = ref<string | null>(null)
const coverImageAlt = ref('')
const seoTitle = ref('')
const seoDescription = ref('')
const sortOrder = ref(0)
const isFeatured = ref(false)
const blocks = ref<EditBlock[]>([])
const scheduleAt = ref('')
const newSlug = ref('')

const topics = ref<AdminTopic[]>([])
const parents = ref<AdminPostRow[]>([])
const revisions = ref<RevisionRow[]>([])
const sessions = ref<CourseSession[]>([])
const media = ref<Record<string, MediaItem>>({})
const picker = ref<null | { target: 'cover' } | { target: 'block'; blockId: string }>(null)

const busy = ref(false)
const message = ref('')
const error = ref('')
const conflict = ref(false)
const dirty = ref(false)

const isNew = computed(() => !post.value)
const canHaveParent = computed(() => type.value === 'solution' || type.value === 'training')
const statusText = computed(() => {
  const p = post.value
  if (!p) return 'Bài mới (chưa lưu)'
  if (p.status === 'published' && p.publishedAt && new Date(p.publishedAt) > new Date()) {
    return `Hẹn giờ đăng ${new Date(p.publishedAt).toLocaleString('vi-VN')}`
  }
  return { draft: 'Bản nháp', published: 'Đã đăng', archived: 'Lưu trữ' }[p.status]
})
const previewMedia = computed<Record<string, MediaRef>>(() =>
  Object.fromEntries(Object.values(media.value).map((m) => [m.id, { url: m.url, width: m.width, height: m.height }])))
const previewBlocks = computed(() => toContentBlocks(blocks.value))
const coverUrl = computed(() => (coverMediaId.value ? media.value[coverMediaId.value]?.url : null) ?? post.value?.coverImageUrl ?? null)

function fill(p: AdminPost) {
  post.value = p
  type.value = p.type
  slug.value = p.slug
  newSlug.value = p.slug
  title.value = p.title
  excerpt.value = p.excerpt ?? ''
  label.value = p.label ?? ''
  keyPoints.value = p.keyPoints.join('\n')
  topicId.value = p.topicId
  parentId.value = p.parentId
  coverMediaId.value = p.coverMediaId
  coverImageAlt.value = p.coverImageAlt ?? ''
  seoTitle.value = p.seoTitle ?? ''
  seoDescription.value = p.seoDescription ?? ''
  sortOrder.value = p.sortOrder
  isFeatured.value = p.isFeatured
  blocks.value = p.blocks.map(toEditBlock)
  conflict.value = false
  queueMicrotask(() => { dirty.value = false })
}

function input(): PostInput {
  return {
    title: title.value.trim(),
    excerpt: excerpt.value.trim() || null,
    label: label.value.trim() || null,
    blocks: toContentBlocks(blocks.value),
    keyPoints: keyPoints.value.split('\n').map((l) => l.trim()).filter(Boolean),
    topicId: topicId.value,
    parentId: canHaveParent.value ? parentId.value : null,
    coverMediaId: coverMediaId.value,
    coverImageAlt: coverImageAlt.value.trim() || null,
    seoTitle: seoTitle.value.trim() || null,
    seoDescription: seoDescription.value.trim() || null,
    sortOrder: sortOrder.value,
    isFeatured: isFeatured.value,
  }
}

function describe(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 409 && e.problem?.code === 'content.edit_conflict') {
      conflict.value = true
      return 'Bài vừa được người khác lưu sau khi bạn mở. Tải lại bản mới rồi sửa tiếp (thay đổi chưa lưu của bạn sẽ mất — hãy chép ra trước nếu cần).'
    }
    const fields = Object.entries(e.problem?.errors ?? {}).map(([k, v]) => `${k}: ${v.join(' ')}`)
    return fields.length ? `${e.message} ${fields.join(' · ')}` : e.message
  }
  return 'Lỗi kết nối, vui lòng thử lại.'
}

async function run(action: () => Promise<AdminPost | void>, done: string) {
  busy.value = true
  error.value = ''
  message.value = ''
  try {
    const result = await action()
    if (result) {
      fill(result)
      emit('saved', result)
      void loadRevisions()
    }
    message.value = done
  } catch (e) {
    error.value = describe(e)
  } finally {
    busy.value = false
  }
}

const save = () => run(async () => {
  if (isNew.value) return contentAdmin.createPost(type.value, slug.value.trim(), input())
  return contentAdmin.updatePost(post.value!.id, post.value!.version, input())
}, 'Đã lưu.')

const publishNow = () => run(async () => {
  const saved = dirty.value || isNew.value ? await saveSilently() : post.value!
  return contentAdmin.publish(saved.id, saved.version)
}, 'Đã đăng — hiển thị trên web trong vòng 1 phút.')

const schedule = () => run(async () => {
  if (!scheduleAt.value) throw new ApiError(400, 'Chọn ngày giờ đăng.')
  const saved = dirty.value || isNew.value ? await saveSilently() : post.value!
  return contentAdmin.publish(saved.id, saved.version, new Date(scheduleAt.value).toISOString())
}, 'Đã hẹn giờ đăng.')

async function saveSilently(): Promise<AdminPost> {
  const saved = isNew.value
    ? await contentAdmin.createPost(type.value, slug.value.trim(), input())
    : await contentAdmin.updatePost(post.value!.id, post.value!.version, input())
  fill(saved)
  return saved
}

const unpublish = () => run(() => contentAdmin.unpublish(post.value!.id, post.value!.version), 'Đã chuyển về bản nháp (gỡ khỏi web).')
const archive = () => run(() => contentAdmin.archive(post.value!.id, post.value!.version), 'Đã lưu trữ (gỡ khỏi web).')
const changeSlug = () => run(() => contentAdmin.changeSlug(post.value!.id, post.value!.version, newSlug.value.trim()),
  'Đã đổi địa chỉ — địa chỉ cũ tự chuyển sang địa chỉ mới.')

async function remove() {
  if (!post.value || !confirm(`Xoá bài "${post.value.title}"? Bài bị gỡ khỏi web (có thể khôi phục bởi quản trị hệ thống).`)) return
  await run(async () => { await contentAdmin.deletePost(post.value!.id, post.value!.version) }, 'Đã xoá.')
  if (!error.value) emit('deleted')
}

async function reload() {
  if (!post.value) return
  await run(() => contentAdmin.getPost(post.value!.id), 'Đã tải bản mới nhất.')
}

const restore = (rev: RevisionRow) => run(() => contentAdmin.restore(post.value!.id, rev.id, post.value!.version),
  `Đã khôi phục phiên bản lúc ${new Date(rev.savedAt).toLocaleString('vi-VN')}.`)

async function loadRevisions() {
  revisions.value = post.value ? await contentAdmin.revisions(post.value.id).catch(() => []) : []
  if (post.value?.type === 'training') sessions.value = await contentAdmin.sessions(post.value.id).catch(() => [])
}

async function loadLookups() {
  topics.value = await contentAdmin.topics(type.value).catch(() => [])
  parents.value = canHaveParent.value
    ? (await contentAdmin.listPosts({ type: type.value, limit: 100 }).catch(() => ({ items: [] }))).items
        .filter((p) => p.parentId === null && p.id !== post.value?.id)
    : []
}

function onPicked(item: MediaItem) {
  media.value = { ...media.value, [item.id]: item }
  const p = picker.value
  if (p?.target === 'cover') {
    coverMediaId.value = item.id
    if (!coverImageAlt.value && item.altDefault) coverImageAlt.value = item.altDefault
  } else if (p?.target === 'block') {
    const block = blocks.value.find((b) => b.id === p.blockId)
    if (block) {
      block.mediaId = item.id
      if (!block.alt && item.altDefault) block.alt = item.altDefault
    }
  }
  picker.value = null
}

function onMediaLoaded(items: MediaItem[]) {
  media.value = { ...media.value, ...Object.fromEntries(items.map((m) => [m.id, m])) }
}

// ---------- Lịch khai giảng (bài đào tạo) ----------
const sessionForm = ref({ startsOn: '', endsOn: '', format: 'online' as CourseSession['format'], location: '', seats: '', priceVnd: '', status: 'open' as CourseSession['status'] })

async function addSession() {
  if (!post.value || !sessionForm.value.startsOn) return
  const f = sessionForm.value
  try {
    await contentAdmin.createSession(post.value.id, {
      startsOn: f.startsOn, endsOn: f.endsOn || null, format: f.format, location: f.location.trim() || null,
      seats: f.seats ? Number(f.seats) : null, priceVnd: f.priceVnd ? Number(f.priceVnd) : null, status: f.status,
    })
    sessionForm.value = { ...sessionForm.value, startsOn: '', endsOn: '', location: '' }
    sessions.value = await contentAdmin.sessions(post.value.id)
  } catch (e) {
    error.value = describe(e)
  }
}

async function setSessionStatus(s: CourseSession, status: CourseSession['status']) {
  try {
    const { id: _id, postId: _postId, ...rest } = s
    await contentAdmin.updateSession(s.id, { ...rest, status })
    sessions.value = await contentAdmin.sessions(s.postId)
  } catch (e) {
    error.value = describe(e)
  }
}

watch(title, (t) => { if (isNew.value && !slugTouched.value) slug.value = suggestSlug(t) })
watch([title, excerpt, label, keyPoints, topicId, parentId, coverMediaId, coverImageAlt, seoTitle, seoDescription, sortOrder, isFeatured, blocks],
  () => { dirty.value = true }, { deep: true })
watch(type, () => {
  // Đổi loại khi tạo bài mới ⇒ chủ đề/bài cha cũ không còn hợp lệ. (Bài đã có: loại cố định, chỉ nạp lại danh sách.)
  if (isNew.value) { topicId.value = null; parentId.value = null }
  void loadLookups()
})

onMounted(async () => {
  if (props.postId) {
    busy.value = true
    try {
      fill(await contentAdmin.getPost(props.postId))
    } catch (e) {
      error.value = describe(e)
    } finally {
      busy.value = false
    }
  }
  await Promise.all([loadLookups(), loadRevisions()])
})
</script>

<template>
  <section class="post-editor">
    <header class="pe-head">
      <div>
        <span class="eyebrow">{{ TYPE_LABELS[type] }} · {{ statusText }}</span>
        <h2>{{ title || 'Bài chưa có tiêu đề' }}</h2>
        <a v-if="post?.status === 'published' && PUBLIC_PATH[type]" :href="PUBLIC_PATH[type] + post.slug" target="_blank" rel="noopener">Xem trên web ↗</a>
      </div>
      <button type="button" class="button button-outline" @click="emit('close')">← Danh sách</button>
    </header>

    <p v-if="error" class="pe-error" role="alert">
      {{ error }}
      <button v-if="conflict" type="button" class="button button-outline" @click="reload">Tải lại bản mới</button>
    </p>
    <p v-else-if="message" class="pe-ok" role="status">{{ message }}</p>

    <div class="pe-grid">
      <div class="pe-main">
        <div class="pe-fields">
          <label v-if="isNew">Loại nội dung
            <select v-model="type"><option v-for="(l, t) in TYPE_LABELS" :key="t" :value="t">{{ l }}</option></select>
          </label>
          <label>Tiêu đề * <input v-model="title" maxlength="200" required /></label>
          <label v-if="isNew">Địa chỉ (slug) * — cố định sau khi tạo
            <input v-model="slug" maxlength="150" pattern="[a-z0-9]+(-[a-z0-9]+)*" @input="slugTouched = true" />
          </label>
          <div v-else class="pe-slug">
            <label>Địa chỉ (slug) <input v-model="newSlug" maxlength="150" /></label>
            <button type="button" class="button button-outline" :disabled="busy || newSlug === slug" @click="changeSlug">Đổi địa chỉ</button>
          </div>
          <label>Tóm tắt (hiện trên thẻ và mô tả tìm kiếm) <textarea v-model="excerpt" rows="2" maxlength="500" /></label>
          <div class="pe-row">
            <label>Nhãn <input v-model="label" maxlength="40" placeholder="HƯỚNG DẪN, BẢO MẬT…" /></label>
            <label>Chủ đề
              <select v-model="topicId"><option :value="null">— Không —</option><option v-for="t in topics" :key="t.id" :value="t.id">{{ t.name }}{{ t.isActive ? '' : ' (đang tắt)' }}</option></select>
            </label>
            <label v-if="canHaveParent">Thuộc trang (hạng mục con)
              <select v-model="parentId"><option :value="null">— Là trang chính —</option><option v-for="p in parents" :key="p.id" :value="p.id">{{ p.title }}</option></select>
            </label>
          </div>
          <label>Ý chính (mỗi dòng một ý, tối đa 10) <textarea v-model="keyPoints" rows="3" /></label>
        </div>

        <h3>Nội dung</h3>
        <BlockEditor v-model="blocks" :media="media" @pick-image="(id) => (picker = { target: 'block', blockId: id })" />
      </div>

      <aside class="pe-side">
        <div class="pe-card">
          <h3>Đăng bài</h3>
          <button type="button" class="button button-primary" :disabled="busy || !title.trim() || (isNew && !slug)" @click="save">{{ isNew ? 'Tạo bản nháp' : 'Lưu' }}</button>
          <button type="button" class="button button-outline" :disabled="busy || !title.trim() || (isNew && !slug)" @click="publishNow">Lưu &amp; đăng ngay</button>
          <label>Hẹn giờ đăng <input v-model="scheduleAt" type="datetime-local" /></label>
          <button type="button" class="button button-outline" :disabled="busy || !scheduleAt" @click="schedule">Hẹn giờ</button>
          <template v-if="post">
            <button v-if="post.status === 'published'" type="button" class="button button-outline" :disabled="busy" @click="unpublish">Gỡ khỏi web (về nháp)</button>
            <button v-if="post.status !== 'archived'" type="button" class="button button-outline" :disabled="busy" @click="archive">Lưu trữ</button>
            <button type="button" class="pe-danger" :disabled="busy" @click="remove">Xoá bài</button>
          </template>
          <small v-if="dirty && post" class="pe-dirty">Có thay đổi chưa lưu</small>
        </div>

        <div class="pe-card">
          <h3>Ảnh bìa</h3>
          <img v-if="coverUrl" :src="coverUrl" alt="" class="pe-cover" />
          <button type="button" class="button button-outline" @click="picker = { target: 'cover' }">Chọn ảnh bìa</button>
          <button v-if="coverMediaId" type="button" class="pe-link" @click="coverMediaId = null">Bỏ ảnh bìa</button>
          <input v-model="coverImageAlt" maxlength="200" placeholder="Mô tả ảnh bìa" />
        </div>

        <div class="pe-card">
          <h3>SEO &amp; hiển thị</h3>
          <label>Tiêu đề SEO <input v-model="seoTitle" maxlength="70" /></label>
          <label>Mô tả SEO <textarea v-model="seoDescription" rows="2" maxlength="160" /></label>
          <label>Thứ tự <input v-model.number="sortOrder" type="number" /></label>
          <label class="pe-check"><input v-model="isFeatured" type="checkbox" /> Nổi bật (trang chủ)</label>
        </div>

        <div v-if="post" class="pe-card">
          <h3>Phiên bản ({{ revisions.length }})</h3>
          <ul class="pe-revisions">
            <li v-for="(rev, i) in revisions" :key="rev.id">
              <span>{{ new Date(rev.savedAt).toLocaleString('vi-VN') }} — {{ rev.title }}</span>
              <button v-if="i > 0" type="button" class="pe-link" :disabled="busy" @click="restore(rev)">Khôi phục</button>
              <em v-else>hiện tại</em>
            </li>
          </ul>
        </div>

        <div v-if="post && type === 'training'" class="pe-card">
          <h3>Lịch khai giảng</h3>
          <ul class="pe-sessions">
            <li v-for="s in sessions" :key="s.id">
              <span>{{ s.startsOn }} · {{ s.format }}{{ s.location ? ` · ${s.location}` : '' }}{{ s.seats ? ` · ${s.seats} chỗ` : '' }}</span>
              <select :value="s.status" @change="setSessionStatus(s, ($event.target as HTMLSelectElement).value as CourseSession['status'])">
                <option value="open">Mở</option><option value="full">Đủ chỗ</option><option value="closed">Đóng</option>
              </select>
            </li>
          </ul>
          <div class="pe-session-form">
            <input v-model="sessionForm.startsOn" type="date" aria-label="Ngày khai giảng" />
            <select v-model="sessionForm.format"><option value="online">Online</option><option value="offline">Offline</option><option value="hybrid">Kết hợp</option></select>
            <input v-model="sessionForm.location" placeholder="Địa điểm" />
            <input v-model="sessionForm.seats" type="number" min="1" placeholder="Số chỗ" />
            <input v-model="sessionForm.priceVnd" type="number" min="0" placeholder="Học phí (VND, để trống = liên hệ)" />
            <button type="button" class="button button-outline" :disabled="!sessionForm.startsOn" @click="addSession">Thêm lịch</button>
          </div>
        </div>
      </aside>
    </div>

    <section class="pe-preview">
      <h3>Xem trước</h3>
      <article class="article-detail">
        <h1 class="article-detail-title">{{ title }}</h1>
        <p v-if="excerpt" class="article-lead">{{ excerpt }}</p>
        <ContentBlocks :blocks="previewBlocks" :media="previewMedia" />
      </article>
    </section>

    <div v-if="picker" class="pe-modal" role="dialog" aria-modal="true" aria-label="Chọn ảnh" @click.self="picker = null">
      <div class="pe-modal-body">
        <header class="pe-head"><h3>Chọn ảnh</h3><button type="button" class="button button-outline" @click="picker = null">Đóng</button></header>
        <MediaLibrary pick @picked="onPicked" @loaded="onMediaLoaded" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.post-editor { display: grid; gap: 1rem; }
.pe-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
.pe-head h2, .pe-head h3 { margin: .25rem 0; }
.pe-error, .pe-ok { margin: 0; padding: .75rem 1rem; border-radius: 10px; font-size: .9rem; display: flex; gap: .75rem; align-items: center; flex-wrap: wrap; }
.pe-error { background: rgba(220, 38, 38, .1); color: #b91c1c; }
.pe-ok { background: rgba(22, 163, 74, .1); color: #15803d; }
.pe-grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 1rem; align-items: start; }
@media (max-width: 960px) { .pe-grid { grid-template-columns: 1fr; } }
.pe-main, .pe-fields, .pe-side, .pe-card { display: grid; gap: .6rem; }
.pe-card { padding: .9rem; border: 1px solid rgba(127, 127, 127, .25); border-radius: 12px; background: rgba(255, 255, 255, .7); }
.pe-card h3 { margin: 0; font-size: 1rem; }
.post-editor label { display: grid; gap: .25rem; font-size: .85rem; font-weight: 600; }
.post-editor input, .post-editor textarea, .post-editor select { padding: .5rem .65rem; border: 1px solid rgba(127, 127, 127, .35); border-radius: 8px; font: inherit; font-weight: 400; background: #fff; }
.pe-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: .6rem; }
.pe-slug { display: flex; gap: .5rem; align-items: flex-end; }
.pe-slug label { flex: 1; }
.pe-check { display: flex !important; grid-auto-flow: column; align-items: center; gap: .4rem; }
.pe-cover { width: 100%; border-radius: 8px; }
.pe-danger { border: 0; background: transparent; color: #b91c1c; cursor: pointer; text-align: left; padding: .25rem 0; }
.pe-link { border: 0; background: transparent; color: #0066cc; cursor: pointer; padding: 0; text-align: left; }
.pe-dirty { color: #b45309; }
.pe-revisions, .pe-sessions { list-style: none; margin: 0; padding: 0; display: grid; gap: .4rem; font-size: .82rem; max-height: 260px; overflow: auto; }
.pe-revisions li, .pe-sessions li { display: flex; justify-content: space-between; gap: .5rem; align-items: center; }
.pe-session-form { display: grid; gap: .4rem; }
.pe-preview { padding: 1rem; border: 1px dashed rgba(127, 127, 127, .4); border-radius: 12px; }
.pe-modal { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 1rem; background: rgba(7, 14, 36, .55); }
.pe-modal-body { width: min(960px, 100%); max-height: 90vh; overflow: auto; padding: 1rem; border-radius: 14px; background: #fff; }
</style>
