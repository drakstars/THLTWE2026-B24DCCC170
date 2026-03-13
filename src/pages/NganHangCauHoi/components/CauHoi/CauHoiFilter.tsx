import React from 'react';
import { Card, Form, Input, Select, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { MonHoc, KhoiKienThuc, MUC_DO_KHO_OPTIONS } from '@/models/nganhangcauhoi';

interface CauHoiFilterProps {
  filterForm: FormInstance;
  monHocList: MonHoc[];
  khoiKienThucList: KhoiKienThuc[];
  onFilter: () => void;
  onReset: () => void;
}

const CauHoiFilter: React.FC<CauHoiFilterProps> = ({
  filterForm,
  monHocList,
  khoiKienThucList,
  onFilter,
  onReset,
}) => {
  return (
    <Card title="Tìm kiếm câu hỏi" style={{ marginBottom: 16 }}>
      <Form form={filterForm} layout="inline">
        <Form.Item name="tuKhoa" style={{ width: 250 }}>
          <Input placeholder="Tìm theo mã hoặc nội dung" />
        </Form.Item>
        <Form.Item name="monHocId" style={{ width: 200 }}>
          <Select placeholder="Chọn môn học" allowClear>
            {monHocList.map(item => (
              <Select.Option key={item.id} value={item.id!}>
                {item.tenMonHoc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="khoiKienThucId" style={{ width: 200 }}>
          <Select placeholder="Chọn khối kiến thức" allowClear>
            {khoiKienThucList.map(item => (
              <Select.Option key={item.id} value={item.id!}>
                {item.tenKhoiKienThuc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="mucDoKho" style={{ width: 150 }}>
          <Select placeholder="Mức độ khó" allowClear>
            {MUC_DO_KHO_OPTIONS.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={onFilter}>
              Tìm kiếm
            </Button>
            <Button onClick={onReset}>Đặt lại</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CauHoiFilter;
