import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Space, Modal, Form, Input, message, Popconfirm, Select, Row, Col, InputNumber, Divider, Alert, Tag, Descriptions, Badge } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, FileAddOutlined, SaveOutlined } from '@ant-design/icons';
import { DeThi, MonHoc, KhoiKienThuc, CauTrucDeThi, CauTrucChiTiet, TaoDeThiRequest, getMucDoKhoLabel, getMucDoKhoColor, MUC_DO_KHO_OPTIONS } from '@/models/nganhangcauhoi';
import { deThiService, monHocService, khoiKienThucService, cauTrucDeThiService } from '@/services/NganHangCauHoi';

const DeThiPage: React.FC = () => {
  const [data, setData] = useState<DeThi[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedDeThi, setSelectedDeThi] = useState<DeThi | null>(null);
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [khoiKienThucList, setKhoiKienThucList] = useState<KhoiKienThuc[]>([]);
  const [cauTrucList, setCauTrucList] = useState<CauTrucDeThi[]>([]);
  const [chiTietList, setChiTietList] = useState<CauTrucChiTiet[]>([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState<string>('');
  const [createForm] = Form.useForm();

  useEffect(() => { loadData(); loadMonHoc(); loadKhoiKienThuc(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      setData(await deThiService.getList());
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

  const loadCauTrucDeThi = async (monHocId: string) => {
    try {
      setCauTrucList(await cauTrucDeThiService.getByMonHoc(monHocId));
    } catch (error) {
      console.error('Error loading exam structures');
    }
  };

  const handleMonHocChange = (monHocId: string) => {
    setSelectedMonHoc(monHocId);
    loadCauTrucDeThi(monHocId);
    createForm.setFieldsValue({ cauTrucDeThiId: undefined });
    setChiTietList([]);
  };

  const handleCauTrucChange = async (cauTrucId: string) => {
    const cauTruc = cauTrucList.find(item => item.id === cauTrucId);
    if (cauTruc) setChiTietList(cauTruc.chiTiet);
  };

  const handleChiTietChange = (index: number, field: keyof CauTrucChiTiet, value: any) => {
    const newList = [...chiTietList];
    newList[index] = { ...newList[index], [field]: value };
    setChiTietList(newList);
  };

  const handleSubmitCreate = async () => {
    try {
      const values = await createForm.validateFields();
      
      if (chiTietList.length === 0) {
        message.warning('Vui lòng thêm ít nhất một chi tiết cấu trúc đề thi');
        return;
      }

      for (let i = 0; i < chiTietList.length; i++) {
        const chiTiet = chiTietList[i];
        if (!chiTiet.khoiKienThucId) {
          message.warning(`Vui lòng chọn khối kiến thức cho dòng ${i + 1}`);
          return;
        }
        if (!chiTiet.soCauHoi || chiTiet.soCauHoi < 1) {
          message.warning(`Số câu hỏi phải lớn hơn 0 cho dòng ${i + 1}`);
          return;
        }
      }

      const request: TaoDeThiRequest = {
        tenDeThi: values.tenDeThi,
        monHocId: values.monHocId,
        cauTrucDeThiId: values.cauTrucDeThiId,
        cauTrucChiTiet: chiTietList,
        thoiGianLamBai: values.thoiGianLamBai,
        ghiChu: values.ghiChu,
      };

      const result = await deThiService.taoDeThi(request);

      if (result.success) {
        message.success(result.message);
        setCreateModalVisible(false);
        loadData();
      } else {
        Modal.error({
          title: result.message,
          content: (
            <div>
              <p>Không đủ câu hỏi cho các yêu cầu sau:</p>
              <ul>
                {result.errors?.map((error, index) => {
                  const khoiKienThuc = khoiKienThucList.find(k => k.id === error.khoiKienThucId);
                  return (
                    <li key={index}>
                      <strong>{khoiKienThuc?.tenKhoiKienThuc}</strong> - {getMucDoKhoLabel(error.mucDoKho as any)}:
                      Yêu cầu <strong>{error.yeuCau}</strong> câu, chỉ có <strong>{error.coSan}</strong> câu
                    </li>
                  );
                })}
              </ul>
              <p>Vui lòng thêm câu hỏi hoặc điều chỉnh cấu trúc đề thi.</p>
            </div>
          ),
          width: 600,
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSaveStructure = async () => {
    try {
      const values = await createForm.validateFields(['tenCauTruc', 'monHocId']);
      
      if (chiTietList.length === 0) {
        message.warning('Vui lòng thêm ít nhất một chi tiết cấu trúc đề thi');
        return;
      }

      for (let i = 0; i < chiTietList.length; i++) {
        if (!chiTietList[i].khoiKienThucId) {
          message.warning(`Vui lòng chọn khối kiến thức cho dòng ${i + 1}`);
          return;
        }
      }

      const tongSoCau = chiTietList.reduce((sum, item) => sum + item.soCauHoi, 0);
      const tongDiem = chiTietList.reduce((sum, item) => sum + (item.soCauHoi * (item.diemMoiCau || 1)), 0);

      const cauTruc: CauTrucDeThi = {
        tenCauTruc: values.tenCauTruc || `Cấu trúc ${Date.now()}`,
        monHocId: values.monHocId,
        chiTiet: chiTietList,
        tongSoCau,
        tongDiem,
        trangThai: true,
      };

      await cauTrucDeThiService.create(cauTruc);
      message.success('Lưu cấu trúc đề thi thành công');
      loadCauTrucDeThi(values.monHocId);
    } catch (error) {
      message.error('Lưu cấu trúc thất bại');
    }
  };

  const getMonHocName = (monHocId: string) => monHocList.find(item => item.id === monHocId)?.tenMonHoc || 'N/A';
  const getKhoiKienThucName = (khoiKienThucId: string) => khoiKienThucList.find(item => item.id === khoiKienThucId)?.tenKhoiKienThuc || 'N/A';

  const columns = [
    { title: 'STT', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Mã đề thi', dataIndex: 'maDeThi', key: 'maDeThi', width: 120 },
    { title: 'Tên đề thi', dataIndex: 'tenDeThi', key: 'tenDeThi' },
    { title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', width: 150, render: (monHocId: string) => getMonHocName(monHocId) },
    { title: 'Số câu', dataIndex: 'tongSoCau', key: 'tongSoCau', width: 80, align: 'center' as const },
    { title: 'Tổng điểm', dataIndex: 'tongDiem', key: 'tongDiem', width: 100, align: 'center' as const, render: (diem: number) => <Tag color="blue">{diem} điểm</Tag> },
    { title: 'Thời gian', dataIndex: 'thoiGianLamBai', key: 'thoiGianLamBai', width: 100, align: 'center' as const, render: (time: number) => time ? `${time} phút` : 'N/A' },
    { title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao', width: 120, render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A' },
    {
      title: 'Thao tác', key: 'action', width: 150, align: 'center' as const, fixed: 'right' as const,
      render: (_: any, record: DeThi) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => { setSelectedDeThi(record); setViewModalVisible(true); }}>Xem</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => { deThiService.delete(record.id!); message.success('Xóa thành công'); loadData(); }} okText="Có" cancelText="Không">
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <PageContainer title="Quản lý đề thi" extra={[
      <Button key="create" type="primary" icon={<FileAddOutlined />} onClick={() => { setChiTietList([]); createForm.resetFields(); setCreateModalVisible(true); }}>Tạo đề thi</Button>
    ]}>
      <Card>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} scroll={{ x: 1200 }}
          pagination={{ showSizeChanger: true, showTotal: (total) => `Tổng số ${total} đề thi` }} />
      </Card>

      <Modal title="Tạo đề thi mới" visible={createModalVisible} onOk={handleSubmitCreate}
        onCancel={() => setCreateModalVisible(false)} width={900} okText="Tạo đề thi" cancelText="Hủy">
        <Form form={createForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên đề thi" name="tenDeThi" rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}>
                <Input placeholder="VD: Đề thi giữa kỳ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Môn học" name="monHocId" rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
                <Select placeholder="Chọn môn học" onChange={handleMonHocChange}>
                  {monHocList.map(item => <Select.Option key={item.id} value={item.id!}>{item.tenMonHoc}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Cấu trúc đề thi có sẵn (tùy chọn)" name="cauTrucDeThiId">
                <Select placeholder="Chọn cấu trúc hoặc tự tạo" allowClear onChange={handleCauTrucChange} disabled={!selectedMonHoc}>
                  {cauTrucList.map(item => <Select.Option key={item.id} value={item.id!}>{item.tenCauTruc} ({item.tongSoCau} câu - {item.tongDiem} điểm)</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời gian làm bài (phút)" name="thoiGianLamBai">
                <InputNumber min={15} max={300} style={{ width: '100%' }} placeholder="VD: 90" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Tên cấu trúc (để lưu cấu trúc này)" name="tenCauTruc">
            <Input placeholder="VD: Cấu trúc đề thi chuẩn" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="ghiChu">
            <Input.TextArea rows={2} placeholder="Ghi chú về đề thi" />
          </Form.Item>

          <Divider>Cấu trúc đề thi</Divider>
          <Alert message="Thêm các yêu cầu về số lượng câu hỏi theo khối kiến thức và mức độ khó. Hệ thống sẽ tự động chọn ngẫu nhiên câu hỏi phù hợp."
            type="info" showIcon style={{ marginBottom: 16 }} />

          {chiTietList.map((chiTiet, index) => (
            <Card key={index} size="small" style={{ marginBottom: 8 }} title={`Yêu cầu ${index + 1}`}
              extra={<Button type="link" danger size="small" icon={<DeleteOutlined />} onClick={() => setChiTietList(chiTietList.filter((_, i) => i !== index))}>Xóa</Button>}>
              <Row gutter={8}>
                <Col span={8}>
                  <Select placeholder="Khối kiến thức" value={chiTiet.khoiKienThucId}
                    onChange={(value) => handleChiTietChange(index, 'khoiKienThucId', value)} style={{ width: '100%' }}>
                    {khoiKienThucList.map(item => <Select.Option key={item.id} value={item.id!}>{item.tenKhoiKienThuc}</Select.Option>)}
                  </Select>
                </Col>
                <Col span={6}>
                  <Select placeholder="Mức độ" value={chiTiet.mucDoKho}
                    onChange={(value) => handleChiTietChange(index, 'mucDoKho', value)} style={{ width: '100%' }}>
                    {MUC_DO_KHO_OPTIONS.map(item => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                  </Select>
                </Col>
                <Col span={5}>
                  <InputNumber placeholder="Số câu" min={1} value={chiTiet.soCauHoi}
                    onChange={(value) => handleChiTietChange(index, 'soCauHoi', value || 1)} style={{ width: '100%' }} />
                </Col>
                <Col span={5}>
                  <InputNumber placeholder="Điểm/câu" min={0.5} step={0.5} value={chiTiet.diemMoiCau}
                    onChange={(value) => handleChiTietChange(index, 'diemMoiCau', value || 1)} style={{ width: '100%' }} />
                </Col>
              </Row>
            </Card>
          ))}

          <Space style={{ marginTop: 8 }}>
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => setChiTietList([...chiTietList, { khoiKienThucId: '', mucDoKho: 'De', soCauHoi: 1, diemMoiCau: 1 }])}>
              Thêm yêu cầu
            </Button>
            <Button icon={<SaveOutlined />} onClick={handleSaveStructure} disabled={!selectedMonHoc || chiTietList.length === 0}>
              Lưu cấu trúc
            </Button>
          </Space>

          {chiTietList.length > 0 && (
            <Alert style={{ marginTop: 16 }}
              message={<span>Tổng cộng: <strong>{chiTietList.reduce((sum, item) => sum + item.soCauHoi, 0)}</strong> câu hỏi, 
                <strong> {chiTietList.reduce((sum, item) => sum + (item.soCauHoi * (item.diemMoiCau || 1)), 0)}</strong> điểm</span>}
              type="success" />
          )}
        </Form>
      </Modal>

      <Modal title="Chi tiết đề thi" visible={viewModalVisible} onCancel={() => setViewModalVisible(false)} width={1000}
        footer={[<Button key="close" onClick={() => setViewModalVisible(false)}>Đóng</Button>]}>
        {selectedDeThi && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã đề thi">{selectedDeThi.maDeThi}</Descriptions.Item>
              <Descriptions.Item label="Tên đề thi">{selectedDeThi.tenDeThi}</Descriptions.Item>
              <Descriptions.Item label="Môn học">{getMonHocName(selectedDeThi.monHocId)}</Descriptions.Item>
              <Descriptions.Item label="Tổng số câu"><Badge count={selectedDeThi.tongSoCau} showZero /></Descriptions.Item>
              <Descriptions.Item label="Tổng điểm"><Tag color="blue">{selectedDeThi.tongDiem} điểm</Tag></Descriptions.Item>
              <Descriptions.Item label="Thời gian làm bài">{selectedDeThi.thoiGianLamBai} phút</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={2}>
                {selectedDeThi.ngayTao ? new Date(selectedDeThi.ngayTao).toLocaleString('vi-VN') : 'N/A'}
              </Descriptions.Item>
              {selectedDeThi.ghiChu && <Descriptions.Item label="Ghi chú" span={2}>{selectedDeThi.ghiChu}</Descriptions.Item>}
            </Descriptions>

            <Divider>Danh sách câu hỏi</Divider>
            <Table dataSource={selectedDeThi.danhSachCauHoi} rowKey="cauHoiId" pagination={false} scroll={{ y: 400 }}
              columns={[
                { title: 'Câu', dataIndex: 'thuTu', key: 'thuTu', width: 60, align: 'center' as const },
                { title: 'Mã câu hỏi', dataIndex: ['cauHoi', 'maCauHoi'], key: 'maCauHoi', width: 120 },
                { title: 'Nội dung', dataIndex: ['cauHoi', 'noiDung'], key: 'noiDung', ellipsis: true },
                { title: 'Khối kiến thức', dataIndex: ['cauHoi', 'khoiKienThucId'], key: 'khoiKienThucId', width: 150, render: (khoiKienThucId: string) => getKhoiKienThucName(khoiKienThucId) },
                { title: 'Mức độ', dataIndex: ['cauHoi', 'mucDoKho'], key: 'mucDoKho', width: 120, render: (mucDoKho: string) => <Tag color={getMucDoKhoColor(mucDoKho as any)}>{getMucDoKhoLabel(mucDoKho as any)}</Tag> },
                { title: 'Điểm', dataIndex: 'diem', key: 'diem', width: 80, align: 'center' as const }
              ]} />
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default DeThiPage;
