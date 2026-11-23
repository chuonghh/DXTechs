// API Catalog (server PR-4/PR-5): danh mục, danh sách sản phẩm, tìm kiếm, chi tiết.
// Kiểu dữ liệu khớp đúng response của server (ASP.NET Core, JSON camelCase).
//
// Giai đoạn chuyển tiếp (Phase 1): giỏ hàng, thanh toán, tài khoản, admin vẫn dùng kiểu `Product` cũ của
// src/data/products.ts (id số, giá nằm trên sản phẩm). Hàm `toLegacyProduct` đổi dữ liệu API sang kiểu đó để
// ProductCard / giỏ hàng chạy nguyên trạng. Phase 3 (đơn hàng) sẽ thay giỏ hàng bằng {variantId, qty} và bỏ adapter.

import type { Product, ProductCategory } from '../data/products'
import { api } from './client'

// ---------- Kiểu dữ liệu của server ----------

export interface CategoryNode {
  id: string
  slug: string
  name: string
  description: string | null
  children: CategoryNode[]
}

export interface CategoryRef {
  slug: string
  name: string
}

export type LicenseType = 'perpetual' | 'subscription' | 'service'
export type Platform = 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'web'
export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'relevance'

export interface ProductListItem {
  id: string
  slug: string
  name: string
  shortDescription: string | null
  brand: string | null
  licenseType: LicenseType
  platforms: Platform[]
  imageUrl: string | null
  badge: string | null
  /** Danh mục trực tiếp của sản phẩm (thường là danh mục con). */
  category: CategoryRef
  /** Giá, giá gốc, tên gói — đều của gói rẻ nhất đang bán. */
  minPriceVnd: number
  compareAtPriceVnd: number | null
  variantName: string
  variantCount: number
}

export interface ProductVariantItem {
  id: string
  sku: string
  name: string
  termMonths: number | null
  seats: number
  priceVnd: number
  compareAtPriceVnd: number | null
  deliveryType: 'license_key' | 'account' | 'manual'
  isDefault: boolean
}

export interface ProductDetail {
  id: string
  slug: string
  name: string
  shortDescription: string | null
  description: string | null
  brand: string | null
  licenseType: LicenseType
  platforms: Platform[]
  features: string[]
  imageUrl: string | null
  badge: string | null
  /** Từ danh mục gốc tới danh mục của sản phẩm. */
  breadcrumb: CategoryRef[]
  variants: ProductVariantItem[]
}

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ProductQuery {
  /** Slug danh mục — gồm cả danh mục con. */
  category?: string
  platform?: Platform
  licenseType?: LicenseType
  minPrice?: number
  maxPrice?: number
  q?: string
  sort?: ProductSort
  page?: number
  pageSize?: number
}

// ---------- Gọi API ----------

export function getCategoryTree(signal?: AbortSignal): Promise<CategoryNode[]> {
  return api.get<CategoryNode[]>('/categories', { signal })
}

export function listProducts(query: ProductQuery = {}, signal?: AbortSignal): Promise<PagedResult<ProductListItem>> {
  return api.get<PagedResult<ProductListItem>>('/products', { query: { ...query }, signal })
}

/** Tìm không dấu ("phan mem" khớp "Phần mềm"), khớp tiền tố, xếp theo độ liên quan. `q` không được rỗng. */
export function searchProducts(q: string, query: Omit<ProductQuery, 'q'> = {}, signal?: AbortSignal): Promise<PagedResult<ProductListItem>> {
  return api.get<PagedResult<ProductListItem>>('/products/search', { query: { ...query, q }, signal })
}

/** Sản phẩm ẩn/đã xoá/không tồn tại ⇒ ApiError status 404, problem.code = 'catalog.product_not_found'. */
export function getProduct(slug: string, signal?: AbortSignal): Promise<ProductDetail> {
  return api.get<ProductDetail>(`/products/${encodeURIComponent(slug)}`, { signal })
}

// ---------- Hiển thị ----------

export const platformLabels: Record<Platform, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
}

/** Nhãn hiển thị → giá trị API, dùng cho bộ lọc hệ điều hành ('macOS' → 'macos'). */
export function platformFromLabel(label: string): Platform | undefined {
  return (Object.entries(platformLabels) as [Platform, string][]).find(([, l]) => l === label)?.[0]
}

export const licenseTypeLabels: Record<LicenseType, string> = {
  perpetual: 'Giấy phép vĩnh viễn',
  subscription: 'Thuê bao theo kỳ hạn',
  service: 'Dịch vụ theo kỳ hạn',
}

// ---------- Adapter sang kiểu Product cũ (giai đoạn chuyển tiếp) ----------

const KNOWN_ROOTS: ProductCategory[] = ['software', 'cloud', 'domain', 'ssl', 'storage', 'backup']

/** Danh mục con → danh mục gốc (cây ≤ 3 cấp). */
export function rootSlugMap(tree: CategoryNode[]): Map<string, string> {
  const map = new Map<string, string>()
  const walk = (node: CategoryNode, root: string) => {
    map.set(node.slug, root)
    node.children.forEach((child) => walk(child, root))
  }
  tree.forEach((root) => walk(root, root.slug))
  return map
}

function asRootCategory(slug: string | undefined): ProductCategory {
  return KNOWN_ROOTS.includes(slug as ProductCategory) ? (slug as ProductCategory) : 'software'
}

/**
 * Id số ổn định từ slug (FNV-1a 32 bit) — giỏ hàng cũ so sánh sản phẩm bằng `id: number`.
 * Lớn hơn 1.000.000 để không trùng id 1..16 của dữ liệu giả còn trong giỏ hàng đã lưu.
 */
export function legacyNumericId(slug: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return 1_000_000 + (hash >>> 0)
}

const fallbackImage = (root: ProductCategory) => `/products/${root}.svg`

export function listItemToLegacyProduct(item: ProductListItem, roots: Map<string, string>): Product {
  const root = asRootCategory(roots.get(item.category.slug))
  return {
    id: legacyNumericId(item.slug),
    slug: item.slug,
    name: item.name,
    category: root,
    categoryLabel: item.category.name,
    imageUrl: item.imageUrl ?? fallbackImage(root),
    description: item.shortDescription ?? '',
    price: item.minPriceVnd,
    oldPrice: item.compareAtPriceVnd ?? undefined,
    badge: item.badge ?? '',
    license: licenseTypeLabels[item.licenseType],
    term: item.variantName,
    os: item.platforms.map((p) => platformLabels[p]),
    need: item.category.name,
    features: [],
  }
}

/** Chi tiết → Product cũ, giá theo gói mặc định (không có thì gói đầu tiên). */
export function detailToLegacyProduct(detail: ProductDetail): Product {
  const root = asRootCategory(detail.breadcrumb[0]?.slug)
  const leaf = detail.breadcrumb[detail.breadcrumb.length - 1]
  const variant = detail.variants.find((v) => v.isDefault) ?? detail.variants[0]
  return {
    id: legacyNumericId(detail.slug),
    slug: detail.slug,
    name: detail.name,
    category: root,
    categoryLabel: leaf?.name ?? '',
    imageUrl: detail.imageUrl ?? fallbackImage(root),
    description: detail.shortDescription ?? detail.description ?? '',
    price: variant?.priceVnd ?? 0,
    oldPrice: variant?.compareAtPriceVnd ?? undefined,
    badge: detail.badge ?? '',
    license: licenseTypeLabels[detail.licenseType],
    term: variant?.name ?? '',
    os: detail.platforms.map((p) => platformLabels[p]),
    need: leaf?.name ?? '',
    features: detail.features,
  }
}
