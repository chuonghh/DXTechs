export interface ResourceTopic {
  slug: string
  name: string
  description: string
}

export interface ResourceSection {
  slug: string
  name: string
  description: string
  image: string
  topics: ResourceTopic[]
}

export const resourceSections: ResourceSection[] = [
  {
    slug: 'tai-lieu',
    name: 'Tài Liệu',
    description: 'Sách tham khảo và tài nguyên tải về phục vụ học tập, vận hành và phát triển sản phẩm số.',
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=960&q=80',
    topics: [
      { slug: 'sach', name: 'Sách', description: 'Tuyển chọn đầu sách về công nghệ, sản phẩm và chuyển đổi số.' },
      { slug: 'download', name: 'Download', description: 'Tài liệu và hướng dẫn hữu ích từ các nguồn chính thức.' },
    ],
  },
  {
    slug: 'goc-nhin',
    name: 'Góc nhìn',
    description: 'Cập nhật tin tức và giải thích những thuật ngữ công nghệ thường gặp.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=960&q=80',
    topics: [
      { slug: 'tin-tuc', name: 'Tin Tức', description: 'Bài viết, hướng dẫn và cập nhật kiến thức số.' },
      { slug: 'thuat-ngu-cntt', name: 'Thuật Ngữ CNTT', description: 'Giải nghĩa ngắn gọn các khái niệm công nghệ thông tin.' },
    ],
  },
]
