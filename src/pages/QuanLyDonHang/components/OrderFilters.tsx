import React from 'react';
import { Button, Col, Input, Row, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { ORDER_STATUS_OPTIONS } from '../data';

interface Props {
  searchText: string;
  statusFilter: string;
  sortBy: string;
  onSearchTextChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onCreate: () => void;
}

const OrderFilters: React.FC<Props> = ({
  searchText,
  statusFilter,
  sortBy,
  onSearchTextChange,
  onStatusFilterChange,
  onSortChange,
  onCreate,
}) => {
  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={10}>
        <Input
          allowClear
          value={searchText}
          prefix={<SearchOutlined />}
          placeholder="Tìm theo mã đơn hàng hoặc khách hàng"
          onChange={(e) => onSearchTextChange(e.target.value)}
        />
      </Col>
      <Col xs={24} sm={12} md={5}>
        <Select
          style={{ width: '100%' }}
          allowClear
          placeholder="Lọc trạng thái"
          value={statusFilter || undefined}
          onChange={(value) => onStatusFilterChange(value || '')}
        >
          {ORDER_STATUS_OPTIONS.map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Select
          style={{ width: '100%' }}
          value={sortBy}
          onChange={onSortChange}
        >
          <Select.Option value="date_desc">Ngày đặt hàng mới nhất</Select.Option>
          <Select.Option value="date_asc">Ngày đặt hàng cũ nhất</Select.Option>
          <Select.Option value="total_desc">Tổng tiền cao đến thấp</Select.Option>
          <Select.Option value="total_asc">Tổng tiền thấp đến cao</Select.Option>
        </Select>
      </Col>
      <Col xs={24} md={3}>
        <Button block type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Thêm mới
        </Button>
      </Col>
    </Row>
  );
};

export default OrderFilters;
