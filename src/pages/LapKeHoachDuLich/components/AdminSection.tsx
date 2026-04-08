import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Image, Popconfirm, Row, Space, Statistic, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import type { AdminStats, Destination } from '../types';
import DestinationFormModal from './DestinationFormModal';

type Props = {
  destinations: Destination[];
  adminStats: AdminStats;
  snapshotsCount: number;
  onUpsertDestination: (destination: Destination) => void;
  onDeleteDestination: (destinationId: string) => void;
};

const AdminSection: React.FC<Props> = ({
  destinations,
  adminStats,
  snapshotsCount,
  onUpsertDestination,
  onDeleteDestination,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | undefined>();

  const popularData = useMemo(() => {
    if (adminStats.popularDestinations.labels.length > 0) {
      return adminStats.popularDestinations;
    }

    return {
      labels: ['Chưa có dữ liệu'],
      values: [0],
    };
  }, [adminStats.popularDestinations]);

  const monthlyData = useMemo(() => {
    if (adminStats.monthlyItineraries.labels.length > 0) {
      return adminStats.monthlyItineraries;
    }

    return {
      labels: ['Chưa có dữ liệu'],
      values: [0],
    };
  }, [adminStats.monthlyItineraries]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Statistic title="Số điểm đến" value={destinations.length} />
          <Statistic title="Số lịch trình đã tạo" value={snapshotsCount} />
          <Statistic title="Doanh thu ước tính (8%)" value={Math.round(adminStats.revenue)} suffix="đ" />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingDestination(undefined);
              setOpenModal(true);
            }}
          >
            Thêm điểm đến
          </Button>
        </Space>
      </Card>

      <Card title="Quản lý điểm đến">
        <Table
          rowKey="id"
          scroll={{ x: 1200 }}
          dataSource={destinations}
          columns={[
            {
              title: 'Ảnh',
              dataIndex: 'imageUrl',
              width: 120,
              render: (value: string) => (
                <Image
                  src={value}
                  width={80}
                  height={56}
                  style={{ objectFit: 'cover', borderRadius: 6 }}
                  fallback="https://via.placeholder.com/80x56?text=No+Image"
                />
              ),
            },
            {
              title: 'Tên điểm đến',
              dataIndex: 'name',
              fixed: 'left',
              width: 260,
            },
            {
              title: 'Loại hình',
              dataIndex: 'category',
              render: (value: string) => <Tag color="blue">{value}</Tag>,
            },
            {
              title: 'Địa điểm',
              dataIndex: 'location',
            },
            {
              title: 'Rating',
              dataIndex: 'rating',
            },
            {
              title: 'Thời gian tham quan',
              dataIndex: 'visitDurationHours',
              render: (value: number) => `${value} giờ`,
            },
            {
              title: 'Mức giá',
              dataIndex: 'priceLevel',
              render: (value: number) => `${value.toLocaleString('vi-VN')}đ`,
            },
            {
              title: 'Hành động',
              fixed: 'right',
              width: 160,
              render: (_: unknown, row: Destination) => (
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingDestination(row);
                      setOpenModal(true);
                    }}
                  />
                  <Popconfirm title="Xóa điểm đến này?" onConfirm={() => onDeleteDestination(row.id)}>
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Số lượt lịch trình tạo theo tháng">
            <ColumnChart
              xAxis={monthlyData.labels}
              yAxis={[monthlyData.values]}
              yLabel={['Lượt tạo']}
              formatY={(value) => `${Math.round(value)} lượt`}
              height={320}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Địa điểm phổ biến">
            <ColumnChart
              xAxis={popularData.labels}
              yAxis={[popularData.values]}
              yLabel={['Số lần xuất hiện']}
              formatY={(value) => `${Math.round(value)} lần`}
              height={320}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Tổng tiền theo từng hạng mục">
        <DonutChart
          xAxis={Object.keys(adminStats.categoryTotals)}
          yAxis={[Object.values(adminStats.categoryTotals)]}
          yLabel={['Tổng chi']}
          height={340}
          showTotal
        />
      </Card>

      <DestinationFormModal
        open={openModal}
        editingDestination={editingDestination}
        onCancel={() => setOpenModal(false)}
        onSubmit={(destination) => {
          onUpsertDestination(destination);
          setOpenModal(false);
          setEditingDestination(undefined);
        }}
      />
    </Space>
  );
};

export default AdminSection;
