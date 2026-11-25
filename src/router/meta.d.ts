import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Cần đăng nhập (chưa đăng nhập ⇒ chuyển tới /dang-nhap?redirect=…). */
    requiresAuth?: boolean
    /** Cần quyền admin. Server vẫn là nơi kiểm tra quyền thật. */
    requiresAdmin?: boolean
    /** Trang chỉ dành cho khách (đã đăng nhập ⇒ chuyển tới /tai-khoan). */
    guestOnly?: boolean
  }
}
