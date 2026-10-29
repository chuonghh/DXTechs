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

## Cấu trúc chính

```text
src/
├── components/       # Header, footer, thẻ sản phẩm, tiêu đề trang
├── data/products.ts  # Danh mục và dữ liệu sản phẩm mẫu
├── router/           # Các tuyến Vue Router
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
