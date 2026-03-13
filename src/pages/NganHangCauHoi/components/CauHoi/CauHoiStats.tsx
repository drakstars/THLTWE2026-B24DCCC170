import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { CauHoi } from '@/models/nganhangcauhoi';

interface CauHoiStatsProps {
  filteredData: CauHoi[];
}

const CauHoiStats: React.FC<CauHoiStatsProps> = ({ filteredData }) => {
  const statsByDifficulty = {
    De: filteredData.filter(item => item.mucDoKho === 'De').length,
    TrungBinh: filteredData.filter(item => item.mucDoKho === 'TrungBinh').length,
    Kho: filteredData.filter(item => item.mucDoKho === 'Kho').length,
    RatKho: filteredData.filter(item => item.mucDoKho === 'RatKho').length,
  };

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Tổng số câu hỏi"
            value={filteredData.length}
            prefix={<QuestionCircleOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Dễ" value={statsByDifficulty.De} valueStyle={{ color: '#52c41a' }} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Trung bình"
            value={statsByDifficulty.TrungBinh}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Khó & Rất khó"
            value={statsByDifficulty.Kho + statsByDifficulty.RatKho}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default CauHoiStats;
