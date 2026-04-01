import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';
import { ReportData } from '../types';

interface ReportsSectionProps {
  reportData: ReportData;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ reportData }) => {
  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số CLB"
              value={reportData.stats.totalClubs}
              prefix={<ApartmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn Pending"
              value={reportData.stats.totalPending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn Approved"
              value={reportData.stats.totalApproved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn Rejected"
              value={reportData.stats.totalRejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Thống kê đơn đăng ký theo CLB">
        <ColumnChart
          title="Số đơn theo trạng thái"
          xAxis={reportData.chart.xAxis}
          yAxis={[reportData.chart.pending, reportData.chart.approved, reportData.chart.rejected]}
          yLabel={['Pending', 'Approved', 'Rejected']}
          colors={['#faad14', '#52c41a', '#f5222d']}
          formatY={(val) => `${val} đơn`}
          height={380}
        />
      </Card>
    </>
  );
};

export default ReportsSection;
