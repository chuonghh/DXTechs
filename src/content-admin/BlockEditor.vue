<script setup lang="ts">
// Soạn thân bài theo khối (CT-C2). Mỗi khối một thẻ: đổi thứ tự, xoá, thêm khối mới ngay sau.
import type { MediaItem } from '../api'
import { BLOCK_TYPES, emptyBlock, type BlockType, type EditBlock } from './blocks'

const blocks = defineModel<EditBlock[]>({ required: true })
defineProps<{ media: Record<string, MediaItem> }>()
const emit = defineEmits<{ pickImage: [blockId: string] }>()

function insert(type: BlockType, after = blocks.value.length - 1) {
  const next = [...blocks.value]
  next.splice(after + 1, 0, emptyBlock(type))
  blocks.value = next
}

function move(index: number, delta: -1 | 1) {
  const target = index + delta
  if (target < 0 || target >= blocks.value.length) return
  const next = [...blocks.value]
  ;[next[index], next[target]] = [next[target], next[index]]
  blocks.value = next
}

function remove(index: number) {
  blocks.value = blocks.value.filter((_, i) => i !== index)
}

const typeLabel = (type: BlockType) => BLOCK_TYPES.find((t) => t.type === type)?.label ?? type
</script>

<template>
  <div class="block-editor">
    <p class="be-hint">Định dạng trong đoạn chữ: <code>**đậm**</code> · <code>*nghiêng*</code> · <code>[chữ](/duong-dan)</code> hoặc <code>[chữ](https://…)</code>. Không dùng HTML.</p>

    <article v-for="(b, i) in blocks" :key="b.id" class="be-block">
      <header class="be-block-head">
        <strong>{{ i + 1 }}. {{ typeLabel(b.type) }}</strong>
        <span class="be-actions">
          <button type="button" :disabled="i === 0" title="Lên" @click="move(i, -1)">↑</button>
          <button type="button" :disabled="i === blocks.length - 1" title="Xuống" @click="move(i, 1)">↓</button>
          <button type="button" class="be-danger" title="Xoá khối" @click="remove(i)">✕</button>
        </span>
      </header>

      <template v-if="b.type === 'heading'">
        <div class="be-row">
          <select v-model.number="b.level" aria-label="Cấp tiêu đề"><option :value="2">H2 — mục lớn</option><option :value="3">H3 — mục nhỏ</option></select>
          <input v-model="b.text" maxlength="200" placeholder="Nội dung tiêu đề" />
        </div>
      </template>

      <textarea v-else-if="b.type === 'paragraph'" v-model="b.text" rows="4" maxlength="5000" placeholder="Nội dung đoạn văn" />

      <template v-else-if="b.type === 'list'">
        <label class="be-check"><input v-model="b.ordered" type="checkbox" /> Danh sách đánh số</label>
        <textarea v-model="b.items" rows="4" placeholder="Mỗi dòng một mục" />
      </template>

      <template v-else-if="b.type === 'image'">
        <div class="be-image">
          <img v-if="b.mediaId && media[b.mediaId]" :src="media[b.mediaId].url" alt="" />
          <span v-else class="be-image-empty">Chưa chọn ảnh</span>
          <button type="button" class="button button-outline" @click="emit('pickImage', b.id)">Chọn ảnh từ thư viện</button>
        </div>
        <div class="be-row">
          <input v-model="b.alt" maxlength="200" placeholder="Mô tả ảnh (bắt buộc — cho người khiếm thị và công cụ tìm kiếm)" />
          <input v-model="b.caption" maxlength="300" placeholder="Chú thích (tuỳ chọn)" />
        </div>
      </template>

      <template v-else-if="b.type === 'callout'">
        <select v-model="b.tone" aria-label="Kiểu ghi chú"><option value="info">Thông tin</option><option value="warn">Cảnh báo</option></select>
        <textarea v-model="b.text" rows="2" placeholder="Nội dung ghi chú" />
      </template>

      <template v-else-if="b.type === 'quote'">
        <textarea v-model="b.text" rows="2" placeholder="Câu trích dẫn" />
        <input v-model="b.cite" maxlength="200" placeholder="Nguồn (tuỳ chọn)" />
      </template>

      <div v-else-if="b.type === 'cta'" class="be-row">
        <input v-model="b.label" maxlength="60" placeholder="Chữ trên nút (ví dụ: Đăng ký tư vấn)" />
        <input v-model="b.href" maxlength="2000" placeholder="/lien-he hoặc https://…" />
      </div>

      <template v-else-if="b.type === 'faq'">
        <input v-model="b.question" maxlength="300" placeholder="Câu hỏi" />
        <textarea v-model="b.text" rows="2" placeholder="Câu trả lời" />
      </template>

      <div class="be-insert">
        <span>Thêm sau:</span>
        <button v-for="t in BLOCK_TYPES" :key="t.type" type="button" @click="insert(t.type, i)">{{ t.label }}</button>
      </div>
    </article>

    <div class="be-insert be-insert-end">
      <span>{{ blocks.length ? 'Thêm khối:' : 'Bài chưa có nội dung — thêm khối đầu tiên:' }}</span>
      <button v-for="t in BLOCK_TYPES" :key="t.type" type="button" @click="insert(t.type)">{{ t.label }}</button>
    </div>
  </div>
</template>

<style scoped>
.block-editor { display: grid; gap: .75rem; }
.be-hint { margin: 0; font-size: .82rem; opacity: .75; }
.be-hint code { padding: 0 .25rem; border-radius: 4px; background: rgba(127, 127, 127, .15); }
.be-block { display: grid; gap: .5rem; padding: .75rem; border: 1px solid rgba(127, 127, 127, .25); border-radius: 12px; background: rgba(255, 255, 255, .6); }
.be-block-head { display: flex; justify-content: space-between; align-items: center; font-size: .9rem; }
.be-actions { display: flex; gap: .25rem; }
.be-actions button { width: 2rem; height: 2rem; border: 1px solid rgba(127, 127, 127, .3); border-radius: 8px; background: transparent; cursor: pointer; }
.be-actions button:disabled { opacity: .35; cursor: default; }
.be-actions .be-danger { color: #b91c1c; }
.be-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: .5rem; }
.block-editor input, .block-editor textarea, .block-editor select { width: 100%; padding: .5rem .65rem; border: 1px solid rgba(127, 127, 127, .35); border-radius: 8px; font: inherit; background: #fff; }
.be-check { display: flex; gap: .4rem; align-items: center; font-size: .9rem; }
.be-check input { width: auto; }
.be-image { display: flex; gap: .75rem; align-items: center; }
.be-image img { width: 120px; height: 80px; object-fit: cover; border-radius: 8px; }
.be-image-empty { display: grid; place-items: center; width: 120px; height: 80px; border: 1px dashed rgba(127, 127, 127, .5); border-radius: 8px; font-size: .8rem; opacity: .7; }
.be-insert { display: flex; flex-wrap: wrap; gap: .3rem; align-items: center; font-size: .78rem; opacity: .85; }
.be-insert button { padding: .2rem .5rem; border: 1px dashed rgba(0, 102, 204, .45); border-radius: 999px; background: transparent; color: #0066cc; cursor: pointer; font-size: .78rem; }
.be-insert-end { padding: .5rem 0; }
</style>
