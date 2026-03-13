import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CauHoi, MonHoc, KhoiKienThuc, getMucDoKhoLabel, getMucDoKhoColor } from '@/models/nganhangcauhoi';

interface CauHoiTableProps {
  data: CauHoi[];
  loading: boolean;
  monHocList: MonHoc[];
  khoiKienThucList: KhoiKienThuc[];
  onEdit: (record: CauHoi) => void;
  onDelete: (record: CauHoi) => void;
}

const CauHoiTable: React.FC<CauHoiTableProps> = ({
  data,
  loading,
  monHocList,
  khoiKienThucList,
  onEdit,
  onDelete,
}) => {
  const getMonHocName = (monHocId: string) =>
    monHocList.find(item => item.id === monHocId)?.tenMonHoc || 'N/A';
  const getKhoiKienThucName = (khoiKienThucId: string) =>
    khoiKienThucList.find(item => item.id === khoiKienThucId)?.tenKhoiKienThuc || 'N/A';

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Mã câu hỏi', dataIndex: 'maCauHoi', key: 'maCauHoi', width: 120 },
    {
      title: 'Môn học',
      dataIndex: 'monHocId',
      key: 'monHocId',
      width: 150,
      render: (monHocId: string) => getMonHocName(monHocId),
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'khoiKienThucId',
      key: 'khoiKienThucId',
      width: 150,
      render: (khoiKienThucId: string) => getKhoiKienThucName(khoiKienThucId),
    },
    { title: 'Nội dung câu hỏi', dataIndex: 'noiDung', key: 'noiDung', ellipsis: true },
    {
      title: 'Mức độ khó',
      dataIndex: 'mucDoKho',
      key: 'mucDoKho',
      width: 120,
      align: 'center' as const,
      render: (mucDoKho: string) => (
        <Tag color={getMucDoKhoColor(mucDoKho as any)}>{getMucDoKhoLabel(mucDoKho as any)}</Tag>
      ),
    },
    { title: 'Điểm', dataIndex: 'diemToiDa', key: 'diemToiDa', width: 80, align: 'center' as const },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: CauHoi) => (
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
      scroll={{ x: 1200 }}
      pagination={{ showSizeChanger: true, showTotal: (total) => `Tổng số ${total} câu hỏi` }}
    />
  );
};

export default CauHoiTable;
