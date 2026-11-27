// Soạn khối nội dung (CT-C2): đổi qua lại giữa khối của server và dạng dễ sửa trên form.
// Định dạng trong đoạn chữ dùng cú pháp ngắn — **đậm**, *nghiêng*, [chữ](đường-dẫn) — rồi đổi thành mảng "đoạn chữ" có cờ
// (ADR-015 §3: không có HTML). Server vẫn kiểm lại mọi khối (loại, độ dài, link chỉ /… hoặc https://).
import type { ContentBlock, Span } from '../api'

export type BlockType = ContentBlock['type']

/** Một khối trên form: mọi trường ở dạng chữ để gắn v-model. */
export interface EditBlock {
  id: string
  type: BlockType
  level: 2 | 3
  text: string
  ordered: boolean
  items: string
  mediaId: string
  alt: string
  caption: string
  tone: 'info' | 'warn'
  cite: string
  label: string
  href: string
  question: string
}

export const BLOCK_TYPES: { type: BlockType; label: string }[] = [
  { type: 'heading', label: 'Tiêu đề' },
  { type: 'paragraph', label: 'Đoạn văn' },
  { type: 'list', label: 'Danh sách' },
  { type: 'image', label: 'Ảnh' },
  { type: 'callout', label: 'Ghi chú nổi bật' },
  { type: 'quote', label: 'Trích dẫn' },
  { type: 'cta', label: 'Nút kêu gọi' },
  { type: 'faq', label: 'Hỏi – đáp' },
]

const TOKEN = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g

/** "Xem **bảng giá** tại [đây](/bang-gia)" ⇒ các đoạn chữ có cờ. */
export function parseMarkup(source: string): Span[] {
  const spans: Span[] = []
  let last = 0
  for (const match of source.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) spans.push({ text: source.slice(last, index) })
    if (match[1] !== undefined) spans.push({ text: match[1], bold: true })
    else if (match[2] !== undefined) spans.push({ text: match[2], italic: true })
    else spans.push({ text: match[3], href: match[4] })
    last = index + match[0].length
  }
  if (last < source.length) spans.push({ text: source.slice(last) })
  return spans.filter((s) => s.text.length > 0)
}

/** Ngược lại của parseMarkup (link giữ chữ, bỏ đậm/nghiêng bên trong link). */
export function toMarkup(spans: Span[] | undefined): string {
  return (spans ?? [])
    .map((s) => (s.href ? `[${s.text}](${s.href})` : s.bold ? `**${s.text}**` : s.italic ? `*${s.text}*` : s.text))
    .join('')
}

export function newBlockId(): string {
  return `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function emptyBlock(type: BlockType): EditBlock {
  return {
    id: newBlockId(), type, level: 2, text: '', ordered: false, items: '', mediaId: '', alt: '', caption: '',
    tone: 'info', cite: '', label: '', href: '', question: '',
  }
}

export function toEditBlock(block: ContentBlock): EditBlock {
  const e = emptyBlock(block.type)
  e.id = block.id
  switch (block.type) {
    case 'heading': e.level = block.level; e.text = block.text; break
    case 'paragraph': e.text = toMarkup(block.spans); break
    case 'list': e.ordered = !!block.ordered; e.items = block.items.map((item) => toMarkup(item)).join('\n'); break
    case 'image': e.mediaId = block.mediaId; e.alt = block.alt; e.caption = block.caption ?? ''; break
    case 'callout': e.tone = block.tone; e.text = toMarkup(block.spans); break
    case 'quote': e.text = toMarkup(block.spans); e.cite = block.cite ?? ''; break
    case 'cta': e.label = block.label; e.href = block.href; break
    case 'faq': e.question = block.question; e.text = toMarkup(block.answer); break
  }
  return e
}

/** Khối trên form ⇒ khối gửi server. Khối rỗng (chưa nhập gì) bị bỏ để không bị server từ chối vì thiếu chữ. */
export function fromEditBlock(e: EditBlock): ContentBlock | null {
  const text = e.text.trim()
  switch (e.type) {
    case 'heading': return text ? { id: e.id, type: 'heading', level: e.level, text } : null
    case 'paragraph': return text ? { id: e.id, type: 'paragraph', spans: parseMarkup(text) } : null
    case 'list': {
      const items = e.items.split('\n').map((l) => l.trim()).filter(Boolean).map(parseMarkup)
      return items.length ? { id: e.id, type: 'list', ordered: e.ordered, items } : null
    }
    case 'image':
      return e.mediaId ? { id: e.id, type: 'image', mediaId: e.mediaId, alt: e.alt.trim(), caption: e.caption.trim() || null } : null
    case 'callout': return text ? { id: e.id, type: 'callout', tone: e.tone, spans: parseMarkup(text) } : null
    case 'quote': return text ? { id: e.id, type: 'quote', spans: parseMarkup(text), cite: e.cite.trim() || null } : null
    case 'cta': return e.label.trim() || e.href.trim() ? { id: e.id, type: 'cta', label: e.label.trim(), href: e.href.trim() } : null
    case 'faq': return e.question.trim() || text ? { id: e.id, type: 'faq', question: e.question.trim(), answer: parseMarkup(text) } : null
  }
}

export function toContentBlocks(edits: EditBlock[]): ContentBlock[] {
  return edits.map(fromEditBlock).filter((b): b is ContentBlock => b !== null)
}

/** Slug gợi ý từ tiêu đề (giống cách web tạo slug cũ) — chỉ dùng khi TẠO bài; sau đó slug cố định. */
export function suggestSlug(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 150)
    .replace(/-$/, '')
}
