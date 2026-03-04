import { Tag, Space, Button, Popconfirm, Progress } from 'antd';
import { EditOutlined, DeleteOutlined, BookOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface StudyProgress {
  id: string;
  subjectId: string;
  subjectName: string;
  date: string;
  duration: number;
  content: string;
  notes: string;
}

interface Goal {
  id: string;
  subjectId: string;
  subjectName: string;
  month: string;
  targetHours: number;
  currentHours: number;
}

export const createActionColumn = (onEdit: any, onDelete: any) => ({
  title: 'Thao tác',
  key: 'action',
  width: 150,
  render: (_: any, record: any) => (
    <Space>
      <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>Sửa</Button>
      <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => onDelete(record.id)} okText="Có" cancelText="Không">
        <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
      </Popconfirm>
    </Space>
  ),
});

export const subjectColumns = (subjects: Subject[], onEdit: any, onDelete: any): ColumnsType<Subject> => [
  {
    title: 'Tên môn học',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <Tag color={record.color} style={{ fontSize: 14, padding: '4px 12px' }}>
        <BookOutlined /> {text}
      </Tag>
    ),
  },
  createActionColumn(onEdit, onDelete),
];

export const progressColumns = (subjects: Subject[], onEdit: any, onDelete: any): ColumnsType<StudyProgress> => [
  {
    title: 'Môn học',
    dataIndex: 'subjectName',
    key: 'subjectName',
    render: (text, record) => {
      const subject = subjects.find(s => s.id === record.subjectId);
      return <Tag color={subject?.color}><BookOutlined /> {text}</Tag>;
    },
  },
  {
    title: 'Thời gian',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) => a.date.localeCompare(b.date),
    render: (text) => moment(text).format('DD/MM/YYYY HH:mm'),
  },
  {
    title: 'Thời lượng',
    dataIndex: 'duration',
    key: 'duration',
    render: (duration) => `${duration} phút`,
  },
  { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
  { title: 'Ghi chú', dataIndex: 'notes', key: 'notes', ellipsis: true },
  createActionColumn(onEdit, onDelete),
];

export const goalColumns = (subjects: Subject[], onEdit: any, onDelete: any): ColumnsType<Goal> => [
  {
    title: 'Môn học',
    dataIndex: 'subjectName',
    key: 'subjectName',
    render: (text, record) => {
      const subject = subjects.find(s => s.id === record.subjectId);
      return <Tag color={subject?.color}><BookOutlined /> {text}</Tag>;
    },
  },
  {
    title: 'Tháng',
    dataIndex: 'month',
    key: 'month',
    render: (text) => moment(text, 'YYYY-MM').format('MM/YYYY'),
  },
  { title: 'Mục tiêu (giờ)', dataIndex: 'targetHours', key: 'targetHours' },
  {
    title: 'Đã học (giờ)',
    dataIndex: 'currentHours',
    key: 'currentHours',
    render: (hours) => hours.toFixed(1),
  },
  {
    title: 'Tiến độ',
    key: 'progress',
    render: (_, record) => {
      const percent = Math.min((record.currentHours / record.targetHours) * 100, 100);
      return <Progress percent={percent} status={percent >= 100 ? 'success' : 'active'} format={(p) => `${p?.toFixed(0)}%`} />;
    },
  },
  {
    title: 'Trạng thái',
    key: 'status',
    render: (_, record) => {
      const achieved = record.currentHours >= record.targetHours;
      return (
        <Tag color={achieved ? 'success' : 'processing'} icon={achieved ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
          {achieved ? 'Đã đạt' : 'Chưa đạt'}
        </Tag>
      );
    },
  },
  createActionColumn(onEdit, onDelete),
];
