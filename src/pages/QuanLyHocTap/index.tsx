import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Input, DatePicker, InputNumber, Select, Space, Tag, Tabs, Statistic, Row, Col, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, BookOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { subjectColumns, progressColumns, goalColumns } from './columns';
import { COLORS, DEFAULT_SUBJECTS, loadFromStorage, saveToStorage, getCurrentMonth } from './utils';
import './style.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface Subject { id: string; name: string; color: string; }
interface StudyProgress { id: string; subjectId: string; subjectName: string; date: string; duration: number; content: string; notes: string; }
interface Goal { id: string; subjectId: string; subjectName: string; month: string; targetHours: number; currentHours: number; }

const QuanLyHocTap: React.FC = () => {
  const [form] = Form.useForm();
  const [goalForm] = Form.useForm();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studyProgress, setStudyProgress] = useState<StudyProgress[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modals, setModals] = useState({ subject: false, progress: false, goal: false });
  const [editing, setEditing] = useState<any>({ subject: null, progress: null, goal: null });

  useEffect(() => {
    setSubjects(loadFromStorage('study_subjects', DEFAULT_SUBJECTS));
    setStudyProgress(loadFromStorage('study_progress', []));
    setGoals(loadFromStorage('study_goals', []));
  }, []);

  useEffect(() => { if (subjects.length) saveToStorage('study_subjects', subjects); }, [subjects]);
  useEffect(() => { saveToStorage('study_progress', studyProgress); }, [studyProgress]);
  useEffect(() => { saveToStorage('study_goals', goals); }, [goals]);

  const openModal = (type: 'subject' | 'progress' | 'goal', item: any = null) => {
    setModals({ ...modals, [type]: true });
    setEditing({ ...editing, [type]: item });
    const formToUse = type === 'goal' ? goalForm : form;
    formToUse.resetFields();
    if (item) {
      if (type === 'progress') formToUse.setFieldsValue({ ...item, date: moment(item.date) });
      else if (type === 'goal') formToUse.setFieldsValue({ ...item, month: moment(item.month, 'YYYY-MM') });
      else formToUse.setFieldsValue(item);
    } else if (type !== 'subject') {
      formToUse.setFieldsValue({ [type === 'progress' ? 'date' : 'month']: moment() });
    }
  };

  const closeModal = (type: 'subject' | 'progress' | 'goal') => setModals({ ...modals, [type]: false });

  const handleDelete = (type: 'subject' | 'progress' | 'goal', id: string) => {
    if (type === 'subject') {
      setSubjects(subjects.filter(s => s.id !== id));
      setStudyProgress(studyProgress.filter(p => p.subjectId !== id));
      setGoals(goals.filter(g => g.subjectId !== id));
    } else if (type === 'progress') {
      const deleted = studyProgress.find(p => p.id === id);
      setStudyProgress(studyProgress.filter(p => p.id !== id));
      if (deleted) updateGoalProgress(deleted.subjectId, deleted.date.substring(0, 7), -deleted.duration);
    } else {
      setGoals(goals.filter(g => g.id !== id));
    }
    message.success(`Đã xóa ${type === 'subject' ? 'môn học' : type === 'progress' ? 'lịch học' : 'mục tiêu'}!`);
  };

  const updateGoalProgress = (subjectId: string, month: string, durationChange: number) => {
    setGoals(goals.map(g => 
      g.subjectId === subjectId && g.month === month 
        ? { ...g, currentHours: Math.max(0, g.currentHours + durationChange / 60) } 
        : g
    ));
  };

  const handleSubmit = (type: 'subject' | 'progress' | 'goal') => {
    const formToUse = type === 'goal' ? goalForm : form;
    formToUse.validateFields().then(values => {
      const editItem = editing[type];
      
      if (type === 'subject') {
        if (editItem) {
          setSubjects(subjects.map(s => s.id === editItem.id ? { ...s, ...values } : s));
          setStudyProgress(studyProgress.map(p => p.subjectId === editItem.id ? { ...p, subjectName: values.name } : p));
          setGoals(goals.map(g => g.subjectId === editItem.id ? { ...g, subjectName: values.name } : g));
        } else {
          setSubjects([...subjects, { id: Date.now().toString(), ...values, color: values.color || COLORS[subjects.length % COLORS.length] }]);
        }
      } else if (type === 'progress') {
        const subject = subjects.find(s => s.id === values.subjectId)!;
        const dateStr = values.date.format('YYYY-MM-DD HH:mm');
        const month = values.date.format('YYYY-MM');
        
        if (editItem) {
          const oldMonth = editItem.date.substring(0, 7);
          setStudyProgress(studyProgress.map(p => 
            p.id === editItem.id ? { ...p, ...values, subjectName: subject.name, date: dateStr, notes: values.notes || '' } : p
          ));
          if (editItem.subjectId === values.subjectId && oldMonth === month) {
            updateGoalProgress(values.subjectId, month, values.duration - editItem.duration);
          } else {
            updateGoalProgress(editItem.subjectId, oldMonth, -editItem.duration);
            updateGoalProgress(values.subjectId, month, values.duration);
          }
        } else {
          setStudyProgress([...studyProgress, { id: Date.now().toString(), ...values, subjectName: subject.name, date: dateStr, notes: values.notes || '' }]);
          updateGoalProgress(values.subjectId, month, values.duration);
        }
      } else {
        const subject = subjects.find(s => s.id === values.subjectId)!;
        const month = values.month.format('YYYY-MM');
        const currentHours = studyProgress.filter(p => p.subjectId === values.subjectId && p.date.startsWith(month)).reduce((sum, p) => sum + p.duration / 60, 0);
        
        if (editItem) {
          setGoals(goals.map(g => g.id === editItem.id ? { ...g, ...values, subjectName: subject.name, month, currentHours } : g));
        } else {
          if (goals.find(g => g.subjectId === values.subjectId && g.month === month)) {
            message.warning('Mục tiêu cho môn học này trong tháng này đã tồn tại!');
            return;
          }
          setGoals([...goals, { id: Date.now().toString(), ...values, subjectName: subject.name, month, currentHours }]);
        }
      }
      
      message.success(`Đã ${editItem ? 'cập nhật' : 'thêm'} ${type === 'subject' ? 'môn học' : type === 'progress' ? 'lịch học' : 'mục tiêu'}!`);
      closeModal(type);
    });
  };

  const currentMonth = getCurrentMonth();
  const stats = {
    totalStudyTime: studyProgress.filter(p => p.date.startsWith(currentMonth)).reduce((sum, p) => sum + p.duration, 0),
    totalGoalTime: goals.filter(g => g.month === currentMonth).reduce((sum, g) => sum + g.targetHours * 60, 0)
  };

  return (
    <PageContainer title="Quản Lý Học Tập" subTitle="Theo dõi tiến độ và mục tiêu học tập" className="study-management">
      <Card className="stats-overview">
        <Row gutter={16}>
          <Col span={8}><Card><Statistic title="Tổng thời gian học tháng này" value={stats.totalStudyTime} suffix="phút" prefix={<ClockCircleOutlined />} /></Card></Col>
          <Col span={8}><Card><Statistic title="Tổng mục tiêu tháng này" value={stats.totalGoalTime} suffix="phút" prefix={<BookOutlined />} /></Card></Col>
          <Col span={8}><Card><Statistic title="Tỷ lệ hoàn thành" value={stats.totalGoalTime > 0 ? (stats.totalStudyTime / stats.totalGoalTime * 100).toFixed(1) : 0} suffix="%" prefix={<CheckCircleOutlined />} /></Card></Col>
        </Row>
      </Card>

      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Môn học" key="1">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('subject')} style={{ marginBottom: 16 }}>Thêm môn học</Button>
            <Table columns={subjectColumns(subjects, (item: any) => openModal('subject', item), (id: string) => handleDelete('subject', id))} dataSource={subjects} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>
          <TabPane tab="Tiến độ học tập" key="2">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('progress')} style={{ marginBottom: 16 }}>Thêm lịch học</Button>
            <Table columns={progressColumns(subjects, (item: any) => openModal('progress', item), (id: string) => handleDelete('progress', id))} dataSource={[...studyProgress].sort((a, b) => b.date.localeCompare(a.date))} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>
          <TabPane tab="Mục tiêu học tập" key="3">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('goal')} style={{ marginBottom: 16 }}>Thêm mục tiêu</Button>
            <Table columns={goalColumns(subjects, (item: any) => openModal('goal', item), (id: string) => handleDelete('goal', id))} dataSource={[...goals].sort((a, b) => b.month.localeCompare(a.month))} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>
        </Tabs>
      </Card>

      <Modal title={editing.subject ? 'Sửa môn học' : 'Thêm môn học'} visible={modals.subject} onOk={() => handleSubmit('subject')} onCancel={() => closeModal('subject')} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên môn học" rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}>
            <Input placeholder="Ví dụ: Toán, Văn, Anh..." />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc" rules={[{ required: true, message: 'Vui lòng chọn màu!' }]}>
            <Select placeholder="Chọn màu">{COLORS.map(color => <Option key={color} value={color}><Tag color={color}>{color}</Tag></Option>)}</Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={editing.progress ? 'Sửa lịch học' : 'Thêm lịch học'} visible={modals.progress} onOk={() => handleSubmit('progress')} onCancel={() => closeModal('progress')} okText="Lưu" cancelText="Hủy" width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
            <Select placeholder="Chọn môn học">{subjects.map(s => <Option key={s.id} value={s.id}><Tag color={s.color}>{s.name}</Tag></Option>)}</Select>
          </Form.Item>
          <Form.Item name="date" label="Thời gian học" rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} placeholder="Chọn ngày giờ" />
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 60" />
          </Form.Item>
          <Form.Item name="content" label="Nội dung đã học" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
            <TextArea rows={3} placeholder="Mô tả nội dung bài học..." />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={2} placeholder="Ghi chú thêm (không bắt buộc)..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={editing.goal ? 'Sửa mục tiêu' : 'Thêm mục tiêu'} visible={modals.goal} onOk={() => handleSubmit('goal')} onCancel={() => closeModal('goal')} okText="Lưu" cancelText="Hủy">
        <Form form={goalForm} layout="vertical">
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
            <Select placeholder="Chọn môn học">{subjects.map(s => <Option key={s.id} value={s.id}><Tag color={s.color}>{s.name}</Tag></Option>)}</Select>
          </Form.Item>
          <Form.Item name="month" label="Tháng" rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}>
            <DatePicker picker="month" format="MM/YYYY" style={{ width: '100%' }} placeholder="Chọn tháng" />
          </Form.Item>
          <Form.Item name="targetHours" label="Mục tiêu (giờ)" rules={[{ required: true, message: 'Vui lòng nhập mục tiêu!' }]}>
            <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} placeholder="Ví dụ: 20" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default QuanLyHocTap;
