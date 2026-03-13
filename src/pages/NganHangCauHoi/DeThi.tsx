import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Form, Modal, message } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import {
  DeThi,
  MonHoc,
  KhoiKienThuc,
  CauTrucDeThi,
  CauTrucChiTiet,
  TaoDeThiRequest,
  getMucDoKhoLabel,
} from '@/models/nganhangcauhoi';
import { deThiService, monHocService, khoiKienThucService, cauTrucDeThiService } from '@/services/NganHangCauHoi';
import DeThiTable from './components/DeThi/DeThiTable';
import CreateDeThiModal from './components/DeThi/CreateDeThiModal';
import ViewDeThiModal from './components/DeThi/ViewDeThiModal';

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

  useEffect(() => {
    loadData();
    loadMonHoc();
    loadKhoiKienThuc();
  }, []);

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

  const handleCauTrucChange = (cauTrucId: string) => {
    const cauTruc = cauTrucList.find(item => item.id === cauTrucId);
    if (cauTruc) {
      setChiTietList(cauTruc.chiTiet);
    }
  };

  const handleChiTietChange = (index: number, field: keyof CauTrucChiTiet, value: any) => {
    const nextList = [...chiTietList];
    nextList[index] = { ...nextList[index], [field]: value };
    setChiTietList(nextList);
  };

  const handleSubmitCreate = async () => {
    try {
      const values = await createForm.validateFields();

      if (chiTietList.length === 0) {
        message.warning('Vui lòng thêm ít nhất một chi tiết cấu trúc đề thi');
        return;
      }

      for (let index = 0; index < chiTietList.length; index += 1) {
        const chiTiet = chiTietList[index];
        if (!chiTiet.khoiKienThucId) {
          message.warning(`Vui lòng chọn khối kiến thức cho dòng ${index + 1}`);
          return;
        }
        if (!chiTiet.soCauHoi || chiTiet.soCauHoi < 1) {
          message.warning(`Số câu hỏi phải lớn hơn 0 cho dòng ${index + 1}`);
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
        return;
      }

      Modal.error({
        title: result.message,
        content: (
          <div>
            <p>Không đủ câu hỏi cho các yêu cầu sau:</p>
            <ul>
              {result.errors?.map((error, index) => {
                const khoiKienThuc = khoiKienThucList.find(item => item.id === error.khoiKienThucId);
                return (
                  <li key={index}>
                    <strong>{khoiKienThuc?.tenKhoiKienThuc}</strong> - {getMucDoKhoLabel(error.mucDoKho as any)}:
                    {' '}Yêu cầu <strong>{error.yeuCau}</strong> câu, chỉ có <strong>{error.coSan}</strong> câu
                  </li>
                );
              })}
            </ul>
            <p>Vui lòng thêm câu hỏi hoặc điều chỉnh cấu trúc đề thi.</p>
          </div>
        ),
        width: 600,
      });
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

      for (let index = 0; index < chiTietList.length; index += 1) {
        if (!chiTietList[index].khoiKienThucId) {
          message.warning(`Vui lòng chọn khối kiến thức cho dòng ${index + 1}`);
          return;
        }
      }

      const tongSoCau = chiTietList.reduce((sum, item) => sum + item.soCauHoi, 0);
      const tongDiem = chiTietList.reduce((sum, item) => sum + item.soCauHoi * (item.diemMoiCau || 1), 0);

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

  const handleDelete = async (record: DeThi) => {
    await deThiService.delete(record.id!);
    message.success('Xóa thành công');
    loadData();
  };

  const handleView = (record: DeThi) => {
    setSelectedDeThi(record);
    setViewModalVisible(true);
  };

  return (
    <PageContainer
      title="Quản lý đề thi"
      extra={[
        <Button
          key="create"
          type="primary"
          icon={<FileAddOutlined />}
          onClick={() => {
            setChiTietList([]);
            createForm.resetFields();
            setSelectedMonHoc('');
            setCreateModalVisible(true);
          }}
        >
          Tạo đề thi
        </Button>,
      ]}
    >
      <Card>
        <DeThiTable
          data={data}
          loading={loading}
          monHocList={monHocList}
          onView={handleView}
          onDelete={handleDelete}
        />
      </Card>

      <CreateDeThiModal
        visible={createModalVisible}
        form={createForm}
        monHocList={monHocList}
        khoiKienThucList={khoiKienThucList}
        cauTrucList={cauTrucList}
        chiTietList={chiTietList}
        selectedMonHoc={selectedMonHoc}
        onMonHocChange={handleMonHocChange}
        onCauTrucChange={handleCauTrucChange}
        onChiTietChange={handleChiTietChange}
        onAddChiTiet={() =>
          setChiTietList([
            ...chiTietList,
            { khoiKienThucId: '', mucDoKho: 'De', soCauHoi: 1, diemMoiCau: 1 },
          ])
        }
        onRemoveChiTiet={(index) => setChiTietList(chiTietList.filter((_, itemIndex) => itemIndex !== index))}
        onOk={handleSubmitCreate}
        onCancel={() => setCreateModalVisible(false)}
        onSaveStructure={handleSaveStructure}
      />

      <ViewDeThiModal
        visible={viewModalVisible}
        deThi={selectedDeThi}
        monHocList={monHocList}
        khoiKienThucList={khoiKienThucList}
        onClose={() => setViewModalVisible(false)}
      />
    </PageContainer>
  );
};

export default DeThiPage;