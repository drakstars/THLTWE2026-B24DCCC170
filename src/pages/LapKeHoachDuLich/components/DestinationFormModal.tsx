import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { Destination } from '../types';
import { DEFAULT_COSTS } from '../utils/travelHelpers';

const { Dragger } = Upload;

type Props = {
  open: boolean;
  editingDestination?: Destination;
  onCancel: () => void;
  onSubmit: (destination: Destination) => void;
};

const readAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const DestinationFormModal: React.FC<Props> = ({ open, editingDestination, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (!open) return;

    if (editingDestination) {
      setImageUrl(editingDestination.imageUrl);
      form.setFieldsValue(editingDestination);
      return;
    }

    setImageUrl('');
    form.setFieldsValue({
      category: 'Biển',
      rating: 4,
      priceLevel: 1500000,
      visitDurationHours: 6,
      ...DEFAULT_COSTS,
    });
  }, [open, editingDestination, form]);

  return (
    <Modal
      title={editingDestination ? 'Cập nhật điểm đến' : 'Thêm điểm đến mới'}
      visible={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={900}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit({
            id: editingDestination?.id || `des-${Date.now()}`,
            name: values.name,
            location: values.location,
            category: values.category,
            imageUrl: imageUrl || values.imageUrl,
            description: values.description,
            rating: values.rating,
            priceLevel: values.priceLevel,
            visitDurationHours: values.visitDurationHours,
            latitude: values.latitude,
            longitude: values.longitude,
            estimatedCosts: {
              'Ăn uống': values['Ăn uống'],
              'Di chuyển': values['Di chuyển'],
              'Lưu trú': values['Lưu trú'],
              'Vé tham quan': values['Vé tham quan'],
              'Khác': values['Khác'],
            },
          });
        }}
      >
        <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="category" label="Loại hình" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'Biển', value: 'Biển' },
              { label: 'Núi', value: 'Núi' },
              { label: 'Thành phố', value: 'Thành phố' },
            ]}
          />
        </Form.Item>

        <Form.Item name="imageUrl" label="URL hình ảnh">
          <Input onChange={(event) => setImageUrl(event.target.value)} placeholder="https://..." />
        </Form.Item>

        <Form.Item label="Upload hình ảnh">
          <Dragger
            accept="image/*"
            beforeUpload={async (file) => {
              const base64 = await readAsBase64(file as File);
              setImageUrl(base64);
              return false;
            }}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Kéo thả hoặc bấm để upload ảnh</p>
          </Dragger>
        </Form.Item>

        <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
          <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="priceLevel" label="Mức giá tổng" rules={[{ required: true }]}>
          <InputNumber min={0} step={100000} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="visitDurationHours" label="Thời gian tham quan (giờ)" rules={[{ required: true }]}>
          <InputNumber min={1} max={48} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="latitude" label="Vĩ độ" rules={[{ required: true }]}>
          <InputNumber min={-90} max={90} step={0.0001} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="longitude" label="Kinh độ" rules={[{ required: true }]}>
          <InputNumber min={-180} max={180} step={0.0001} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="Ăn uống" label="Chi phí ăn uống" rules={[{ required: true }]}>
          <InputNumber min={0} step={50000} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="Di chuyển" label="Chi phí di chuyển" rules={[{ required: true }]}>
          <InputNumber min={0} step={50000} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="Lưu trú" label="Chi phí lưu trú" rules={[{ required: true }]}>
          <InputNumber min={0} step={50000} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="Vé tham quan" label="Chi phí vé tham quan" rules={[{ required: true }]}>
          <InputNumber min={0} step={50000} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="Khác" label="Chi phí khác" rules={[{ required: true }]}>
          <InputNumber min={0} step={50000} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DestinationFormModal;
