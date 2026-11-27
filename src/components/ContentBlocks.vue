<script setup lang="ts">
// Dựng thân bài dạng khối từ API (ADR-015 §3). KHÔNG dùng v-html: mọi chữ đi qua nội suy {{ }} của Vue (tự escape) ⇒
// không có cách chèn script qua nội dung. Liên kết nội bộ dùng RouterLink; liên kết ngoài chỉ https (server đã kiểm), mở tab mới
// với rel="noopener noreferrer". Khối được gom thành từng <section> theo tiêu đề cấp 2 để dùng lại CSS bài viết hiện có.
import { computed } from 'vue'
import type { ContentBlock, MediaRef, Span } from '../api'

const props = defineProps<{
  blocks: ContentBlock[]
  media?: Record<string, MediaRef>
}>()

const sections = computed(() => {
  const groups: ContentBlock[][] = []
  for (const block of props.blocks) {
    if (block.type === 'heading' && block.level === 2) groups.push([block])
    else if (groups.length) groups[groups.length - 1].push(block)
    else groups.push([block])
  }
  return groups
})

function isInternal(href: string | undefined): href is string {
  return !!href && href.startsWith('/') && !href.startsWith('//')
}

function isExternal(href: string | undefined): href is string {
  return !!href && href.startsWith('https://')
}

function spanKey(span: Span, index: number) {
  return `${index}:${span.text.slice(0, 20)}`
}
</script>

<template>
  <div class="content-blocks">
    <section v-for="(group, gi) in sections" :key="group[0]?.id ?? gi" class="article-detail-section">
      <template v-for="block in group" :key="block.id">
        <h2 v-if="block.type === 'heading' && block.level === 2">{{ block.text }}</h2>
        <h3 v-else-if="block.type === 'heading'">{{ block.text }}</h3>

        <p v-else-if="block.type === 'paragraph'">
          <template v-for="(span, i) in block.spans" :key="spanKey(span, i)">
            <RouterLink v-if="isInternal(span.href)" :to="span.href" :class="{ 'cb-bold': span.bold, 'cb-italic': span.italic }">{{ span.text }}</RouterLink>
            <a v-else-if="isExternal(span.href)" :href="span.href" target="_blank" rel="noopener noreferrer" :class="{ 'cb-bold': span.bold, 'cb-italic': span.italic }">{{ span.text }}</a>
            <strong v-else-if="span.bold && !span.italic">{{ span.text }}</strong>
            <em v-else-if="span.italic && !span.bold">{{ span.text }}</em>
            <strong v-else-if="span.bold && span.italic"><em>{{ span.text }}</em></strong>
            <template v-else>{{ span.text }}</template>
          </template>
        </p>

        <component :is="block.ordered ? 'ol' : 'ul'" v-else-if="block.type === 'list'">
          <li v-for="(item, li) in block.items" :key="li">
            <template v-for="(span, i) in item" :key="spanKey(span, i)">
              <RouterLink v-if="isInternal(span.href)" :to="span.href">{{ span.text }}</RouterLink>
              <a v-else-if="isExternal(span.href)" :href="span.href" target="_blank" rel="noopener noreferrer">{{ span.text }}</a>
              <strong v-else-if="span.bold">{{ span.text }}</strong>
              <em v-else-if="span.italic">{{ span.text }}</em>
              <template v-else>{{ span.text }}</template>
            </template>
          </li>
        </component>

        <figure v-else-if="block.type === 'image' && media?.[block.mediaId]" class="cb-figure">
          <img :src="media[block.mediaId].url" :alt="block.alt" :width="media[block.mediaId].width" :height="media[block.mediaId].height" loading="lazy" />
          <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
        </figure>

        <aside v-else-if="block.type === 'callout'" class="cb-callout" :class="`cb-callout-${block.tone}`" role="note">
          <template v-for="(span, i) in block.spans" :key="spanKey(span, i)"><strong v-if="span.bold">{{ span.text }}</strong><template v-else>{{ span.text }}</template></template>
        </aside>

        <blockquote v-else-if="block.type === 'quote'" class="cb-quote">
          <p><template v-for="(span, i) in block.spans" :key="spanKey(span, i)">{{ span.text }}</template></p>
          <cite v-if="block.cite">— {{ block.cite }}</cite>
        </blockquote>

        <p v-else-if="block.type === 'cta'" class="cb-cta">
          <RouterLink v-if="isInternal(block.href)" class="button button-primary" :to="block.href">{{ block.label }} <span aria-hidden="true">→</span></RouterLink>
          <a v-else-if="isExternal(block.href)" class="button button-primary" :href="block.href" target="_blank" rel="noopener noreferrer">{{ block.label }} <span aria-hidden="true">↗</span></a>
        </p>

        <details v-else-if="block.type === 'faq'" class="cb-faq">
          <summary>{{ block.question }}</summary>
          <p><template v-for="(span, i) in block.answer" :key="spanKey(span, i)">{{ span.text }}</template></p>
        </details>
      </template>
    </section>
  </div>
</template>

<style scoped>
.cb-bold { font-weight: 700; }
.cb-italic { font-style: italic; }
.cb-figure { margin: 1.5rem 0; }
.cb-figure img { width: 100%; height: auto; border-radius: 12px; }
.cb-figure figcaption { margin-top: .5rem; font-size: .875rem; opacity: .75; }
.cb-callout { margin: 1.25rem 0; padding: 1rem 1.25rem; border-radius: 12px; border-left: 4px solid currentColor; background: rgba(0, 102, 204, .08); }
.cb-callout-warn { background: rgba(234, 140, 0, .12); }
.cb-quote { margin: 1.5rem 0; padding-left: 1.25rem; border-left: 3px solid rgba(127, 127, 127, .5); font-style: italic; }
.cb-quote cite { display: block; margin-top: .5rem; font-size: .875rem; font-style: normal; opacity: .75; }
.cb-cta { margin: 1.5rem 0; }
.cb-faq { margin: .75rem 0; padding: .75rem 1rem; border-radius: 10px; background: rgba(127, 127, 127, .08); }
.cb-faq summary { cursor: pointer; font-weight: 600; }
</style>
