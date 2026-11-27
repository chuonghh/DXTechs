// Nội dung web đọc từ API (CT-C1, ADR-015): tin tức, giải pháp, đào tạo, sách, tài liệu, thuật ngữ.
//
// Nguyên tắc:
//  - Trang hiển thị NGAY bằng dữ liệu gắn cứng cũ (src/data/*), rồi thay bằng dữ liệu API khi tải xong ⇒ không có màn hình trắng,
//    và web vẫn chạy nếu API lỗi hoặc database chưa nạp nội dung (`--seed-content`).
//  - Dữ liệu API được đổi về đúng kiểu cũ (KnowledgeArticle, SolutionCategory…) ⇒ giao diện các trang gần như không đổi.
//  - Mỗi loại chỉ tải một lần mỗi phiên; lỗi thì lần sau thử lại.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  ApiError,
  getPost,
  getTopics,
  listPosts,
  spansText,
  type ContentBlock,
  type MediaRef,
  type PostSummary,
  type TopicNode,
} from '../api'
import { articles as staticArticles, type KnowledgeArticle } from '../data/articles'
import {
  staticBooks,
  staticDownloads,
  staticGlossary,
  type GlossaryTerm,
  type ResourceBook,
  type ResourceDownload,
} from '../data/resources'
import { staticSolutionCategories, type SolutionCategory } from '../data/solutions'

export type ContentSource = 'static' | 'api'

/** Bài tin tức đầy đủ để hiển thị trang chi tiết. */
export interface ArticleView {
  article: KnowledgeArticle
  blocks: ContentBlock[]
  media: Record<string, MediaRef>
}

const AUDIENCE_PREFIX = /^Đối tượng phù hợp:\s*/i
const BOOK_COLORS = ['#0066cc', '#2997ff', '#0066cc', '#0066cc']
const dateFormat = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' })

/** "2025-08-12T02:00:00Z" ⇒ "12.08.2025" (giờ Việt Nam) — đúng định dạng dữ liệu cũ. */
export function formatPostDate(iso: string): string {
  return dateFormat.format(new Date(iso)).replace(/\//g, '.')
}

export function toArticle(p: PostSummary): KnowledgeArticle {
  return {
    slug: p.slug,
    label: p.label ?? '',
    title: p.title,
    excerpt: p.excerpt ?? '',
    date: formatPostDate(p.publishedAt),
    readTime: p.readingMinutes ? `${p.readingMinutes} phút đọc` : '',
    imageUrl: p.cover?.url ?? '',
    imageAlt: p.cover?.alt ?? p.title,
    keyPoints: [],
    sections: [],
  }
}

/** Bài cũ (sections) ⇒ khối, để trang chi tiết luôn hiển thị bằng một bộ dựng duy nhất. */
export function sectionsToBlocks(article: KnowledgeArticle): ContentBlock[] {
  const blocks: ContentBlock[] = []
  article.sections.forEach((section, i) => {
    blocks.push({ id: `s${i}`, type: 'heading', level: 2, text: section.heading })
    section.paragraphs.forEach((text, j) => blocks.push({ id: `s${i}p${j}`, type: 'paragraph', spans: [{ text }] }))
    if (section.bullets?.length) {
      blocks.push({ id: `s${i}l`, type: 'list', ordered: false, items: section.bullets.map((text) => [{ text }]) })
    }
  })
  return blocks
}

/** Cây chủ đề giải pháp/đào tạo ⇒ kiểu SolutionCategory mà menu và trang Giải pháp đang dùng. */
export function toSolutionCategories(nodes: TopicNode[], kind: 'solution' | 'training'): SolutionCategory[] {
  return nodes.map((node) => ({
    name: node.name,
    slug: node.slug,
    description: node.description ?? '',
    image: node.imageUrl ?? '',
    subcategories: node.pages.map((page) => {
      const points = page.keyPoints.length ? page.keyPoints : undefined
      return {
        name: page.title,
        slug: page.slug,
        description: page.excerpt ?? undefined,
        highlights: kind === 'solution' ? points : undefined,
        focusAreas: kind === 'training' ? points : undefined,
        audience: page.callout && AUDIENCE_PREFIX.test(page.callout) ? page.callout.replace(AUDIENCE_PREFIX, '') : undefined,
        items: page.children.map((c) => c.title),
        itemSlugs: Object.fromEntries(page.children.map((c) => [c.title, c.slug])),
      }
    }),
  }))
}

function blocksOf(p: PostSummary): ContentBlock[] {
  return Array.isArray(p.blocks) ? (p.blocks as ContentBlock[]) : []
}

function paragraphs(blocks: ContentBlock[]): string[] {
  return blocks.flatMap((b) => (b.type === 'paragraph' ? [spansText(b.spans)] : []))
}

function firstCta(blocks: ContentBlock[]): string {
  const cta = blocks.find((b) => b.type === 'cta')
  return cta && cta.type === 'cta' ? cta.href : ''
}

/** Thuật ngữ: tên đầy đủ là đoạn đầu tiên của bài (quy ước của dữ liệu seed). */
export function toGlossaryTerm(p: PostSummary): GlossaryTerm {
  const [fullName = ''] = paragraphs(blocksOf(p))
  return { term: p.title, fullName, description: p.excerpt ?? '', category: p.label ?? '' }
}

/** Sách: đoạn "Tác giả: X · N trang" (quy ước seed) ⇒ tác giả + số trang; link lấy từ nút CTA. */
export function toBook(p: PostSummary, index: number): ResourceBook {
  const blocks = blocksOf(p)
  const meta = paragraphs(blocks).find((t) => t.startsWith('Tác giả:')) ?? ''
  const [author = '', pages = ''] = meta.replace(/^Tác giả:\s*/, '').split(' · ')
  return {
    title: p.title,
    author,
    pages,
    detail: p.excerpt ?? '',
    link: firstCta(blocks),
    label: p.label ?? '',
    tag: p.label ?? '',
    color: BOOK_COLORS[index % BOOK_COLORS.length],
  }
}

export function toDownload(p: PostSummary): ResourceDownload {
  return { title: p.title, detail: p.excerpt ?? '', link: firstCta(blocksOf(p)), label: p.label ?? '' }
}

export const useContentStore = defineStore('content', () => {
  const news = ref<KnowledgeArticle[]>(staticArticles)
  const solutions = ref<SolutionCategory[]>(staticSolutionCategories)
  const books = ref<ResourceBook[]>(staticBooks)
  const downloads = ref<ResourceDownload[]>(staticDownloads)
  const glossary = ref<GlossaryTerm[]>(staticGlossary)
  const source = ref<Record<'news' | 'solutions' | 'resources', ContentSource>>({ news: 'static', solutions: 'static', resources: 'static' })

  const pending: Partial<Record<string, Promise<void>>> = {}

  /** Chạy một lần mỗi phiên; lỗi ⇒ giữ dữ liệu cũ, lần gọi sau thử lại. */
  function once(key: string, load: () => Promise<void>): Promise<void> {
    pending[key] ??= load().catch((error) => {
      delete pending[key]
      if (import.meta.env.DEV) console.warn(`[content] ${key}: dùng dữ liệu dự phòng`, error)
    })
    return pending[key]!
  }

  function loadNews() {
    return once('news', async () => {
      const page = await listPosts({ type: 'news', limit: 50 })
      if (page.items.length) {
        news.value = page.items.map(toArticle)
        source.value.news = 'api'
      }
    })
  }

  function loadSolutions() {
    return once('solutions', async () => {
      const [solution, training] = await Promise.all([getTopics('solution'), getTopics('training')])
      // Server cũ (trước CT-2b) chưa có keyPoints/children ⇒ ném lỗi ở đây ⇒ giữ dữ liệu cũ.
      if ([...solution, ...training].some((n) => n.pages.some((p) => !Array.isArray(p.children)))) {
        throw new Error('API cây chủ đề chưa có hạng mục con (server trước CT-2b)')
      }
      const categories = [...toSolutionCategories(solution, 'solution'), ...toSolutionCategories(training, 'training')]
      if (categories.some((c) => c.subcategories.length)) {
        solutions.value = categories
        source.value.solutions = 'api'
      }
    })
  }

  function loadResources() {
    return once('resources', async () => {
      const [bookPage, downloadPage, glossaryPage] = await Promise.all([
        listPosts({ type: 'resource', topic: 'sach', sort: 'order', limit: 100, include: 'blocks' }),
        listPosts({ type: 'resource', topic: 'download', sort: 'order', limit: 100, include: 'blocks' }),
        listPosts({ type: 'glossary', sort: 'order', limit: 100, include: 'blocks' }),
      ])
      // Server cũ (trước CT-2b) bỏ qua include=blocks ⇒ thẻ không có khối ⇒ thiếu tác giả/link: giữ dữ liệu cũ.
      const usable = (items: PostSummary[]) => items.length > 0 && items.every((i) => Array.isArray(i.blocks))
      if (usable(bookPage.items)) books.value = bookPage.items.map(toBook)
      if (usable(downloadPage.items)) downloads.value = downloadPage.items.map(toDownload)
      if (usable(glossaryPage.items)) glossary.value = glossaryPage.items.map(toGlossaryTerm)
      if ([bookPage, downloadPage, glossaryPage].some((p) => usable(p.items))) source.value.resources = 'api'
    })
  }

  /**
   * Bài tin tức đầy đủ. API trả 404 (bài bị gỡ, slug sai) ⇒ null (trang hiện "không tìm thấy").
   * Lỗi mạng/máy chủ ⇒ dùng bài cũ cùng slug nếu có.
   */
  async function loadArticle(slug: string, signal?: AbortSignal): Promise<ArticleView | null> {
    try {
      const post = await getPost('news', slug, signal)
      return {
        article: { ...toArticle({ ...post, topic: null }), keyPoints: post.keyPoints },
        blocks: post.blocks,
        media: post.media,
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      const fallback = staticArticles.find((a) => a.slug === slug)
      return fallback ? { article: fallback, blocks: sectionsToBlocks(fallback), media: {} } : null
    }
  }

  return { news, solutions, books, downloads, glossary, source, loadNews, loadSolutions, loadResources, loadArticle }
})
