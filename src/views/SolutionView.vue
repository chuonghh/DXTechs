<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageIntro from '../components/PageIntro.vue'
import CategoryCarousel, { type CategoryCarouselItem } from '../components/CategoryCarousel.vue'
import {
  solutionCategories,
  solutionCategoryPath,
  solutionItemPath,
  solutionSlug,
  solutionSubcategoryPath,
} from '../data/solutions.ts'

const route = useRoute()
const relatedTrack = ref<HTMLElement | null>(null)
const activeRoadmapStep = ref(-1)
let roadmapObserver: IntersectionObserver | undefined

const scrollRelated = (direction: -1 | 1) => {
  const track = relatedTrack.value
  if (!track) return
  track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
}

const observeRoadmapSteps = async () => {
  roadmapObserver?.disconnect()
  await nextTick()
  const steps = document.querySelectorAll<HTMLElement>('.solution-website-process .solution-roadmap-grid article')
  activeRoadmapStep.value = -1
  if (!steps.length || !('IntersectionObserver' in window)) {
    if (steps.length) activeRoadmapStep.value = 0
    return
  }

  roadmapObserver = new IntersectionObserver((entries) => {
    const visibleSteps = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * 0.4) - Math.abs(b.boundingClientRect.top - window.innerHeight * 0.4))
    if (visibleSteps.length) {
      activeRoadmapStep.value = Array.from(steps).indexOf(visibleSteps[0].target as HTMLElement)
    }
  }, { rootMargin: '-35% 0px -50% 0px', threshold: 0 })

  steps.forEach((step) => roadmapObserver?.observe(step))
}

onMounted(observeRoadmapSteps)
watch(() => route.fullPath, observeRoadmapSteps)
onBeforeUnmount(() => roadmapObserver?.disconnect())

const imageSet = [
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85',
]
const implementationLandingThemes = {
  'Quản trị doanh nghiệp': {
    key: 'enterprise',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Kết nối nhân sự, mục tiêu, công việc và nguồn lực trên một nền tảng quản trị thống nhất, phù hợp cách doanh nghiệp đang vận hành.',
    sceneLabel: 'KHÔNG GIAN QUẢN TRỊ',
    sceneTitle: 'Toàn cảnh doanh nghiệp',
    metrics: [{ label: 'Nhân sự', value: '01 nền tảng' }, { label: 'Mục tiêu', value: 'Đồng bộ' }, { label: 'Vận hành', value: 'Minh bạch' }],
    badge: 'Quản trị tập trung',
    features: ['Một nguồn dữ liệu xuyên suốt phòng ban', 'Quy trình nội bộ rõ vai trò và trách nhiệm', 'Báo cáo quản trị theo mục tiêu thực tế'],
  },
  'Kinh doanh và thương mại': {
    key: 'commerce',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Theo dõi khách hàng, mua hàng và đơn hàng liền mạch để đội ngũ kiểm soát cơ hội, nhà cung cấp và trải nghiệm giao dịch.',
    sceneLabel: 'DÒNG CHẢY THƯƠNG MẠI',
    sceneTitle: 'Từ nhu cầu đến đơn hàng',
    metrics: [{ label: 'Khách hàng', value: 'Tập trung' }, { label: 'Đơn hàng', value: 'Theo sát' }, { label: 'Giao dịch', value: 'Liền mạch' }],
    badge: 'Vận hành thương mại',
    features: ['Hồ sơ và lịch sử khách hàng xuyên suốt', 'Quy trình mua hàng có kiểm soát', 'Theo dõi trạng thái đơn trên một luồng'],
  },
  'Sản xuất và chất lượng': {
    key: 'manufacturing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Kết nối kế hoạch, tiến độ tại xưởng, chất lượng, thiết bị và tồn kho để nâng khả năng kiểm soát toàn bộ hoạt động sản xuất.',
    sceneLabel: 'ĐIỀU HÀNH NHÀ MÁY',
    sceneTitle: 'Sản xuất trong tầm kiểm soát',
    metrics: [{ label: 'Tiến độ', value: 'Thời gian thực' }, { label: 'Chất lượng', value: 'Theo công đoạn' }, { label: 'Thiết bị', value: 'Chủ động' }],
    badge: 'Sẵn sàng sản xuất',
    features: ['Theo dõi lệnh và tiến độ theo công đoạn', 'Ghi nhận chất lượng và hành động khắc phục', 'Kết nối máy móc, bảo trì và vật tư'],
  },
  'Vận hành và Logistics': {
    key: 'logistics',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Điều phối giao nhận, an toàn lao động và năng lượng bằng dữ liệu tập trung, giúp đội ngũ theo dõi nguồn lực và xử lý chủ động.',
    sceneLabel: 'TRUNG TÂM ĐIỀU PHỐI',
    sceneTitle: 'Vận hành luôn thông suốt',
    metrics: [{ label: 'Giao nhận', value: 'Đúng lộ trình' }, { label: 'An toàn', value: 'Chủ động' }, { label: 'Năng lượng', value: 'Tối ưu' }],
    badge: 'Điều phối vận hành',
    features: ['Theo dõi chuyến đi và nguồn lực vận tải', 'Nhận diện rủi ro và quản lý an toàn', 'Đo lường tiêu thụ để tối ưu năng lượng'],
  },
  'AI và tự động hóa doanh nghiệp': {
    key: 'ai',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1675559207503-1c7d0f0f8e4d?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Ứng dụng AI vào tài liệu, dữ liệu và quy trình thực tế để giảm thao tác lặp lại, khai thác thông tin và hỗ trợ đội ngũ ra quyết định.',
    sceneLabel: 'AI BUSINESS STUDIO',
    sceneTitle: 'Dữ liệu thành hành động',
    metrics: [{ label: 'Tài liệu', value: 'Tự động đọc' }, { label: 'Dữ liệu', value: 'Phân tích nhanh' }, { label: 'Quy trình', value: 'Thông minh hơn' }],
    badge: 'AI đang hỗ trợ',
    features: ['Tự động trích xuất và xử lý tài liệu', 'Trợ lý AI kết nối tri thức doanh nghiệp', 'Phân tích và dự báo theo dữ liệu vận hành'],
  },
} as const
const serviceLandingThemes = {
  'Phát triển phần mềm': {
    key: 'service-software',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Xây dựng website, ứng dụng và hệ thống theo quy trình thực tế, dễ mở rộng và kết nối với nền tảng doanh nghiệp đang sử dụng.',
    sceneLabel: 'SOFTWARE DELIVERY',
    sceneTitle: 'Biến ý tưởng thành sản phẩm số',
    overviewTitle: 'Sản phẩm số tốt bắt đầu từ quy trình rõ ràng',
    overviewDescription: 'Đi từ bài toán nghiệp vụ đến phần mềm sẵn sàng sử dụng, với phạm vi và mốc bàn giao thống nhất.',
    metrics: [{ label: 'Sản phẩm', value: 'Theo yêu cầu' }, { label: 'Tích hợp', value: 'Đồng bộ' }, { label: 'Mở rộng', value: 'Linh hoạt' }],
    badge: 'Phát triển đúng bài toán',
    features: ['Khảo sát nghiệp vụ, chốt phạm vi trước khi phát triển', 'Thiết kế giao diện và xây dựng theo từng mốc', 'Kiểm thử, triển khai và đồng hành sau bàn giao'],
  },
  'Thiết kế UI/UX': {
    key: 'service-uiux',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Tạo trải nghiệm số rõ ràng, dễ sử dụng và nhất quán với thương hiệu, dựa trên nhu cầu thật của người dùng.',
    sceneLabel: 'EXPERIENCE DESIGN',
    sceneTitle: 'Trải nghiệm tốt bắt đầu từ người dùng',
    overviewTitle: 'Thiết kế dễ dùng, có cơ sở để kiểm chứng',
    overviewDescription: 'Kết hợp nghiên cứu người dùng, kiến trúc thông tin và thiết kế tương tác để giảm ma sát trong từng thao tác.',
    metrics: [{ label: 'Nghiên cứu', value: 'Lấy người dùng làm tâm' }, { label: 'Thiết kế', value: 'Nhất quán' }, { label: 'Tương tác', value: 'Trực quan' }],
    badge: 'Thiết kế lấy người dùng làm tâm',
    features: ['Tìm hiểu hành vi và nhu cầu của từng nhóm người dùng', 'Xây dựng luồng, wireframe và prototype để kiểm chứng', 'Hoàn thiện UI đồng bộ thương hiệu trên mọi thiết bị'],
  },
  'Tư vấn chuyển đổi số': {
    key: 'service-digital',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Đánh giá hiện trạng, ưu tiên đúng bài toán và xây lộ trình chuyển đổi số phù hợp với mục tiêu, nguồn lực và mức độ sẵn sàng của doanh nghiệp.',
    sceneLabel: 'DIGITAL STRATEGY',
    sceneTitle: 'Chuyển đổi số theo lộ trình',
    overviewTitle: 'Lộ trình chuyển đổi gắn với mục tiêu doanh nghiệp',
    overviewDescription: 'Ưu tiên những thay đổi tạo giá trị, phù hợp nguồn lực và có thể triển khai theo từng giai đoạn.',
    metrics: [{ label: 'Hiện trạng', value: 'Đánh giá rõ' }, { label: 'Ưu tiên', value: 'Theo mục tiêu' }, { label: 'Lộ trình', value: 'Từng giai đoạn' }],
    badge: 'Bắt đầu từ hiện trạng',
    features: ['Rà soát quy trình, dữ liệu và hạ tầng hiện có', 'Xếp thứ tự ưu tiên theo giá trị và nguồn lực', 'Lập lộ trình, kiến trúc và kế hoạch triển khai'],
  },
  'Nghiên cứu và phát triển công nghệ (R&D)': {
    key: 'service-research',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Thử nghiệm công nghệ và phát triển nguyên mẫu để kiểm chứng tính khả thi trước khi đầu tư mở rộng.',
    sceneLabel: 'RESEARCH & DEVELOPMENT',
    sceneTitle: 'Thử nghiệm, kiểm chứng, phát triển',
    overviewTitle: 'Kiểm chứng công nghệ trước khi mở rộng',
    overviewDescription: 'Biến giả thuyết thành nguyên mẫu có thể thử, đánh giá rủi ro và xác định hướng phát triển khả thi.',
    metrics: [{ label: 'Ý tưởng', value: 'Định hình' }, { label: 'Nguyên mẫu', value: 'Kiểm chứng' }, { label: 'Công nghệ', value: 'Sẵn sàng mở rộng' }],
    badge: 'Biến ý tưởng thành nguyên mẫu',
    features: ['Làm rõ giả thuyết, mục tiêu và yêu cầu kỹ thuật', 'Phát triển nguyên mẫu để thử nghiệm trong thực tế', 'Đánh giá khả năng tích hợp, mở rộng và vận hành'],
  },
  'Quản trị Website & Marketing': {
    key: 'service-growth',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85',
    ],
    description: 'Duy trì website ổn định, nội dung nhất quán và hiệu quả kênh số được theo dõi để liên tục cải thiện.',
    sceneLabel: 'WEBSITE & DIGITAL GROWTH',
    sceneTitle: 'Tối ưu từng điểm chạm số',
    overviewTitle: 'Website được chăm sóc, hiệu quả được đo lường',
    overviewDescription: 'Kết nối quản trị nội dung, nền tảng kỹ thuật và dữ liệu hiệu suất để cải thiện liên tục.',
    metrics: [{ label: 'Nội dung', value: 'Luôn cập nhật' }, { label: 'Website', value: 'Vận hành ổn định' }, { label: 'Hiệu quả', value: 'Đo lường được' }],
    badge: 'Tăng trưởng có đo lường',
    features: ['Quản trị nội dung và cập nhật website định kỳ', 'Theo dõi SEO, hiệu năng và trải nghiệm truy cập', 'Đo lường hoạt động để ưu tiên cải thiện đúng điểm'],
  },
} as const
const serviceDeliveryDetails = {
  'Phát triển phần mềm': {
    scope: [
      { title: 'Phân tích nghiệp vụ và kiến trúc', description: 'Làm rõ người dùng, quy trình, dữ liệu, yêu cầu chức năng và hệ thống cần kết nối; xác định kiến trúc phù hợp với phạm vi.' },
      { title: 'Thiết kế và phát triển sản phẩm', description: 'Thiết kế trải nghiệm, xây giao diện và xử lý nghiệp vụ theo từng mốc để khách hàng có thể rà soát sớm.' },
      { title: 'Tích hợp và kiểm thử', description: 'Kết nối API hoặc nền tảng liên quan; kiểm thử chức năng, dữ liệu và luồng sử dụng trước khi đưa vào vận hành.' },
      { title: 'Triển khai và chuyển giao', description: 'Chuẩn bị môi trường, tài liệu và hướng dẫn quản trị; thống nhất kế hoạch hỗ trợ và mở rộng sau bàn giao.' },
    ],
    workflow: [
      { title: 'Khám phá bài toán', description: 'Trao đổi mục tiêu, người dùng, quy trình hiện tại và điều kiện kỹ thuật để xác định phạm vi khả thi.' },
      { title: 'Thiết kế và xây dựng', description: 'Duyệt phương án giao diện, chia mốc phát triển và cập nhật bản chạy thử để nhận phản hồi sớm.' },
      { title: 'Kiểm thử và vận hành', description: 'Nghiệm thu theo tiêu chí đã thống nhất, triển khai môi trường thật và hướng dẫn đội ngũ sử dụng.' },
    ],
    audience: 'Doanh nghiệp cần xây mới website, ứng dụng hoặc phần mềm nghiệp vụ; cần tích hợp các hệ thống hiện có hoặc từng bước thay thế quy trình thủ công.',
    outcomes: ['Đặc tả yêu cầu và phạm vi theo giai đoạn', 'Sản phẩm phần mềm cùng tài liệu hướng dẫn', 'Kế hoạch triển khai, kiểm thử và hỗ trợ sau bàn giao'],
  },
  'Thiết kế UI/UX': {
    scope: [
      { title: 'Nghiên cứu người dùng', description: 'Xác định nhóm người dùng, mục tiêu và điểm vướng trong hành trình hiện tại qua tài liệu, phỏng vấn hoặc dữ liệu sẵn có.' },
      { title: 'Kiến trúc thông tin và luồng thao tác', description: 'Sắp xếp nội dung, sơ đồ điều hướng và các bước hoàn thành tác vụ để người dùng dễ tìm và dễ thực hiện.' },
      { title: 'Wireframe và prototype', description: 'Mô phỏng cấu trúc và tương tác chính để nhóm sản phẩm rà soát sớm trước khi hoàn thiện giao diện.' },
      { title: 'Giao diện và quy chuẩn thiết kế', description: 'Xây dựng màn hình, thành phần dùng chung và trạng thái tương tác nhất quán trên web, mobile hoặc hệ thống nội bộ.' },
    ],
    workflow: [
      { title: 'Tìm hiểu bối cảnh', description: 'Thu thập mục tiêu sản phẩm, đối tượng sử dụng, yêu cầu thương hiệu và các ràng buộc nền tảng.' },
      { title: 'Phác thảo và kiểm chứng', description: 'Dựng luồng, wireframe và prototype; lấy phản hồi từ các bên liên quan để điều chỉnh.' },
      { title: 'Hoàn thiện UI và bàn giao', description: 'Hoàn thiện giao diện, trạng thái và quy chuẩn; bàn giao file thiết kế, component và ghi chú cho đội phát triển.' },
    ],
    audience: 'Đội ngũ chuẩn bị ra mắt sản phẩm số, cần cải thiện luồng sử dụng hiện tại hoặc muốn đồng bộ giao diện trên nhiều nền tảng.',
    outcomes: ['Sơ đồ hành trình và luồng thao tác', 'Wireframe, prototype và bộ giao diện đã duyệt', 'Quy chuẩn thành phần và tài liệu bàn giao cho đội ngũ phát triển'],
  },
  'Tư vấn chuyển đổi số': {
    scope: [
      { title: 'Đánh giá hiện trạng', description: 'Rà soát quy trình, ứng dụng, dữ liệu, hạ tầng và cách phối hợp giữa các bộ phận để xác định điểm nghẽn.' },
      { title: 'Xác định mục tiêu và ưu tiên', description: 'Liên kết nhu cầu chuyển đổi với mục tiêu vận hành; phân nhóm sáng kiến theo giá trị, mức độ cấp thiết và nguồn lực.' },
      { title: 'Thiết kế kiến trúc và lộ trình', description: 'Đề xuất mô hình hệ thống, phương án dữ liệu, các mốc triển khai và sự phụ thuộc giữa các hạng mục.' },
      { title: 'Hỗ trợ triển khai và chuyển giao', description: 'Điều phối cấu hình hoặc tích hợp, chuẩn bị kiểm thử, hướng dẫn người dùng và theo dõi khi đưa vào sử dụng.' },
    ],
    workflow: [
      { title: 'Khảo sát và thống nhất mục tiêu', description: 'Làm việc với các bên liên quan để ghi nhận hiện trạng, mong đợi, ràng buộc và chỉ số theo dõi.' },
      { title: 'Lập phương án theo ưu tiên', description: 'Xây dựng lộ trình theo giai đoạn, phân định trách nhiệm và xác định các giả định cần kiểm chứng.' },
      { title: 'Đồng hành thực hiện', description: 'Theo dõi tiến độ, hỗ trợ xử lý phụ thuộc và cập nhật phương án theo kết quả triển khai thực tế.' },
    ],
    audience: 'Doanh nghiệp đang có nhiều công cụ rời rạc, quy trình thủ công hoặc cần lộ trình công nghệ gắn với mục tiêu và nguồn lực cụ thể.',
    outcomes: ['Bản đánh giá hiện trạng và vấn đề ưu tiên', 'Kiến trúc mục tiêu cùng lộ trình triển khai theo giai đoạn', 'Danh sách đầu việc, vai trò phối hợp và tiêu chí theo dõi'],
  },
  'Nghiên cứu và phát triển công nghệ (R&D)': {
    scope: [
      { title: 'Xác định giả thuyết nghiên cứu', description: 'Làm rõ nhu cầu, câu hỏi cần kiểm chứng, điều kiện thành công và giới hạn về thiết bị, dữ liệu hoặc môi trường.' },
      { title: 'Thiết kế thử nghiệm', description: 'Chọn phương án kỹ thuật, cấu hình thử nghiệm và cách thu thập dữ liệu để kết quả có thể đánh giá được.' },
      { title: 'Phát triển nguyên mẫu', description: 'Xây dựng mẫu thử phần mềm, thiết bị hoặc kết nối cảm biến ở quy mô phù hợp để kiểm tra chức năng cốt lõi.' },
      { title: 'Đánh giá khả năng mở rộng', description: 'Ghi nhận kết quả, rủi ro, chi phí và yêu cầu tích hợp để đề xuất bước phát triển tiếp theo.' },
    ],
    workflow: [
      { title: 'Định nghĩa câu hỏi', description: 'Thống nhất mục tiêu nghiên cứu, phạm vi thử nghiệm và dữ liệu hoặc thiết bị cần chuẩn bị.' },
      { title: 'Tạo mẫu và thử nghiệm', description: 'Phát triển nguyên mẫu vừa đủ để kiểm chứng các giả định quan trọng trong điều kiện đã thống nhất.' },
      { title: 'Đánh giá và đề xuất', description: 'Tổng hợp kết quả, giới hạn kỹ thuật và phương án tiếp tục, điều chỉnh hoặc dừng thử nghiệm.' },
    ],
    audience: 'Doanh nghiệp cần thử nghiệm công nghệ mới, IoT, thiết bị kết nối hoặc ý tưởng sản phẩm trước khi cam kết đầu tư triển khai rộng.',
    outcomes: ['Đề cương thử nghiệm và tiêu chí kiểm chứng', 'Nguyên mẫu cùng kết quả thử nghiệm ghi nhận được', 'Đánh giá rủi ro và đề xuất hướng phát triển tiếp'],
  },
  'Quản trị Website & Marketing': {
    scope: [
      { title: 'Quản trị nội dung', description: 'Cập nhật trang, bài viết và hình ảnh theo lịch; rà soát liên kết, biểu mẫu và tính nhất quán của thông tin.' },
      { title: 'SEO và sức khỏe website', description: 'Theo dõi cấu trúc trang, khả năng thu thập dữ liệu, tốc độ và hiển thị trên thiết bị; đề xuất hạng mục cần xử lý.' },
      { title: 'Đo lường hiệu quả', description: 'Thiết lập hoặc rà soát chỉ số truy cập, nguồn người dùng và chuyển đổi theo mục tiêu đã thống nhất.' },
      { title: 'Cải thiện theo dữ liệu', description: 'Tổng hợp kết quả định kỳ, xác định nội dung hoặc điểm chạm cần ưu tiên và đề xuất thử nghiệm tiếp theo.' },
    ],
    workflow: [
      { title: 'Rà soát và lập kế hoạch', description: 'Kiểm tra hiện trạng website, mục tiêu nội dung, chỉ số đang có và quyền truy cập cần thiết.' },
      { title: 'Thực hiện và theo dõi', description: 'Cập nhật nội dung, xử lý hạng mục đã thống nhất và theo dõi chỉ số trong kỳ.' },
      { title: 'Báo cáo và tối ưu', description: 'Báo cáo công việc, nêu vấn đề phát hiện và thống nhất thứ tự cải thiện cho kỳ tiếp theo.' },
    ],
    audience: 'Doanh nghiệp cần duy trì website thường xuyên, cải thiện khả năng tìm kiếm hoặc theo dõi hiệu quả nội dung và hoạt động số.',
    outcomes: ['Lịch cập nhật nội dung và danh sách công việc định kỳ', 'Báo cáo tình trạng kỹ thuật, SEO hoặc truy cập theo phạm vi', 'Đề xuất ưu tiên cải thiện cho giai đoạn tiếp theo'],
  },
} as const
const trainingLandingThemes = {
  overview: {
    key: 'education',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=85'],
    description: 'Chương trình thực tiễn giúp đội ngũ phát triển năng lực quản trị, sản xuất, tài chính, cải tiến và ứng dụng AI.',
    sceneLabel: 'DXTECHS · LEARNING',
    sceneTitle: 'Học để tạo chuyển đổi',
    metrics: [{ label: 'Nội dung', value: 'Theo lĩnh vực' }, { label: 'Phương pháp', value: 'Thực tiễn' }, { label: 'Năng lực', value: 'Ứng dụng ngay' }],
    badge: 'Đào tạo theo mục tiêu',
    features: ['Nội dung gắn với tình huống công việc', 'Tập trung năng lực có thể ứng dụng', 'Lộ trình theo nhu cầu của doanh nghiệp'],
  },
  'Quản trị rủi ro': {
    key: 'risk',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=85'],
    description: 'Nhận diện, đánh giá và kiểm soát rủi ro',
    sceneLabel: 'RISK MANAGEMENT',
    sceneTitle: 'Chủ động trước rủi ro',
    metrics: [{ label: 'Nhận diện', value: 'Có hệ thống' }, { label: 'Đánh giá', value: 'Theo mức độ' }, { label: 'Kiểm soát', value: 'Chủ động' }],
    badge: 'Năng lực quản trị rủi ro',
    features: ['Nhận diện rủi ro trong hoạt động', 'Đánh giá mức độ và tác động', 'Xây dựng phương án kiểm soát phù hợp'],
  },
  'Quản trị doanh nghiệp': {
    key: 'business',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85'],
    description: 'Điều hành thống nhất theo mục tiêu và quy trình',
    sceneLabel: 'BUSINESS MANAGEMENT',
    sceneTitle: 'Mục tiêu rõ, vận hành đồng bộ',
    metrics: [{ label: 'Mục tiêu', value: 'Thống nhất' }, { label: 'Quy trình', value: 'Liên kết' }, { label: 'Điều hành', value: 'Minh bạch' }],
    badge: 'Năng lực quản trị',
    features: ['Liên kết mục tiêu với hoạt động', 'Thống nhất cách vận hành theo quy trình', 'Củng cố năng lực điều hành doanh nghiệp'],
  },
  'Quản lý sản xuất': {
    key: 'production',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85'],
    description: 'Tối ưu kế hoạch, nguồn lực, chất lượng và năng suất',
    sceneLabel: 'PRODUCTION MANAGEMENT',
    sceneTitle: 'Tối ưu năng lực sản xuất',
    metrics: [{ label: 'Kế hoạch', value: 'Chủ động' }, { label: 'Nguồn lực', value: 'Hiệu quả' }, { label: 'Năng suất', value: 'Cải thiện' }],
    badge: 'Năng lực sản xuất',
    features: ['Tối ưu kế hoạch và nguồn lực', 'Nâng cao chất lượng trong sản xuất', 'Cải thiện năng suất vận hành'],
  },
  'Tài chính – lãi lỗ': {
    key: 'finance',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=85'],
    description: 'Kiểm soát hiệu quả tài chính và lợi nhuận',
    sceneLabel: 'FINANCE & PROFIT',
    sceneTitle: 'Hiểu rõ hiệu quả tài chính',
    metrics: [{ label: 'Tài chính', value: 'Kiểm soát' }, { label: 'Chi phí', value: 'Theo dõi' }, { label: 'Lợi nhuận', value: 'Tối ưu' }],
    badge: 'Năng lực tài chính',
    features: ['Nắm các yếu tố ảnh hưởng đến tài chính', 'Theo dõi hiệu quả và lãi lỗ', 'Hỗ trợ quyết định dựa trên số liệu'],
  },
  'Đào tạo & phát triển năng lực': {
    key: 'capability',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=85'],
    description: 'Nâng cao năng suất, cải tiến và năng lực số/AI',
    sceneLabel: 'CAPABILITY DEVELOPMENT',
    sceneTitle: 'Phát triển năng lực đội ngũ',
    metrics: [{ label: 'Năng suất', value: 'Nâng cao' }, { label: 'Cải tiến', value: 'Liên tục' }, { label: 'Năng lực số', value: 'Sẵn sàng' }],
    badge: 'Phát triển năng lực',
    features: ['Củng cố năng lực trong công việc', 'Thúc đẩy tư duy cải tiến', 'Phát triển năng lực số và AI'],
  },
  Kaizen: {
    key: 'kaizen',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85'],
    description: 'Cải tiến liên tục trong công việc và sản xuất',
    sceneLabel: 'KAIZEN · CONTINUOUS IMPROVEMENT',
    sceneTitle: 'Mỗi ngày tốt hơn',
    metrics: [{ label: 'Quan sát', value: 'Tại hiện trường' }, { label: 'Cải tiến', value: 'Liên tục' }, { label: 'Kết quả', value: 'Đo lường' }],
    badge: 'Văn hóa cải tiến',
    features: ['Nhận diện cơ hội cải tiến hằng ngày', 'Tối ưu công việc và hoạt động sản xuất', 'Duy trì kết quả bằng thói quen cải tiến'],
  },
  'AI Cơ Bản': {
    key: 'ai-basic',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=85'],
    description: 'Trang bị kiến thức và kỹ năng sử dụng AI an toàn, hiệu quả trong công việc',
    sceneLabel: 'AI LITERACY',
    sceneTitle: 'Sử dụng AI tự tin, an toàn',
    metrics: [{ label: 'Kiến thức', value: 'Nền tảng' }, { label: 'Kỹ năng', value: 'Thực hành' }, { label: 'An toàn', value: 'Có trách nhiệm' }],
    badge: 'AI cho mọi người',
    features: ['Hiểu các khái niệm AI nền tảng', 'Thực hành sử dụng AI trong công việc', 'Nhận biết nguyên tắc an toàn và hiệu quả'],
  },
  'AI cho Doanh Nghiệp. X10 hiệu suất': {
    key: 'ai-business',
    image: 'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1000&q=85'],
    description: 'Ứng dụng AI nâng cao hiệu suất và tái thiết kế quy trình doanh nghiệp',
    sceneLabel: 'AI FOR BUSINESS',
    sceneTitle: 'Tái thiết kế quy trình với AI',
    metrics: [{ label: 'Quy trình', value: 'Đánh giá lại' }, { label: 'AI', value: 'Ứng dụng thực tế' }, { label: 'Hiệu suất', value: 'Tăng cường' }],
    badge: 'AI cho doanh nghiệp',
    features: ['Tìm cơ hội ứng dụng AI vào quy trình', 'Tái thiết kế cách phối hợp và thực hiện công việc', 'Nâng cao hiệu suất hoạt động doanh nghiệp'],
  },
} as const

const category = computed(() => solutionCategories.find(
  (item) => solutionSlug(item.name) === route.params.categorySlug,
))
const subcategory = computed(() => category.value?.subcategories.find(
  (item) => solutionSlug(item.name) === route.params.subcategorySlug,
))
const solutionItem = computed(() => subcategory.value?.items.find(
  (item) => solutionSlug(item) === route.params.itemSlug,
))
const isItemPage = computed(() => Boolean(route.params.itemSlug))
const isWebsiteDevelopmentPage = computed(() => solutionItem.value?.startsWith('Thiết kế và phát triển website'))
const isWebsiteContentPage = computed(() => solutionItem.value?.startsWith('Quản trị nội dung và cập nhật website'))
const isWebsiteAnalyticsPage = computed(() => solutionItem.value?.startsWith('Theo dõi hiệu suất website và báo cáo hoạt động'))
const isTechnicalSeoPage = computed(() => solutionItem.value?.startsWith('Tối ưu SEO kỹ thuật và trải nghiệm trên công cụ tìm kiếm'))
const isAiBasicPage = computed(() => subcategory.value?.name === 'AI Cơ Bản')

export interface AiServicePackage {
  id: string
  name: string
  badge?: string
  isFeatured?: boolean
  price: string
  unit: string
  description: string
  highlights: string[]
  features: string[]
  ctaText: string
}

const fanpageAiPackages: AiServicePackage[] = [
  {
    id: 'fanpage-starter',
    name: 'Khởi Động Fanpage AI',
    badge: 'TIẾT KIỆM',
    isFeatured: false,
    price: '1.990.000',
    unit: 'tháng',
    description: 'Tự động hóa phản hồi cơ bản, giữ chân khách hàng 24/7 và chống trôi tin nhắn.',
    highlights: ['Trực Fanpage 24/7', 'Phản hồi tức thì < 3s', 'Setup trong 48h'],
    features: [
      'Tự động phản hồi bình luận (comment) & tin nhắn (inbox) 24/7',
      'AI học kiến thức sản phẩm, dịch vụ và bảng giá cơ bản từ tài liệu của bạn',
      'Kịch bản chào mừng, phân luồng nhu cầu và thu thập SĐT / Email',
      'Tự động ẩn bình luận chứa số điện thoại chống đối thủ cướp khách',
      'Bàn giao kịch bản và hướng dẫn nhân sự vận hành dễ dàng trong 48 giờ',
    ],
    ctaText: 'Tư vấn gói Khởi Động',
  },
  {
    id: 'fanpage-pro',
    name: 'Fanpage AI Tự Động & Chốt Đơn',
    badge: 'ĐƯỢC CHỌN NHIỀU NHẤT',
    isFeatured: true,
    price: '4.500.000',
    unit: 'tháng',
    description: 'Trợ lý AI thông minh xử lý ngữ cảnh sâu, tư vấn cá nhân hóa và hỗ trợ chốt đơn tự động.',
    highlights: ['AI NLP hiểu ngữ cảnh', 'Lên lịch bài viết tự động', 'Tối ưu chuyển đổi'],
    features: [
      'Bao gồm toàn bộ tính năng của gói Khởi Động',
      'AI Chatbot NLP thông minh xử lý từ chối, giải đáp thắc mắc chuyên sâu',
      'Gợi ý sản phẩm thông minh và tự động gửi catalog hình ảnh kèm báo giá',
      'Tự động gắn thẻ (Tags) khách hàng và phân loại phễu bán hàng',
      'Tự động lên ý tưởng và lập lịch đăng bài Fanpage chuẩn SEO mạng xã hội',
      'Phân quyền nhân viên, chuyển tiếp hội thoại mượt mà khi cần chuyên viên tư vấn',
      'Báo cáo phân tích hiệu suất hội thoại, tỷ lệ phản hồi và khách tiềm năng hàng tuần',
    ],
    ctaText: 'Tư vấn gói Chốt Đơn',
  },
  {
    id: 'fanpage-enterprise',
    name: 'Fanpage AI Đa Kênh & Tùy Biến',
    badge: 'DOANH NGHIỆP',
    isFeatured: false,
    price: '8.900.000',
    unit: 'tháng',
    description: 'Hệ thống AI đa Fanpage đồng bộ, tích hợp sâu vào CRM/ERP và kịch bản nghiệp vụ độc quyền.',
    highlights: ['Đa kênh / Đa Fanpage', 'Tích hợp CRM/ERP', 'Kỹ sư AI đồng hành 1-1'],
    features: [
      'Bao gồm toàn bộ tính năng của gói Tự Động & Chốt Đơn',
      'Quản lý tập trung đồng bộ không giới hạn Fanpage, Zalo OA & Website Chat',
      'Tích hợp 2 chiều API với hệ thống ERP / CRM / Kho vận sẵn có của doanh nghiệp',
      'Kịch bản AI Re-marketing tự động chăm sóc và kích hoạt lại khách hàng cũ',
      'AI tạo hình ảnh sản phẩm và nội dung bài viết theo đúng phong cách nhận diện',
      'Cam kết SLA phản hồi kỹ thuật ưu tiên 24/7',
      'Đội ngũ kỹ sư DXTechs đồng hành tinh chỉnh prompt và tối ưu hóa định kỳ',
    ],
    ctaText: 'Tư vấn gói Doanh Nghiệp',
  },
]
const websiteDevelopmentPackages = [
  {
    name: 'Gói 1',
    price: '3–5',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80',
    imageAlt: 'Laptop hiển thị giao diện website đang được phát triển',
    description: 'Phù hợp để giới thiệu nhanh một sản phẩm, dịch vụ hoặc chiến dịch.',
    features: ['Landing page chuyên nghiệp, hiển thị tốt trên di động', 'Thiết kế UI/UX theo nhận diện và luồng chuyển đổi cơ bản', 'SEO nền tảng: cấu trúc trang, tiêu đề và mô tả', 'Form liên hệ, nút gọi nhanh; chưa gồm tích hợp API riêng'],
  },
  {
    name: 'Gói 2',
    price: '5–10',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=80',
    imageAlt: 'Màn hình máy tính với mã nguồn phát triển website',
    description: 'Xây dựng website doanh nghiệp gọn gàng, dễ quản lý và cập nhật.',
    features: ['Website doanh nghiệp chuyên nghiệp khoảng 5–7 trang', 'Thiết kế UI/UX theo yêu cầu và nhận diện thương hiệu', 'SEO on-page cơ bản, cấu hình sitemap và chia sẻ mạng xã hội', 'Quản trị nội dung cơ bản, biểu mẫu và chức năng phổ biến'],
  },
  {
    name: 'Gói 3',
    price: '10–20',
    image: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&w=700&q=80',
    imageAlt: 'Nhóm thiết kế đang làm việc trên trải nghiệm website',
    description: 'Lựa chọn cân bằng cho website nhiều nội dung hoặc Web App phiên bản đầu.',
    features: ['Website chuyên nghiệp hoặc Web App phiên bản đầu', 'Thiết kế UI/UX theo luồng sử dụng, prototype màn hình chính', 'SEO on-page và quản trị nội dung theo cấu trúc website', 'Tích hợp API hoặc chức năng theo yêu cầu đã thống nhất'],
  },
  {
    name: 'Gói 4',
    price: '20–30',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=700&q=80',
    imageAlt: 'Thiết kế giao diện ứng dụng web trên nhiều thiết bị',
    description: 'Phù hợp hệ thống web có quy trình nghiệp vụ và nhiều nhóm người dùng.',
    features: ['Web App theo luồng nghiệp vụ và nhóm người dùng', 'UI/UX thiết kế riêng, trang quản trị dữ liệu và tài khoản', 'SEO kỹ thuật cơ bản cho các trang công khai', 'Tích hợp API và chức năng nghiệp vụ theo phạm vi'],
  },
  {
    name: 'Gói 5',
    price: '40–50',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=700&q=80',
    imageAlt: 'Đội ngũ công nghệ phối hợp xây dựng một nền tảng số',
    description: 'Dành cho nền tảng nhiều tính năng, tích hợp các dịch vụ bên ngoài.',
    features: ['Website/Web App nhiều phân hệ, thiết kế UI/UX riêng', 'Quản trị nội dung, dữ liệu và quyền theo vai trò', 'SEO kỹ thuật và tối ưu hiệu suất trong phạm vi thống nhất', 'Tích hợp API với thanh toán, CRM hoặc hệ thống liên quan'],
  },
  {
    name: 'Gói 6',
    price: '50–80',
    image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=700&q=80',
    imageAlt: 'Không gian làm việc phát triển nền tảng web quy mô lớn',
    description: 'Phạm vi nâng cao cho nền tảng số cần mở rộng và vận hành lâu dài.',
    features: ['Nền tảng Website/Web App nhiều module, thiết kế theo yêu cầu', 'UI/UX đa luồng, quản trị nội dung và vận hành theo quy trình', 'SEO kỹ thuật, hiệu suất và khả năng mở rộng theo phạm vi', 'Tích hợp API, hệ thống và chức năng nâng cao theo yêu cầu'],
  },
]
const implementationLanding = computed(() => {
  if (isItemPage.value) return undefined
  if (category.value?.name === 'Dịch vụ') {
    return serviceLandingThemes[subcategory.value?.name as keyof typeof serviceLandingThemes]
  }
  if (category.value?.name === 'Tư vấn triển khai') {
    return implementationLandingThemes[subcategory.value?.name as keyof typeof implementationLandingThemes]
  }
  if (category.value?.name === 'Đào Tạo') {
    return subcategory.value
      ? trainingLandingThemes[subcategory.value.name as keyof typeof trainingLandingThemes]
      : trainingLandingThemes.overview
  }
  return undefined
})
const serviceLandingTheme = computed(() => (
  category.value?.name === 'Dịch vụ' && subcategory.value
    ? serviceLandingThemes[subcategory.value.name as keyof typeof serviceLandingThemes]
    : undefined
))
const serviceDeliveryDetail = computed(() => (
  category.value?.name === 'Dịch vụ' && subcategory.value
    ? serviceDeliveryDetails[subcategory.value.name as keyof typeof serviceDeliveryDetails]
    : undefined
))
const implementationOverviewTitle = computed(() => serviceLandingTheme.value?.overviewTitle
  || 'Công nghệ phù hợp với nhịp vận hành của bạn')
const implementationOverviewDescription = computed(() => serviceLandingTheme.value?.overviewDescription
  || 'Không áp dụng một khuôn mẫu cho mọi doanh nghiệp. Cùng làm rõ quy trình, chọn đúng phân hệ và triển khai theo thứ tự ưu tiên.')
const websiteContentPlans = [
  {
    name: 'Cơ bản',
    price: '1.500.000',
    description: 'Duy trì nội dung website gọn gàng, luôn cập nhật.',
    features: ['Viết 8 bài chuẩn SEO/tháng', 'Tối đa 4 yêu cầu cập nhật/tháng', 'Chỉnh sửa nội dung và hình ảnh có sẵn', 'Kiểm tra liên kết và biểu mẫu cơ bản', 'Báo cáo công việc cuối tháng'],
  },
  {
    name: 'Tiêu chuẩn',
    price: '4.500.000',
    description: 'Quản trị định kỳ và tối ưu nội dung các trang chính.',
    features: ['Viết 25 bài chuẩn SEO/tháng', 'Sản xuất 1 video/tháng', 'Tối đa 10 yêu cầu cập nhật/tháng', 'Tối ưu tiêu đề, mô tả và hình ảnh cơ bản', 'Kiểm tra hiển thị trên điện thoại', 'Tối đa 2 vòng chỉnh sửa/yêu cầu'],
  },
  {
    name: 'Chuyên nghiệp',
    price: '9.000.000',
    description: 'Phù hợp website thường xuyên có chiến dịch và nội dung mới.',
    features: ['Viết 50 bài chuẩn SEO/tháng', 'Sản xuất 2 video/tháng', 'Tối đa 20 yêu cầu cập nhật/tháng', 'Lên lịch nội dung và cập nhật landing page', 'Rà soát SEO on-page và liên kết nội bộ', 'Báo cáo hiệu suất và đề xuất cải thiện'],
  },
  {
    name: 'Nâng cao',
    price: '15.000.000',
    description: 'Đồng hành quản trị nội dung toàn diện cho website doanh nghiệp.',
    features: ['Viết 80 bài chuẩn SEO/tháng', 'Sản xuất 4 video/tháng', 'Tối đa 35 yêu cầu cập nhật/tháng', 'Lập kế hoạch và quản trị lịch nội dung', 'Tối ưu SEO on-page và trải nghiệm trang', 'Ưu tiên xử lý, báo cáo và họp rà soát định kỳ'],
  },
]
const websiteAnalyticsPlans = [
  {
    name: 'Cơ bản',
    price: '2.500.000',
    description: 'Nắm được các chỉ số quan trọng trên một website.',
    features: ['Thiết lập hoặc rà soát GA4 cơ bản', 'Theo dõi lượt truy cập và nguồn truy cập', '01 báo cáo tổng quan/tháng', 'Gợi ý các điểm cần cải thiện'],
  },
  {
    name: 'Tiêu chuẩn',
    price: '5.000.000',
    description: 'Theo dõi đồng bộ dữ liệu tìm kiếm và hành vi truy cập.',
    features: ['Kết nối GA4 và Google Search Console', 'Theo dõi trang đích và chuyển đổi cơ bản', '01 dashboard theo KPI thống nhất', 'Báo cáo và họp rà soát hàng tháng'],
  },
  {
    name: 'Chuyên nghiệp',
    price: '9.000.000',
    description: 'Phân tích sâu hiệu quả nội dung và hành trình khách hàng.',
    features: ['Theo dõi SEO, nguồn truy cập và chuyển đổi', 'Dashboard tùy chỉnh theo mục tiêu', 'Phân tích xu hướng và trang hoạt động nổi bật', 'Báo cáo hành động ưu tiên hàng tháng'],
  },
  {
    name: 'Nâng cao',
    price: '15.000.000',
    description: 'Báo cáo đa website và tư vấn tối ưu hiệu suất toàn diện.',
    features: ['Theo dõi tối đa 3 website hoặc landing page', 'Dashboard KPI đa kênh tùy chỉnh', 'Phân tích phễu chuyển đổi và hành vi', 'Báo cáo chuyên sâu và họp tư vấn hàng tháng'],
  },
]
const technicalSeoPlans = [
  {
    name: 'Cơ bản',
    price: '3.000.000',
    description: 'Rà soát nền tảng kỹ thuật và xử lý các lỗi SEO thiết yếu.',
    features: ['Kiểm tra crawl, index và sitemap', 'Rà soát robots.txt và lỗi 404 cơ bản', 'Kiểm tra title, meta và heading', 'Báo cáo ưu tiên khắc phục theo tháng'],
  },
  {
    name: 'Tiêu chuẩn',
    price: '6.000.000',
    description: 'Cải thiện tốc độ và khả năng hiển thị trên thiết bị di động.',
    features: ['Bao gồm toàn bộ gói Cơ bản', 'Phân tích Core Web Vitals và tốc độ tải', 'Rà soát responsive và trải nghiệm trang', 'Tối ưu liên kết nội bộ và chuyển hướng'],
  },
  {
    name: 'Chuyên nghiệp',
    price: '10.000.000',
    description: 'Tối ưu cấu trúc website và các tín hiệu tìm kiếm chuyên sâu.',
    features: ['Bao gồm toàn bộ gói Tiêu chuẩn', 'Rà soát canonical, schema và trang trùng lặp', 'Phân tích kiến trúc thông tin và độ sâu trang', 'Theo dõi lỗi kỹ thuật và báo cáo hàng tháng'],
  },
  {
    name: 'Nâng cao',
    price: '15.000.000',
    description: 'Đồng hành SEO kỹ thuật cho website lớn hoặc nhiều nhóm nội dung.',
    features: ['Bao gồm toàn bộ gói Chuyên nghiệp', 'Kiểm tra chuyên sâu website tối đa 500 URL', 'Lập lộ trình tối ưu theo mức độ ảnh hưởng', 'Theo dõi sau triển khai và họp tư vấn hàng tháng'],
  },
]
const activeWebsitePlans = computed(() => isTechnicalSeoPage.value
  ? technicalSeoPlans
  : isWebsiteAnalyticsPage.value
    ? websiteAnalyticsPlans
    : websiteContentPlans)
const pageIndex = computed(() => solutionCategories.indexOf(category.value ?? solutionCategories[0]))
const subcategoryIndex = computed(() => category.value?.subcategories.indexOf(subcategory.value!) ?? 0)
const activeImage = computed(() => isTechnicalSeoPage.value
  ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85'
  : isWebsiteAnalyticsPage.value
    ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85'
    : implementationLanding.value?.image || imageSet[(pageIndex.value * 2 + subcategoryIndex.value) % imageSet.length])
const pageTitle = computed(() => solutionItem.value || subcategory.value?.name || category.value?.name || 'Không tìm thấy giải pháp')
const detailSummary = computed(() => {
  if (!solutionItem.value || !subcategory.value) return ''
  return `${solutionItem.value} là hạng mục thuộc ${subcategory.value.name.toLowerCase()}. ${subcategory.value.description || `Phạm vi được xác định theo quy trình và mục tiêu thực tế trong nhóm ${subcategory.value.name.toLowerCase()}.`}`
})
type DetailCapability = {
  title: string
  description: string
  image?: string
  imageAlt?: string
  stage?: string
}
const detailCapabilities = computed<DetailCapability[]>(() => {
  if (isWebsiteDevelopmentPage.value) {
    return [
      {
        title: 'Khảo sát hiện trạng',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Nhóm dự án trao đổi để khảo sát hiện trạng website',
        stage: 'Khám phá nhu cầu',
        description: 'Tìm hiểu hoạt động kinh doanh, website hiện tại, đối tượng người dùng, dữ liệu và các bên liên quan.',
      },
      {
        title: 'Phân tích nghiệp vụ',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Phân tích thông tin và quy trình dự án trên bảng kế hoạch',
        stage: 'Làm rõ bài toán',
        description: 'Phân tích hành trình người dùng, quy trình nghiệp vụ, yêu cầu tích hợp và các ràng buộc kỹ thuật.',
      },
      {
        title: 'Chốt yêu cầu và phạm vi',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Các bên rà soát và thống nhất yêu cầu dự án',
        stage: 'Thống nhất phạm vi',
        description: 'Thống nhất danh sách chức năng, cấu trúc trang, nội dung, tiêu chí nghiệm thu, tiến độ và đầu mối phối hợp.',
      },
      {
        title: 'Thiết kế trải nghiệm và giao diện',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Thiết kế giao diện và trải nghiệm người dùng cho website',
        stage: 'Thiết kế UX/UI',
        description: 'Xây dựng luồng sử dụng, wireframe và giao diện; lấy ý kiến, điều chỉnh và duyệt thiết kế trước khi lập trình.',
      },
      {
        title: 'Phát triển website',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Lập trình viên phát triển website trên máy tính',
        stage: 'Lập trình',
        description: 'Xây dựng frontend, backend, quản trị nội dung và kết nối API theo thiết kế cùng phạm vi đã được duyệt.',
      },
      {
        title: 'Kiểm thử và hoàn thiện',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Đội ngũ kiểm tra chức năng website trên các thiết bị',
        stage: 'Đảm bảo chất lượng',
        description: 'Kiểm tra chức năng, dữ liệu, bảo mật cơ bản, tốc độ và hiển thị trên trình duyệt, thiết bị; xử lý lỗi trước nghiệm thu.',
      },
      {
        title: 'Nghiệm thu cùng khách hàng',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Nhóm dự án và khách hàng cùng rà soát kết quả website',
        stage: 'Xác nhận kết quả',
        description: 'Đối chiếu sản phẩm với yêu cầu và tiêu chí đã thống nhất; ghi nhận phản hồi, hoàn thiện các hạng mục trong phạm vi.',
      },
      {
        title: 'Triển khai và bàn giao',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Đội ngũ phối hợp triển khai và bàn giao website',
        stage: 'Vận hành',
        description: 'Đưa website lên môi trường thật, bàn giao tài khoản và tài liệu, hướng dẫn quản trị và thống nhất hỗ trợ sau triển khai.',
      },
    ]
  }
  if (serviceDeliveryDetail.value) {
    return [...serviceDeliveryDetail.value.scope]
  }
  return (subcategory.value?.highlights || [
    `Làm rõ yêu cầu và phạm vi cho ${solutionItem.value?.toLowerCase() || 'giải pháp'}`,
    'Kết nối dữ liệu với quy trình và hệ thống hiện có',
    'Theo dõi kết quả, tiếp nhận phản hồi và cải tiến',
  ]).map((title) => ({
    title,
    description: `Phạm vi ${solutionItem.value?.toLowerCase() || 'giải pháp'} được xác định cùng khách hàng theo mục tiêu, hiện trạng và nguồn lực thực tế.`,
  }))
})
const implementationSteps = computed(() => isWebsiteDevelopmentPage.value
  ? [
      { title: 'Khảo sát & đặc tả', description: 'Thu thập yêu cầu, thống nhất cấu trúc trang, chức năng, nội dung, tiêu chí nghiệm thu và kế hoạch thực hiện.' },
      { title: 'Thiết kế & phát triển', description: 'Duyệt prototype/giao diện trước khi lập trình; phát triển theo từng mốc và cập nhật tiến độ để khách hàng phản hồi.' },
      { title: 'Kiểm thử & bàn giao', description: 'Kiểm thử cùng khách hàng, xử lý lỗi trong phạm vi, triển khai, hướng dẫn sử dụng và bàn giao theo checklist.' },
    ]
  : serviceDeliveryDetail.value
    ? serviceDeliveryDetail.value.workflow
    : category.value?.name === 'Tư vấn triển khai'
  ? [
      { title: 'Khảo sát hiện trạng', description: 'Làm rõ quy trình, hệ thống, dữ liệu và các bên tham gia.' },
      { title: 'Lập phương án', description: 'Thống nhất phạm vi, thứ tự ưu tiên, nguồn lực và kế hoạch chuyển đổi.' },
      { title: 'Triển khai & chuyển giao', description: 'Cấu hình, kiểm thử, hướng dẫn người dùng và theo dõi vận hành.' },
    ]
  : category.value?.name === 'Sản phẩm'
    ? [
        { title: 'Xác định quy trình', description: 'Chọn nhóm người dùng, dữ liệu cần quản lý và luồng nghiệp vụ.' },
        { title: 'Cấu hình giải pháp', description: 'Thiết lập vai trò, biểu mẫu và quy tắc theo cách vận hành.' },
        { title: 'Đưa vào sử dụng', description: 'Hướng dẫn người dùng, rà soát kết quả và điều chỉnh khi cần.' },
      ]
    : [
        { title: 'Khám phá nhu cầu', description: 'Làm rõ mục tiêu, người dùng, yêu cầu kỹ thuật và phạm vi công việc.' },
        { title: 'Thiết kế & thực hiện', description: 'Xây dựng phương án, chia nhỏ giai đoạn và kiểm tra theo từng mốc.' },
        { title: 'Bàn giao & đồng hành', description: 'Chuyển giao kết quả, hướng dẫn sử dụng và tiếp nhận phản hồi.' },
      ])
const pageDescription = computed(() => {
  if (solutionItem.value) {
    return detailSummary.value
  }
  if (subcategory.value) {
    return implementationLanding.value?.description || subcategory.value.description
      || `Khám phá các hạng mục ${subcategory.value.name.toLowerCase()} được thiết kế linh hoạt, rõ phạm vi và sẵn sàng kết nối với hệ thống hiện có.`
  }
  return category.value?.description || 'Khám phá các giải pháp công nghệ được tuyển chọn để đồng hành cùng hành trình phát triển số.'
})

function contactPath(service: string, packageName?: string) {
  return { name: 'contact', query: { service, ...(packageName ? { package: packageName } : {}) } }
}

const categorySubcategoryCarouselItems = computed<CategoryCarouselItem[]>(() => {
  if (!category.value) return []
  return category.value.subcategories.map((sub, index) => {
    let img = imageSet[(pageIndex.value + index) % imageSet.length]
    if (category.value?.name === 'Đào Tạo') {
      const theme = trainingLandingThemes[sub.name as keyof typeof trainingLandingThemes]
      if (theme?.image) img = theme.image
    } else if (implementationLandingThemes[sub.name as keyof typeof implementationLandingThemes]) {
      img = implementationLandingThemes[sub.name as keyof typeof implementationLandingThemes].image
    }
    return {
      id: sub.name,
      title: sub.name,
      eyebrow: category.value?.name || 'Giải pháp',
      description: sub.description || (sub.items && sub.items[0]) || `Khám phá giải pháp ${sub.name.toLowerCase()} phù hợp với quy trình của bạn.`,
      image: img,
      imageAlt: `Hình minh họa ${sub.name}`,
      to: solutionSubcategoryPath(category.value!, sub),
      ctaText: 'Khám phá ngay',
    }
  })
})

const relatedCategoriesCarouselItems = computed<CategoryCarouselItem[]>(() => {
  return solutionCategories.map((cat, index) => ({
    id: cat.name,
    title: cat.name,
    eyebrow: 'Danh mục giải pháp',
    description: cat.description || 'Khám phá các giải pháp công nghệ chuyên sâu từ DXTechs.',
    image: cat.image || imageSet[index % imageSet.length],
    imageAlt: `Danh mục ${cat.name}`,
    to: solutionCategoryPath(cat),
    ctaText: 'Khám phá ngay',
  }))
})
</script>

<template>
  <div v-if="category && (!route.params.subcategorySlug || subcategory) && (!route.params.itemSlug || solutionItem)" class="solution-view content-wrap">
    <nav class="solution-breadcrumb" aria-label="Đường dẫn">
      <RouterLink to="/">Trang chủ</RouterLink><span>/</span>
      <RouterLink :to="solutionCategoryPath(category)">{{ category.name }}</RouterLink>
      <template v-if="subcategory"><span>/</span><RouterLink :to="solutionSubcategoryPath(category, subcategory)">{{ subcategory.name }}</RouterLink></template>
      <template v-if="solutionItem"><span>/</span><span>{{ solutionItem }}</span></template>
    </nav>

    <section
      class="solution-hero"
      :class="[
        implementationLanding ? 'solution-hero-implementation' : '',
        serviceLandingTheme ? `solution-service-${serviceLandingTheme.key}` : '',
      ]"
    >
      <div class="solution-hero-copy">
        <span class="eyebrow">DXTechs · {{ category.name }}</span>
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageDescription }}</p>
        <div class="solution-hero-actions">
          <RouterLink class="button button-primary" :to="contactPath(solutionItem || subcategory?.name || category.name)">
            Trao đổi nhu cầu <span aria-hidden="true">→</span>
          </RouterLink>
          <RouterLink v-if="!isItemPage && subcategory" class="solution-text-link" :to="solutionCategoryPath(category)">Xem tất cả {{ category.name }}</RouterLink>
          <RouterLink v-else-if="!subcategory" class="solution-text-link" to="/phan-mem">Khám phá phần mềm</RouterLink>
          <RouterLink v-else class="solution-text-link" :to="solutionSubcategoryPath(category, subcategory)">Quay lại danh mục con</RouterLink>
        </div>
        <div class="solution-hero-proof"><span>✓ Tư vấn theo nhu cầu</span><span>✓ Lộ trình rõ ràng</span><span>✓ Đồng hành triển khai</span></div>
      </div>
      <div v-if="implementationLanding" class="solution-hero-art implementation-scene" :class="`scene-${implementationLanding.key}`">
        <div class="implementation-scene-orbit implementation-scene-orbit-one"></div>
        <div class="implementation-scene-orbit implementation-scene-orbit-two"></div>
        <div class="implementation-scene-photo">
          <img :src="implementationLanding.image" :alt="`Hình ảnh lĩnh vực ${subcategory?.name}`" />
        </div>
        <div class="implementation-scene-grid" aria-hidden="true"></div>
        <div class="implementation-scene-console">
          <div class="implementation-console-top"><span><i></i> DXTECHS · {{ implementationLanding.sceneLabel }}</span><b>● LIVE</b></div>
          <strong>{{ implementationLanding.sceneTitle }}</strong>
          <div class="implementation-console-metrics">
            <div v-for="metric in implementationLanding.metrics" :key="metric.label">
              <small>{{ metric.label }}</small><b>{{ metric.value }}</b>
            </div>
          </div>
          <div class="implementation-console-activity" aria-hidden="true">
            <i v-for="height in [26, 42, 34, 57, 48, 71, 58, 84, 66, 96, 75, 88]" :key="height" :style="{ height: `${height}%` }"></i>
          </div>
        </div>
        <div class="implementation-scene-badge implementation-scene-badge-top"><span aria-hidden="true">✦</span>{{ implementationLanding.badge }}</div>
        <div class="implementation-scene-badge implementation-scene-badge-bottom"><span aria-hidden="true">✓</span>Thiết kế theo quy trình thực tế</div>
      </div>
      <div v-else class="solution-hero-art">
        <div class="solution-art-orbit solution-art-orbit-one"></div>
        <div class="solution-art-orbit solution-art-orbit-two"></div>
        <img :src="solutionItem ? activeImage : subcategory ? activeImage : category.image" :alt="`Minh họa ${pageTitle}`" />
        <div class="solution-float-card solution-float-card-top"><span>DX</span><div><b>Giải pháp số</b><small>Thiết kế để phát triển</small></div></div>
        <div class="solution-float-card solution-float-card-bottom"><span>↗</span><div><b>Vận hành hiệu quả</b><small>Linh hoạt theo quy mô</small></div></div>
      </div>
    </section>

    <section
      v-if="implementationLanding"
      class="implementation-overview"
      :class="serviceLandingTheme ? ['service-landing-overview', `overview-${serviceLandingTheme.key}`] : ''"
    >
      <div class="implementation-overview-heading">
        <span class="eyebrow">Giải pháp theo lĩnh vực</span>
        <h2>{{ implementationOverviewTitle }}</h2>
        <p>{{ implementationOverviewDescription }}</p>
      </div>
      <div class="implementation-feature-grid">
        <article v-for="(feature, index) in implementationLanding.features" :key="feature" class="implementation-feature-card">
          <span>0{{ index + 1 }}</span><p>{{ feature }}</p><i aria-hidden="true">↗</i>
        </article>
      </div>
    </section>

    <section v-if="serviceLandingTheme && serviceDeliveryDetail && !isItemPage" class="service-delivery-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Phạm vi dịch vụ</span>
          <h2>Các hạng mục được triển khai cụ thể</h2>
          <p>Phạm vi được lựa chọn theo nhu cầu và ưu tiên của doanh nghiệp; đầu ra được thống nhất trước khi bắt đầu.</p>
        </div>
      </div>
      <div class="service-scope-grid">
        <article v-for="(scope, index) in serviceDeliveryDetail.scope" :key="scope.title">
          <span class="service-scope-index">0{{ index + 1 }}</span>
          <h3>{{ scope.title }}</h3>
          <p>{{ scope.description }}</p>
        </article>
      </div>
      <div class="service-delivery-bottom">
        <div class="service-workflow">
          <span class="eyebrow">Cách phối hợp</span>
          <h3>Từ mục tiêu đến kết quả bàn giao</h3>
          <div class="service-workflow-list">
            <article v-for="(step, index) in serviceDeliveryDetail.workflow" :key="step.title">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <div><h4>{{ step.title }}</h4><p>{{ step.description }}</p></div>
            </article>
          </div>
        </div>
        <aside class="service-outcomes">
          <span class="eyebrow">Đầu ra tham khảo</span>
          <h3>Những gì doanh nghiệp nhận được</h3>
          <ul><li v-for="outcome in serviceDeliveryDetail.outcomes" :key="outcome">{{ outcome }}</li></ul>
          <div class="service-audience"><b>Phù hợp với</b><p>{{ serviceDeliveryDetail.audience }}</p></div>
          <RouterLink class="button button-primary" :to="contactPath(pageTitle)">Trao đổi phạm vi <span aria-hidden="true">→</span></RouterLink>
        </aside>
      </div>
    </section>

    <template v-if="!subcategory">
      <section class="solution-section">
        <div class="section-heading">
          <div><span class="eyebrow">Khám phá {{ category.name.toLowerCase() }}</span><h2>Chọn đúng hướng đi cho doanh nghiệp</h2><p>Mỗi nhóm giải pháp có thể bắt đầu độc lập và kết nối thành một hệ sinh thái thống nhất.</p></div>
        </div>
        <CategoryCarousel :items="categorySubcategoryCarouselItems" :default-eyebrow="category.name" />
      </section>
    </template>

    <template v-else-if="!isItemPage">
      <section class="solution-detail-intro">
        <div><span class="eyebrow">{{ implementationLanding ? 'Các phân hệ trong lĩnh vực' : 'Từ ý tưởng đến giá trị' }}</span><h2>{{ implementationLanding ? `Khám phá ${subcategory.name.toLocaleLowerCase('vi')}` : 'Giải pháp phù hợp bắt đầu từ bài toán thật' }}</h2><p>{{ implementationLanding ? `Lựa chọn các hạng mục ${subcategory.name.toLocaleLowerCase('vi')} cần ưu tiên, sau đó mở rộng theo lộ trình của doanh nghiệp.` : 'Chúng tôi chia nhỏ từng hạng mục để bạn dễ hình dung phạm vi, trao đổi yêu cầu và xây dựng lộ trình triển khai phù hợp.' }}</p></div>
        <div class="solution-detail-stats"><div><b>{{ subcategory.items.length || '01' }}</b><span>{{ subcategory.items.length ? 'hạng mục tham khảo' : 'giải pháp tư vấn' }}</span></div><div><b>360°</b><span>đồng hành triển khai</span></div></div>
      </section>
      <section v-if="category.name === 'Đào Tạo' && subcategory.focusAreas?.length" class="training-focus-section">
        <div class="training-focus-heading">
          <span class="eyebrow">Nội dung trọng tâm</span>
          <h2>Các chủ đề trong chương trình</h2>
          <p>Nội dung được điều chỉnh theo mục tiêu, vai trò công việc và bối cảnh thực tế của doanh nghiệp.</p>
        </div>
        <div class="training-focus-grid">
          <article v-for="(focus, index) in subcategory.focusAreas" :key="focus" class="training-focus-card">
            <span>0{{ index + 1 }}</span><p>{{ focus }}</p>
          </article>
        </div>
        <aside v-if="subcategory.audience" class="training-audience">
          <span aria-hidden="true">◎</span>
          <div><b>Đối tượng phù hợp</b><p>{{ subcategory.audience }}</p></div>
        </aside>
      </section>

      <!-- SERVICE PACKAGES: GÓI DỊCH VỤ FANPAGE AI -->
      <section v-if="isAiBasicPage" class="fanpage-ai-pricing-section">
        <div class="section-heading text-center">
          <div>
            <span class="eyebrow">Bảng giá dịch vụ · Tự động hóa bán hàng với AI</span>
            <h2>Gói Dịch Vụ AI Cho Fanpage &amp; Tăng Trưởng Bán Hàng</h2>
            <p>Ứng dụng trí tuệ nhân tạo thế hệ mới để tương tác khách hàng 24/7, phản hồi bình luận tức thì, tăng tỷ lệ chuyển đổi và giải phóng 80% thời gian trực page.</p>
          </div>
        </div>

        <div class="fanpage-pricing-grid">
          <article
            v-for="pkg in fanpageAiPackages"
            :key="pkg.id"
            class="fanpage-pricing-card"
            :class="{ 'is-featured': pkg.isFeatured }"
          >
            <div v-if="pkg.badge" class="fanpage-pkg-badge-wrap">
              <span class="fanpage-pkg-badge">{{ pkg.badge }}</span>
            </div>

            <div class="fanpage-pkg-header">
              <span class="eyebrow fanpage-eyebrow">Gói dịch vụ Fanpage</span>
              <h3 class="fanpage-pkg-name">{{ pkg.name }}</h3>
              <p class="fanpage-pkg-desc">{{ pkg.description }}</p>
            </div>

            <div class="fanpage-pkg-price-row">
              <strong class="fanpage-pkg-price-num">{{ pkg.price }}₫</strong>
              <span class="fanpage-pkg-price-unit">/ {{ pkg.unit }}</span>
            </div>

            <!-- Quick Highlight Badges -->
            <div class="fanpage-pkg-highlights">
              <span v-for="hl in pkg.highlights" :key="hl" class="highlight-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{{ hl }}</span>
              </span>
            </div>

            <div class="fanpage-pkg-divider"></div>

            <ul class="fanpage-pkg-features" aria-label="Danh sách tính năng và quyền lợi">
              <li v-for="feat in pkg.features" :key="feat">
                <svg class="feat-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{{ feat }}</span>
              </li>
            </ul>

            <div class="fanpage-pkg-footer">
              <RouterLink
                class="button button-wide fanpage-pkg-cta"
                :class="pkg.isFeatured ? 'button-primary' : 'button-secondary'"
                :to="contactPath(subcategory.name, pkg.name)"
              >
                <span>{{ pkg.ctaText }}</span>
                <span aria-hidden="true">→</span>
              </RouterLink>
            </div>
          </article>
        </div>

        <p class="fanpage-pricing-note">
          * Báo giá trên là chi phí triển khai và đồng hành định kỳ. Hỗ trợ kết nối miễn phí Fanpage và chuyển giao tài liệu hướng dẫn chi tiết cho đội ngũ doanh nghiệp.
        </p>
      </section>
      <div v-if="subcategory.items.length" class="solution-card-grid solution-item-grid">
        <RouterLink
          v-for="(item, index) in subcategory.items"
          :key="item"
          class="solution-card"
          :to="solutionItemPath(category, subcategory, item)"
        >
          <div class="solution-card-image"><img :src="implementationLanding ? implementationLanding.images[index % implementationLanding.images.length] : imageSet[(subcategoryIndex + index) % imageSet.length]" :alt="`Minh họa ${item}`" loading="lazy" /><span class="solution-card-index">0{{ index + 1 }}</span></div>
          <div class="solution-card-copy"><span class="eyebrow">{{ subcategory.name }}</span><h3>{{ item }}</h3><p>{{ serviceDeliveryDetail ? serviceDeliveryDetail.scope[index % serviceDeliveryDetail.scope.length].description : `${subcategory.description || `Hạng mục ${item.toLowerCase()} được xác định theo mục tiêu và hiện trạng thực tế.`} Mở trang chi tiết để xem phạm vi và cách tiếp cận.` }}</p><span class="solution-card-link">Xem chi tiết <b aria-hidden="true">↗</b></span></div>
        </RouterLink>
      </div>
      <div v-else-if="category.name !== 'Đào Tạo'" class="solution-empty-detail">
        <img :src="activeImage" :alt="`Minh họa giải pháp ${subcategory.name}`" loading="lazy" />
        <div><h2>Bắt đầu từ nhu cầu của bạn</h2><p>Chia sẻ mục tiêu, quy mô và những vướng mắc hiện tại. Đội ngũ sẽ cùng bạn làm rõ phạm vi và đề xuất hướng triển khai phù hợp.</p><RouterLink class="button button-primary" :to="contactPath(subcategory.name)">Nhận tư vấn giải pháp <span aria-hidden="true">→</span></RouterLink></div>
      </div>
      <section v-else class="training-contact-cta">
        <div><span class="eyebrow">Thiết kế theo nhu cầu</span><h2>Cùng xây dựng lộ trình đào tạo phù hợp</h2><p>Trao đổi mục tiêu, nhóm học viên và tình huống thực tế để điều chỉnh nội dung, thời lượng và hình thức triển khai.</p></div>
        <RouterLink class="button button-primary" :to="contactPath(subcategory.name)">Tư vấn chương trình <span aria-hidden="true">→</span></RouterLink>
      </section>
    </template>

    <section v-if="isWebsiteDevelopmentPage" class="website-content-pricing website-development-pricing">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Gói phát triển Website & Web App</span>
          <h2>Chọn mức ngân sách phù hợp</h2>
          <p>Sáu mức chi phí tham khảo; phạm vi và báo giá chính thức được xác nhận sau khi trao đổi yêu cầu.</p>
        </div>
      </div>
      <div class="website-development-grid">
        <article
          v-for="(plan, index) in websiteDevelopmentPackages"
          :key="plan.name"
          class="website-development-card"
          :class="{ 'website-development-card-featured': index === 2 }"
          :style="{ animationDelay: `${index * 90}ms` }"
        >
          <div class="website-development-image">
            <img :src="plan.image" :alt="plan.imageAlt" loading="lazy" />
            <span v-if="index === 2" class="website-development-badge"><span aria-hidden="true">★</span> ĐƯỢC YÊU THÍCH</span>
          </div>
          <div class="website-development-copy" :style="{ animationDelay: `${index * 90}ms` }">
            <span class="eyebrow">{{ plan.name }}</span>
            <h3 class="website-development-price-title"><strong>{{ plan.price }}</strong><span>triệu VNĐ</span></h3>
            <p>{{ plan.description }}</p>
            <ul>
              <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
            </ul>
            <RouterLink class="button button-wide website-development-cta" :to="contactPath(solutionItem!, plan.name)">
              Tư vấn gói <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </article>
      </div>
      <p class="website-plan-note">Mức giá chưa phải báo giá cuối cùng. Chi phí thực tế phụ thuộc vào tính năng, thiết kế, tích hợp và yêu cầu kỹ thuật của dự án.</p>
    </section>

    <section v-if="isWebsiteContentPage || isWebsiteAnalyticsPage || isTechnicalSeoPage" class="website-content-pricing" :class="{ 'website-analytics-pricing': isWebsiteAnalyticsPage || isTechnicalSeoPage }">
      <div class="section-heading">
        <div>
          <span class="eyebrow">{{ isTechnicalSeoPage ? 'Gói SEO kỹ thuật' : isWebsiteAnalyticsPage ? 'Gói phân tích hiệu suất' : 'Gói quản trị website' }}</span>
          <h2>{{ isTechnicalSeoPage ? 'Nền tảng kỹ thuật khỏe, trải nghiệm tìm kiếm tốt hơn' : isWebsiteAnalyticsPage ? 'Đo lường rõ ràng, tối ưu đúng trọng tâm' : 'Chọn mức đồng hành phù hợp' }}</h2>
          <p>{{ isTechnicalSeoPage ? 'Bốn cấp độ rà soát và tối ưu kỹ thuật, điều chỉnh theo quy mô website và mục tiêu tìm kiếm.' : isWebsiteAnalyticsPage ? 'Các gói tham khảo theo tháng, tùy chỉnh theo nền tảng đo lường, KPI và số lượng website.' : 'Chi phí tham khảo theo tháng, có thể điều chỉnh sau khi thống nhất khối lượng và hiện trạng website.' }}</p>
        </div>
      </div>
      <div class="website-plan-grid">
        <article v-for="(plan, index) in activeWebsitePlans" :key="plan.name" class="website-plan-card" :class="{ 'website-plan-featured': index === 2 }">
          <span v-if="index === 3" class="website-plan-badge">CAO CẤP</span>
          <span class="eyebrow">Gói {{ plan.name }}</span>
          <h3>{{ plan.name }}</h3>
          <p>{{ plan.description }}</p>
          <div class="website-plan-price"><strong>{{ plan.price }}₫</strong><span>/ tháng</span></div>
          <ul><li v-for="feature in plan.features" :key="feature">{{ feature }}</li></ul>
          <RouterLink class="button button-wide website-plan-cta" :to="contactPath(solutionItem!, plan.name)">Tư vấn gói {{ plan.name }} <span aria-hidden="true">→</span></RouterLink>
        </article>
      </div>
      <p class="website-plan-note">{{ isTechnicalSeoPage ? 'Giá tham khảo bằng VNĐ/tháng. Không cam kết thứ hạng cụ thể trên công cụ tìm kiếm; phạm vi thực hiện và quyền truy cập sẽ được thống nhất sau khi khảo sát website.' : isWebsiteAnalyticsPage ? 'Giá tham khảo bằng VNĐ/tháng. Chưa bao gồm ngân sách quảng cáo, phí công cụ trả phí hoặc triển khai các thay đổi kỹ thuật ngoài phạm vi đo lường. KPI và quyền truy cập dữ liệu sẽ được thống nhất trước khi bắt đầu.' : 'Giá tham khảo bằng VNĐ/tháng. Không bao gồm phí hosting, tên miền, quảng cáo, sản xuất hình ảnh/video hoặc phát triển tính năng mới. Khối lượng thực tế được xác nhận trước khi triển khai.' }}</p>
    </section>

    <template v-if="solutionItem && subcategory">
      <section class="solution-detail-capabilities" :class="{ 'solution-website-process': isWebsiteDevelopmentPage }">
        <div class="section-heading">
          <div>
            <span class="eyebrow">{{ isWebsiteDevelopmentPage ? 'Quy trình triển khai tham khảo' : serviceDeliveryDetail ? 'Phạm vi dịch vụ' : 'Phạm vi tham khảo' }}</span>
            <h2>{{ isWebsiteDevelopmentPage ? 'Từ yêu cầu đến bàn giao website' : 'Nội dung có thể triển khai' }}</h2>
            <p>{{ isWebsiteDevelopmentPage ? 'Các giai đoạn được thống nhất trước khi bắt đầu; mỗi mốc có đầu ra để rà soát và xác nhận.' : serviceDeliveryDetail ? `Phạm vi ${solutionItem.toLowerCase()} được chia thành các đầu việc rõ ràng, có đầu ra để cùng rà soát.` : 'Các đầu việc được thống nhất theo yêu cầu, nguồn lực và hệ thống đang sử dụng.' }}</p>
          </div>
        </div>
        <div class="solution-capability-grid" :class="{ 'solution-roadmap-grid': isWebsiteDevelopmentPage }">
          <article
            v-for="(capability, index) in detailCapabilities"
            :key="capability.title"
            :class="{ 'is-active': isWebsiteDevelopmentPage && activeRoadmapStep === index }"
            :aria-current="isWebsiteDevelopmentPage && activeRoadmapStep === index ? 'step' : undefined"
          >
            <template v-if="isWebsiteDevelopmentPage">
              <span class="solution-roadmap-node">0{{ index + 1 }}</span>
              <div class="solution-roadmap-card">
                <img :src="capability.image" :alt="capability.imageAlt" loading="lazy" />
                <div class="solution-roadmap-copy">
                  <span class="solution-roadmap-stage">{{ capability.stage }}</span>
                  <h3>{{ capability.title }}</h3>
                  <p>{{ capability.description }}</p>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="solution-capability-number">0{{ index + 1 }}</div>
              <div class="solution-capability-copy">
                <h3>{{ capability.title }}</h3>
                <p>{{ capability.description }}</p>
              </div>
            </template>
          </article>
        </div>
      </section>
      <section v-if="!isWebsiteDevelopmentPage" class="solution-process-detail">
        <div class="section-heading"><div><span class="eyebrow">{{ serviceDeliveryDetail ? 'Quy trình phối hợp' : 'Cách tiếp cận' }}</span><h2>{{ serviceDeliveryDetail ? `Cách triển khai ${solutionItem.toLowerCase()}` : 'Triển khai theo từng bước rõ ràng' }}</h2><p v-if="serviceDeliveryDetail">Các mốc được điều chỉnh theo phạm vi cụ thể; kết quả từng bước được thống nhất cùng doanh nghiệp.</p></div></div>
        <div class="solution-process-grid">
          <article v-for="(step, index) in implementationSteps" :key="step.title">
            <span class="solution-process-number">0{{ index + 1 }}</span><div><h3>{{ step.title }}</h3><p>{{ step.description }}</p></div>
          </article>
        </div>
      </section>
      <section v-if="subcategory.items.length > 1" class="solution-sibling-pages">
        <div class="solution-sibling-heading">
          <div class="section-heading"><div><span class="eyebrow">Cùng danh mục</span><h2>Khám phá các hạng mục liên quan</h2></div></div>
          <div class="solution-sibling-controls" aria-label="Điều hướng hạng mục liên quan">
            <button type="button" aria-label="Trượt sang trái" @click="scrollRelated(-1)">‹</button>
            <button type="button" aria-label="Trượt sang phải" @click="scrollRelated(1)">›</button>
          </div>
        </div>
        <div ref="relatedTrack" class="solution-related-links solution-sibling-track" aria-label="Các hạng mục cùng danh mục">
          <RouterLink
            v-for="item in subcategory.items.filter((item) => item !== solutionItem)"
            :key="item"
            :to="solutionItemPath(category, subcategory, item)"
          ><span>{{ item }}</span><span aria-hidden="true">↗</span></RouterLink>
        </div>
      </section>
    </template>

    <section class="solution-related">
      <div class="section-heading"><div><span class="eyebrow">Kết nối giải pháp</span><h2>Tiếp tục khám phá</h2></div><RouterLink class="text-link" to="/lien-he">Liên hệ DXtechs <span>→</span></RouterLink></div>
      <CategoryCarousel :items="relatedCategoriesCarouselItems" default-eyebrow="Danh mục giải pháp" />
      <div class="solution-related-links" style="margin-top: 16px;">
        <RouterLink to="/phan-mem">Phần mềm <span aria-hidden="true">↗</span></RouterLink>
        <RouterLink to="/du-an">Dự Án <span aria-hidden="true">↗</span></RouterLink>
        <RouterLink to="/tai-nguyen">Tài Nguyên <span aria-hidden="true">↗</span></RouterLink>
      </div>
    </section>
  </div>
  <div v-else class="content-wrap solution-not-found">
    <PageIntro eyebrow="Giải pháp DXTechs" title="Không tìm thấy danh mục" description="Danh mục này không tồn tại hoặc đường dẫn đã thay đổi. Hãy chọn một nhóm giải pháp bên dưới." />
    <div class="solution-related-links"><RouterLink v-for="item in solutionCategories" :key="item.name" :to="solutionCategoryPath(item)">{{ item.name }} <span aria-hidden="true">→</span></RouterLink></div>
  </div>
</template>
