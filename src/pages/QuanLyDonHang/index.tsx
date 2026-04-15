import React, { useMemo, useState } from 'react';
import { Card, Modal, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import { CUSTOMERS, INITIAL_ORDERS, PRODUCTS } from './data';
import OrderFilters from './components/OrderFilters';
import OrderFormModal from './components/OrderFormModal';
import OrderTable from './components/OrderTable';
import { Order, OrderFormSubmitValue } from './types';

const STORAGE_KEY = 'quan_ly_don_hang_data';

const readInitialOrders = (): Order[] => {
  if (typeof window === 'undefined') {
    return INITIAL_ORDERS;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return INITIAL_ORDERS;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return INITIAL_ORDERS;
    }
    return parsed;
  } catch {
    return INITIAL_ORDERS;
  }
};

const QuanLyDonHang: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(readInitialOrders);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    const byFilter = orders.filter((order) => {
      const isMatchKeyword =
        !keyword ||
        order.id.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword);

      const isMatchStatus = !statusFilter || order.status === statusFilter;

      return isMatchKeyword && isMatchStatus;
    });

    const sorted = [...byFilter];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return moment(a.orderDate).valueOf() - moment(b.orderDate).valueOf();
        case 'total_desc':
          return b.totalAmount - a.totalAmount;
        case 'total_asc':
          return a.totalAmount - b.totalAmount;
        case 'date_desc':
        default:
          return moment(b.orderDate).valueOf() - moment(a.orderDate).valueOf();
      }
    });

    return sorted;
  }, [orders, searchText, sortBy, statusFilter]);

  const persistOrders = (nextOrders: Order[]) => {
    setOrders(nextOrders);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
    }
  };

  const openCreateModal = () => {
    setEditingOrder(null);
    setIsModalVisible(true);
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingOrder(null);
  };

  const handleSubmitOrder = (payload: OrderFormSubmitValue) => {
    const duplicatedOrder = orders.find(
      (order) =>
        order.id.toLowerCase() === payload.id.trim().toLowerCase() &&
        (!editingOrder || order.id !== editingOrder.id),
    );

    if (duplicatedOrder) {
      message.error('Mã đơn hàng đã tồn tại.');
      return;
    }

    const customer = CUSTOMERS.find((item) => item.id === payload.customerId);
    if (!customer) {
      message.error('Khách hàng không hợp lệ.');
      return;
    }

    const items = payload.items.map((item) => {
      const product = PRODUCTS.find((productRow) => productRow.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || '',
        quantity: item.quantity,
        unitPrice: product?.price || 0,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    if (editingOrder && payload.status === 'Hủy' && editingOrder.status !== 'Chờ xác nhận') {
      message.error('Chỉ có thể hủy đơn khi trạng thái hiện tại là Chờ xác nhận.');
      return;
    }

    const nextOrder: Order = {
      id: payload.id.trim(),
      customerId: payload.customerId,
      customerName: customer.name,
      orderDate: payload.orderDate.toISOString(),
      totalAmount,
      status: payload.status,
      items,
    };

    if (!editingOrder) {
      persistOrders([nextOrder, ...orders]);
      message.success('Thêm đơn hàng thành công.');
    } else {
      persistOrders(orders.map((item) => (item.id === editingOrder.id ? nextOrder : item)));
      message.success('Cập nhật đơn hàng thành công.');
    }

    closeModal();
  };

  const handleCancelOrder = (order: Order) => {
    if (order.status !== 'Chờ xác nhận') {
      message.warning('Chỉ được hủy đơn hàng ở trạng thái Chờ xác nhận.');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: `Bạn sắp hủy đơn ${order.id}. Thao tác này không thể hoàn tác.`,
      okText: 'Hủy đơn',
      okButtonProps: { danger: true },
      cancelText: 'Đóng',
      onOk: () => {
        const nextOrders = orders.map((item) => {
          if (item.id !== order.id) {
            return item;
          }
          return {
            ...item,
            status: 'Hủy' as const,
          };
        });
        persistOrders(nextOrders);
        message.success(`Đã hủy đơn hàng ${order.id}.`);
      },
    });
  };

  return (
    <PageContainer
      title="Quản Lý Đơn Hàng"
      subTitle="Tìm kiếm, lọc, sắp xếp, thêm, chỉnh sửa và hủy đơn hàng theo điều kiện"
    >
      <Card style={{ marginBottom: 16 }}>
        <OrderFilters
          searchText={searchText}
          statusFilter={statusFilter}
          sortBy={sortBy}
          onSearchTextChange={setSearchText}
          onStatusFilterChange={setStatusFilter}
          onSortChange={setSortBy}
          onCreate={openCreateModal}
        />
      </Card>

      <OrderTable orders={filteredOrders} onEdit={openEditModal} onCancelOrder={handleCancelOrder} />

      <OrderFormModal
        visible={isModalVisible}
        customers={CUSTOMERS}
        products={PRODUCTS}
        editingOrder={editingOrder}
        existingOrderIds={orders.map((item) => item.id)}
        onCancel={closeModal}
        onSubmit={handleSubmitOrder}
      />
    </PageContainer>
  );
};

export default QuanLyDonHang;
