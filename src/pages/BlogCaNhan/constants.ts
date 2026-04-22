import { AuthorProfile, BlogPost, BlogTag } from './types';

export const BLOG_STORE_KEY = 'blog-ca-nhan-store';

export const DEFAULT_AUTHOR: AuthorProfile = {
	name: 'Nguyễn Văn Admin',
	avatar:
		'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
	bio: 'Lập trình viên frontend yêu thích xây dựng sản phẩm web với trải nghiệm tốt và nội dung hữu ích.',
	skills: ['React', 'TypeScript', 'Ant Design', 'Node.js', 'Viết nội dung'],
	socials: [
		{ name: 'GitHub', url: 'https://github.com/' },
		{ name: 'LinkedIn', url: 'https://www.linkedin.com/' },
		{ name: 'Facebook', url: 'https://www.facebook.com/' },
	],
};

export const DEFAULT_TAGS: BlogTag[] = [
	{ id: 'react', name: 'React' },
	{ id: 'typescript', name: 'TypeScript' },
	{ id: 'career', name: 'Sự nghiệp' },
	{ id: 'learning', name: 'Học tập' },
	{ id: 'lifestyle', name: 'Lối sống' },
	{ id: 'productivity', name: 'Năng suất' },
];

export const DEFAULT_POSTS: BlogPost[] = [
	{
		id: 'post-1',
		title: 'Bắt đầu với React và TypeScript',
		slug: 'bat-dau-voi-react-va-typescript',
		summary: 'Hướng dẫn nhanh để khởi tạo dự án React với TypeScript cho người mới.',
		content:
			"# Bắt đầu với React + TypeScript\n\nTypeScript giúp dự án React an toàn hơn và dễ bảo trì hơn.\n\n## 1. Cài đặt\n\n- Tạo dự án mới với mẫu TypeScript\n- Cấu hình eslint và prettier\n\n## 2. Tổ chức thư mục\n\nNên tách `components`, `pages`, `services` rõ ràng ngay từ đầu.\n\n## 3. Kết luận\n\nHãy bắt đầu từ nhỏ, sau đó mở rộng dần.",
		coverImage:
			'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
		tags: ['react', 'typescript', 'learning'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-01-10T09:00:00.000Z',
		updatedAt: '2026-01-10T09:00:00.000Z',
	},
	{
		id: 'post-2',
		title: '5 mẹo quản lý thời gian cho lập trình viên',
		slug: '5-meo-quan-ly-thoi-gian-cho-lap-trinh-vien',
		summary: 'Tổng hợp các mẹo thực tế để làm việc hiệu quả hơn mỗi ngày.',
		content:
			"# 5 mẹo quản lý thời gian\n\n## Pomodoro\n\nLàm việc 25 phút, nghỉ 5 phút.\n\n## Chốt 3 mục tiêu quan trọng\n\nMỗi ngày chỉ đặt 3 việc quan trọng nhất.\n\n## Giảm xao nhãng\n\nTắt thông báo không cần thiết khi cần tập trung.",
		coverImage:
			'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
		tags: ['productivity', 'career', 'lifestyle'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-02-05T14:20:00.000Z',
		updatedAt: '2026-02-05T14:20:00.000Z',
	},
	{
		id: 'post-3',
		title: 'Nhật ký học lập trình 30 ngày',
		slug: 'nhat-ky-hoc-lap-trinh-30-ngay',
		summary: 'Cách tôi đặt mục tiêu và theo dõi tiến độ học lập trình trong 30 ngày.',
		content:
			"# Nhật ký học lập trình 30 ngày\n\nĐây là hành trình học mỗi ngày và tổng kết hằng tuần.\n\n- Ngày 1-7: Cú pháp cơ bản\n- Ngày 8-20: Làm dự án nhỏ\n- Ngày 21-30: Refactor và viết tài liệu",
		coverImage:
			'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
		tags: ['learning', 'career'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-03-01T08:00:00.000Z',
		updatedAt: '2026-03-02T08:00:00.000Z',
	},
	{
		id: 'post-4',
		title: 'Checklist tạo CV cho lập trình viên mới ra trường',
		slug: 'checklist-tao-cv-cho-lap-trinh-vien-moi-ra-truong',
		summary: 'Những mục quan trọng giúp CV rõ ràng, đúng trọng tâm và tăng cơ hội phỏng vấn.',
		content:
			"# Checklist tạo CV cho lập trình viên\n\n## 1. Phần mở đầu ngắn gọn\n\nNêu rõ mục tiêu nghề nghiệp trong 2-3 dòng.\n\n## 2. Dự án nổi bật\n\n- Mô tả vai trò\n- Công nghệ sử dụng\n- Kết quả đạt được\n\n## 3. Kỹ năng\n\nƯu tiên kỹ năng có thể chứng minh qua dự án.",
		coverImage:
			'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
		tags: ['career', 'productivity'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-03-07T10:10:00.000Z',
		updatedAt: '2026-03-07T10:10:00.000Z',
	},
	{
		id: 'post-5',
		title: 'Cách đọc tài liệu kỹ thuật không bị ngợp',
		slug: 'cach-doc-tai-lieu-ky-thuat-khong-bi-ngop',
		summary: 'Phương pháp chia nhỏ tài liệu để học nhanh và áp dụng ngay vào dự án.',
		content:
			"# Cách đọc tài liệu kỹ thuật\n\n## Đặt mục tiêu trước khi đọc\n\nXác định rõ bạn cần gì: cài đặt, API hay best practices.\n\n## Vừa đọc vừa thử\n\nĐọc xong một phần nhỏ thì chạy thử ngay.\n\n## Ghi chú ngắn\n\nTự tạo ghi chú 1 trang giúp nhớ lâu hơn.",
		coverImage:
			'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
		tags: ['learning', 'productivity'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-03-12T09:00:00.000Z',
		updatedAt: '2026-03-12T09:00:00.000Z',
	},
	{
		id: 'post-6',
		title: 'Tối ưu hiệu năng React bằng memo đúng cách',
		slug: 'toi-uu-hieu-nang-react-bang-memo-dung-cach',
		summary: 'Khi nào nên dùng React.memo, useMemo, useCallback và khi nào không nên.',
		content:
			"# Tối ưu hiệu năng React\n\n## Đừng tối ưu sớm\n\nHãy đo trước khi tối ưu.\n\n## React.memo\n\nDùng khi component render nhiều và props ít thay đổi.\n\n## useMemo và useCallback\n\nDùng cho phép tính nặng hoặc dependency ổn định.",
		coverImage:
			'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80',
		tags: ['react', 'learning'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-03-18T13:30:00.000Z',
		updatedAt: '2026-03-18T13:30:00.000Z',
	},
	{
		id: 'post-7',
		title: 'Thiết kế thói quen học mỗi ngày trong 20 phút',
		slug: 'thiet-ke-thoi-quen-hoc-moi-ngay-trong-20-phut',
		summary: 'Bí quyết duy trì nhịp học đều đặn cho người đi làm bận rộn.',
		content:
			"# Thói quen học mỗi ngày\n\n## Bắt đầu từ mức nhỏ\n\n20 phút một ngày là đủ để tiến bộ.\n\n## Gắn với một mốc cố định\n\nVí dụ: học ngay sau bữa tối.\n\n## Theo dõi chuỗi ngày\n\nĐánh dấu lịch để giữ động lực.",
		coverImage:
			'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
		tags: ['learning', 'lifestyle'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-03-24T07:45:00.000Z',
		updatedAt: '2026-03-24T07:45:00.000Z',
	},
	{
		id: 'post-8',
		title: 'Roadmap frontend 2026 cho người tự học',
		slug: 'roadmap-frontend-2026-cho-nguoi-tu-hoc',
		summary: 'Lộ trình rõ ràng từ HTML/CSS đến React, testing và deploy sản phẩm thực tế.',
		content:
			"# Roadmap frontend 2026\n\n- Giai đoạn 1: HTML, CSS, JavaScript\n- Giai đoạn 2: TypeScript và React\n- Giai đoạn 3: State management và testing\n- Giai đoạn 4: Deploy và tối ưu hiệu năng\n\nLuôn gắn việc học với dự án thật.",
		coverImage:
			'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
		tags: ['learning', 'career', 'typescript'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-03-28T11:15:00.000Z',
		updatedAt: '2026-03-28T11:15:00.000Z',
	},
	{
		id: 'post-9',
		title: 'Tại sao nên viết tài liệu cho dự án cá nhân',
		slug: 'tai-sao-nen-viet-tai-lieu-cho-du-an-ca-nhan',
		summary: 'Tài liệu tốt giúp bạn hiểu code lâu dài và gây ấn tượng khi đi phỏng vấn.',
		content:
			"# Viết tài liệu cho dự án cá nhân\n\n## Lợi ích\n\n- Dễ onboarding lại dự án\n- Dễ chia sẻ với đồng đội\n- Tăng độ chuyên nghiệp\n\n## Nên có gì trong README\n\n- Mục tiêu dự án\n- Cách chạy\n- Cấu trúc chính",
		coverImage:
			'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
		tags: ['productivity', 'career'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-04-01T08:20:00.000Z',
		updatedAt: '2026-04-01T08:20:00.000Z',
	},
	{
		id: 'post-10',
		title: 'Thiết lập workspace VS Code cho dự án React',
		slug: 'thiet-lap-workspace-vs-code-cho-du-an-react',
		summary: 'Bộ extension và cấu hình giúp tăng tốc độ code và giảm lỗi phổ biến.',
		content:
			"# Thiết lập workspace VS Code\n\n## Extension nên có\n\n- ESLint\n- Prettier\n- Error Lens\n\n## Settings quan trọng\n\nBật format on save và lint on save để code luôn nhất quán.",
		coverImage:
			'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
		tags: ['react', 'productivity'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-04-05T15:40:00.000Z',
		updatedAt: '2026-04-05T15:40:00.000Z',
	},
	{
		id: 'post-11',
		title: 'Cách review pull request hiệu quả cho team nhỏ',
		slug: 'cach-review-pull-request-hieu-qua-cho-team-nho',
		summary: 'Một checklist ngắn giúp review nhanh, đúng trọng tâm và tôn trọng đồng đội.',
		content:
			"# Review pull request hiệu quả\n\n## Ưu tiên điều gì\n\n- Logic đúng\n- Ảnh hưởng đến bảo mật\n- Khả năng bảo trì\n\n## Cách góp ý\n\nNêu vấn đề, giải thích lý do và gợi ý cách sửa cụ thể.",
		coverImage:
			'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
		tags: ['career', 'productivity'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-04-10T09:30:00.000Z',
		updatedAt: '2026-04-10T09:30:00.000Z',
	},
	{
		id: 'post-12',
		title: 'Cân bằng công việc và cuộc sống của lập trình viên',
		slug: 'can-bang-cong-viec-va-cuoc-song-cua-lap-trinh-vien',
		summary: 'Những thói quen nhỏ giúp duy trì năng lượng và tránh kiệt sức khi làm dự án dài hạn.',
		content:
			"# Cân bằng công việc và cuộc sống\n\n## Đặt ranh giới rõ ràng\n\nTách thời gian làm việc và nghỉ ngơi.\n\n## Vận động nhẹ mỗi ngày\n\nĐi bộ 20-30 phút giúp đầu óc tỉnh táo hơn.\n\n## Tái tạo năng lượng\n\nDành thời gian cho gia đình, bạn bè và sở thích cá nhân.",
		coverImage:
			'https://images.unsplash.com/photo-1470163395405-d2b80e7450ed?auto=format&fit=crop&w=1200&q=80',
		tags: ['lifestyle', 'career'],
		status: 'published',
		author: 'Nguyễn Văn Admin',
		createdAt: '2026-04-15T18:00:00.000Z',
		updatedAt: '2026-04-15T18:00:00.000Z',
	},
];
