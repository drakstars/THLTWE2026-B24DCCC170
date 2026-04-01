import React from 'react';
import { Modal, Table, Tag } from 'antd';
import { ApplicationHistory } from '../types';
import { formatDateTime } from '../utils/clubHelpers';

interface HistoryModalProps {
  visible: boolean;
  loading: boolean;
  histories: ApplicationHistory[];
  onCancel: () => void;
}

const actionColorMap: Record<string, string> = {
  CREATED: 'blue',
  UPDATED: 'gold',
  DELETED: 'red',
  APPROVED: 'green',
  REJECTED: 'volcano',
  TRANSFERRED: 'purple',
};

const HistoryModal: React.FC<HistoryModalProps> = ({ visible, loading, histories, onCancel }) => {
  return (
    <Modal visible={visible} title="Lịch sử thao tác" footer={null} onCancel={onCancel} width={860}>
      <Table<ApplicationHistory>
        rowKey="id"
        loading={loading}
        dataSource={histories}
        pagination={{ pageSize: 6 }}
        columns={[
          {
            title: 'Hành động',
            dataIndex: 'action',
            width: 130,
            render: (value: string) => <Tag color={actionColorMap[value] || 'default'}>{value}</Tag>,
          },
          { title: 'Admin', dataIndex: 'adminName', width: 160 },
          {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            width: 180,
            render: (value: string) => formatDateTime(value),
          },
          { title: 'Ghi chú', dataIndex: 'note' },
        ]}
      />
    </Modal>
  );
};

export default HistoryModal;
