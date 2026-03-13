import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CauHoi, MonHoc, KhoiKienThuc, FilterCauHoi } from '@/models/nganhangcauhoi';
import { cauHoiService, monHocService, khoiKienThucService } from '@/services/NganHangCauHoi';
import CauHoiStats from './components/CauHoi/CauHoiStats';
import CauHoiFilter from './components/CauHoi/CauHoiFilter';
import CauHoiTable from './components/CauHoi/CauHoiTable';
import CauHoiFormModal from './components/CauHoi/CauHoiFormModal';

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

  useEffect(() => {
    loadData();
    loadMonHoc();
    loadKhoiKienThuc();
  }, []);

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

  const handleEdit = (record: CauHoi) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: CauHoi) => {
    await cauHoiService.delete(record.id!);
    message.success('Xóa thành công');
    loadData();
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ trangThai: true, diemToiDa: 1 });
    setModalVisible(true);
  };

  return (
    <PageContainer
      title="Quản lý câu hỏi"
      extra={[
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm câu hỏi
        </Button>,
      ]}
    >
      <CauHoiStats filteredData={filteredData} />

      <CauHoiFilter
        filterForm={filterForm}
        monHocList={monHocList}
        khoiKienThucList={khoiKienThucList}
        onFilter={handleFilter}
        onReset={() => {
          filterForm.resetFields();
          setFilteredData(data);
        }}
      />

      <Card>
        <CauHoiTable
          data={filteredData}
          loading={loading}
          monHocList={monHocList}
          khoiKienThucList={khoiKienThucList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <CauHoiFormModal
        visible={modalVisible}
        editingItem={editingItem}
        form={form}
        monHocList={monHocList}
        khoiKienThucList={khoiKienThucList}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </PageContainer>
  );
};

export default CauHoiPage;