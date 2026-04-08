import React from 'react';
import { Alert, Card, Col, InputNumber, Progress, Row, Space, Statistic, Table, Typography } from 'antd';
import DonutChart from '@/components/Chart/DonutChart';
import type { EstimatedCosts } from '../types';

const { Text } = Typography;

type Props = {
  totalBudget: number;
  totalEstimated: number;
  byCategory: EstimatedCosts;
  onBudgetChange: (budget: number) => void;
};

const BudgetSection: React.FC<Props> = ({ totalBudget, totalEstimated, byCategory, onBudgetChange }) => {
  const categoryEntries = Object.entries(byCategory);
  const budgetRate = totalBudget > 0 ? (totalEstimated / totalBudget) * 100 : 0;
  const overBudget = totalEstimated > totalBudget;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Text strong>Ngân sách dự kiến cho chuyến đi</Text>
            <InputNumber
              min={0}
              step={100000}
              style={{ width: '100%', marginTop: 8 }}
              value={totalBudget}
              onChange={(value) => onBudgetChange(Number(value) || 0)}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Tổng chi phí" value={totalEstimated} suffix="đ" />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Còn lại" value={totalBudget - totalEstimated} suffix="đ" />
          </Col>
        </Row>

        <Progress
          percent={Math.min(100, Number(budgetRate.toFixed(1)))}
          status={overBudget ? 'exception' : 'active'}
          strokeColor={overBudget ? '#ff4d4f' : '#1890ff'}
          style={{ marginTop: 16 }}
        />

        {overBudget && (
          <Alert
            style={{ marginTop: 12 }}
            type="error"
            message="Vượt ngân sách"
            description={`Bạn đã vượt ngân sách ${(totalEstimated - totalBudget).toLocaleString('vi-VN')}đ. Hãy giảm bớt lịch trình hoặc tăng ngân sách.`}
            showIcon
          />
        )}
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Biểu đồ phân bổ ngân sách">
            <DonutChart
              xAxis={categoryEntries.map((entry) => entry[0])}
              yAxis={[categoryEntries.map((entry) => entry[1])]}
              yLabel={['Chi phí']}
              showTotal
              height={320}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Bảng chi tiết theo hạng mục">
            <Table
              size="small"
              pagination={false}
              rowKey={(row) => row.category}
              dataSource={categoryEntries.map(([category, amount]) => ({
                category,
                amount,
                ratio: totalEstimated ? Number(((amount / totalEstimated) * 100).toFixed(1)) : 0,
              }))}
              columns={[
                { title: 'Hạng mục', dataIndex: 'category' },
                {
                  title: 'Chi phí',
                  dataIndex: 'amount',
                  render: (value: number) => `${value.toLocaleString('vi-VN')}đ`,
                },
                {
                  title: 'Tỷ trọng',
                  dataIndex: 'ratio',
                  render: (value: number) => `${value}%`,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default BudgetSection;
