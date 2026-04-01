import React, { useMemo, useState } from 'react';
import { Button, Card, Input, Space, Table, Tag } from 'antd';
import { Club, MemberApplication } from '../types';
import TransferClubModal from './TransferClubModal';
import { getClubName } from '../utils/clubHelpers';

interface MembersSectionProps {
  clubs: Club[];
  members: MemberApplication[];
  submitting: boolean;
  onTransfer: (applicationIds: number[], targetClubId: number) => Promise<void>;
}

const MembersSection: React.FC<MembersSectionProps> = ({ clubs, members, submitting, onTransfer }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [showTransfer, setShowTransfer] = useState<boolean>(false);

  const filteredMembers = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      return members;
    }
    return members.filter(
      (item) =>
        item.fullName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q),
    );
  }, [members, keyword]);

  return (
    <Card
      title="Danh sách thành viên CLB (Approved)"
      extra={
        <Space>
          <Input.Search
            allowClear
            placeholder="Tìm thành viên theo họ tên/email/SĐT"
            style={{ width: 300 }}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Button type="primary" disabled={!selectedRowKeys.length} onClick={() => setShowTransfer(true)}>
            Chuyển CLB cho {selectedRowKeys.length || ''} thành viên
          </Button>
        </Space>
      }
    >
      <Table<MemberApplication>
        rowKey="id"
        loading={submitting}
        dataSource={filteredMembers}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
        scroll={{ x: 1200 }}
        columns={[
          { title: 'Họ tên', dataIndex: 'fullName', sorter: (a, b) => a.fullName.localeCompare(b.fullName) },
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
          { title: 'Địa chỉ', dataIndex: 'address' },
          { title: 'Sở trường', dataIndex: 'talent' },
          {
            title: 'CLB hiện tại',
            dataIndex: 'clubId',
            render: (value: number) => getClubName(clubs, value),
            filters: clubs.map((club) => ({ text: club.name, value: club.id })),
            onFilter: (value, record) => record.clubId === value,
          },
        ]}
      />

      <TransferClubModal
        visible={showTransfer}
        count={selectedRowKeys.length}
        clubs={clubs}
        submitting={submitting}
        onCancel={() => setShowTransfer(false)}
        onConfirm={async (targetClubId) => {
          await onTransfer(selectedRowKeys, targetClubId);
          setShowTransfer(false);
          setSelectedRowKeys([]);
        }}
      />
    </Card>
  );
};

export default MembersSection;
