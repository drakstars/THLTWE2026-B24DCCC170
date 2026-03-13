import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MonHoc } from '@/models/nganhangcauhoi';

interface MonHocTableProps {
  data: MonHoc[];
  loading: boolean;
  onEdit: (record: MonHoc) => void;
  onDelete: (record: MonHoc) => void;
}

const MonHocTable: React.FC<MonHocTableProps> = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Mã môn học', dataIndex: 'maMonHoc', key: 'maMonHoc', width: 120 },
    { title: 'Tên môn học', dataIndex: 'tenMonHoc', key: 'tenMonHoc' },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      key: 'soTinChi',
      width: 100,
      align: 'center' as const,
      render: (soTinChi: number) => <Tag color="blue">{soTinChi} TC</Tag>,
    },
    { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', ellipsis: true },
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
      render: (_: any, record: MonHoc) => (
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

export default MonHocTable;
