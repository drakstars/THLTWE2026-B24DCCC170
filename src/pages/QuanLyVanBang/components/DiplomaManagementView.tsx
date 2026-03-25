import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
} from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment, { Moment } from 'moment';
import { useDiplomaContext } from '../context/DiplomaContext';
import {
  AppendixFieldConfig,
  DiplomaRecord,
  GraduationDecision,
  FieldType,
  DiplomaSearchParams,
} from '../types';

const { TabPane } = Tabs;
const { Option } = Select;

const DiplomaManagementView: React.FC = () => {
  const {
    state,
    loading,
    booksById,
    decisionsById,
    createBook,
    saveDecision,
    removeDecision,
    saveField,
    removeField,
    saveDiploma,
    removeDiploma,
    searchDiplomas,
    increaseLookup,
  } = useDiplomaContext();

  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [decisionModalVisible, setDecisionModalVisible] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [diplomaModalVisible, setDiplomaModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const [editingDecision, setEditingDecision] = useState<GraduationDecision | null>(null);
  const [editingField, setEditingField] = useState<AppendixFieldConfig | null>(null);
  const [editingDiploma, setEditingDiploma] = useState<DiplomaRecord | null>(null);
  const [detailDiploma, setDetailDiploma] = useState<DiplomaRecord | null>(null);

  const [searchResult, setSearchResult] = useState<DiplomaRecord[]>([]);

  const [bookForm] = Form.useForm();
  const [decisionForm] = Form.useForm();
  const [fieldForm] = Form.useForm();
  const [diplomaForm] = Form.useForm();
  const [searchForm] = Form.useForm();

  const selectedDecisionId = Form.useWatch('decisionId', diplomaForm) as number | undefined;

  const selectedDecision = selectedDecisionId
    ? (decisionsById[selectedDecisionId] as GraduationDecision)
    : undefined;

  const getNextEntryNumber = (bookId?: number) => {
    if (!bookId) return undefined;
    const book = booksById[bookId];
    if (!book) return undefined;
    return book.currentEntryNumber + 1;
  };

  const renderInputByFieldType = (field: AppendixFieldConfig) => {
    if (field.type === 'Number') return <InputNumber style={{ width: '100%' }} />;
    if (field.type === 'Date') return <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />;
    return <Input />;
  };

  const handleCreateBook = async (values: { year: number }) => {
    try {
      await createBook(values.year);
      message.success('Tạo sổ văn bằng mới thành công. Số vào sổ được reset về 1 cho sổ mới.');
      setBookModalVisible(false);
      bookForm.resetFields();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const openDecisionModal = (decision?: GraduationDecision) => {
    if (decision) {
      setEditingDecision(decision);
      decisionForm.setFieldsValue({
        decisionNumber: decision.decisionNumber,
        issuedDate: moment(decision.issuedDate),
        summary: decision.summary,
        bookId: decision.bookId,
      });
    } else {
      setEditingDecision(null);
      decisionForm.resetFields();
    }
    setDecisionModalVisible(true);
  };

  const submitDecision = async (values: {
    decisionNumber: string;
    issuedDate: Moment;
    summary: string;
    bookId: number;
  }) => {
    try {
      await saveDecision(
        {
          decisionNumber: values.decisionNumber,
          issuedDate: values.issuedDate.toISOString(),
          summary: values.summary,
          bookId: values.bookId,
        },
        editingDecision?.id,
      );

      message.success(editingDecision ? 'Cập nhật quyết định thành công.' : 'Thêm quyết định mới thành công.');
      setDecisionModalVisible(false);
      setEditingDecision(null);
      decisionForm.resetFields();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const handleDeleteDecision = async (decisionId: number) => {
    try {
      await removeDecision(decisionId);
      message.success('Xóa quyết định thành công.');
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const openFieldModal = (field?: AppendixFieldConfig) => {
    if (field) {
      setEditingField(field);
      fieldForm.setFieldsValue({
        name: field.name,
        type: field.type,
      });
    } else {
      setEditingField(null);
      fieldForm.resetFields();
      fieldForm.setFieldsValue({ type: 'String' });
    }
    setFieldModalVisible(true);
  };

  const submitField = async (values: { name: string; type: FieldType }) => {
    try {
      await saveField(
        {
          name: values.name,
          type: values.type,
        },
        editingField?.id,
      );

      message.success(editingField ? 'Cập nhật trường biểu mẫu thành công.' : 'Thêm trường cấu hình thành công.');
      setFieldModalVisible(false);
      setEditingField(null);
      fieldForm.resetFields();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    try {
      await removeField(fieldId);
      message.success('Đã xóa trường cấu hình và dữ liệu tương ứng khỏi văn bằng.');
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const openDiplomaModal = (diploma?: DiplomaRecord) => {
    if (diploma) {
      setEditingDiploma(diploma);
      const payload: Record<string, unknown> = {
        decisionId: diploma.decisionId,
        diplomaNumber: diploma.diplomaNumber,
        studentCode: diploma.studentCode,
        fullName: diploma.fullName,
        dateOfBirth: moment(diploma.dateOfBirth),
      };

      state.fieldConfigs.forEach((field) => {
        const value = diploma.extraData[field.key];
        payload[`extra_${field.key}`] =
          field.type === 'Date' && typeof value === 'string' && value ? moment(value) : value;
      });

      diplomaForm.setFieldsValue(payload);
    } else {
      setEditingDiploma(null);
      diplomaForm.resetFields();
    }

    setDiplomaModalVisible(true);
  };

  const submitDiploma = async (values: {
    decisionId: number;
    diplomaNumber: string;
    studentCode: string;
    fullName: string;
    dateOfBirth: Moment;
    [key: string]: unknown;
  }) => {
    const extraData: Record<string, string | number> = {};
    state.fieldConfigs.forEach((field) => {
      const raw = values[`extra_${field.key}`];
      if (raw === undefined || raw === null || raw === '') return;
      if (field.type === 'Date') {
        extraData[field.key] = (raw as Moment).toISOString();
      } else {
        extraData[field.key] = raw as string | number;
      }
    });

    try {
      await saveDiploma(
        {
          decisionId: values.decisionId,
          diplomaNumber: values.diplomaNumber,
          studentCode: values.studentCode,
          fullName: values.fullName,
          dateOfBirth: values.dateOfBirth.toISOString(),
          extraData,
        },
        editingDiploma?.id,
      );

      message.success(editingDiploma ? 'Cập nhật văn bằng thành công.' : 'Thêm văn bằng thành công.');
      setDiplomaModalVisible(false);
      setEditingDiploma(null);
      diplomaForm.resetFields();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const handleDeleteDiploma = async (diplomaId: number) => {
    try {
      await removeDiploma(diplomaId);
      message.success('Xóa văn bằng thành công.');
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const runSearch = async (values: {
    diplomaNumber?: string;
    entryNumber?: number;
    studentCode?: string;
    fullName?: string;
    dateOfBirth?: Moment;
  }) => {
    const activeFilters = [
      values.diplomaNumber?.trim(),
      values.entryNumber,
      values.studentCode?.trim(),
      values.fullName?.trim(),
      values.dateOfBirth,
    ].filter((item) => item !== undefined && item !== null && item !== '').length;

    if (activeFilters < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số tra cứu.');
      setSearchResult([]);
      return;
    }

    const searchPayload: DiplomaSearchParams = {
      diplomaNumber: values.diplomaNumber,
      entryNumber: values.entryNumber,
      studentCode: values.studentCode,
      fullName: values.fullName,
      dateOfBirth: values.dateOfBirth?.toISOString(),
    };

    const result = await searchDiplomas(searchPayload);
    setSearchResult(result);
    message.success(`Tìm thấy ${result.length} văn bằng phù hợp.`);
  };

  const openDetailFromSearch = async (diploma: DiplomaRecord) => {
    setDetailDiploma(diploma);
    setDetailModalVisible(true);

    if (diploma.decisionId) {
      await increaseLookup(diploma.decisionId);
    }
  };

  const bookColumns: ColumnsType<typeof state.books[number]> = [
    { title: 'Năm', dataIndex: 'year', key: 'year' },
    {
      title: 'Số vào sổ hiện tại',
      dataIndex: 'currentEntryNumber',
      key: 'currentEntryNumber',
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_value, record) => <Badge status="processing" text={`Số tiếp theo: ${record.currentEntryNumber + 1}`} />,
    },
  ];

  const decisionColumns: ColumnsType<GraduationDecision> = [
    { title: 'Số QĐ', dataIndex: 'decisionNumber', key: 'decisionNumber' },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issuedDate',
      key: 'issuedDate',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    { title: 'Trích yếu', dataIndex: 'summary', key: 'summary' },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'bookId',
      key: 'bookId',
      render: (value) => booksById[value]?.year ?? 'Không xác định',
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'lookupCount',
      key: 'lookupCount',
      render: (value) => <Tag color="geekblue">{value}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_value, record) => (
        <Space>
          <Button size="small" onClick={() => openDecisionModal(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa quyết định này?" onConfirm={() => handleDeleteDecision(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fieldColumns: ColumnsType<AppendixFieldConfig> = [
    { title: 'Tên trường', dataIndex: 'name', key: 'name' },
    { title: 'Khóa dữ liệu', dataIndex: 'key', key: 'key' },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'type',
      key: 'type',
      render: (value) => <Tag color={value === 'String' ? 'cyan' : value === 'Number' ? 'gold' : 'green'}>{value}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_value, record) => (
        <Space>
          <Button size="small" onClick={() => openFieldModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa trường cấu hình? Dữ liệu đã nhập theo trường này cũng sẽ bị xóa."
            onConfirm={() => handleDeleteField(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const diplomaColumns: ColumnsType<DiplomaRecord> = [
    {
      title: 'Sổ năm',
      dataIndex: 'bookId',
      key: 'bookId',
      render: (value) => booksById[value]?.year ?? '-',
    },
    {
      title: 'Số vào sổ',
      dataIndex: 'entryNumber',
      key: 'entryNumber',
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    { title: 'Số hiệu văn bằng', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
    { title: 'MSV', dataIndex: 'studentCode', key: 'studentCode' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Quyết định',
      dataIndex: 'decisionId',
      key: 'decisionId',
      render: (value) => decisionsById[value]?.decisionNumber ?? '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_value, record) => (
        <Space>
          <Button size="small" onClick={() => openDiplomaModal(record)}>
            Sửa
          </Button>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDetailFromSearch(record)}>
            Xem
          </Button>
          <Popconfirm title="Xóa văn bằng này?" onConfirm={() => handleDeleteDiploma(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const searchColumns: ColumnsType<DiplomaRecord> = [
    { title: 'Số hiệu văn bằng', dataIndex: 'diplomaNumber', key: 'diplomaNumber' },
    { title: 'Số vào sổ', dataIndex: 'entryNumber', key: 'entryNumber' },
    { title: 'MSV', dataIndex: 'studentCode', key: 'studentCode' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Quyết định',
      dataIndex: 'decisionId',
      key: 'decisionId',
      render: (value) => decisionsById[value]?.decisionNumber ?? '-',
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (_value, record) => (
        <Button size="small" icon={<FileTextOutlined />} onClick={() => openDetailFromSearch(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Card title="Quản Lý Văn Bằng Tốt Nghiệp">
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={8}>
            <Statistic title="Sổ văn bằng" value={state.books.length} />
          </Col>
          <Col xs={24} md={8}>
            <Statistic title="Quyết định tốt nghiệp" value={state.decisions.length} />
          </Col>
          <Col xs={24} md={8}>
            <Statistic title="Tổng văn bằng" value={state.diplomas.length} />
          </Col>
        </Row>

        <Tabs defaultActiveKey="books">
          <TabPane tab="Sổ văn bằng" key="books">
            <Space style={{ marginBottom: 12 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setBookModalVisible(true)}>
                Mở sổ văn bằng mới
              </Button>
            </Space>
            <Table rowKey="id" dataSource={state.books} columns={bookColumns} pagination={false} />
          </TabPane>

          <TabPane tab="Quyết định tốt nghiệp" key="decisions">
            <Space style={{ marginBottom: 12 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openDecisionModal()}>
                Thêm quyết định
              </Button>
            </Space>
            <Table rowKey="id" dataSource={state.decisions} columns={decisionColumns} />
          </TabPane>

          <TabPane tab="Cấu hình biểu mẫu phụ lục" key="fields">
            <Space style={{ marginBottom: 12 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openFieldModal()}>
                Thêm trường cấu hình
              </Button>
            </Space>
            <Table rowKey="id" dataSource={state.fieldConfigs} columns={fieldColumns} pagination={false} />
          </TabPane>

          <TabPane tab="Thông tin văn bằng" key="diplomas">
            <Space style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  if (!state.decisions.length) {
                    message.warning('Cần tạo quyết định tốt nghiệp trước khi thêm văn bằng.');
                    return;
                  }
                  openDiplomaModal();
                }}
              >
                Thêm văn bằng
              </Button>
            </Space>
            <Table rowKey="id" dataSource={state.diplomas} columns={diplomaColumns} />
          </TabPane>

          <TabPane tab="Tra cứu văn bằng" key="lookup">
            <Form form={searchForm} layout="vertical" onFinish={runSearch}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="Số hiệu văn bằng" name="diplomaNumber">
                    <Input placeholder="VD: VB-2026-001" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Số vào sổ" name="entryNumber">
                    <InputNumber style={{ width: '100%' }} min={1} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="MSV" name="studentCode">
                    <Input placeholder="VD: B24DCCC170" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Họ tên" name="fullName">
                    <Input placeholder="Nhập họ tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Ngày sinh" name="dateOfBirth">
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8} style={{ display: 'flex', alignItems: 'end' }}>
                  <Space>
                    <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
                      Tra cứu
                    </Button>
                    <Button
                      onClick={() => {
                        searchForm.resetFields();
                        setSearchResult([]);
                      }}
                    >
                      Làm mới
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>

            <Table
              rowKey="id"
              dataSource={searchResult}
              columns={searchColumns}
              locale={{ emptyText: 'Nhập ít nhất 2 tham số để tra cứu văn bằng.' }}
            />
          </TabPane>
        </Tabs>

        <Modal
          title="Mở Sổ Văn Bằng"
          visible={bookModalVisible}
          onCancel={() => {
            setBookModalVisible(false);
            bookForm.resetFields();
          }}
          footer={null}
        >
          <Form form={bookForm} layout="vertical" onFinish={handleCreateBook}>
            <Form.Item
              label="Năm mở sổ"
              name="year"
              rules={[{ required: true, message: 'Vui lòng nhập năm mở sổ.' }]}
            >
              <InputNumber style={{ width: '100%' }} min={2000} max={2100} />
            </Form.Item>
            <Button block type="primary" htmlType="submit">
              Tạo sổ
            </Button>
          </Form>
        </Modal>

        <Modal
          title={editingDecision ? 'Cập Nhật Quyết Định' : 'Thêm Quyết Định Tốt Nghiệp'}
          visible={decisionModalVisible}
          onCancel={() => {
            setDecisionModalVisible(false);
            setEditingDecision(null);
            decisionForm.resetFields();
          }}
          footer={null}
        >
          <Form form={decisionForm} layout="vertical" onFinish={submitDecision}>
            <Form.Item
              label="Số quyết định"
              name="decisionNumber"
              rules={[{ required: true, message: 'Vui lòng nhập số quyết định.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngày ban hành"
              name="issuedDate"
              rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành.' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              label="Trích yếu"
              name="summary"
              rules={[{ required: true, message: 'Vui lòng nhập trích yếu.' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              label="Thuộc sổ văn bằng năm"
              name="bookId"
              rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng.' }]}
            >
              <Select>
                {state.books
                  .slice()
                  .sort((a, b) => b.year - a.year)
                  .map((book) => (
                    <Option key={book.id} value={book.id}>
                      Năm {book.year}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Button block type="primary" htmlType="submit">
              {editingDecision ? 'Lưu thay đổi' : 'Thêm quyết định'}
            </Button>
          </Form>
        </Modal>

        <Modal
          title={editingField ? 'Cập Nhật Trường Cấu Hình' : 'Thêm Trường Cấu Hình'}
          visible={fieldModalVisible}
          onCancel={() => {
            setFieldModalVisible(false);
            setEditingField(null);
            fieldForm.resetFields();
          }}
          footer={null}
        >
          <Form form={fieldForm} layout="vertical" onFinish={submitField}>
            <Form.Item
              label="Tên trường"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên trường.' }]}
            >
              <Input placeholder="VD: Dân tộc, Điểm trung bình, Ngày nhập học" />
            </Form.Item>
            <Form.Item
              label="Kiểu dữ liệu"
              name="type"
              rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu.' }]}
            >
              <Select>
                <Option value="String">String</Option>
                <Option value="Number">Number</Option>
                <Option value="Date">Date</Option>
              </Select>
            </Form.Item>
            <Button block type="primary" htmlType="submit">
              {editingField ? 'Lưu thay đổi' : 'Thêm trường'}
            </Button>
          </Form>
        </Modal>

        <Modal
          title={editingDiploma ? 'Cập Nhật Văn Bằng' : 'Thêm Thông Tin Văn Bằng'}
          visible={diplomaModalVisible}
          onCancel={() => {
            setDiplomaModalVisible(false);
            setEditingDiploma(null);
            diplomaForm.resetFields();
          }}
          footer={null}
          width={820}
        >
          <Form form={diplomaForm} layout="vertical" onFinish={submitDiploma}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Quyết định tốt nghiệp"
                  name="decisionId"
                  rules={[{ required: true, message: 'Vui lòng chọn quyết định.' }]}
                >
                  <Select disabled={Boolean(editingDiploma)}>
                    {state.decisions
                      .slice()
                      .sort((a, b) => moment(b.issuedDate).valueOf() - moment(a.issuedDate).valueOf())
                      .map((decision) => (
                        <Option key={decision.id} value={decision.id}>
                          {decision.decisionNumber} - {moment(decision.issuedDate).format('DD/MM/YYYY')}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Số vào sổ (tự động cấp)">
                  <Input
                    disabled
                    value={editingDiploma ? editingDiploma.entryNumber : getNextEntryNumber(selectedDecision?.bookId)}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Số hiệu văn bằng"
                  name="diplomaNumber"
                  rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng.' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Mã sinh viên"
                  name="studentCode"
                  rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên.' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên.' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Ngày sinh"
                  name="dateOfBirth"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày sinh.' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>

              {state.fieldConfigs.map((field) => (
                <Col xs={24} md={12} key={field.id}>
                  <Form.Item label={field.name} name={`extra_${field.key}`}>
                    {renderInputByFieldType(field)}
                  </Form.Item>
                </Col>
              ))}
            </Row>
            <Button block type="primary" htmlType="submit">
              {editingDiploma ? 'Lưu thay đổi' : 'Thêm văn bằng'}
            </Button>
          </Form>
        </Modal>

        <Modal
          title="Chi Tiết Văn Bằng"
          visible={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setDetailDiploma(null);
          }}
          footer={null}
          width={850}
        >
          {detailDiploma && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Sổ năm">{booksById[detailDiploma.bookId]?.year}</Descriptions.Item>
              <Descriptions.Item label="Số vào sổ">{detailDiploma.entryNumber}</Descriptions.Item>
              <Descriptions.Item label="Số hiệu văn bằng">{detailDiploma.diplomaNumber}</Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">{detailDiploma.studentCode}</Descriptions.Item>
              <Descriptions.Item label="Họ tên">{detailDiploma.fullName}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{moment(detailDiploma.dateOfBirth).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Số quyết định">{decisionsById[detailDiploma.decisionId]?.decisionNumber}</Descriptions.Item>
              <Descriptions.Item label="Ngày ban hành quyết định">
                {decisionsById[detailDiploma.decisionId]?.issuedDate
                  ? moment(decisionsById[detailDiploma.decisionId].issuedDate).format('DD/MM/YYYY')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Trích yếu quyết định" span={2}>
                {decisionsById[detailDiploma.decisionId]?.summary || '-'}
              </Descriptions.Item>

              {state.fieldConfigs.map((field) => {
                const raw = detailDiploma.extraData[field.key];
                let displayValue: string | number = '-';
                if (raw !== undefined && raw !== null && raw !== '') {
                  displayValue =
                    field.type === 'Date' && typeof raw === 'string'
                      ? moment(raw).format('DD/MM/YYYY')
                      : (raw as string | number);
                }

                return (
                  <Descriptions.Item label={field.name} key={field.id}>
                    {displayValue}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          )}
        </Modal>
      </Card>
    </Spin>
  );
};

export default DiplomaManagementView;
