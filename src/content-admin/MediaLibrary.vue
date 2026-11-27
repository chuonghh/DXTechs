<script setup lang="ts">
// Thư viện ảnh (CT-C2). Chế độ "pick": bấm ảnh để chọn (khối ảnh, ảnh bìa). Server tự xoá EXIF/GPS, chống tải trùng,
// chặn xoá ảnh đang được bài dùng (409).
import { onMounted, ref } from 'vue'
import { ApiError, contentAdmin, type MediaItem } from '../api'

const props = defineProps<{ pick?: boolean }>()
const emit = defineEmits<{ picked: [item: MediaItem]; loaded: [items: MediaItem[]] }>()

const items = ref<MediaItem[]>([])
const cursor = ref<string | null>(null)
const loading = ref(false)
const uploading = ref(false)
const message = ref('')
const alt = ref('')

async function load(more = false) {
  loading.value = true
  try {
    const page = await contentAdmin.listMedia(more ? cursor.value ?? undefined : undefined)
    items.value = more ? [...items.value, ...page.items] : page.items
    cursor.value = page.nextCursor
    emit('loaded', items.value)
  } catch (e) {
    message.value = e instanceof ApiError ? e.message : 'Không tải được thư viện ảnh.'
  } finally {
    loading.value = false
  }
}

async function upload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    message.value = 'Ảnh tối đa 5 MB.'
    return
  }
  uploading.value = true
  message.value = ''
  try {
    const item = await contentAdmin.uploadMedia(file, alt.value.trim() || undefined)
    message.value = item.duplicate
      ? 'Ảnh này đã có trong thư viện — dùng lại ảnh cũ.'
      : `Đã tải ảnh ${item.width}×${item.height}${item.metadataBytesRemoved ? ` (đã xoá ${item.metadataBytesRemoved} byte thông tin máy ảnh/vị trí)` : ''}.`
    items.value = [item, ...items.value.filter((m) => m.id !== item.id)]
    alt.value = ''
    emit('loaded', items.value)
    if (props.pick) emit('picked', item)
  } catch (e) {
    message.value = e instanceof ApiError ? e.message : 'Tải ảnh thất bại.'
  } finally {
    uploading.value = false
  }
}

async function remove(item: MediaItem) {
  if (!confirm('Xoá ảnh này khỏi thư viện?')) return
  try {
    await contentAdmin.deleteMedia(item.id)
    items.value = items.value.filter((m) => m.id !== item.id)
    emit('loaded', items.value)
  } catch (e) {
    message.value = e instanceof ApiError && e.status === 409 ? 'Ảnh đang được bài viết dùng — gỡ khỏi bài trước khi xoá.' : 'Xoá ảnh thất bại.'
  }
}

onMounted(() => void load())
</script>

<template>
  <section class="media-library">
    <div class="ml-upload">
      <input v-model="alt" maxlength="200" placeholder="Mô tả ảnh mặc định (tuỳ chọn)" />
      <label class="button button-primary ml-upload-btn">
        {{ uploading ? 'Đang tải…' : 'Tải ảnh lên' }}
        <input type="file" accept="image/jpeg,image/png,image/webp" :disabled="uploading" hidden @change="upload" />
      </label>
    </div>
    <p class="ml-note">JPEG, PNG, WebP · tối đa 5 MB và 6000×6000 px. Ảnh điện thoại: xoay đúng chiều trước khi tải (thông tin xoay bị xoá cùng EXIF).</p>
    <p v-if="message" class="ml-message" role="status">{{ message }}</p>

    <div class="ml-grid">
      <figure v-for="item in items" :key="item.id" class="ml-item" :class="{ 'ml-pickable': pick }" @click="pick && emit('picked', item)">
        <img :src="item.url" :alt="item.altDefault ?? ''" loading="lazy" />
        <figcaption>
          <span>{{ item.width }}×{{ item.height }} · {{ Math.round(item.bytes / 1024) }} KB</span>
          <button v-if="!pick" type="button" @click.stop="remove(item)">Xoá</button>
        </figcaption>
      </figure>
    </div>
    <p v-if="!items.length && !loading" class="ml-note">Chưa có ảnh nào.</p>
    <button v-if="cursor" type="button" class="button button-outline" :disabled="loading" @click="load(true)">Tải thêm</button>
  </section>
</template>

<style scoped>
.media-library { display: grid; gap: .75rem; }
.ml-upload { display: flex; gap: .5rem; flex-wrap: wrap; }
.ml-upload input { flex: 1 1 220px; padding: .5rem .65rem; border: 1px solid rgba(127, 127, 127, .35); border-radius: 8px; font: inherit; }
.ml-upload-btn { cursor: pointer; }
.ml-note { margin: 0; font-size: .82rem; opacity: .7; }
.ml-message { margin: 0; padding: .5rem .75rem; border-radius: 8px; background: rgba(0, 102, 204, .08); font-size: .88rem; }
.ml-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .75rem; }
.ml-item { margin: 0; border: 1px solid rgba(127, 127, 127, .25); border-radius: 10px; overflow: hidden; background: #fff; }
.ml-item img { display: block; width: 100%; height: 110px; object-fit: cover; }
.ml-item figcaption { display: flex; justify-content: space-between; align-items: center; padding: .35rem .5rem; font-size: .75rem; }
.ml-item figcaption button { border: 0; background: transparent; color: #b91c1c; cursor: pointer; font-size: .75rem; }
.ml-pickable { cursor: pointer; }
.ml-pickable:hover { outline: 2px solid #0066cc; }
</style>
