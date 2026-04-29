import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Progress,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import moment, { Moment } from 'moment';
import React, { useMemo, useState } from 'react';

import { GOAL_STATUSES, GOAL_TYPES } from '../constants';
import { FitnessGoal } from '../types';

interface GoalsTabProps {
  goals: FitnessGoal[];
  onCreate: (payload: Omit<FitnessGoal, 'id'>) => void;
  onUpdate: (id: string, payload: Omit<FitnessGoal, 'id'>) => void;
  onDelete: (id: string) => void;
}

interface GoalFormValues {
  name: string;
  type: FitnessGoal['type'];
  targetValue: number;
  currentValue: number;
  deadline: Moment;
  status: FitnessGoal['status'];
}

const goalStatusColor: Record<FitnessGoal['status'], string> = {
  'Đang thực hiện': 'processing',
  'Đã đạt': 'success',
  'Đã hủy': 'default',
};

const GoalsTab: React.FC<GoalsTabProps> = ({ goals, onCreate, onUpdate, onDelete }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | FitnessGoal['status']>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<FitnessGoal | null>(null);
  const [form] = Form.useForm<GoalFormValues>();

  const filteredGoals = useMemo(() => {
    if (statusFilter === 'all') return goals;
    return goals.filter((goal) => goal.status === statusFilter);
  }, [goals, statusFilter]);

  const openCreateDrawer = () => {
    setEditingGoal(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'Giảm cân',
      targetValue: 10,
      currentValue: 0,
      deadline: moment().add(30, 'day'),
      status: 'Đang thực hiện',
    });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (goal: FitnessGoal) => {
    setEditingGoal(goal);
    form.setFieldsValue({
      name: goal.name,
      type: goal.type,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      deadline: moment(goal.deadline),
      status: goal.status,
    });
    setIsDrawerOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: Omit<FitnessGoal, 'id'> = {
      name: values.name,
      type: values.type,
      targetValue: values.targetValue,
      currentValue: values.currentValue,
      deadline: values.deadline.format('YYYY-MM-DD'),
      status: values.status,
    };

    if (editingGoal) {
      onUpdate(editingGoal.id, payload);
    } else {
      onCreate(payload);
    }

    setIsDrawerOpen(false);
    setEditingGoal(null);
    form.resetFields();
  };

  const handleInlineCurrentValueChange = (goal: FitnessGoal, value: number | null) => {
    if (value === null) return;

    onUpdate(goal.id, {
      ...goal,
      currentValue: value,
      status: value >= goal.targetValue ? 'Đã đạt' : goal.status === 'Đã hủy' ? 'Đã hủy' : 'Đang thực hiện',
    });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Space wrap>
        <Segmented
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as 'all' | FitnessGoal['status'])}
          options={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Đang thực hiện', value: 'Đang thực hiện' },
            { label: 'Đã đạt', value: 'Đã đạt' },
            { label: 'Đã hủy', value: 'Đã hủy' },
          ]}
        />

        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>
          Thêm mục tiêu
        </Button>
      </Space>

      {filteredGoals.length === 0 ? (
        <Card>
          <Empty description="Không có mục tiêu nào" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredGoals.map((goal) => {
            const percent = goal.targetValue > 0 ? Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100) : 0;
            return (
              <Col key={goal.id} xs={24} md={12} xl={8}>
                <Card
                  title={goal.name}
                  extra={<Tag color={goalStatusColor[goal.status]}>{goal.status}</Tag>}
                  actions={[
                    <Typography.Link key="edit" onClick={() => openEditDrawer(goal)}>
                      Sửa
                    </Typography.Link>,
                    <Popconfirm
                      key="delete"
                      title="Xóa mục tiêu này?"
                      okText="Xóa"
                      cancelText="Hủy"
                      onConfirm={() => onDelete(goal.id)}
                    >
                      <Button size="small" danger type="text" icon={<DeleteOutlined />}>
                        Xóa
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Typography.Text>Loại: {goal.type}</Typography.Text>
                    <Typography.Text>Giá trị mục tiêu: {goal.targetValue}</Typography.Text>
                    <Space align="center">
                      <Typography.Text>Giá trị hiện tại:</Typography.Text>
                      <InputNumber
                        min={0}
                        value={goal.currentValue}
                        step={0.1}
                        onChange={(value) => handleInlineCurrentValueChange(goal, value)}
                      />
                    </Space>
                    <Progress percent={percent} />
                    <Typography.Text type="secondary">
                      Hạn chót: {moment(goal.deadline).format('DD/MM/YYYY')}
                    </Typography.Text>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Drawer
        visible={isDrawerOpen}
        title={editingGoal ? 'Cập nhật mục tiêu' : 'Thêm mục tiêu mới'}
        width={420}
        onClose={() => setIsDrawerOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerOpen(false)}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit}>
              {editingGoal ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên mục tiêu" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Loại" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
            <Select>
              {GOAL_TYPES.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá trị mục tiêu"
            name="targetValue"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Giá trị hiện tại"
            name="currentValue"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị hiện tại' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Hạn chót" name="deadline" rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              {GOAL_STATUSES.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </Space>
  );
};

export default GoalsTab;
