import { Customer, Order, Product } from './types';

export const ORDER_STATUS_OPTIONS = ['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Hủy'] as const;

export const CUSTOMERS: Customer[] = [
  { id: 'KH001', name: 'Nguyễn Văn An' },
  { id: 'KH002', name: 'Trần Thị Bình' },
  { id: 'KH003', name: 'Lê Minh Châu' },
  { id: 'KH004', name: 'Phạm Gia Hân' },
  { id: 'KH005', name: 'Hoàng Quốc Duy' },
];

export const PRODUCTS: Product[] = [
  { id: 'SP001', name: 'Áo sơ mi trắng', price: 350000 },
  { id: 'SP002', name: 'Quần jean xanh', price: 550000 },
  { id: 'SP003', name: 'Giày sneaker', price: 1250000 },
  { id: 'SP004', name: 'Túi xách da', price: 1750000 },
  { id: 'SP005', name: 'Nón lưỡi trai', price: 180000 },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'DH001',
    customerId: 'KH001',
    customerName: 'Nguyễn Văn An',
    orderDate: '2026-04-10T08:30:00',
    totalAmount: 1600000,
    status: 'Chờ xác nhận',
    items: [
      { productId: 'SP001', productName: 'Áo sơ mi trắng', quantity: 1, unitPrice: 350000 },
      { productId: 'SP003', productName: 'Giày sneaker', quantity: 1, unitPrice: 1250000 },
    ],
  },
  {
    id: 'DH002',
    customerId: 'KH003',
    customerName: 'Lê Minh Châu',
    orderDate: '2026-04-12T14:20:00',
    totalAmount: 1100000,
    status: 'Đang giao',
    items: [
      { productId: 'SP002', productName: 'Quần jean xanh', quantity: 2, unitPrice: 550000 },
    ],
  },
];
