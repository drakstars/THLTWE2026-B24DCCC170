import React from 'react';
import { Card, Col, Row, Statistic, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SectionCard from './common/SectionCard';
import { formatCurrency } from '../utils/appointment';

interface ReportsPanelProps {
  appointmentsToday: number;
  appointmentsThisMonth: number;
  revenueThisMonth: number;
  revenueByService: Array<{ serviceId: number; serviceName: string; revenue: number }>;
  revenueByStaff: Array<{ staffId: number; staffName: string; revenue: number }>;
}

const ReportsPanel: React.FC<ReportsPanelProps> = ({
  appointmentsToday,
  appointmentsThisMonth,
  revenueThisMonth,
  revenueByService,
  revenueByStaff,
}) => {
  const revenueServiceColumns: ColumnsType<{ serviceId: number; serviceName: string; revenue: number }> = [
    { title: 'Dịch vụ', dataIndex: 'serviceName', key: 'serviceName' },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: (value) => formatCurrency(value) },
  ];

  const revenueStaffColumns: ColumnsType<{ staffId: number; staffName: string; revenue: number }> = [
    { title: 'Nhân viên', dataIndex: 'staffName', key: 'staffName' },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: (value) => formatCurrency(value) },
  ];

  return (
    <SectionCard title="Thống kê và báo cáo">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Số lịch hẹn hôm nay" value={appointmentsToday} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Số lịch hẹn tháng này" value={appointmentsThisMonth} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Doanh thu tháng này" value={revenueThisMonth} formatter={(value) => formatCurrency(Number(value))} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={12}>
          <Table
            rowKey="serviceId"
            columns={revenueServiceColumns}
            dataSource={revenueByService}
            pagination={false}
            title={() => 'Doanh thu dịch vụ'}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Table
            rowKey="staffId"
            columns={revenueStaffColumns}
            dataSource={revenueByStaff}
            pagination={false}
            title={() => 'Doanh thu nhân viên'}
          />
        </Col>
      </Row>
    </SectionCard>
  );
};

export default ReportsPanel;
