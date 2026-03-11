import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Space, Modal, Form, Input, message, Popconfirm, Tag, Switch, Select, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { CauHoi, MonHoc, KhoiKienThuc, FilterCauHoi, getMucDoKhoLabel, getMucDoKhoColor, MUC_DO_KHO_OPTIONS } from '@/models/nganhangcauhoi';
import { cauHoiService, monHocService, khoiKienThucService } from '@/services/NganHangCauHoi';

const CauHoiPage: React.FC = () => {
  const [data, setData] = useState<CauHoi[]>([]);
  const [filteredData, setFilteredData] = useState<CauHoi[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CauHoi | null>(null);
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [khoiKienThucList, setKhoiKienThucList] = useState<KhoiKienThuc[]>([]);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  useEffect(() => { loadData(); loadMonHoc(); loadKhoiKienThuc(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await cauHoiService.getList();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const loadMonHoc = async () => {
    try {
      setMonHocList((await monHocService.getList()).filter(item => item.trangThai !== false));
    } catch (error) {
      console.error('Error loading subjects');
    }
  };

  const loadKhoiKienThuc = async () => {
    try {
      setKhoiKienThucList((await khoiKienThucService.getList()).filter(item => item.trangThai !== false));
    } catch (error) {
      console.error('Error loading knowledge blocks');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const exists = await cauHoiService.checkMaCauHoiExists(values.maCauHoi, editingItem?.id);
      if (exists) {
        message.error('Mã câu hỏi đã tồn tại');
        return;
      }

      if (editingItem) {
        await cauHoiService.update(editingItem.id!, values);
        message.success('Cập nhật thành công');
      } else {
        await cauHoiService.create(values);
        message.success('Thêm mới thành công');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleFilter = async () => {
    try {
      const values = await filterForm.validateFields();
      const filter: FilterCauHoi = {
        monHocId: values.monHocId,
        khoiKienThucId: values.khoiKienThucId,
        mucDoKho: values.mucDoKho,
        tuKhoa: values.tuKhoa?.trim(),
      };
      const result = await cauHoiService.filter(filter);
      setFilteredData(result);
      message.success(`Tìm thấy ${result.length} câu hỏi`);
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  const getMonHocName = (monHocId: string) => monHocList.find(item => item.id === monHocId)?.tenMonHoc || 'N/A';
  const getKhoiKienThucName = (khoiKienThucId: string) => khoiKienThucList.find(item => item.id === khoiKienThucId)?.tenKhoiKienThuc || 'N/A';

  const columns = [
    { title: 'STT', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Mã câu hỏi', dataIndex: 'maCauHoi', key: 'maCauHoi', width: 120 },
    { title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', width: 150, render: (monHocId: string) => getMonHocName(monHocId) },
    { title: 'Khối kiến thức', dataIndex: 'khoiKienThucId', key: 'khoiKienThucId', width: 150, render: (khoiKienThucId: string) => getKhoiKienThucName(khoiKienThucId) },
    { title: 'Nội dung câu hỏi', dataIndex: 'noiDung', key: 'noiDung', ellipsis: true },
    {
      title: 'Mức độ khó', dataIndex: 'mucDoKho', key: 'mucDoKho', width: 120, align: 'center' as const,
      render: (mucDoKho: string) => <Tag color={getMucDoKhoColor(mucDoKho as any)}>{getMucDoKhoLabel(mucDoKho as any)}</Tag>
    },
    { title: 'Điểm', dataIndex: 'diemToiDa', key: 'diemToiDa', width: 80, align: 'center' as const },
    {
      title: 'Thao tác', key: 'action', width: 150, align: 'center' as const, fixed: 'right' as const,
      render: (_: any, record: CauHoi) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => { setEditingItem(record); form.setFieldsValue(record); setModalVisible(true); }}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => { cauHoiService.delete(record.id!); message.success('Xóa thành công'); loadData(); }} okText="Có" cancelText="Không">
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const statsByDifficulty = {
    De: filteredData.filter(item => item.mucDoKho === 'De').length,
    TrungBinh: filteredData.filter(item => item.mucDoKho === 'TrungBinh').length,
    Kho: filteredData.filter(item => item.mucDoKho === 'Kho').length,
    RatKho: filteredData.filter(item => item.mucDoKho === 'RatKho').length,
  };

  return (
    <PageContainer title="Quản lý câu hỏi" extra={[
      <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); form.setFieldsValue({ trangThai: true, diemToiDa: 1 }); setModalVisible(true); }}>Thêm câu hỏi</Button>
    ]}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="Tổng số câu hỏi" value={filteredData.length} prefix={<QuestionCircleOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Dễ" value={statsByDifficulty.De} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="Trung bình" value={statsByDifficulty.TrungBinh} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="Khó & Rất khó" value={statsByDifficulty.Kho + statsByDifficulty.RatKho} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      <Card title="Tìm kiếm câu hỏi" style={{ marginBottom: 16 }}>
        <Form form={filterForm} layout="inline">
          <Form.Item name="tuKhoa" style={{ width: 250 }}><Input placeholder="Tìm theo mã hoặc nội dung" /></Form.Item>
          <Form.Item name="monHocId" style={{ width: 200 }}>
            <Select placeholder="Chọn môn học" allowClear>
              {monHocList.map(item => <Select.Option key={item.id} value={item.id!}>{item.tenMonHoc}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="khoiKienThucId" style={{ width: 200 }}>
            <Select placeholder="Chọn khối kiến thức" allowClear>
              {khoiKienThucList.map(item => <Select.Option key={item.id} value={item.id!}>{item.tenKhoiKienThuc}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="mucDoKho" style={{ width: 150 }}>
            <Select placeholder="Mức độ khó" allowClear>
              {MUC_DO_KHO_OPTIONS.map(item => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleFilter}>Tìm kiếm</Button>
              <Button onClick={() => { filterForm.resetFields(); setFilteredData(data); }}>Đặt lại</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table columns={columns} dataSource={filteredData} rowKey="id" loading={loading} scroll={{ x: 1200 }}
          pagination={{ showSizeChanger: true, showTotal: (total) => `Tổng số ${total} câu hỏi` }} />
      </Card>

      <Modal title={editingItem ? 'Chỉnh sửa câu hỏi' : 'Thêm mới câu hỏi'} visible={modalVisible}
        onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={800} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical" initialValues={{ trangThai: true, diemToiDa: 1 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã câu hỏi" name="maCauHoi"
                rules={[{ required: true, message: 'Vui lòng nhập mã' }, { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ chứa chữ in hoa và số' }]}>
                <Input placeholder="VD: CH001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Môn học" name="monHocId" rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
                <Select placeholder="Chọn môn học">
                  {monHocList.map(item => <Select.Option key={item.id} value={item.id!}>{item.tenMonHoc}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Khối kiến thức" name="khoiKienThucId" rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}>
                <Select placeholder="Chọn khối kiến thức">
                  {khoiKienThucList.map(item => <Select.Option key={item.id} value={item.id!}>{item.tenKhoiKienThuc}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mức độ khó" name="mucDoKho" rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}>
                <Select placeholder="Chọn mức độ khó">
                  {MUC_DO_KHO_OPTIONS.map(item => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Nội dung câu hỏi" name="noiDung" rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}>
            <Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi" />
          </Form.Item>
          <Form.Item label="Đáp án" name="dapAn"><Input.TextArea rows={4} placeholder="Nhập đáp án (tùy chọn)" /></Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Điểm tối đa" name="diemToiDa" rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}>
                <Input type="number" min="0.5" step="0.5" placeholder="VD: 1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="trangThai" valuePropName="checked">
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default CauHoiPage;
