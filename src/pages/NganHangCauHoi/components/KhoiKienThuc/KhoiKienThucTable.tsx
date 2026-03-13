import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { KhoiKienThuc } from '@/models/nganhangcauhoi';

interface KhoiKienThucTableProps {
  data: KhoiKienThuc[];
  loading: boolean;
  onEdit: (record: KhoiKienThuc) => void;
  onDelete: (record: KhoiKienThuc) => void;
}

const KhoiKienThucTable: React.FC<KhoiKienThucTableProps> = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Mã khối kiến thức', dataIndex: 'maKhoiKienThuc', key: 'maKhoiKienThuc', width: 150 },
    { title: 'Tên khối kiến thức', dataIndex: 'tenKhoiKienThuc', key: 'tenKhoiKienThuc' },
    { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', ellipsis: true },
    { title: 'Thứ tự', dataIndex: 'thuTu', key: 'thuTu', width: 80, align: 'center' as const },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      align: 'center' as const,
      render: (trangThai: boolean) => (
        <Tag color={trangThai ? 'success' : 'error'}>{trangThai ? 'Hoạt động' : 'Ngưng'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: KhoiKienThuc) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => onDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{ showSizeChanger: true, showTotal: (total) => `Tổng số ${total} bản ghi` }}
    />
  );
};

export default KhoiKienThucTable;
