import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useMemo, useState } from 'react';

import { DIFFICULTIES, MUSCLE_GROUPS } from '../constants';
import { Exercise } from '../types';

interface ExerciseLibraryTabProps {
  exercises: Exercise[];
  onCreate: (payload: Omit<Exercise, 'id'>) => void;
  onUpdate: (id: string, payload: Omit<Exercise, 'id'>) => void;
  onDelete: (id: string) => void;
}

interface ExerciseFormValues {
  name: string;
  muscleGroup: Exercise['muscleGroup'];
  difficulty: Exercise['difficulty'];
  shortDescription: string;
  instructions: string;
  caloriesPerHour: number;
}

const difficultyColor: Record<Exercise['difficulty'], string> = {
  Dễ: 'green',
  'Trung bình': 'gold',
  Khó: 'red',
};

const ExerciseLibraryTab: React.FC<ExerciseLibraryTabProps> = ({ exercises, onCreate, onUpdate, onDelete }) => {
  const [keyword, setKeyword] = useState<string>('');
  const [muscleFilter, setMuscleFilter] = useState<Exercise['muscleGroup'] | undefined>();
  const [difficultyFilter, setDifficultyFilter] = useState<Exercise['difficulty'] | undefined>();

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [form] = Form.useForm<ExerciseFormValues>();

  const filteredExercises = useMemo(() => {
    return exercises.filter((item) => {
      const matchKeyword = !keyword || item.name.toLowerCase().includes(keyword.toLowerCase());
      const matchMuscle = !muscleFilter || item.muscleGroup === muscleFilter;
      const matchDifficulty = !difficultyFilter || item.difficulty === difficultyFilter;
      return matchKeyword && matchMuscle && matchDifficulty;
    });
  }, [difficultyFilter, exercises, keyword, muscleFilter]);

  const openCreateModal = () => {
    setEditingExercise(null);
    form.resetFields();
    form.setFieldsValue({
      difficulty: 'Dễ',
      muscleGroup: 'Chest',
      caloriesPerHour: 300,
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (item: Exercise) => {
    setEditingExercise(item);
    form.setFieldsValue({
      name: item.name,
      muscleGroup: item.muscleGroup,
      difficulty: item.difficulty,
      shortDescription: item.shortDescription,
      instructions: item.instructions,
      caloriesPerHour: item.caloriesPerHour,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: Omit<Exercise, 'id'> = {
      name: values.name,
      muscleGroup: values.muscleGroup,
      difficulty: values.difficulty,
      shortDescription: values.shortDescription,
      instructions: values.instructions,
      caloriesPerHour: values.caloriesPerHour,
    };

    if (editingExercise) {
      onUpdate(editingExercise.id, payload);
    } else {
      onCreate(payload);
    }

    setIsFormModalOpen(false);
    setEditingExercise(null);
    form.resetFields();
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Space wrap>
        <Input
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm tên bài tập"
          allowClear
          style={{ width: 240 }}
        />

        <Select
          allowClear
          value={muscleFilter}
          onChange={(value) => setMuscleFilter(value)}
          placeholder="Lọc nhóm cơ"
          style={{ width: 180 }}
        >
          {MUSCLE_GROUPS.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>

        <Select
          allowClear
          value={difficultyFilter}
          onChange={(value) => setDifficultyFilter(value)}
          placeholder="Lọc độ khó"
          style={{ width: 180 }}
        >
          {DIFFICULTIES.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>

        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Thêm bài tập
        </Button>
      </Space>

      {filteredExercises.length === 0 ? (
        <Card>
          <Empty description="Không tìm thấy bài tập" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredExercises.map((item) => (
            <Col key={item.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                title={item.name}
                onClick={() => setSelectedExercise(item)}
                extra={<Tag color={difficultyColor[item.difficulty]}>{item.difficulty}</Tag>}
                actions={[
                  <Button
                    key="edit"
                    icon={<EditOutlined />}
                    type="text"
                    onClick={(event) => {
                      event.stopPropagation();
                      openEditModal(item);
                    }}
                  >
                    Sửa
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="Xóa bài tập này?"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={(event) => {
                      event?.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      type="text"
                      danger
                      onClick={(event) => event.stopPropagation()}
                    >
                      Xóa
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Typography.Text type="secondary">Nhóm cơ: {item.muscleGroup}</Typography.Text>
                  <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }} style={{ marginBottom: 0 }}>
                    {item.shortDescription}
                  </Typography.Paragraph>
                  <Typography.Text strong>{item.caloriesPerHour} kcal/giờ</Typography.Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        visible={Boolean(selectedExercise)}
        title={selectedExercise?.name}
        footer={null}
        onCancel={() => setSelectedExercise(null)}
      >
        {selectedExercise ? (
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space>
              <Tag>{selectedExercise.muscleGroup}</Tag>
              <Tag color={difficultyColor[selectedExercise.difficulty]}>{selectedExercise.difficulty}</Tag>
            </Space>
            <Typography.Paragraph>{selectedExercise.shortDescription}</Typography.Paragraph>
            <Typography.Text strong>Hướng dẫn đầy đủ:</Typography.Text>
            <Typography.Paragraph>{selectedExercise.instructions}</Typography.Paragraph>
            <Typography.Text>Đốt trung bình: {selectedExercise.caloriesPerHour} kcal/giờ</Typography.Text>
          </Space>
        ) : null}
      </Modal>

      <Modal
        visible={isFormModalOpen}
        title={editingExercise ? 'Sửa bài tập' : 'Thêm bài tập'}
        onOk={handleSubmit}
        onCancel={() => setIsFormModalOpen(false)}
        okText={editingExercise ? 'Cập nhật' : 'Thêm mới'}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên bài tập" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Nhóm cơ" name="muscleGroup" rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}>
            <Select>
              {MUSCLE_GROUPS.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Mức độ khó" name="difficulty" rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}>
            <Select>
              {DIFFICULTIES.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Mô tả ngắn"
            name="shortDescription"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Hướng dẫn đầy đủ"
            name="instructions"
            rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Calo đốt trung bình/ giờ"
            name="caloriesPerHour"
            rules={[{ required: true, message: 'Vui lòng nhập calo' }]}
          >
            <InputNumber min={1} max={2000} style={{ width: '100%' }} addonAfter="kcal" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default ExerciseLibraryTab;
