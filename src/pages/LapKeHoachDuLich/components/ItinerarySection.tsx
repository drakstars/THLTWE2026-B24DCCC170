import React, { useMemo } from 'react';
import { Button, Card, Col, Empty, List, Row, Select, Space, Statistic, Tag, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import type { Destination, ItineraryItem } from '../types';

const { Text } = Typography;

type Props = {
  itineraryItems: ItineraryItem[];
  destinations: Destination[];
  totalCost: number;
  travelHours: number;
  onRemoveItem: (itemId: string) => void;
  onMoveItem: (itemId: string, direction: 'up' | 'down') => void;
  onUpdateDay: (itemId: string, day: number) => void;
  onClear: () => void;
  onSave: () => void;
};

const ItinerarySection: React.FC<Props> = ({
  itineraryItems,
  destinations,
  totalCost,
  travelHours,
  onRemoveItem,
  onMoveItem,
  onUpdateDay,
  onClear,
  onSave,
}) => {
  const destinationMap = useMemo(
    () => new Map(destinations.map((destination) => [destination.id, destination])),
    [destinations],
  );

  const groupedByDay = useMemo(() => {
    return itineraryItems.reduce<Record<number, ItineraryItem[]>>((acc, item) => {
      acc[item.day] = acc[item.day] || [];
      acc[item.day].push(item);
      return acc;
    }, {});
  }, [itineraryItems]);

  const sortedDays = Object.keys(groupedByDay)
    .map((day) => Number(day))
    .sort((a, b) => a - b);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="Tổng chi phí ước tính" value={totalCost} precision={0} suffix="đ" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="Tổng thời gian (tham quan + di chuyển)" value={travelHours.toFixed(1)} suffix="giờ" />
          </Card>
        </Col>
        <Col xs={24} sm={24} lg={8}>
          <Card>
            <Space>
              <Button danger onClick={onClear}>Xóa toàn bộ lịch trình</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>Lưu lịch trình</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {sortedDays.length === 0 ? (
        <Card>
          <Empty description="Bạn chưa thêm điểm đến nào" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {sortedDays.map((day) => (
            <Col xs={24} xl={12} key={day}>
              <Card title={`Ngày ${day}`}>
                <List
                  dataSource={groupedByDay[day].sort((a, b) => a.order - b.order)}
                  renderItem={(item) => {
                    const destination = destinationMap.get(item.destinationId);
                    if (!destination) return null;

                    return (
                      <List.Item
                        actions={[
                          <Button key="up" icon={<ArrowUpOutlined />} onClick={() => onMoveItem(item.id, 'up')} />,
                          <Button key="down" icon={<ArrowDownOutlined />} onClick={() => onMoveItem(item.id, 'down')} />,
                          <Select
                            key="day"
                            value={item.day}
                            style={{ width: 84 }}
                            options={Array.from({ length: 15 }).map((_, index) => ({
                              label: `Ngày ${index + 1}`,
                              value: index + 1,
                            }))}
                            onChange={(value) => onUpdateDay(item.id, value)}
                          />,
                          <Button
                            key="delete"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => onRemoveItem(item.id)}
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <Space>
                              <Tag color="cyan">#{item.order}</Tag>
                              <Text strong>{destination.name}</Text>
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size={4}>
                              <Text type="secondary">{destination.location}</Text>
                              <Text type="secondary">Dự kiến tham quan: {destination.visitDurationHours} giờ</Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
};


export default ItinerarySection;
