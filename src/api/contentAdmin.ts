// API quản trị nội dung (server CT-3, ADR-015) — policy `content`: editor hoặc admin đang hoạt động.
// Chống ghi đè: mỗi bài/chủ đề có `version` (xmin); mọi thao tác sửa gửi `If-Match: "<version>"`. Người khác đã lưu trước ⇒ 409
// `content.edit_conflict` ⇒ giao diện yêu cầu tải lại thay vì ghi đè lặng lẽ.
import { api } from './client'
import type { ContentBlock, PostType } from './content'

export type PostStatus = 'draft' | 'published' | 'archived'

export interface AdminPostRow {
  id: string
  type: PostType
  slug: string
  status: PostStatus
  title: string
  topicId: string | null
  parentId: string | null
  publishedAt: string | null
  updatedAt: string
  isFeatured: boolean
}

export interface AdminPostPage {
  items: AdminPostRow[]
  nextCursor: string | null
}

export interface AdminPost {
  id: string
  type: PostType
  slug: string
  status: PostStatus
  title: string
  excerpt: string | null
  label: string | null
  blocks: ContentBlock[]
  keyPoints: string[]
  topicId: string | null
  parentId: string | null
  coverMediaId: string | null
  coverImageUrl: string | null
  coverImageAlt: string | null
  seoTitle: string | null
  seoDescription: string | null
  readingMinutes: number | null
  sortOrder: number
  isFeatured: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  updatedBy: string
  version: number
}

/** Nội dung gửi khi tạo/sửa (loại, slug, trạng thái có thao tác riêng). */
export interface PostInput {
  title: string
  excerpt: string | null
  label: string | null
  blocks: ContentBlock[]
  keyPoints: string[]
  topicId: string | null
  parentId: string | null
  coverMediaId: string | null
  coverImageAlt: string | null
  seoTitle: string | null
  seoDescription: string | null
  sortOrder: number
  isFeatured: boolean
}

export interface RevisionRow {
  id: number
  title: string
  savedBy: string
  savedAt: string
}

export interface AdminTopic {
  id: string
  type: PostType
  parentId: string | null
  slug: string
  name: string
  description: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  version: number
}

export interface MediaItem {
  id: string
  url: string
  contentType: string
  bytes: number
  width: number
  height: number
  altDefault: string | null
  createdAt: string
  duplicate: boolean
  metadataBytesRemoved: number
}

export interface MediaPage {
  items: MediaItem[]
  nextCursor: string | null
}

export interface CourseSession {
  id: string
  postId: string
  startsOn: string
  endsOn: string | null
  format: 'online' | 'offline' | 'hybrid'
  location: string | null
  seats: number | null
  priceVnd: number | null
  status: 'open' | 'full' | 'closed'
}

export type SessionInput = Omit<CourseSession, 'id' | 'postId'>

export type LeadStatus = 'new' | 'contacted' | 'closed'

export interface AdminLead {
  id: string
  kind: 'consultation' | 'course'
  fullName: string
  email: string | null
  phone: string | null
  company: string | null
  message: string | null
  postId: string | null
  postTitle: string | null
  sessionId: string | null
  consentVersion: string
  consentAt: string
  status: LeadStatus
  note: string | null
  handledBy: string | null
  createdAt: string
  anonymized: boolean
}

export interface AdminLeadPage {
  items: AdminLead[]
  nextCursor: string | null
}

const base = '/admin/content'
const ifMatch = (version: number) => ({ headers: { 'If-Match': `"${version}"` } })

export const contentAdmin = {
  listPosts: (query: { type?: PostType; status?: PostStatus; topicId?: string; q?: string; cursor?: string; limit?: number }) =>
    api.get<AdminPostPage>(`${base}/posts`, { query: { ...query } }),
  getPost: (id: string) => api.get<AdminPost>(`${base}/posts/${id}`),
  createPost: (type: PostType, slug: string, content: PostInput) => api.post<AdminPost>(`${base}/posts`, { type, slug, content }),
  updatePost: (id: string, version: number, content: PostInput) => api.put<AdminPost>(`${base}/posts/${id}`, content, ifMatch(version)),
  publish: (id: string, version: number, publishedAt?: string) =>
    api.post<AdminPost>(`${base}/posts/${id}/publish`, { publishedAt: publishedAt ?? null }, ifMatch(version)),
  unpublish: (id: string, version: number) => api.post<AdminPost>(`${base}/posts/${id}/unpublish`, {}, ifMatch(version)),
  archive: (id: string, version: number) => api.post<AdminPost>(`${base}/posts/${id}/archive`, {}, ifMatch(version)),
  changeSlug: (id: string, version: number, slug: string) => api.put<AdminPost>(`${base}/posts/${id}/slug`, { slug }, ifMatch(version)),
  deletePost: (id: string, version: number) => api.delete<void>(`${base}/posts/${id}`, ifMatch(version)),
  revisions: (id: string) => api.get<RevisionRow[]>(`${base}/posts/${id}/revisions`),
  restore: (id: string, revisionId: number, version: number) =>
    api.post<AdminPost>(`${base}/posts/${id}/revisions/${revisionId}/restore`, {}, ifMatch(version)),

  topics: (type?: PostType) => api.get<AdminTopic[]>(`${base}/topics`, { query: { type } }),

  listMedia: (cursor?: string) => api.get<MediaPage>(`${base}/media`, { query: { cursor, limit: 40 } }),
  uploadMedia: (file: File, alt?: string) => {
    const form = new FormData()
    form.append('file', file)
    if (alt) form.append('alt', alt)
    return api.post<MediaItem>(`${base}/media`, form, { timeoutMs: 60_000 })
  },
  deleteMedia: (id: string) => api.delete<void>(`${base}/media/${id}`),

  sessions: (postId: string) => api.get<CourseSession[]>(`${base}/courses/${postId}/sessions`),
  createSession: (postId: string, input: SessionInput) => api.post<CourseSession>(`${base}/courses/${postId}/sessions`, input),
  updateSession: (id: string, input: SessionInput) => api.put<CourseSession>(`${base}/sessions/${id}`, input),

  leads: (status?: LeadStatus, cursor?: string) => api.get<AdminLeadPage>(`${base}/leads`, { query: { status, cursor, limit: 50 } }),
  updateLead: (id: string, status: LeadStatus, note?: string) => api.put<AdminLead>(`${base}/leads/${id}`, { status, note: note ?? null }),
}
