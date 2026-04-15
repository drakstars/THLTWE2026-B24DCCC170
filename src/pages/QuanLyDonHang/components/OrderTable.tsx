import React from 'react';
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { EditOutlined, StopOutlined } from '@ant-design/icons';
import { Order, OrderStatus } from '../types';

interface Props {
  orders: Order[];
  onEdit: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
}

const colorMap: Record<OrderStatus, string> = {
  'Chờ xác nhận': 'gold',
  'Đang giao': 'processing',
  'Hoàn thành': 'success',
  'Hủy': 'error',
};

const OrderTable: React.FC<Props> = ({ orders, onEdit, onCancelOrder }) => {
  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 140,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 180,
      render: (value: string) => moment(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right',
      width: 170,
      render: (value: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 160,
      render: (status: OrderStatus) => <Tag color={colorMap[status]}>{status}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 220,
      align: 'center',
      render: (_, record) => {
        const canCancel = record.status === 'Chờ xác nhận';

        return (
          <Space>
            <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Xác nhận hủy đơn hàng"
              description="Bạn có chắc chắn muốn hủy đơn hàng này?"
              okText="Hủy đơn"
              cancelText="Đóng"
              onConfirm={() => onCancelOrder(record)}
              disabled={!canCancel}
            >
              <Tooltip title={canCancel ? 'Hủy đơn hàng' : 'Chỉ hủy khi trạng thái là Chờ xác nhận'}>
                <Button type="link" danger icon={<StopOutlined />} disabled={!canCancel}>
                  Hủy đơn
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Table<Order>
      rowKey="id"
      columns={columns}
      dataSource={orders}
      bordered
      pagination={{
        pageSize: 8,
        showTotal: (total) => `Tổng số: ${total} đơn hàng`,
      }}
    />
  );
};

export default OrderTable;
