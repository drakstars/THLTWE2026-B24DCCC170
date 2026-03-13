import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { MonHoc } from '@/models/nganhangcauhoi';

interface MonHocStatsProps {
  data: MonHoc[];
}

const MonHocStats: React.FC<MonHocStatsProps> = ({ data }) => {
  const totalCredits = data.reduce((sum, item) => sum + item.soTinChi, 0);
  const activeSubjects = data.filter(item => item.trangThai).length;

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={8}>
        <Card>
          <Statistic title="Tổng số môn học" value={data.length} prefix={<BookOutlined />} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Môn học hoạt động" value={activeSubjects} valueStyle={{ color: '#3f8600' }} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Tổng số tín chỉ" value={totalCredits} suffix="TC" />
        </Card>
      </Col>
    </Row>
  );
};

export default MonHocStats;
