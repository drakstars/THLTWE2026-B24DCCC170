import React from 'react';
import { Modal, Table, Button, Tag, Divider, Descriptions, Badge } from 'antd';
import { DeThi, MonHoc, KhoiKienThuc, getMucDoKhoLabel, getMucDoKhoColor } from '@/models/nganhangcauhoi';

interface ViewDeThiModalProps {
  visible: boolean;
  deThi: DeThi | null;
  monHocList: MonHoc[];
  khoiKienThucList: KhoiKienThuc[];
  onClose: () => void;
}

const ViewDeThiModal: React.FC<ViewDeThiModalProps> = ({
  visible,
  deThi,
  monHocList,
  khoiKienThucList,
  onClose,
}) => {
  const getMonHocName = (monHocId: string) =>
    monHocList.find(item => item.id === monHocId)?.tenMonHoc || 'N/A';
  const getKhoiKienThucName = (khoiKienThucId: string) =>
    khoiKienThucList.find(item => item.id === khoiKienThucId)?.tenKhoiKienThuc || 'N/A';

  const questionColumns = [
    { title: 'Câu', dataIndex: 'thuTu', key: 'thuTu', width: 60, align: 'center' as const },
    { title: 'Mã câu hỏi', dataIndex: ['cauHoi', 'maCauHoi'], key: 'maCauHoi', width: 120 },
    { title: 'Nội dung', dataIndex: ['cauHoi', 'noiDung'], key: 'noiDung', ellipsis: true },
    {
      title: 'Khối kiến thức',
      dataIndex: ['cauHoi', 'khoiKienThucId'],
      key: 'khoiKienThucId',
      width: 150,
      render: (khoiKienThucId: string) => getKhoiKienThucName(khoiKienThucId),
    },
    {
      title: 'Mức độ',
      dataIndex: ['cauHoi', 'mucDoKho'],
      key: 'mucDoKho',
      width: 120,
      render: (mucDoKho: string) => (
        <Tag color={getMucDoKhoColor(mucDoKho as any)}>{getMucDoKhoLabel(mucDoKho as any)}</Tag>
      ),
    },
    { title: 'Điểm', dataIndex: 'diem', key: 'diem', width: 80, align: 'center' as const },
  ];

  return (
    <Modal
      title="Chi tiết đề thi"
      visible={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      {deThi && (
        <div>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã đề thi">{deThi.maDeThi}</Descriptions.Item>
            <Descriptions.Item label="Tên đề thi">{deThi.tenDeThi}</Descriptions.Item>
            <Descriptions.Item label="Môn học">{getMonHocName(deThi.monHocId)}</Descriptions.Item>
            <Descriptions.Item label="Tổng số câu">
              <Badge count={deThi.tongSoCau} showZero />
            </Descriptions.Item>
            <Descriptions.Item label="Tổng điểm">
              <Tag color="blue">{deThi.tongDiem} điểm</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian làm bài">
              {deThi.thoiGianLamBai} phút
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo" span={2}>
              {deThi.ngayTao ? new Date(deThi.ngayTao).toLocaleString('vi-VN') : 'N/A'}
            </Descriptions.Item>
            {deThi.ghiChu && (
              <Descriptions.Item label="Ghi chú" span={2}>
                {deThi.ghiChu}
              </Descriptions.Item>
            )}
          </Descriptions>

          <Divider>Danh sách câu hỏi</Divider>
          <Table
            dataSource={deThi.danhSachCauHoi}
            rowKey="cauHoiId"
            pagination={false}
            scroll={{ y: 400 }}
            columns={questionColumns}
          />
        </div>
      )}
    </Modal>
  );
};

export default ViewDeThiModal;
