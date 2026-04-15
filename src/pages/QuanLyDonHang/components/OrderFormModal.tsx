import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Space, Typography, message } from 'antd';
import moment from 'moment';
import { Customer, Order, OrderFormSubmitValue, OrderStatus, Product } from '../types';
import { ORDER_STATUS_OPTIONS } from '../data';

interface Props {
  visible: boolean;
  customers: Customer[];
  products: Product[];
  editingOrder?: Order | null;
  existingOrderIds: string[];
  onCancel: () => void;
  onSubmit: (payload: OrderFormSubmitValue) => void;
}

const OrderFormModal: React.FC<Props> = ({
  visible,
  customers,
  products,
  editingOrder,
  existingOrderIds,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (!editingOrder) {
      form.setFieldsValue({
        id: '',
        customerId: undefined,
        status: 'Chờ xác nhận',
        orderDate: moment(),
      });
      setSelectedProductIds([]);
      setQuantities({});
      return;
    }

    form.setFieldsValue({
      id: editingOrder.id,
      customerId: editingOrder.customerId,
      status: editingOrder.status,
      orderDate: moment(editingOrder.orderDate),
    });

    const productIds = editingOrder.items.map((item) => item.productId);
    const initialQuantities = editingOrder.items.reduce<Record<string, number>>((acc, item) => {
      acc[item.productId] = item.quantity;
      return acc;
    }, {});

    setSelectedProductIds(productIds);
    setQuantities(initialQuantities);
  }, [editingOrder, form, visible]);

  const totalAmount = useMemo(() => {
    return selectedProductIds.reduce((sum, productId) => {
      const product = products.find((item) => item.id === productId);
      const qty = quantities[productId] || 0;
      return sum + (product ? product.price * qty : 0);
    }, 0);
  }, [products, quantities, selectedProductIds]);

  const isDuplicateCode = (code: string) => {
    const normalized = code.trim().toLowerCase();
    return existingOrderIds.some((id) => {
      if (editingOrder && id === editingOrder.id) {
        return false;
      }
      return id.toLowerCase() === normalized;
    });
  };

  const onSelectedProductChange = (ids: string[]) => {
    setSelectedProductIds(ids);
    const nextQuantities: Record<string, number> = {};
    ids.forEach((id) => {
      nextQuantities[id] = quantities[id] || 1;
    });
    setQuantities(nextQuantities);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedProductIds.length) {
        message.error('Vui lòng chọn ít nhất một sản phẩm.');
        return;
      }

      const invalidProduct = selectedProductIds.find((productId) => !quantities[productId] || quantities[productId] <= 0);
      if (invalidProduct) {
        message.error('Số lượng sản phẩm phải lớn hơn 0.');
        return;
      }

      const payload: OrderFormSubmitValue = {
        id: values.id.trim(),
        customerId: values.customerId,
        status: values.status as OrderStatus,
        orderDate: values.orderDate,
        items: selectedProductIds.map((productId) => ({
          productId,
          quantity: quantities[productId],
        })),
      };

      onSubmit(payload);
    } catch (error) {
      // Keep default antd validation behavior.
    }
  };

  return (
    <Modal
      title={editingOrder ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText={editingOrder ? 'Lưu thay đổi' : 'Tạo đơn'}
      cancelText="Hủy"
      width={760}
      destroyOnClose
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Mã đơn hàng"
              name="id"
              rules={[
                { required: true, message: 'Vui lòng nhập mã đơn hàng.' },
                { whitespace: true, message: 'Mã đơn hàng không được để trống.' },
                {
                  validator: (_, value) => {
                    if (!value || !isDuplicateCode(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mã đơn hàng đã tồn tại.'));
                  },
                },
              ]}
            >
              <Input placeholder="Ví dụ: DH003" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Khách hàng"
              name="customerId"
              rules={[{ required: true, message: 'Vui lòng chọn khách hàng.' }]}
            >
              <Select placeholder="Chọn khách hàng">
                {customers.map((customer) => (
                  <Select.Option key={customer.id} value={customer.id}>
                    {customer.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Trạng thái đơn hàng"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
            >
              <Select>
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <Select.Option key={status} value={status}>
                    {status}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày đặt hàng"
              name="orderDate"
              rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng.' }]}
            >
              <DatePicker
                showTime
                style={{ width: '100%' }}
                format="DD/MM/YYYY HH:mm"
                placeholder="Chọn ngày đặt hàng"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Sản phẩm trong đơn">
          <Select
            mode="multiple"
            value={selectedProductIds}
            onChange={onSelectedProductChange}
            placeholder="Chọn một hoặc nhiều sản phẩm"
          >
            {products.map((product) => (
              <Select.Option key={product.id} value={product.id}>
                {product.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {!!selectedProductIds.length && (
          <Card size="small" title="Số lượng sản phẩm" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {selectedProductIds.map((productId) => {
                const product = products.find((item) => item.id === productId);
                return (
                  <Row key={productId} gutter={8} align="middle">
                    <Col span={16}>{product?.name}</Col>
                    <Col span={8}>
                      <InputNumber
                        min={1}
                        precision={0}
                        style={{ width: '100%' }}
                        value={quantities[productId]}
                        onChange={(value) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [productId]: Number(value || 0),
                          }))
                        }
                      />
                    </Col>
                  </Row>
                );
              })}
            </Space>
          </Card>
        )}

        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
        </Typography.Title>
      </Form>
    </Modal>
  );
};

export default OrderFormModal;
