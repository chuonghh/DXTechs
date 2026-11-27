// API nội dung (server CT-2, ADR-015): tin tức, giải pháp, đào tạo, tài nguyên, thuật ngữ, form đăng ký tư vấn.
// Kiểu dữ liệu khớp đúng response của server (JSON camelCase). Chỉ bài ĐÃ ĐĂNG mới đi qua các API này.

import { api } from './client'

export type PostType = 'news' | 'solution' | 'training' | 'resource' | 'glossary' | 'page'

// ---------- Khối nội dung (ADR-015 §3) — không có HTML, web chỉ in chữ ----------

export interface Span {
  text: string
  bold?: boolean
  italic?: boolean
  /** Đường dẫn nội bộ `/…` hoặc `https://…` (server đã kiểm). */
  href?: string
}

export type ContentBlock =
  | { id: string; type: 'heading'; level: 2 | 3; text: string }
  | { id: string; type: 'paragraph'; spans: Span[] }
  | { id: string; type: 'list'; ordered?: boolean; items: Span[][] }
  | { id: string; type: 'image'; mediaId: string; alt: string; caption?: string | null }
  | { id: string; type: 'callout'; tone: 'info' | 'warn'; spans: Span[] }
  | { id: string; type: 'quote'; spans: Span[]; cite?: string | null }
  | { id: string; type: 'cta'; label: string; href: string }
  | { id: string; type: 'faq'; question: string; answer: Span[] }

export interface MediaRef {
  url: string
  width: number
  height: number
}

export interface CoverImage {
  url: string
  alt: string | null
}

export interface TopicRef {
  slug: string
  name: string
  path: string | null
}

export interface PostLink {
  type: PostType
  slug: string
  title: string
  excerpt: string | null
  path: string | null
}

export interface TopicPage extends PostLink {
  keyPoints: string[]
  /** Chữ của khối ghi chú đầu tiên (ví dụ "Đối tượng phù hợp: …"). */
  callout: string | null
  children: PostLink[]
}

export interface TopicNode {
  slug: string
  name: string
  description: string | null
  imageUrl: string | null
  path: string | null
  children: TopicNode[]
  pages: TopicPage[]
}

export interface PostSummary {
  type: PostType
  slug: string
  title: string
  excerpt: string | null
  label: string | null
  publishedAt: string
  readingMinutes: number | null
  cover: CoverImage | null
  topic: TopicRef | null
  path: string | null
  /** Chỉ có khi gọi danh sách với `include: 'blocks'`. */
  blocks?: ContentBlock[] | null
  keyPoints?: string[] | null
}

export interface PostPage {
  items: PostSummary[]
  nextCursor: string | null
}

export interface PostDetail {
  type: PostType
  slug: string
  title: string
  excerpt: string | null
  label: string | null
  blocks: ContentBlock[]
  keyPoints: string[]
  cover: CoverImage | null
  media: Record<string, MediaRef>
  publishedAt: string
  updatedAt: string
  readingMinutes: number | null
  seoTitle: string | null
  seoDescription: string | null
  breadcrumb: TopicRef[]
  parent: PostLink | null
  children: PostLink[]
  path: string | null
}

export interface ListPostsQuery {
  type: PostType
  topic?: string
  q?: string
  sort?: 'newest' | 'order'
  cursor?: string
  limit?: number
  /** `blocks` ⇒ mỗi thẻ kèm khối nội dung (thuật ngữ, sách, tài liệu). */
  include?: 'blocks'
}

export interface LeadRequest {
  kind: 'consultation' | 'course'
  fullName: string
  email?: string
  phone?: string
  company?: string
  message?: string
  postSlug?: string
  sessionId?: string
  consent: boolean
  /** Trường bẫy: người thật để trống (ô ẩn). */
  website?: string
  /** Thời gian từ lúc mở form tới lúc gửi (ms) — gửi quá nhanh bị coi là bot. */
  elapsedMs: number
}

// ---------- Gọi API ----------

export function getTopics(type: PostType, signal?: AbortSignal) {
  return api.get<TopicNode[]>('/content/topics', { query: { type }, signal })
}

export function listPosts(query: ListPostsQuery, signal?: AbortSignal) {
  return api.get<PostPage>('/content/posts', { query: { ...query }, signal })
}

export function getPost(type: PostType, slug: string, signal?: AbortSignal) {
  return api.get<PostDetail>(`/content/posts/${type}/${encodeURIComponent(slug)}`, { signal })
}

export function getFeatured(type: PostType, limit = 6, signal?: AbortSignal) {
  return api.get<PostSummary[]>('/content/featured', { query: { type, limit }, signal })
}

export function submitLead(body: LeadRequest) {
  return api.post<{ received: boolean }>('/content/leads', body)
}

/** Chữ thuần của một dãy đoạn chữ. */
export function spansText(spans: Span[] | undefined): string {
  return (spans ?? []).map((s) => s.text).join('')
}
