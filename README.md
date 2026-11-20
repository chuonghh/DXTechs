# DXtechs Digital Store

Ứng dụng cửa hàng phần mềm bản quyền và dịch vụ số minh họa, xây dựng bằng Vue 3, TypeScript, Vite, Vue Router và Pinia, sử dụng logo DXtechs do người dùng cung cấp. Mỗi dịch vụ có ít nhất 30 sản phẩm mẫu. Dữ liệu tài khoản, đơn hàng và giấy phép đều mô phỏng trong bộ nhớ; không cần backend hoặc thông tin thẻ thật.

## Chạy dự án

```sh
npm install
npm run dev
```

Mở URL Vite hiển thị trong terminal. Kiểm tra kiểu và tạo bản build:

```sh
npm run build
npm run preview
```

## Kết nối API (backend `DxTech_server`)

| Môi trường | `VITE_API_BASE_URL` | Cách tới ASP.NET Core |
|---|---|---|
| `npm run dev` / `npm run preview` | `/api` (`.env`) | Vite proxy → `API_PROXY_TARGET` trong `.env.development` (mặc định `http://localhost:5043`) — cùng origin, không cần CORS |
| Production (`npm run build`) | `https://api.dxtechs.com/api` (`.env.production`) | Web ở `https://dxtechs.com` gọi sang subdomain API — khác origin, server bật CORS chỉ cho `https://dxtechs.com` |

Request gửi kèm `credentials: 'include'` để cookie đăng nhập (Phase 2) đi theo. Muốn build trỏ tới API khác:
`VITE_API_BASE_URL=https://api-staging.example.com/api npm run build`.

Chạy cùng backend khi dev:

```sh
# Terminal 1 — trong repo DxTech_server
docker compose up -d
dotnet run --project server/server.csproj --launch-profile http

# Terminal 2 — trong repo này
npm run dev
curl http://localhost:5173/api/health      # → Healthy (đi qua Vite proxy)
```

Gọi API trong code qua `src/api` (một chỗ duy nhất xử lý base URL, timeout, lỗi ProblemDetails):

```ts
import { api, ApiError } from '../api' // đường dẫn tương đối tới src/api

try {
  const products = await api.get<Product[]>('/products', { query: { page: 1 } })
} catch (error) {
  if (error instanceof ApiError) notify(error.message) // status 0 = mất kết nối/quá thời gian chờ
}
```

Biến môi trường:

- `.env`: `VITE_API_BASE_URL=/api` cho dev/preview; `.env.production`: `https://api.dxtechs.com/api`. Biến `VITE_*` được nhúng vào bundle gửi cho trình duyệt — **không đặt bí mật**.
- `.env.development`: `API_PROXY_TARGET`, chỉ dùng trong `vite.config.ts`. Ghi đè riêng trên máy bằng `.env.development.local` (không commit).

## Tách code theo trang

Ngoài trang chủ, mỗi trang trong `src/router/index.ts` là một chunk riêng, chỉ tải khi người dùng mở.
Sau mỗi lần deploy, tab đang mở từ bản cũ sẽ tự tải lại đúng trang khi gặp chunk cũ không còn trên server.

## Cấu trúc chính

```text
src/
├── components/       # Header, footer, thẻ sản phẩm, tiêu đề trang
├── data/products.ts  # Danh mục và dữ liệu sản phẩm mẫu
├── api/              # Lớp gọi API (fetch wrapper, ApiError, health)
├── router/           # Các tuyến Vue Router (lazy-load theo trang)
├── stores/shop.ts    # Pinia: giỏ hàng, tài khoản, đơn hàng, thông báo
├── views/            # Trang chủ, danh mục, sản phẩm, giỏ hàng, tài khoản...
├── App.vue           # Khung ứng dụng, điều hướng trang và thông báo
└── style.css         # Giao diện responsive
public/products/      # Hình minh họa SVG cục bộ theo danh mục
```

## Luồng demo

- Duyệt và lọc sản phẩm theo hệ điều hành, nhu cầu, loại giấy phép và giá.
- Duyệt danh mục con như Văn phòng, Thiết kế, Lập trình, Cloud và Hosting; mỗi sản phẩm có ảnh Unsplash riêng cùng ảnh SVG dự phòng cục bộ.
- Thêm sản phẩm vào giỏ, thay đổi số lượng, xem tạm tính và tổng tiền.
- Đăng nhập hoặc đăng ký bằng email hợp lệ cùng mật khẩu từ 6 ký tự; đây không phải xác thực máy chủ.
- Thanh toán mô phỏng chỉ cần họ tên và email. Không nhập thông tin thẻ; đơn hàng và mã giấy phép được tạo mẫu trong phiên hiện tại.
- Xem đơn hàng, trạng thái và hướng dẫn gia hạn tại mục tài khoản.

Tên doanh nghiệp, thông tin liên hệ, giá, chứng nhận, giấy phép và chính sách đều là nội dung minh họa phục vụ học tập.
