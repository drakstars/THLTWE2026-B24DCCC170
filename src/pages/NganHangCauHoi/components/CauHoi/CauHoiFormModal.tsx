import React from 'react';
import { Modal, Form, Input, Switch, Select, Row, Col } from 'antd';
import type { FormInstance } from 'antd';
import { CauHoi, MonHoc, KhoiKienThuc, MUC_DO_KHO_OPTIONS } from '@/models/nganhangcauhoi';

interface CauHoiFormModalProps {
  visible: boolean;
  editingItem: CauHoi | null;
  form: FormInstance;
  monHocList: MonHoc[];
  khoiKienThucList: KhoiKienThuc[];
  onOk: () => void;
  onCancel: () => void;
}

const CauHoiFormModal: React.FC<CauHoiFormModalProps> = ({
  visible,
  editingItem,
  form,
  monHocList,
  khoiKienThucList,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title={editingItem ? 'Chỉnh sửa câu hỏi' : 'Thêm mới câu hỏi'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={800}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" initialValues={{ trangThai: true, diemToiDa: 1 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Mã câu hỏi"
              name="maCauHoi"
              rules={[
                { required: true, message: 'Vui lòng nhập mã' },
                { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ chứa chữ in hoa và số' },
              ]}
            >
              <Input placeholder="VD: CH001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Môn học"
              name="monHocId"
              rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
            >
              <Select placeholder="Chọn môn học">
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
            <Form.Item
              label="Khối kiến thức"
              name="khoiKienThucId"
              rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
            >
              <Select placeholder="Chọn khối kiến thức">
                {khoiKienThucList.map(item => (
                  <Select.Option key={item.id} value={item.id!}>
                    {item.tenKhoiKienThuc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Mức độ khó"
              name="mucDoKho"
              rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}
            >
              <Select placeholder="Chọn mức độ khó">
                {MUC_DO_KHO_OPTIONS.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Nội dung câu hỏi"
          name="noiDung"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi" />
        </Form.Item>
        <Form.Item label="Đáp án" name="dapAn">
          <Input.TextArea rows={4} placeholder="Nhập đáp án (tùy chọn)" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Điểm tối đa"
              name="diemToiDa"
              rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}
            >
              <Input type="number" min="0.5" step="0.5" placeholder="VD: 1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái" name="trangThai" valuePropName="checked">
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CauHoiFormModal;
