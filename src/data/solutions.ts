export interface SolutionSubcategory {
  name: string
  description?: string
  highlights?: string[]
  focusAreas?: string[]
  audience?: string
  items: string[]
}

export interface SolutionCategory {
  name: string
  description: string
  image: string
  subcategories: SolutionSubcategory[]
}

export const solutionCategories: SolutionCategory[] = ([
  {
    name: 'Dịch vụ',
    description: 'Đội ngũ công nghệ đồng hành từ ý tưởng, thiết kế đến vận hành và tăng trưởng.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85',
    subcategories: [
      {
        name: 'Phát triển phần mềm',
        items: [
          'Thiết kế và phát triển website, Web App.',
          'Phát triển ứng dụng di động trên iOS và Android.',
          'Xây dựng phần mềm quản lý doanh nghiệp ERP, CRM, MRP, HRM.',
          'Phát triển hệ thống quản lý theo yêu cầu.',
          'Tích hợp API và kết nối các nền tảng phần mềm.',
        ],
      },
      {
        name: 'Thiết kế UI/UX',
        description: 'Nghiên cứu nhu cầu người dùng và chuyển hóa thành giao diện số trực quan, dễ sử dụng trên nhiều thiết bị.',
        highlights: ['Khảo sát hành vi và nhu cầu người dùng', 'Thiết kế luồng thao tác, wireframe và prototype', 'Xây dựng giao diện nhất quán với thương hiệu'],
        items: [
          'Thiết kế giao diện website và ứng dụng di động.',
          'Nghiên cứu hành vi và nhu cầu người dùng.',
          'Xây dựng wireframe, prototype và thiết kế tương tác.',
          'Tối ưu trải nghiệm người dùng trên các nền tảng số.',
          'Thiết kế giao diện hiện đại, thân thiện và nhất quán với thương hiệu.',
        ],
      },
      {
        name: 'Trí tuệ nhân tạo (AI) và phân tích dữ liệu',
        description: 'Khai thác dữ liệu và ứng dụng AI để hỗ trợ ra quyết định, tự động hóa các công việc lặp lại.',
        highlights: ['Xác định bài toán và nguồn dữ liệu phù hợp', 'Thiết kế chatbot, trợ lý và quy trình tự động', 'Trực quan hóa dữ liệu cho hoạt động quản trị'],
        items: [
          'Tư vấn ứng dụng AI trong hoạt động doanh nghiệp.',
          'Xây dựng chatbot và trợ lý AI.',
          'Tự động hóa quy trình bằng AI.',
          'Phân tích dữ liệu, xây dựng báo cáo và dashboard trực quan.',
          'Nghiên cứu, phát triển các giải pháp Machine Learning và khai thác dữ liệu.',
        ],
      },
      {
        name: 'Tư vấn chuyển đổi số',
        description: 'Đánh giá hiện trạng, chọn công nghệ phù hợp và xây dựng lộ trình chuyển đổi theo từng giai đoạn.',
        highlights: ['Đánh giá quy trình và hạ tầng hiện tại', 'Xác định ưu tiên, nguồn lực và lộ trình', 'Kết nối hệ thống và hỗ trợ chuyển giao'],
        items: [
          'Đánh giá hiện trạng công nghệ và quy trình vận hành.',
          'Tư vấn chiến lược và lộ trình chuyển đổi số.',
          'Tư vấn kiến trúc hệ thống và hạ tầng công nghệ.',
          'Triển khai giải pháp điện toán đám mây (Cloud Computing).',
          'Tư vấn, phát triển và tích hợp nền tảng SaaS.',
          'Tối ưu quy trình quản lý và vận hành doanh nghiệp bằng công nghệ.',
        ],
      },
      {
        name: 'Nghiên cứu và phát triển công nghệ (R&D)',
        description: 'Thử nghiệm và phát triển nguyên mẫu công nghệ theo yêu cầu, từ kết nối thiết bị đến thu thập dữ liệu.',
        highlights: ['Xác định giả thuyết và yêu cầu kỹ thuật', 'Phát triển nguyên mẫu để kiểm chứng', 'Đánh giá khả năng mở rộng và tích hợp'],
        items: [
          'Nghiên cứu và phát triển giải pháp Internet vạn vật (IoT).',
          'Thiết kế nguyên mẫu và thử nghiệm công nghệ mới.',
          'Tích hợp cảm biến, thiết bị và nền tảng dữ liệu.',
        ],
      },
      {
        name: 'Quản trị Website & Marketing',
        description: 'Duy trì website hoạt động ổn định và hỗ trợ xây dựng trải nghiệm nội dung nhất quán trên kênh số.',
        highlights: ['Cập nhật nội dung và tối ưu cấu trúc website', 'Theo dõi hiệu năng, bảo mật và khả năng truy cập', 'Đo lường hoạt động và cải thiện nội dung'],
        items: [
          'Quản trị nội dung và cập nhật website định kỳ.',
          'Tối ưu SEO kỹ thuật và trải nghiệm trên công cụ tìm kiếm.',
          'Theo dõi hiệu suất website và báo cáo hoạt động.',
        ],
      },
    ],
  },
  {
    name: 'Sản phẩm',
    description: 'Các phân hệ quản trị kết nối quy trình từ khách hàng, đơn hàng, cung ứng và sản xuất đến tài chính, nhân sự và vận hành.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85',
    subcategories: [
      {
        name: 'Quản lý khách hàng (CRM)',
        description: 'Tập trung dữ liệu khách hàng và lịch sử tương tác để đội ngũ theo dõi cơ hội, chăm sóc và duy trì quan hệ nhất quán.',
        highlights: ['Quản lý lead và hồ sơ khách hàng', 'Theo dõi lịch sử giao dịch, tương tác', 'Lập lịch chăm sóc và nhắc việc'],
        items: ['Tiếp nhận, phân loại và theo dõi lead.', 'Quản lý hồ sơ, nhu cầu và thông tin liên hệ khách hàng.', 'Ghi nhận lịch sử giao dịch và trao đổi.', 'Lập lịch chăm sóc, phân công phụ trách và nhắc việc.'],
      },
      {
        name: 'Quản lý bán hàng (Sales CRM)',
        description: 'Theo dõi xuyên suốt quy trình bán hàng từ báo giá, hợp đồng và đơn hàng đến doanh thu.',
        highlights: ['Quản lý cơ hội và pipeline bán hàng', 'Lập báo giá, hợp đồng, đơn hàng', 'Theo dõi doanh thu và hiệu suất'],
        items: ['Quản lý khách hàng tiềm năng và cơ hội bán hàng.', 'Lập, gửi và theo dõi báo giá.', 'Theo dõi hợp đồng, đơn hàng và trạng thái xử lý.', 'Tổng hợp doanh thu và báo cáo hiệu suất bán hàng.'],
      },
      {
        name: 'Quản lý hợp đồng',
        description: 'Kiểm soát vòng đời hợp đồng từ soạn thảo, rà soát và phê duyệt đến theo dõi nghĩa vụ, thời hạn.',
        highlights: ['Quản lý mẫu và phiên bản hợp đồng', 'Thiết lập luồng rà soát, phê duyệt', 'Cảnh báo mốc thời gian quan trọng'],
        items: ['Soạn thảo hợp đồng từ mẫu được quản lý.', 'Theo dõi phiên bản và lịch sử chỉnh sửa.', 'Thiết lập luồng rà soát, phê duyệt và ký kết.', 'Theo dõi thời hạn, nghĩa vụ và nhắc gia hạn.'],
      },
      {
        name: 'Quản lý đơn hàng (OMS)',
        description: 'Kết nối tiếp nhận, xử lý và giao đơn; hỗ trợ theo dõi trạng thái đơn hàng cùng tình hình hàng hóa phục vụ hoàn tất đơn.',
        highlights: ['Tập trung đơn hàng từ các kênh', 'Theo dõi trạng thái xử lý và giao hàng', 'Đối soát tồn kho, đóng gói và hoàn tất đơn'],
        items: ['Tiếp nhận và đồng bộ đơn hàng từ các kênh.', 'Phân loại, xác nhận và theo dõi trạng thái đơn.', 'Theo dõi tồn kho, soạn hàng và đóng gói.', 'Ghi nhận giao hàng, đổi trả và lịch sử xử lý.'],
      },
      {
        name: 'Quản lý mua hàng (Procurement)',
        description: 'Chuẩn hóa quy trình mua sắm từ đề nghị mua, lấy báo giá đến lập đơn đặt hàng và phê duyệt.',
        highlights: ['Tiếp nhận và duyệt yêu cầu mua', 'So sánh báo giá và lựa chọn nguồn cung', 'Theo dõi đơn đặt hàng và ngân sách'],
        items: ['Tạo, phân loại và phê duyệt yêu cầu mua hàng.', 'Gửi yêu cầu và tiếp nhận báo giá từ nhà cung cấp.', 'So sánh báo giá theo giá, điều kiện và thời gian giao.', 'Lập đơn đặt hàng và theo dõi phê duyệt, giao nhận.'],
      },
      {
        name: 'Quản lý nhà cung cấp (SRM)',
        description: 'Quản lý tập trung hồ sơ, năng lực và hiệu quả nhà cung cấp để hỗ trợ lựa chọn, đánh giá và cải thiện quan hệ cung ứng.',
        highlights: ['Lưu trữ hồ sơ và chứng từ nhà cung cấp', 'Đánh giá chất lượng, giao hàng và mức độ đáp ứng', 'Tra cứu lịch sử mua hàng'],
        items: ['Quản lý hồ sơ, thông tin liên hệ và chứng từ nhà cung cấp.', 'Thiết lập tiêu chí và xếp hạng nhà cung cấp.', 'Theo dõi chất lượng, tiến độ giao hàng và mức độ đáp ứng.', 'Tra cứu lịch sử báo giá, đơn hàng và đánh giá.'],
      },
      {
        name: 'Quản lý sản xuất (MES)',
        description: 'Theo dõi lệnh và tiến độ sản xuất tại xưởng, ghi nhận năng suất, sản lượng và tình trạng theo từng công đoạn.',
        highlights: ['Phát hành và theo dõi lệnh sản xuất', 'Cập nhật tiến độ theo công đoạn', 'Tổng hợp năng suất và sản lượng'],
        items: ['Tạo, phân công và theo dõi lệnh sản xuất.', 'Cập nhật tiến độ, trạng thái máy và công đoạn.', 'Ghi nhận sản lượng, thời gian và năng suất.', 'Tổng hợp báo cáo sản xuất theo ca, chuyền hoặc sản phẩm.'],
      },
      {
        name: 'Quản lý chất lượng (QMS)',
        description: 'Chuẩn hóa hoạt động kiểm tra chất lượng, xử lý lỗi và hành động khắc phục, phòng ngừa theo yêu cầu vận hành và ISO.',
        highlights: ['Lập kế hoạch và ghi nhận kiểm tra', 'Theo dõi lỗi, nguyên nhân và xử lý', 'Quản lý CAPA và hồ sơ chất lượng'],
        items: ['Thiết lập tiêu chí và kế hoạch kiểm tra chất lượng.', 'Ghi nhận kết quả kiểm tra và lỗi sản phẩm.', 'Phân tích nguyên nhân, theo dõi CAPA.', 'Quản lý hồ sơ, quy trình và báo cáo phục vụ ISO.'],
      },
      {
        name: 'Quản lý bảo trì thiết bị (CMMS)',
        description: 'Lập kế hoạch bảo trì, tiếp nhận yêu cầu sửa chữa và lưu lịch sử thiết bị để hỗ trợ duy trì hoạt động ổn định.',
        highlights: ['Lập lịch bảo trì định kỳ', 'Quản lý yêu cầu và lệnh sửa chữa', 'Theo dõi hồ sơ, lịch sử thiết bị'],
        items: ['Lập lịch và nhắc bảo trì phòng ngừa.', 'Tiếp nhận sự cố, phân công và theo dõi sửa chữa.', 'Quản lý hồ sơ, thông số và lịch sử thiết bị.', 'Theo dõi vật tư bảo trì và báo cáo tình trạng thiết bị.'],
      },
      {
        name: 'Quản lý tài sản (AMS)',
        description: 'Theo dõi vòng đời tài sản từ ghi nhận, cấp phát và điều chuyển đến khấu hao, kiểm kê.',
        highlights: ['Quản lý danh mục và hồ sơ tài sản', 'Theo dõi cấp phát, điều chuyển và thu hồi', 'Tổng hợp khấu hao và kiểm kê'],
        items: ['Ghi nhận thông tin, nguyên giá và hồ sơ tài sản.', 'Theo dõi cấp phát, bàn giao, điều chuyển và thu hồi.', 'Quản lý lịch sử sử dụng và tình trạng tài sản.', 'Tính, theo dõi khấu hao và hỗ trợ kiểm kê định kỳ.'],
      },
      {
        name: 'Quản lý giao nhận và vận tải (TMS)',
        description: 'Điều phối phương tiện và tuyến giao hàng, theo dõi vận chuyển và tình trạng giao nhận.',
        highlights: ['Lập kế hoạch điều phối xe và tuyến', 'Theo dõi chuyến, tài xế và giao hàng', 'Quản lý lịch sử vận chuyển và phương tiện'],
        items: ['Tiếp nhận và sắp xếp yêu cầu vận chuyển.', 'Điều phối xe, tài xế và lịch trình giao hàng.', 'Theo dõi trạng thái chuyến và xác nhận giao nhận.', 'Quản lý lịch sử phương tiện, bảo dưỡng và hiệu suất vận tải.'],
      },
      {
        name: 'Quản lý tài chính và ngân sách',
        description: 'Tổng hợp thu chi, lập và kiểm soát ngân sách, theo dõi dòng tiền và báo cáo phục vụ quyết định.',
        highlights: ['Ghi nhận và phân loại thu chi', 'Lập ngân sách và theo dõi thực hiện', 'Theo dõi dòng tiền và báo cáo'],
        items: ['Ghi nhận, phân loại và theo dõi các khoản thu chi.', 'Lập ngân sách theo kỳ, đơn vị hoặc hạng mục.', 'So sánh ngân sách với số liệu thực tế và cảnh báo chênh lệch.', 'Theo dõi dòng tiền và lập báo cáo tài chính quản trị.'],
      },
      {
        name: 'Quản lý công việc (Task Management)',
        description: 'Giao việc, phối hợp tiến độ và theo dõi kết quả, KPI với nhắc việc theo thời hạn.',
        highlights: ['Giao việc theo cá nhân và nhóm', 'Theo dõi tiến độ, thời hạn và phụ thuộc', 'Đánh giá kết quả và KPI'],
        items: ['Tạo, giao và phân loại công việc theo dự án hoặc phòng ban.', 'Thiết lập thời hạn, mức ưu tiên và người phối hợp.', 'Theo dõi tiến độ, nhắc việc và tổng hợp tình trạng.', 'Thiết lập KPI, đánh giá kết quả và báo cáo hiệu suất.'],
      },
      {
        name: 'Quản lý văn bản điện tử (DMS)',
        description: 'Lưu trữ văn bản tập trung, phân quyền truy cập, tìm kiếm và xử lý phê duyệt theo quy trình.',
        highlights: ['Phân loại tài liệu và quản lý phiên bản', 'Kiểm soát quyền truy cập', 'Tìm kiếm và phê duyệt văn bản'],
        items: ['Lưu trữ, phân loại và tra cứu văn bản điện tử.', 'Quản lý phiên bản, lịch sử cập nhật và hồ sơ liên quan.', 'Phân quyền xem, tải và chỉnh sửa theo vai trò.', 'Thiết lập luồng trình ký, phê duyệt và nhắc xử lý.'],
      },
      {
        name: 'Quản lý chấm công và tính lương',
        description: 'Tổng hợp ca làm, chấm công, tăng ca và nghỉ phép thành dữ liệu phục vụ tính lương minh bạch.',
        highlights: ['Quản lý ca làm và dữ liệu chấm công', 'Tổng hợp tăng ca, nghỉ phép', 'Đối soát và lập bảng lương'],
        items: ['Thiết lập ca làm việc, lịch làm và phân ca.', 'Ghi nhận chấm công, tăng ca và nghỉ phép.', 'Tổng hợp ngày công, phụ cấp và dữ liệu tính lương.', 'Đối soát và lập bảng lương theo kỳ.', 'Quản lý đăng ký suất ăn, thực đơn và đối soát chi phí căn tin.'],
      },
      {
        name: 'Quản lý đào tạo (LMS)',
        description: 'Tổ chức khóa học, quản lý học viên, kiểm tra kết quả và theo dõi chứng chỉ.',
        highlights: ['Quản lý khóa học và học liệu', 'Theo dõi tiến độ học viên', 'Tổ chức kiểm tra và cấp chứng chỉ'],
        items: ['Tạo danh mục khóa học và tài liệu đào tạo.', 'Gán khóa học theo vai trò, phòng ban hoặc nhóm học viên.', 'Theo dõi tiến độ, điểm kiểm tra và mức độ hoàn thành.', 'Quản lý kết quả, chứng chỉ và lịch sử đào tạo.'],
      },
      {
        name: 'Quản lý an toàn lao động (HSE)',
        description: 'Ghi nhận sự cố và rủi ro, theo dõi trang bị bảo hộ (PPE) và tổ chức kiểm tra an toàn.',
        highlights: ['Quản lý sự cố và nguy cơ an toàn', 'Theo dõi PPE và kiểm tra định kỳ', 'Lập kế hoạch hành động khắc phục'],
        items: ['Ghi nhận sự cố, near-miss và rủi ro tại nơi làm việc.', 'Theo dõi cấp phát, kiểm tra và tình trạng PPE.', 'Lập lịch kiểm tra an toàn và ghi nhận kết quả.', 'Theo dõi hành động khắc phục và báo cáo HSE.', 'Ghi nhận khách ra vào, quyền truy cập khu vực và nhật ký an ninh cơ sở.'],
      },
      {
        name: 'Quản lý năng lượng (EMS)',
        description: 'Theo dõi tiêu thụ điện, nước và năng lượng, thiết lập định mức cùng cảnh báo bất thường.',
        highlights: ['Tập hợp dữ liệu tiêu thụ năng lượng', 'Theo dõi định mức và xu hướng', 'Cảnh báo mức tiêu thụ bất thường'],
        items: ['Ghi nhận và tổng hợp dữ liệu điện, nước và năng lượng.', 'Theo dõi mức tiêu hao theo khu vực, thiết bị hoặc kỳ.', 'Thiết lập định mức và cảnh báo khi có bất thường.', 'Lập báo cáo xu hướng sử dụng và cơ hội tiết kiệm năng lượng.'],
      },
    ],
  },
  {
    name: 'Tư vấn triển khai',
    description: 'Tư vấn, triển khai và bảo trì hệ thống theo sát quy trình vận hành thực tế.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85',
    subcategories: [
      {
        name: 'Quản trị doanh nghiệp',
        items: [
          'Quản lý nhân sự',
          'Quản lý chấm công và tiền lương',
          'Quản lý KPI',
          'Quản lý mục tiêu và kết quả then chốt',
          'Quản lý công việc',
          'Quản lý ngân sách',
          'Quản lý tài sản',
          'Quản lý hợp đồng',
          'Quản lý văn bản và tài liệu',
          'Quản lý đào tạo nội bộ',
          'Quản lý khảo sát nội bộ',
          'Quản lý đánh giá nội bộ',
          'Hệ thống xét duyệt nội bộ',
          'Quản lý thông báo nội bộ',
          'Quản lý cuộc họp',
          'Quản lý đặt cơm Canteen',
          'Hệ thống đánh giá hồ sơ ứng tuyển nhân sự',
        ],
      },
      {
        name: 'Kinh doanh và thương mại',
        items: [
          'Quản lý khách hàng',
          'Quản lý mua hàng',
          'Quản lý đơn hàng',
        ],
      },
      {
        name: 'Sản xuất và chất lượng',
        items: [
          'Quản lý sản xuất',
          'Quản lý chất lượng',
          'Quản lý bảo trì thiết bị',
          'Quản lý kho',
        ],
      },
      {
        name: 'Vận hành và Logistics',
        items: [
          'Quản lý giao nhận và vận tải',
          'Quản lý an toàn lao động',
          'Quản lý năng lượng',
        ],
      },
      {
        name: 'AI và tự động hóa doanh nghiệp',
        items: [
          'AI OCR & xử lý tài liệu',
          'AI Chatbot doanh nghiệp',
          'AI Dashboard',
          'AI Forecast',
          'AI Vision',
          'AI Automation',
          'AI Assistant',
        ],
      },
      {
        name: 'Hệ thống ERP',
        description: 'Tư vấn triển khai hệ thống hoạch định nguồn lực doanh nghiệp, kết nối quy trình và dữ liệu giữa các phòng ban.',
        highlights: ['Khảo sát quy trình và yêu cầu nghiệp vụ', 'Thiết kế cấu hình và kế hoạch chuyển đổi dữ liệu', 'Đào tạo người dùng và hỗ trợ vận hành'],
        items: ['Khảo sát quy trình và yêu cầu hệ thống ERP.', 'Tư vấn lựa chọn phạm vi và lộ trình triển khai ERP.', 'Cấu hình phân hệ và tích hợp dữ liệu ERP.', 'Đào tạo người dùng và chuyển giao vận hành ERP.'],
      },
      {
        name: 'Hệ thống MES',
        description: 'Kết nối thông tin tại xưởng với kế hoạch sản xuất, hỗ trợ theo dõi tiến độ và chất lượng theo công đoạn.',
        highlights: ['Khảo sát dây chuyền và quy trình sản xuất', 'Thiết kế phương án thu thập dữ liệu tại xưởng', 'Kết nối dữ liệu sản xuất với hệ thống quản trị'],
        items: ['Khảo sát dây chuyền và yêu cầu hệ thống MES.', 'Theo dõi tiến độ sản xuất theo công đoạn.', 'Kết nối thiết bị và thu thập dữ liệu sản xuất.', 'Thiết lập báo cáo chất lượng và hiệu suất xưởng.'],
      },
      {
        name: 'Hệ thống MRP',
        description: 'Rà soát nhu cầu vật tư và kế hoạch cung ứng dựa trên sản lượng, tồn kho và thời gian đáp ứng.',
        highlights: ['Chuẩn hóa dữ liệu định mức và tồn kho', 'Tính toán nhu cầu vật tư theo kế hoạch', 'Hỗ trợ theo dõi đề nghị mua và cung ứng'],
        items: ['Chuẩn hóa dữ liệu định mức nguyên vật liệu.', 'Lập kế hoạch nhu cầu vật tư theo sản xuất.', 'Theo dõi tồn kho và đề nghị mua hàng.', 'Đồng bộ kế hoạch MRP với hệ thống ERP.'],
      },
      {
        name: 'Bảo trì hệ thống ERP',
        description: 'Duy trì hệ thống ổn định qua hoạt động theo dõi, xử lý yêu cầu, cập nhật cấu hình và hỗ trợ người dùng.',
        highlights: ['Tiếp nhận và phân loại yêu cầu hỗ trợ', 'Kiểm tra lỗi và đề xuất phương án xử lý', 'Theo dõi cập nhật và thay đổi hệ thống'],
        items: ['Theo dõi vận hành và kiểm tra định kỳ hệ thống.', 'Tiếp nhận, phân loại và xử lý yêu cầu người dùng.', 'Cập nhật cấu hình và kiểm thử thay đổi ERP.', 'Rà soát dữ liệu và lập báo cáo tình trạng hệ thống.'],
      },
    ],
  },
  {
    name: 'Đào Tạo',
    description: 'Chương trình đào tạo thực tiễn giúp doanh nghiệp nâng cao năng lực quản trị, vận hành, cải tiến và ứng dụng AI.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=85',
    subcategories: [
      {
        name: 'Quản trị rủi ro',
        description: 'Nhận diện, đánh giá và kiểm soát rủi ro',
        focusAreas: ['Danh mục rủi ro', 'Ma trận xác suất và tác động', 'KRI – chỉ số rủi ro trọng yếu', 'Kế hoạch ứng phó', 'Theo dõi hành động kiểm soát'],
        items: [],
      },
      {
        name: 'Quản trị doanh nghiệp',
        description: 'Điều hành thống nhất theo mục tiêu và quy trình',
        focusAreas: ['Chiến lược', 'Cơ cấu tổ chức', 'Phân quyền', 'Quy trình', 'KPI/OKR', 'Công việc', 'Văn bản'],
        items: [],
      },
      {
        name: 'Quản lý sản xuất',
        description: 'Tối ưu kế hoạch, nguồn lực, chất lượng và năng suất',
        focusAreas: ['Kế hoạch sản xuất', 'Lệnh sản xuất', 'BOM/MRP', 'Nguyên vật liệu', 'Tiến độ', 'QC/kiểm soát chất lượng', 'Bảo trì', 'Giá thành'],
        items: [],
      },
      {
        name: 'Tài chính – lãi lỗ',
        description: 'Kiểm soát hiệu quả tài chính và lợi nhuận',
        focusAreas: ['Doanh thu', 'Chi phí', 'Giá vốn', 'Lãi/lỗ theo đơn hàng hoặc sản phẩm', 'Dòng tiền', 'Công nợ', 'Điểm hòa vốn'],
        items: [],
      },
      {
        name: 'Đào tạo & phát triển năng lực',
        description: 'Nâng cao năng suất, cải tiến và năng lực số/AI',
        focusAreas: ['Kaizen', 'AI Cơ Bản', 'AI X10 cho Doanh Nghiệp', 'Kế hoạch đào tạo', 'Đánh giá sau đào tạo'],
        items: [],
      },
      {
        name: 'Kaizen',
        description: 'Cải tiến liên tục trong công việc và sản xuất',
        focusAreas: ['Nhận diện lãng phí và vấn đề tại nơi làm việc', 'Phân tích nguyên nhân và đề xuất cải tiến', 'Chuẩn hóa cách làm hiệu quả', 'Theo dõi kết quả cải tiến'],
        audience: 'Toàn thể nhân viên; ưu tiên quản lý chuyền, tổ trưởng, QA/QC và nhân sự kho.',
        items: [],
      },
      {
        name: 'AI Cơ Bản',
        description: 'Trang bị kiến thức và kỹ năng sử dụng AI an toàn, hiệu quả trong công việc',
        focusAreas: ['Khái niệm và khả năng của AI', 'Cách đặt yêu cầu và làm việc với công cụ AI', 'Ứng dụng AI vào công việc văn phòng', 'Bảo mật dữ liệu, kiểm chứng kết quả và sử dụng AI có trách nhiệm'],
        audience: 'Toàn thể nhân viên, đặc biệt là nhóm văn phòng và quản lý.',
        items: [],
      },
      {
        name: 'AI cho Doanh Nghiệp. X10 hiệu suất',
        description: 'Ứng dụng AI nâng cao hiệu suất và tái thiết kế quy trình doanh nghiệp',
        focusAreas: ['Đánh giá quy trình và cơ hội ứng dụng AI', 'Tự động hóa công việc và luồng xử lý', 'Tái thiết kế quy trình doanh nghiệp với AI', 'Đo lường hiệu quả và quản trị thay đổi'],
        audience: 'Ban Giám đốc, trưởng/phó phòng, nhân sự nòng cốt, nhóm cải tiến và CNTT.',
        items: [],
      },
    ],
  },
]).filter((category) => category.name !== 'Sản phẩm')

export function solutionSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function solutionCategoryPath(category: SolutionCategory): string {
  return `/giai-phap/${solutionSlug(category.name)}`
}

export function solutionSubcategoryPath(category: SolutionCategory, subcategory: SolutionSubcategory): string {
  return `${solutionCategoryPath(category)}/${solutionSlug(subcategory.name)}`
}

export function solutionItemPath(category: SolutionCategory, subcategory: SolutionSubcategory, item: string): string {
  return `${solutionSubcategoryPath(category, subcategory)}/${solutionSlug(item)}`
}
