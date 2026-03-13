import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { DeThi, MonHoc } from '@/models/nganhangcauhoi';

interface DeThiTableProps {
  data: DeThi[];
  loading: boolean;
  monHocList: MonHoc[];
  onView: (record: DeThi) => void;
  onDelete: (record: DeThi) => void;
}

const DeThiTable: React.FC<DeThiTableProps> = ({ data, loading, monHocList, onView, onDelete }) => {
  const getMonHocName = (monHocId: string) =>
    monHocList.find(item => item.id === monHocId)?.tenMonHoc || 'N/A';

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Mã đề thi', dataIndex: 'maDeThi', key: 'maDeThi', width: 120 },
    { title: 'Tên đề thi', dataIndex: 'tenDeThi', key: 'tenDeThi' },
    {
      title: 'Môn học',
      dataIndex: 'monHocId',
      key: 'monHocId',
      width: 150,
      render: (monHocId: string) => getMonHocName(monHocId),
    },
    { title: 'Số câu', dataIndex: 'tongSoCau', key: 'tongSoCau', width: 80, align: 'center' as const },
    {
      title: 'Tổng điểm',
      dataIndex: 'tongDiem',
      key: 'tongDiem',
      width: 100,
      align: 'center' as const,
      render: (diem: number) => <Tag color="blue">{diem} điểm</Tag>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoiGianLamBai',
      key: 'thoiGianLamBai',
      width: 100,
      align: 'center' as const,
      render: (time: number) => (time ? `${time} phút` : 'N/A'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      width: 120,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: DeThi) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => onView(record)}>
            Xem
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
      scroll={{ x: 1200 }}
      pagination={{ showSizeChanger: true, showTotal: (total) => `Tổng số ${total} đề thi` }}
    />
  );
};

export default DeThiTable;
