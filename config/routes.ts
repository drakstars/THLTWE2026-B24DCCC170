export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/quan-ly-san-pham',
		name: 'QuanLySanPham',
		icon: 'ShoppingOutlined',
		component: './QuanLySanPham',
	},
	{
		path: '/tro-choi/doan-so',
		name: 'TroChoiDoanSo',
		icon: 'SmileOutlined',
		component: './TroChoiDoanSo',
	},
	{
		path: '/tro-choi/oan-tu-ti',
		name: 'OanTuTi',
		icon: 'ScissorOutlined',
		component: './OanTuTi',
	},
	{
		path: '/quan-ly-hoc-tap',
		name: 'QuanLyHocTap',
		icon: 'BookOutlined',
		component: './QuanLyHocTap',
	},
	{
		name: 'NganHangCauHoi',
		path: '/ngan-hang-cau-hoi',
		icon: 'DatabaseOutlined',
		routes: [
			{
				path: '/ngan-hang-cau-hoi/khoi-kien-thuc',
				name: 'KhoiKienThuc',
				component: './NganHangCauHoi/KhoiKienThuc',
			},
			{
				path: '/ngan-hang-cau-hoi/mon-hoc',
				name: 'MonHoc',
				component: './NganHangCauHoi/MonHoc',
			},
			{
				path: '/ngan-hang-cau-hoi/cau-hoi',
				name: 'CauHoi',
				component: './NganHangCauHoi/CauHoi',
			},
			{
				path: '/ngan-hang-cau-hoi/de-thi',
				name: 'DeThi',
				component: './NganHangCauHoi/DeThi',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
