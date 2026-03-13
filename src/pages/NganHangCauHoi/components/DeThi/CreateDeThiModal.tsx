import React from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Row,
  Col,
  Card,
  Divider,
  Alert,
} from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import {
  MonHoc,
  KhoiKienThuc,
  CauTrucDeThi,
  CauTrucChiTiet,
  MUC_DO_KHO_OPTIONS,
} from '@/models/nganhangcauhoi';

interface CreateDeThiModalProps {
  visible: boolean;
  form: FormInstance;
  monHocList: MonHoc[];
  khoiKienThucList: KhoiKienThuc[];
  cauTrucList: CauTrucDeThi[];
  chiTietList: CauTrucChiTiet[];
  selectedMonHoc: string;
  onMonHocChange: (monHocId: string) => void;
  onCauTrucChange: (cauTrucId: string) => void;
  onChiTietChange: (index: number, field: keyof CauTrucChiTiet, value: any) => void;
  onAddChiTiet: () => void;
  onRemoveChiTiet: (index: number) => void;
  onOk: () => void;
  onCancel: () => void;
  onSaveStructure: () => void;
}

const CreateDeThiModal: React.FC<CreateDeThiModalProps> = ({
  visible,
  form,
  monHocList,
  khoiKienThucList,
  cauTrucList,
  chiTietList,
  selectedMonHoc,
  onMonHocChange,
  onCauTrucChange,
  onChiTietChange,
  onAddChiTiet,
  onRemoveChiTiet,
  onOk,
  onCancel,
  onSaveStructure,
}) => {
  const tongSoCau = chiTietList.reduce((sum, item) => sum + item.soCauHoi, 0);
  const tongDiem = chiTietList.reduce((sum, item) => sum + item.soCauHoi * (item.diemMoiCau || 1), 0);

  return (
    <Modal
      title="Tạo đề thi mới"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={900}
      okText="Tạo đề thi"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên đề thi"
              name="tenDeThi"
              rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
            >
              <Input placeholder="VD: Đề thi giữa kỳ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Môn học"
              name="monHocId"
              rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
            >
              <Select placeholder="Chọn môn học" onChange={onMonHocChange}>
                {monHocList.map(item => (
                  <Select.Option key={item.id} value={item.id!}>
                    {item.tenMonHoc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Cấu trúc đề thi có sẵn (tùy chọn)" name="cauTrucDeThiId">
              <Select
                placeholder="Chọn cấu trúc hoặc tự tạo"
                allowClear
                onChange={onCauTrucChange}
                disabled={!selectedMonHoc}
              >
                {cauTrucList.map(item => (
                  <Select.Option key={item.id} value={item.id!}>
                    {item.tenCauTruc} ({item.tongSoCau} câu - {item.tongDiem} điểm)
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thời gian làm bài (phút)" name="thoiGianLamBai">
              <InputNumber min={15} max={300} style={{ width: '100%' }} placeholder="VD: 90" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Tên cấu trúc (để lưu cấu trúc này)" name="tenCauTruc">
          <Input placeholder="VD: Cấu trúc đề thi chuẩn" />
        </Form.Item>
        <Form.Item label="Ghi chú" name="ghiChu">
          <Input.TextArea rows={2} placeholder="Ghi chú về đề thi" />
        </Form.Item>

        <Divider>Cấu trúc đề thi</Divider>
        <Alert
          message="Thêm các yêu cầu về số lượng câu hỏi theo khối kiến thức và mức độ khó. Hệ thống sẽ tự động chọn ngẫu nhiên câu hỏi phù hợp."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {chiTietList.map((chiTiet, index) => (
          <Card
            key={index}
            size="small"
            style={{ marginBottom: 8 }}
            title={`Yêu cầu ${index + 1}`}
            extra={
              <Button
                type="link"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onRemoveChiTiet(index)}
              >
                Xóa
              </Button>
            }
          >
            <Row gutter={8}>
              <Col span={8}>
                <Select
                  placeholder="Khối kiến thức"
                  value={chiTiet.khoiKienThucId || undefined}
                  onChange={value => onChiTietChange(index, 'khoiKienThucId', value)}
                  style={{ width: '100%' }}
                >
                  {khoiKienThucList.map(item => (
                    <Select.Option key={item.id} value={item.id!}>
                      {item.tenKhoiKienThuc}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  placeholder="Mức độ"
                  value={chiTiet.mucDoKho}
                  onChange={value => onChiTietChange(index, 'mucDoKho', value)}
                  style={{ width: '100%' }}
                >
                  {MUC_DO_KHO_OPTIONS.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <InputNumber
                  placeholder="Số câu"
                  min={1}
                  value={chiTiet.soCauHoi}
                  onChange={value => onChiTietChange(index, 'soCauHoi', value || 1)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={5}>
                <InputNumber
                  placeholder="Điểm/câu"
                  min={0.5}
                  step={0.5}
                  value={chiTiet.diemMoiCau}
                  onChange={value => onChiTietChange(index, 'diemMoiCau', value || 1)}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Card>
        ))}

        <Space style={{ marginTop: 8 }}>
          <Button type="dashed" icon={<PlusOutlined />} onClick={onAddChiTiet}>
            Thêm yêu cầu
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={onSaveStructure}
            disabled={!selectedMonHoc || chiTietList.length === 0}
          >
            Lưu cấu trúc
          </Button>
        </Space>

        {chiTietList.length > 0 && (
          <Alert
            style={{ marginTop: 16 }}
            message={
              <span>
                Tổng cộng: <strong>{tongSoCau}</strong> câu hỏi,{' '}
                <strong>{tongDiem}</strong> điểm
              </span>
            }
            type="success"
          />
        )}
      </Form>
    </Modal>
  );
};

export default CreateDeThiModal;
