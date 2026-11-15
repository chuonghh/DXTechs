export interface KnowledgeArticle {
  slug: string
  label: string
  title: string
  excerpt: string
  date: string
  readTime: string
  imageUrl: string
  imageAlt: string
  keyPoints: string[]
  sections: {
    heading: string
    paragraphs: string[]
    bullets?: string[]
  }[]
}

export const articles: KnowledgeArticle[] = [
  {
    slug: 'cach-cai-dat-phan-mem-ban-quyen',
    label: 'HƯỚNG DẪN',
    title: '5 bước cài đặt phần mềm bản quyền đúng cách',
    excerpt: 'Từ kiểm tra thiết bị đến kích hoạt, hướng dẫn từng bước giúp bạn cài phần mềm an toàn và tránh những lỗi thường gặp.',
    date: '12.08.2025',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Người dùng làm việc trên máy tính xách tay',
    keyPoints: ['Kiểm tra yêu cầu hệ thống trước khi mua', 'Tải bộ cài từ nguồn chính thức', 'Lưu thông tin kích hoạt an toàn'],
    sections: [
      {
        heading: 'Bước 1: Kiểm tra thiết bị và nhu cầu',
        paragraphs: ['Trước khi mua, hãy xác định thiết bị đang dùng, hệ điều hành và công việc cần phần mềm hỗ trợ. Một số giấy phép chỉ dùng được trên một hệ điều hành hoặc giới hạn số thiết bị.'],
        bullets: ['Đối chiếu phiên bản Windows hoặc macOS với yêu cầu của phần mềm.', 'Kiểm tra dung lượng trống, bộ nhớ và kết nối Internet.', 'Đọc số thiết bị, thời hạn và phạm vi sử dụng của giấy phép.'],
      },
      {
        heading: 'Bước 2: Nhận và kiểm tra thông tin giấy phép',
        paragraphs: ['Sau khi mua, đối chiếu tên sản phẩm và thời hạn trên đơn hàng với hướng dẫn nhận được. Không công khai mã kích hoạt, mật khẩu hay liên kết đăng nhập cá nhân.'],
      },
      {
        heading: 'Bước 3–5: Tải, cài đặt và kích hoạt',
        paragraphs: ['Tải bộ cài từ trang web hoặc ứng dụng chính thức của nhà phát hành. Đóng các ứng dụng không cần thiết, chạy trình cài đặt và làm theo hướng dẫn trên màn hình. Khi được yêu cầu, đăng nhập tài khoản phù hợp hoặc nhập mã giấy phép đúng theo hướng dẫn đi kèm.'],
        bullets: ['Khởi động lại ứng dụng sau khi cài đặt nếu được yêu cầu.', 'Kiểm tra trạng thái kích hoạt trong mục tài khoản hoặc giấy phép.', 'Lưu hóa đơn và thông tin hỗ trợ ở nơi riêng tư để tiện tra cứu.'],
      },
      {
        heading: 'Nếu gặp lỗi kích hoạt',
        paragraphs: ['Kiểm tra lại chính tả mã, email đăng nhập, ngày giờ thiết bị và kết nối mạng. Nếu giấy phép báo đã sử dụng hoặc không đúng phiên bản, hãy liên hệ nhà cung cấp với mã đơn hàng; tuyệt đối không gửi mật khẩu tài khoản.'],
      },
    ],
  },
  {
    slug: 'bao-ve-tai-khoan-so',
    label: 'BẢO MẬT',
    title: 'Bắt đầu bảo vệ tài khoản số từ những điều nhỏ',
    excerpt: 'Các thói quen dễ thực hiện giúp giảm nguy cơ mất tài khoản, lộ thông tin cá nhân và bị lợi dụng qua email hoặc liên kết giả mạo.',
    date: '08.08.2025',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Màn hình máy tính minh họa bảo mật tài khoản số',
    keyPoints: ['Dùng mật khẩu riêng cho từng dịch vụ', 'Bật xác thực nhiều lớp', 'Cẩn trọng với đường dẫn và mã xác minh'],
    sections: [
      {
        heading: 'Tạo lớp bảo vệ cơ bản',
        paragraphs: ['Mật khẩu bị dùng lại ở nhiều nơi sẽ khiến các tài khoản khác có nguy cơ bị truy cập nếu một dịch vụ gặp sự cố. Hãy dùng mật khẩu dài, khó đoán và riêng cho từng tài khoản; trình quản lý mật khẩu có thể giúp lưu trữ thuận tiện hơn.'],
        bullets: ['Không dùng ngày sinh, số điện thoại hay chuỗi dễ đoán.', 'Bật xác thực hai bước hoặc passkey nếu dịch vụ hỗ trợ.', 'Cập nhật email và số điện thoại khôi phục tài khoản.'],
      },
      {
        heading: 'Nhận biết email và liên kết đáng ngờ',
        paragraphs: ['Kẻ gian có thể giả mạo thông báo giao hàng, hóa đơn hoặc cảnh báo tài khoản để dụ bạn mở liên kết. Hãy kiểm tra kỹ địa chỉ người gửi và tên miền trước khi đăng nhập.'],
        bullets: ['Tự mở ứng dụng hoặc gõ địa chỉ trang web thay vì bấm liên kết lạ.', 'Không gửi mã OTP, mã khôi phục hoặc mật khẩu cho bất kỳ ai.', 'Cẩn trọng với yêu cầu xử lý gấp, đe dọa khóa tài khoản hoặc đòi thanh toán.'],
      },
      {
        heading: 'Kiểm tra thiết bị và phiên đăng nhập',
        paragraphs: ['Định kỳ xem danh sách thiết bị đang đăng nhập, đăng xuất khỏi thiết bị không nhận ra và cập nhật hệ điều hành, trình duyệt. Nếu nghi ngờ tài khoản bị truy cập, hãy đổi mật khẩu từ thiết bị an toàn và thu hồi các phiên lạ.'],
      },
    ],
  },
  {
    slug: 'chon-ten-mien-cho-thuong-hieu',
    label: 'MẸO HAY',
    title: 'Chọn tên miền phù hợp cho thương hiệu của bạn',
    excerpt: 'Tìm một tên miền dễ nhớ, dễ đọc và phù hợp mục tiêu kinh doanh; đồng thời biết cách kiểm tra, đăng ký và gia hạn.',
    date: '02.08.2025',
    readTime: '5 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Bảng phân tích website và sự hiện diện trực tuyến của thương hiệu',
    keyPoints: ['Ưu tiên tên ngắn, dễ đọc và dễ gõ', 'Chọn đuôi miền phù hợp khách hàng', 'Kiểm tra khả năng gia hạn và quyền quản lý'],
    sections: [
      {
        heading: 'Chọn tên dễ nhớ và đại diện đúng thương hiệu',
        paragraphs: ['Tên miền thường là điểm chạm đầu tiên khi khách hàng tìm website. Nên chọn tên ngắn gọn, dễ phát âm, dễ viết và nhất quán với tên doanh nghiệp hoặc sản phẩm.'],
        bullets: ['Tránh cách viết dễ nhầm, nhiều dấu gạch nối hoặc dãy số khó nhớ.', 'Kiểm tra tên có ý nghĩa không mong muốn trong ngôn ngữ khác.', 'Đảm bảo bạn có quyền sử dụng tên thương hiệu đã chọn.'],
      },
      {
        heading: 'Chọn đuôi tên miền phù hợp',
        paragraphs: ['Đuôi .vn thường phù hợp với tổ chức hướng tới khách hàng tại Việt Nam; .com được nhận diện rộng rãi cho mục tiêu quốc tế. Các đuôi chuyên biệt có thể phù hợp với ngành nghề, nhưng hãy cân nhắc mức độ quen thuộc và chi phí gia hạn.'],
      },
      {
        heading: 'Kiểm tra, đăng ký và quản lý',
        paragraphs: ['Trạng thái tên miền có thể thay đổi theo thời gian. Hãy kiểm tra với nhà đăng ký tên miền chính thức trước khi quyết định; công cụ demo trên trang này không tra cứu trạng thái Internet thực tế.'],
        bullets: ['Đăng ký bằng thông tin chủ thể chính xác và giữ quyền truy cập tài khoản quản lý.', 'Bật tự động gia hạn hoặc đặt nhắc lịch trước ngày hết hạn.', 'Bật xác thực nhiều lớp và lưu thông tin DNS, nhà đăng ký ở nơi an toàn.'],
      },
    ],
  },
  {
    slug: 'chon-phan-mem-quan-ly-doanh-nghiep',
    label: 'GIẢI PHÁP',
    title: 'Chọn phần mềm quản lý phù hợp với doanh nghiệp',
    excerpt: 'Bắt đầu từ quy trình và mục tiêu vận hành để lựa chọn phần mềm vừa nhu cầu, dễ áp dụng và có thể mở rộng.',
    date: '28.07.2025',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Nhóm doanh nghiệp trao đổi về giải pháp quản lý',
    keyPoints: ['Xác định điểm nghẽn trong quy trình', 'Ưu tiên nhu cầu thiết yếu', 'Đánh giá khả năng tích hợp và mở rộng'],
    sections: [
      {
        heading: 'Bắt đầu từ quy trình hiện tại',
        paragraphs: ['Liệt kê cách các bộ phận đang tiếp nhận công việc, chia sẻ dữ liệu và phê duyệt. Xác định bước nào mất thời gian, dễ sai sót hoặc thiếu thông tin trước khi so sánh các phần mềm.'],
      },
      {
        heading: 'Chọn phạm vi phù hợp',
        paragraphs: ['Ưu tiên các chức năng giải quyết vấn đề thường xuyên nhất. Một phạm vi triển khai rõ ràng giúp đội ngũ làm quen, đánh giá kết quả và bổ sung tính năng theo từng giai đoạn.'],
        bullets: ['Xác định nhóm người dùng và vai trò cần thiết.', 'Kiểm tra khả năng kết nối với các hệ thống đang sử dụng.', 'Đánh giá phương án nhập dữ liệu và hỗ trợ sau triển khai.'],
      },
      {
        heading: 'Chuẩn bị cho việc áp dụng',
        paragraphs: ['Phần mềm chỉ phát huy hiệu quả khi quy trình, dữ liệu và cách sử dụng được thống nhất. Hãy bố trí người phụ trách, kế hoạch hướng dẫn và tiêu chí đo lường trước khi đưa hệ thống vào vận hành.'],
      },
    ],
  },
  {
    slug: 'bao-ve-du-lieu-khi-lam-viec-tren-cloud',
    label: 'CÔNG NGHỆ',
    title: 'Những lưu ý bảo vệ dữ liệu khi làm việc trên Cloud',
    excerpt: 'Một số nguyên tắc cơ bản về phân quyền, sao lưu và bảo mật giúp đội ngũ sử dụng dịch vụ đám mây an toàn hơn.',
    date: '20.07.2025',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Hình ảnh minh họa kết nối dữ liệu và dịch vụ đám mây',
    keyPoints: ['Phân quyền đúng nhu cầu công việc', 'Bật xác thực nhiều lớp', 'Kiểm tra khả năng khôi phục bản sao lưu'],
    sections: [
      {
        heading: 'Kiểm soát quyền truy cập',
        paragraphs: ['Chỉ cấp quyền cần thiết cho từng vai trò và rà soát định kỳ tài khoản không còn sử dụng. Bật xác thực nhiều lớp để tăng thêm lớp bảo vệ cho tài khoản quản trị và người dùng.'],
      },
      {
        heading: 'Sao lưu và thử khôi phục',
        paragraphs: ['Không nên mặc định rằng dữ liệu đã đồng bộ đồng nghĩa với dữ liệu đã được sao lưu. Xác định lịch sao lưu, người chịu trách nhiệm và thử khôi phục để bảo đảm bản sao có thể sử dụng khi cần.'],
      },
      {
        heading: 'Thiết lập quy tắc chia sẻ',
        paragraphs: ['Hạn chế liên kết chia sẻ công khai, đặt thời hạn truy cập khi phù hợp và hướng dẫn nhân viên xử lý tệp nhạy cảm. Lưu lại quy trình phản hồi để đội ngũ biết cần làm gì khi phát hiện truy cập bất thường.'],
      },
    ],
  },
]
