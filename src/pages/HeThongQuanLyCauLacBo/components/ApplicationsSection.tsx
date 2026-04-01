import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  ApplicationFormPayload,
  ApplicationHistory,
  Club,
  MemberApplication,
} from '../types';
import ApplicationFormModal from './ApplicationFormModal';
import RejectModal from './RejectModal';
import HistoryModal from './HistoryModal';
import { formatDateTime, getClubName } from '../utils/clubHelpers';

interface ApplicationsSectionProps {
  clubs: Club[];
  applications: MemberApplication[];
  histories: ApplicationHistory[];
  submitting: boolean;
  onCreate: (payload: ApplicationFormPayload) => Promise<void>;
  onUpdate: (applicationId: number, payload: ApplicationFormPayload) => Promise<void>;
  onDelete: (applicationId: number) => Promise<void>;
  onApprove: (applicationIds: number[]) => Promise<void>;
  onReject: (applicationIds: number[], reason: string) => Promise<void>;
  onLoadHistory: (applicationId: number) => Promise<void>;
}

const statusColorMap: Record<string, string> = {
  Pending: 'gold',
  Approved: 'green',
  Rejected: 'red',
};

const ApplicationsSection: React.FC<ApplicationsSectionProps> = ({
  clubs,
  applications,
  histories,
  submitting,
  onCreate,
  onUpdate,
  onDelete,
  onApprove,
  onReject,
  onLoadHistory,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MemberApplication | undefined>(undefined);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<MemberApplication | undefined>(undefined);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      return applications;
    }
    return applications.filter(
      (item) =>
        item.fullName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q),
    );
  }, [applications, keyword]);

  const handleSubmitForm = async (payload: ApplicationFormPayload) => {
    if (editingItem) {
      await onUpdate(editingItem.id, payload);
    } else {
      await onCreate(payload);
    }
    setShowForm(false);
    setEditingItem(undefined);
  };

  const selectedCount = selectedRowKeys.length;

  return (
    <Card
      title="Quản lý đơn đăng ký thành viên"
      extra={
        <Space>
          <Input.Search
            placeholder="Tìm theo họ tên/email/SĐT"
            allowClear
            style={{ width: 280 }}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingItem(undefined);
              setShowForm(true);
            }}
          >
            Thêm đơn
          </Button>
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          disabled={!selectedCount}
          loading={submitting}
          onClick={() => onApprove(selectedRowKeys)}
        >
          Duyệt {selectedCount || ''} đơn đã chọn
        </Button>
        <Button danger disabled={!selectedCount} onClick={() => setShowRejectModal(true)}>
          Không duyệt {selectedCount || ''} đơn đã chọn
        </Button>
      </Space>

      <Table<MemberApplication>
        rowKey="id"
        dataSource={filteredRows}
        loading={submitting}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
        scroll={{ x: 1600 }}
        columns={[
          { title: 'Họ tên', dataIndex: 'fullName', sorter: (a, b) => a.fullName.localeCompare(b.fullName) },
          { title: 'Email', dataIndex: 'email' },
          { title: 'SĐT', dataIndex: 'phone' },
          { title: 'Giới tính', dataIndex: 'gender', width: 110 },
          { title: 'Địa chỉ', dataIndex: 'address', ellipsis: true },
          { title: 'Sở trường', dataIndex: 'talent', ellipsis: true },
          {
            title: 'Câu lạc bộ',
            dataIndex: 'clubId',
            render: (value: number) => getClubName(clubs, value),
            filters: clubs.map((club) => ({ text: club.name, value: club.id })),
            onFilter: (value, record) => record.clubId === value,
          },
          { title: 'Lý do đăng ký', dataIndex: 'reason', ellipsis: true },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 110,
            filters: [
              { text: 'Pending', value: 'Pending' },
              { text: 'Approved', value: 'Approved' },
              { text: 'Rejected', value: 'Rejected' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (value: string) => <Tag color={statusColorMap[value]}>{value}</Tag>,
          },
          {
            title: 'Ghi chú',
            dataIndex: 'rejectionNote',
            render: (value: string) => value || '-',
          },
          {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 320,
            render: (_, record) => (
              <Space>
                <Button type="link" onClick={() => setShowDetail(record)}>
                  Chi tiết
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    setEditingItem(record);
                    setShowForm(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Popconfirm
                  title="Bạn có chắc muốn xóa đơn này?"
                  onConfirm={() => onDelete(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="link" danger>
                    Xóa
                  </Button>
                </Popconfirm>
                <Button
                  type="link"
                  onClick={async () => {
                    await onLoadHistory(record.id);
                    setShowHistory(true);
                  }}
                >
                  Lịch sử
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <ApplicationFormModal
        visible={showForm}
        submitting={submitting}
        editingItem={editingItem}
        clubs={clubs}
        onCancel={() => {
          setShowForm(false);
          setEditingItem(undefined);
        }}
        onSubmit={handleSubmitForm}
      />

      <RejectModal
        visible={showRejectModal}
        submitting={submitting}
        count={selectedCount}
        onCancel={() => setShowRejectModal(false)}
        onConfirm={async (reason) => {
          await onReject(selectedRowKeys, reason);
          setShowRejectModal(false);
          setSelectedRowKeys([]);
        }}
      />

      <HistoryModal
        visible={showHistory}
        loading={submitting}
        histories={histories}
        onCancel={() => setShowHistory(false)}
      />

      <Drawer
        visible={Boolean(showDetail)}
        title="Chi tiết đơn đăng ký"
        onClose={() => setShowDetail(undefined)}
        width={560}
      >
        {showDetail && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Họ tên">{showDetail.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{showDetail.email}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{showDetail.phone}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{showDetail.gender}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{showDetail.address}</Descriptions.Item>
            <Descriptions.Item label="Sở trường">{showDetail.talent}</Descriptions.Item>
            <Descriptions.Item label="Câu lạc bộ">
              {getClubName(clubs, showDetail.clubId)}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do đăng ký">{showDetail.reason}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColorMap[showDetail.status]}>{showDetail.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Lý do từ chối">{showDetail.rejectionNote || '-'}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{showDetail.adminNote || '-'}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật">{formatDateTime(showDetail.updatedAt)}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </Card>
  );
};

export default ApplicationsSection;
