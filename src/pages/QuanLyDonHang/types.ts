import { Moment } from 'moment';

export type OrderStatus = 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Hủy';

export interface Customer {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
}

export interface OrderFormSubmitValue {
  id: string;
  customerId: string;
  status: OrderStatus;
  orderDate: Moment;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
