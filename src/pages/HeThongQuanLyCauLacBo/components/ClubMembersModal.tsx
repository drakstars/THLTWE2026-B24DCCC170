import React from 'react';
import { Modal, Table, Tag } from 'antd';
import { Club, MemberApplication } from '../types';
import { formatDate } from '../utils/clubHelpers';

interface ClubMembersModalProps {
  visible: boolean;
  club?: Club;
  members: MemberApplication[];
  onCancel: () => void;
}

const ClubMembersModal: React.FC<ClubMembersModalProps> = ({ visible, club, members, onCancel }) => {
  return (
    <Modal
      visible={visible}
      title={`Danh sách thành viên - ${club?.name || ''}`}
      footer={null}
      width={900}
      onCancel={onCancel}
      destroyOnClose
    >
      <Table<MemberApplication>
        rowKey="id"
        dataSource={members}
        pagination={{ pageSize: 6 }}
        columns={[
          { title: 'Họ tên', dataIndex: 'fullName' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'SĐT', dataIndex: 'phone' },
          {
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (value: string) => {
              const color = value === 'Female' ? 'magenta' : value === 'Male' ? 'blue' : 'default';
              return <Tag color={color}>{value}</Tag>;
            },
          },
          {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            render: (value: string) => formatDate(value),
          },
        ]}
      />
    </Modal>
  );
};

export default ClubMembersModal;
