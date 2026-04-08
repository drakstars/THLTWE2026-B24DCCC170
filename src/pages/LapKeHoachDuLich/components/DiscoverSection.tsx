import React, { useMemo, useState } from 'react';
import { Button, Card, Col, InputNumber, Rate, Row, Select, Slider, Space, Tag, Typography } from 'antd';
import type { Destination, DestinationCategory } from '../types';

const { Paragraph, Text } = Typography;

type Props = {
  destinations: Destination[];
  onAddToItinerary: (destinationId: string, day: number) => void;
};

type SortType = 'ratingDesc' | 'ratingAsc' | 'priceAsc' | 'priceDesc';

const DiscoverSection: React.FC<Props> = ({ destinations, onAddToItinerary }) => {
  const [category, setCategory] = useState<DestinationCategory | undefined>();
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [sortType, setSortType] = useState<SortType>('ratingDesc');
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const filtered = useMemo(() => {
    const cloned = destinations
      .filter((item) => !category || item.category === category)
      .filter((item) => item.rating >= minRating)
      .filter((item) => item.priceLevel >= priceRange[0] && item.priceLevel <= priceRange[1]);

    cloned.sort((a, b) => {
      if (sortType === 'ratingDesc') return b.rating - a.rating;
      if (sortType === 'ratingAsc') return a.rating - b.rating;
      if (sortType === 'priceAsc') return a.priceLevel - b.priceLevel;
      return b.priceLevel - a.priceLevel;
    });

    return cloned;
  }, [destinations, category, minRating, priceRange, sortType]);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6}>
            <Text strong>Loại hình</Text>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn loại hình"
              value={category}
              onChange={(value) => setCategory(value)}
              options={[
                { label: 'Biển', value: 'Biển' },
                { label: 'Núi', value: 'Núi' },
                { label: 'Thành phố', value: 'Thành phố' },
              ]}
            />
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Text strong>Rating từ</Text>
            <Rate allowHalf value={minRating} onChange={setMinRating} />
          </Col>

          <Col xs={24} sm={12} md={7}>
            <Text strong>Khoảng giá</Text>
            <Slider
              range
              min={0}
              max={5000000}
              step={100000}
              value={priceRange}
              onChange={(val) => setPriceRange(val as [number, number])}
            />
            <Text type="secondary">{priceRange[0].toLocaleString('vi-VN')}đ - {priceRange[1].toLocaleString('vi-VN')}đ</Text>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Text strong>Sắp xếp</Text>
            <Select
              style={{ width: '100%' }}
              value={sortType}
              onChange={(value: SortType) => setSortType(value)}
              options={[
                { label: 'Rating cao đến thấp', value: 'ratingDesc' },
                { label: 'Rating thấp đến cao', value: 'ratingAsc' },
                { label: 'Giá thấp đến cao', value: 'priceAsc' },
                { label: 'Giá cao đến thấp', value: 'priceDesc' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {filtered.map((destination) => (
          <Col xs={24} sm={12} lg={8} key={destination.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={destination.name}
                  src={destination.imageUrl}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
              actions={[
                <Space key="schedule">
                  <InputNumber
                    min={1}
                    max={30}
                    value={selectedDay}
                    onChange={(value) => setSelectedDay(Number(value) || 1)}
                    size="small"
                  />
                  <Button type="primary" size="small" onClick={() => onAddToItinerary(destination.id, selectedDay)}>
                    Thêm vào ngày
                  </Button>
                </Space>,
              ]}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Tag color="blue">{destination.category}</Tag>
                  <Tag color="gold">{destination.location}</Tag>
                </Space>

                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  {destination.name}
                </Typography.Title>

                <Rate disabled allowHalf value={destination.rating} />
                <Text strong>{destination.priceLevel.toLocaleString('vi-VN')}đ</Text>
                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }} style={{ marginBottom: 0 }}>
                  {destination.description}
                </Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default DiscoverSection;
