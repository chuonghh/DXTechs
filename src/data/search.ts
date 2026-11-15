import { articles } from './articles'
import { categories, products } from './products'
import { resourceSections } from './resources'
import {
  solutionCategories,
  solutionCategoryPath,
  solutionItemPath,
  solutionSubcategoryPath,
} from './solutions'

export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  path: string
  imageUrl?: string
  price?: number
  badge?: string
  kind: 'product' | 'page' | 'solution' | 'resource' | 'article'
}

const pageEntries: SearchResult[] = [
  { id: 'page-home', title: 'Trang chủ DXtechs', description: 'Nền tảng dịch vụ số minh bạch, phần mềm bản quyền và giải pháp công nghệ.', category: 'Trang', path: '/', kind: 'page' },
  { id: 'page-about', title: 'Giới thiệu DXtechs', description: 'Công ty, sứ mệnh, tầm nhìn và hành trình chuyển đổi số.', category: 'Trang', path: '/gioi-thieu', kind: 'page' },
  { id: 'page-services', title: 'Dịch vụ số', description: 'Danh mục phần mềm, cloud, hosting, tên miền, SSL, lưu trữ và sao lưu.', category: 'Danh mục', path: '/dich-vu', kind: 'page' },
  { id: 'page-software', title: 'Phần mềm bản quyền', description: 'Phần mềm văn phòng, thiết kế, bảo mật và lập trình.', category: 'Danh mục', path: '/phan-mem', kind: 'page' },
  { id: 'page-projects', title: 'Dự án tiêu biểu', description: 'Website, hệ thống quản trị vận hành, SEO và phân tích.', category: 'Trang', path: '/du-an', kind: 'page' },
  { id: 'page-resources', title: 'Tài Nguyên', description: 'Tài liệu, sách, download, tin tức, hướng dẫn và thuật ngữ công nghệ.', category: 'Danh mục', path: '/tai-nguyen', kind: 'page' },
  { id: 'page-contact', title: 'Liên hệ DXtechs', description: 'Tư vấn giải pháp, dịch vụ, hỗ trợ kỹ thuật và yêu cầu liên hệ.', category: 'Trang', path: '/lien-he', kind: 'page' },
  { id: 'page-policies', title: 'Chính sách & hỗ trợ', description: 'Mua hàng, gia hạn, đổi trả và hoàn tiền.', category: 'Trang', path: '/chinh-sach', kind: 'page' },
  { id: 'page-cart', title: 'Giỏ hàng', description: 'Xem, cập nhật hoặc xóa sản phẩm trong giỏ hàng.', category: 'Mua hàng', path: '/gio-hang', kind: 'page' },
  { id: 'page-checkout', title: 'Thanh toán mô phỏng', description: 'Xem lại đơn hàng và hoàn tất thanh toán demo.', category: 'Mua hàng', path: '/thanh-toan', kind: 'page' },
  { id: 'page-account', title: 'Tài khoản khách hàng', description: 'Thông tin tài khoản, giấy phép đã mua và hướng dẫn gia hạn.', category: 'Tài khoản', path: '/tai-khoan', kind: 'page' },
  { id: 'page-orders', title: 'Đơn hàng', description: 'Lịch sử đơn hàng và trạng thái cấp phép.', category: 'Tài khoản', path: '/don-hang', kind: 'page' },
  { id: 'page-login', title: 'Đăng nhập', description: 'Đăng nhập mô phỏng để xem tài khoản và đơn hàng.', category: 'Tài khoản', path: '/dang-nhap', kind: 'page' },
  { id: 'page-register', title: 'Đăng ký tài khoản', description: 'Tạo tài khoản khách hàng mô phỏng.', category: 'Tài khoản', path: '/dang-ky', kind: 'page' },
  { id: 'page-news', title: 'Tin tức & hướng dẫn', description: 'Hướng dẫn cài đặt, kích hoạt, bảo mật và sử dụng dịch vụ số.', category: 'Tài Nguyên', path: '/tai-nguyen/goc-nhin/tin-tuc', kind: 'resource' },
  { id: 'home-slide-1', title: 'Công nghệ tốt. Khởi đầu an tâm.', description: 'Phần mềm bản quyền và dịch vụ số thiết yếu, nguồn gốc rõ ràng, hỗ trợ tận tình.', category: 'Trang chủ', path: '/', kind: 'page' },
  { id: 'home-slide-2', title: 'Vận hành đồng bộ. Tăng trưởng vững vàng.', description: 'Hệ thống ERP, MES, MRP cho doanh nghiệp; phân tích quy trình, tích hợp theo nhu cầu và đồng hành triển khai.', category: 'Trang chủ · ERP · MES · MRP', path: '/giai-phap/tu-van-trien-khai', kind: 'solution' },
  { id: 'home-slide-3', title: 'AI đồng hành. Quy trình tự động.', description: 'AI Automation cho doanh nghiệp, tự động hóa công việc lặp lại và kết nối công cụ.', category: 'Trang chủ · AI Automation', path: '/giai-phap/dich-vu/tri-tue-nhan-tao-ai-va-phan-tich-du-lieu', kind: 'solution' },
]

const categoryEntries: SearchResult[] = categories.map((category) => ({
  id: `category-${category.id}`,
  title: category.name,
  description: `${category.description} ${category.subcategories.join(' ')}`,
  category: 'Danh mục dịch vụ số',
  path: `/dich-vu?category=${category.id}`,
  kind: 'page',
}))

const productEntries: SearchResult[] = products.map((product) => ({
  id: `product-${product.id}`,
  title: product.name,
  description: `${product.description} ${product.categoryLabel} ${product.need} ${product.license} ${product.term} ${product.features.join(' ')}`,
  category: product.categoryLabel,
  path: `/san-pham/${product.slug}`,
  imageUrl: product.imageUrl,
  price: product.price,
  badge: product.badge,
  kind: 'product',
}))

const solutionEntries: SearchResult[] = solutionCategories.flatMap((category) => [
  {
    id: `solution-category-${category.name}`,
    title: category.name,
    description: `${category.description} ${category.subcategories.map((subcategory) => subcategory.name).join(' ')}`,
    category: 'Giải pháp',
    path: solutionCategoryPath(category),
    imageUrl: category.image,
    kind: 'solution' as const,
  },
  ...category.subcategories.flatMap((subcategory) => [
    {
      id: `solution-subcategory-${category.name}-${subcategory.name}`,
      title: subcategory.name,
      description: `${subcategory.description || ''} ${subcategory.highlights?.join(' ') || ''} ${subcategory.items.join(' ')}`,
      category: category.name,
      path: solutionSubcategoryPath(category, subcategory),
      imageUrl: category.image,
      kind: 'solution' as const,
    },
    ...subcategory.items.map((item) => ({
      id: `solution-item-${category.name}-${item}`,
      title: item.replace(/[.。]+$/, ''),
      description: `${subcategory.name} ${subcategory.description || ''} ${item}`,
      category: subcategory.name,
      path: solutionItemPath(category, subcategory, item),
      imageUrl: category.image,
      kind: 'solution' as const,
    })),
  ]),
])

const resourceEntries: SearchResult[] = resourceSections.flatMap((section) => [
  {
    id: `resource-section-${section.slug}`,
    title: section.name,
    description: section.description,
    category: 'Tài Nguyên',
    path: `/tai-nguyen/${section.slug}`,
    imageUrl: section.image,
    kind: 'resource',
  },
  ...section.topics.map((topic) => ({
    id: `resource-topic-${section.slug}-${topic.slug}`,
    title: topic.name,
    description: `${topic.description} ${section.name}`,
    category: section.name,
    path: `/tai-nguyen/${section.slug}/${topic.slug}`,
    imageUrl: section.image,
    kind: 'resource' as const,
  })),
])

const articleEntries: SearchResult[] = articles.map((article) => ({
  id: `article-${article.slug}`,
  title: article.title,
  description: `${article.excerpt} ${article.keyPoints.join(' ')} ${article.sections.map((section) => `${section.heading} ${section.paragraphs.join(' ')} ${section.bullets?.join(' ') || ''}`).join(' ')}`,
  category: 'Tin Tức & Hướng dẫn',
  path: `/tin-tuc/${article.slug}`,
  imageUrl: article.imageUrl,
  kind: 'article',
}))

const additionalResources: SearchResult[] = [
  { id: 'resource-book-lean-startup', title: 'The Lean Startup', description: 'Tư duy thử nghiệm, kiểm chứng giả thuyết và phát triển sản phẩm.', category: 'Sách · Tài Liệu', path: '/tai-nguyen/tai-lieu/sach', kind: 'resource' },
  { id: 'resource-book-inspired', title: 'Inspired: How to Create Tech Products Customers Love', description: 'Phương pháp xây dựng sản phẩm công nghệ lấy khách hàng làm trọng tâm.', category: 'Sách · Tài Liệu', path: '/tai-nguyen/tai-lieu/sach', kind: 'resource' },
  { id: 'resource-book-data-intensive', title: 'Designing Data-Intensive Applications', description: 'Kiến thức nền tảng về hệ thống dữ liệu và kiến trúc ứng dụng.', category: 'Sách · Tài Liệu', path: '/tai-nguyen/tai-lieu/sach', kind: 'resource' },
  { id: 'resource-download-seo', title: 'SEO Starter Guide', description: 'Hướng dẫn tối ưu website từ Google Search Central.', category: 'Download · Tài Liệu', path: '/tai-nguyen/tai-lieu/download', kind: 'resource' },
  { id: 'resource-download-webdev', title: 'Web.dev Learn', description: 'Tài liệu học về hiệu năng, khả năng truy cập và nền tảng web.', category: 'Download · Tài Liệu', path: '/tai-nguyen/tai-lieu/download', kind: 'resource' },
  { id: 'resource-download-owasp', title: 'OWASP Top 10', description: 'Tài liệu nhận biết các nhóm rủi ro bảo mật ứng dụng web phổ biến.', category: 'Download · Tài Liệu', path: '/tai-nguyen/tai-lieu/download', kind: 'resource' },
  { id: 'resource-download-vue', title: 'Vue.js Documentation', description: 'Tài liệu chính thức để bắt đầu và phát triển ứng dụng Vue.', category: 'Download · Tài Liệu', path: '/tai-nguyen/tai-lieu/download', kind: 'resource' },
  { id: 'resource-glossary', title: 'Thuật Ngữ CNTT', description: 'API, Cloud Computing, CMS, CRM, ERP, SEO, UI/UX, API Gateway và các khái niệm công nghệ.', category: 'Góc nhìn', path: '/tai-nguyen/goc-nhin/thuat-ngu-cntt', kind: 'resource' },
  { id: 'resource-glossary-api', title: 'API · Giao diện lập trình ứng dụng', description: 'Application Programming Interface: giao diện giúp các ứng dụng trao đổi dữ liệu và chức năng.', category: 'Thuật Ngữ CNTT', path: '/tai-nguyen/goc-nhin/thuat-ngu-cntt', kind: 'resource' },
  { id: 'resource-glossary-cloud', title: 'Cloud Computing · Điện toán đám mây', description: 'Mô hình cung cấp tài nguyên máy chủ, lưu trữ và phần mềm qua mạng.', category: 'Thuật Ngữ CNTT', path: '/tai-nguyen/goc-nhin/thuat-ngu-cntt', kind: 'resource' },
  { id: 'resource-glossary-cms', title: 'CMS · Hệ quản trị nội dung', description: 'Content Management System giúp tạo, chỉnh sửa và xuất bản nội dung website.', category: 'Thuật Ngữ CNTT', path: '/tai-nguyen/goc-nhin/thuat-ngu-cntt', kind: 'resource' },
  { id: 'resource-glossary-crm', title: 'CRM · Quản lý quan hệ khách hàng', description: 'Customer Relationship Management: quản lý thông tin, tương tác và chăm sóc khách hàng.', category: 'Thuật Ngữ CNTT', path: '/tai-nguyen/goc-nhin/thuat-ngu-cntt', kind: 'resource' },
  { id: 'resource-glossary-erp', title: 'ERP · Hoạch định nguồn lực doanh nghiệp', description: 'Enterprise Resource Planning kết nối các quy trình vận hành và dữ liệu doanh nghiệp.', category: 'Thuật Ngữ CNTT', path: '/tai-nguyen/goc-nhin/thuat-ngu-cntt', kind: 'resource' },
  { id: 'resource-glossary-seo', title: 'SEO · Tối ưu hóa công cụ tìm kiếm', description: 'Search Engine Optimization giúp công cụ tìm kiếm thu thập và hiển thị website phù hợp.', category: 'Thuật Ngữ CNTT', path: '/tai-nguyen/goc-nhin/thuat-ngu-cntt', kind: 'resource' },
  { id: 'resource-glossary-uiux', title: 'UI/UX · Giao diện & trải nghiệm người dùng', description: 'User Interface và User Experience là giao diện và trải nghiệm tổng thể khi dùng sản phẩm số.', category: 'Thuật Ngữ CNTT', path: '/tai-nguyen/goc-nhin/thuat-ngu-cntt', kind: 'resource' },
  { id: 'resource-glossary-api-gateway', title: 'API Gateway · Cổng giao tiếp API', description: 'Điểm tiếp nhận và điều phối yêu cầu API giữa ứng dụng khách và các dịch vụ phía sau.', category: 'Thuật Ngữ CNTT', path: '/tai-nguyen/goc-nhin/thuat-ngu-cntt', kind: 'resource' },
  { id: 'project-portal', title: 'Cổng thông tin doanh nghiệp', description: 'Dự án website, UX/UI, thiết kế đa thiết bị và quản trị nội dung.', category: 'Dự án', path: '/du-an', kind: 'page' },
  { id: 'project-operations', title: 'Hệ thống quản trị vận hành', description: 'Dự án ERP, tự động hóa, mô hình hóa quy trình và kết nối dữ liệu.', category: 'Dự án', path: '/du-an', kind: 'page' },
  { id: 'project-digital', title: 'Tối ưu hiện diện số', description: 'Dự án SEO, phân tích, trải nghiệm website và đo lường hiệu quả.', category: 'Dự án', path: '/du-an', kind: 'page' },
]

export const searchEntries: SearchResult[] = [
  ...pageEntries,
  ...categoryEntries,
  ...solutionEntries,
  ...resourceEntries,
  ...additionalResources,
  ...articleEntries,
  ...productEntries,
]

export function normalizeSearch(value: string) {
  return value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').trim()
}

export function findSearchResults(query: string, limit = Number.POSITIVE_INFINITY) {
  const normalizedQuery = normalizeSearch(query)
  if (!normalizedQuery) return []

  const terms = normalizedQuery.split(/\s+/).filter(Boolean)

  return searchEntries
    .map((entry, index) => {
      const title = normalizeSearch(entry.title)
      const searchableText = normalizeSearch(`${entry.title} ${entry.description} ${entry.category}`)
      const matches = terms.every((term) => searchableText.includes(term))
      const score = title === normalizedQuery ? 4 : title.startsWith(normalizedQuery) ? 3 : title.includes(normalizedQuery) ? 2 : 1
      return { entry, index, matches, score }
    })
    .filter((result) => result.matches)
    .sort((first, second) => second.score - first.score || first.index - second.index)
    .slice(0, limit)
    .map(({ entry }) => entry)
}
