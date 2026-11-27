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

// ---------- Sách, tài liệu, thuật ngữ ----------
// Dự phòng khi API nội dung chưa trả được dữ liệu (CT-C1). Nguồn thật: bài `resource` (chủ đề sach/download) và `glossary` trên server.

export interface ResourceBook {
  title: string
  author: string
  detail: string
  link: string
  label: string
  tag: string
  pages: string
  color: string
}

export interface ResourceDownload {
  title: string
  detail: string
  link: string
  label: string
  /** Chỉ có ở dữ liệu cũ (minh hoạ); dữ liệu từ API không có. */
  format?: string
  downloads?: string
}

export interface GlossaryTerm {
  term: string
  fullName: string
  description: string
  category: string
}

export const staticBooks: ResourceBook[] = [
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    detail: 'Tư duy thử nghiệm tinh gọn, kiểm chứng giả thuyết sản phẩm và rút ngắn chu kỳ phát triển cho doanh nghiệp công nghệ.',
    link: 'https://books.google.com/books?q=The+Lean+Startup+Eric+Ries',
    label: 'Khởi nghiệp & Sản phẩm',
    tag: 'Bán chạy toàn cầu',
    pages: '336 trang',
    color: '#0066cc',
  },
  {
    title: 'Inspired: How to Create Tech Products Customers Love',
    author: 'Marty Cagan',
    detail: 'Phương pháp xây dựng sản phẩm công nghệ lấy khách hàng làm trọng tâm từ các tập đoàn công nghệ hàng đầu thế giới.',
    link: 'https://books.google.com/books?q=Inspired+Marty+Cagan',
    label: 'Quản trị sản phẩm',
    tag: 'Chuyên gia khuyên đọc',
    pages: '368 trang',
    color: '#2997ff',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    detail: 'Kiến thức nền tảng và chuyên sâu về hệ thống dữ liệu lớn, kiến trúc phân tán, độ tin cậy và khả năng mở rộng của ứng dụng.',
    link: 'https://books.google.com/books?q=Designing+Data-Intensive+Applications',
    label: 'Kiến trúc & Kỹ thuật',
    tag: 'Kỹ sư phần mềm',
    pages: '616 trang',
    color: '#0066cc',
  },
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    detail: 'Các nguyên lý, mẫu hình thiết kế và kỹ thuật viết mã sạch, dễ bảo trì, dễ kiểm thử cho lập trình viên chuyên nghiệp.',
    link: 'https://books.google.com/books?q=Clean+Code+Robert+C+Martin',
    label: 'Lập trình chuyên nghiệp',
    tag: 'Kinh điển',
    pages: '464 trang',
    color: '#0066cc',
  },
]

export const staticDownloads: ResourceDownload[] = [
  {
    title: 'Bảng Tra Cứu Tối Ưu SEO Kỹ Thuật (SEO Technical Cheat Sheet)',
    detail: 'Checklist toàn diện rà soát Core Web Vitals, Schema markup, robots.txt, canonical và tối ưu cấu trúc website doanh nghiệp.',
    link: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
    label: 'Google Search Central',
    format: 'PDF · 4.2 MB',
    downloads: '1.240 lượt tải',
  },
  {
    title: 'Cẩm Nang Hiệu Năng & Khả Năng Truy Cập Web 2026',
    detail: 'Tài liệu hướng dẫn tối ưu thời gian tải trang, Lighthouse 100/100, tối ưu hình ảnh và khả năng truy cập (a11y).',
    link: 'https://web.dev/learn/',
    label: 'Web.dev & Google',
    format: 'Ebook PDF · 6.8 MB',
    downloads: '980 lượt tải',
  },
  {
    title: 'OWASP Top 10 — Hướng Dẫn Phòng Ngừa Lỗ Hổng Bảo Mật Web',
    detail: 'Tổng hợp 10 nhóm rủi ro an ninh mạng phổ biến nhất và giải pháp mã hóa, phòng vệ từ các chuyên gia an toàn thông tin.',
    link: 'https://owasp.org/www-project-top-ten/',
    label: 'OWASP Foundation',
    format: 'Whitepaper PDF · 3.5 MB',
    downloads: '2.150 lượt tải',
  },
  {
    title: 'Sổ Tay Kiến Trúc Điện Toán Đám Mây & Microservices',
    detail: 'Mô hình triển khai Cloud, container Docker, Kubernetes và thiết kế hệ thống có tính sẵn sàng cao (High Availability).',
    link: 'https://vuejs.org/guide/introduction.html',
    label: 'DXTechs Architecture',
    format: 'Tài liệu PDF · 8.1 MB',
    downloads: '1.820 lượt tải',
  },
]

export const staticGlossary: GlossaryTerm[] = [
  { term: 'API', fullName: 'Application Programming Interface', description: 'Giao diện lập trình ứng dụng giúp các hệ thống trao đổi dữ liệu và thực thi tác vụ với nhau một cách bảo mật.', category: 'Phần mềm' },
  { term: 'Cloud Computing', fullName: 'Điện toán đám mây', description: 'Mô hình cung cấp tài nguyên máy chủ, mạng, lưu trữ và dịch vụ qua Internet theo nhu cầu thực tế.', category: 'Hạ tầng' },
  { term: 'SaaS', fullName: 'Software as a Service', description: 'Mô hình phân phối phần mềm qua đám mây, người dùng trả phí định kỳ và truy cập qua trình duyệt mà không cần cài đặt phức tạp.', category: 'Giải pháp' },
  { term: 'PaaS', fullName: 'Platform as a Service', description: 'Nền tảng đám mây cung cấp môi trường hoàn chỉnh để phát triển, chạy và quản lý ứng dụng mà không cần quản trị máy chủ bên dưới.', category: 'Hạ tầng' },
  { term: 'CI/CD', fullName: 'Continuous Integration / Continuous Delivery', description: 'Quy trình tự động hóa tích hợp mã nguồn, kiểm thử tự động và triển khai phần mềm liên tục lên môi trường sản xuất.', category: 'DevOps' },
  { term: 'SSL / TLS', fullName: 'Secure Sockets Layer / Transport Layer Security', description: 'Giao thức mã hóa dữ liệu giữa trình duyệt người dùng và máy chủ web, đảm bảo thông tin cá nhân và thanh toán không bị đánh cắp.', category: 'Bảo mật' },
  { term: 'CDN', fullName: 'Content Delivery Network', description: 'Mạng lưới máy chủ phân tán toàn cầu lưu trữ bản sao dữ liệu tĩnh, giúp website tải nhanh hơn đối với người dùng ở mọi vị trí địa lý.', category: 'Hạ tầng' },
  { term: 'ERP', fullName: 'Enterprise Resource Planning', description: 'Hệ thống hoạch định nguồn lực doanh nghiệp, kết nối tài chính, nhân sự, chuỗi cung ứng và bán hàng trên một cơ sở dữ liệu duy nhất.', category: 'Doanh nghiệp' },
  { term: 'CRM', fullName: 'Customer Relationship Management', description: 'Hệ thống quản lý thông tin khách hàng, quy trình bán hàng và chăm sóc hậu mãi giúp tối ưu hóa doanh thu.', category: 'Doanh nghiệp' },
  { term: 'CMS', fullName: 'Content Management System', description: 'Hệ quản trị nội dung giúp doanh nghiệp tạo, chỉnh sửa và xuất bản nội dung số lên website dễ dàng không cần biết lập trình.', category: 'Website' },
  { term: 'SEO', fullName: 'Search Engine Optimization', description: 'Tối ưu hóa công cụ tìm kiếm giúp website cải thiện thứ hạng tự nhiên trên Google, thu hút lượt truy cập khách hàng tiềm năng.', category: 'Marketing' },
  { term: 'Docker & K8s', fullName: 'Containers & Kubernetes', description: 'Công nghệ đóng gói ứng dụng độc lập trong các container và hệ thống điều phối tự động giúp mở rộng linh hoạt theo quy mô.', category: 'DevOps' },
]
