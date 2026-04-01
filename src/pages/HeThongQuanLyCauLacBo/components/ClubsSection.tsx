import React, { useMemo, useState } from 'react';
import { Avatar, Button, Card, Input, Popconfirm, Space, Switch, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Club, ClubFormPayload, MemberApplication } from '../types';
import ClubFormModal from './ClubFormModal';
import ClubMembersModal from './ClubMembersModal';
import { formatDate } from '../utils/clubHelpers';

interface ClubsSectionProps {
  clubs: Club[];
  submitting: boolean;
  getClubMembers: (clubId: number) => MemberApplication[];
  onCreateClub: (payload: ClubFormPayload) => Promise<void>;
  onUpdateClub: (clubId: number, payload: ClubFormPayload) => Promise<void>;
  onDeleteClub: (clubId: number) => Promise<void>;
}

const ClubsSection: React.FC<ClubsSectionProps> = ({
  clubs,
  submitting,
  getClubMembers,
  onCreateClub,
  onUpdateClub,
  onDeleteClub,
}) => {
  const [keyword, setKeyword] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingClub, setEditingClub] = useState<Club | undefined>(undefined);
  const [viewingClub, setViewingClub] = useState<Club | undefined>(undefined);

  const filteredClubs = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      return clubs;
    }
    return clubs.filter(
      (club) =>
        club.name.toLowerCase().includes(q) ||
        club.presidentName.toLowerCase().includes(q) ||
        club.descriptionHtml.toLowerCase().includes(q),
    );
  }, [clubs, keyword]);

  const handleSubmit = async (payload: ClubFormPayload) => {
    if (editingClub) {
      await onUpdateClub(editingClub.id, payload);
    } else {
      await onCreateClub(payload);
    }
    setShowForm(false);
    setEditingClub(undefined);
  };

  return (
    <Card
      title="Danh sách câu lạc bộ"
      extra={
        <Space>
          <Input.Search
            allowClear
            placeholder="Tìm theo tên CLB/chủ nhiệm"
            style={{ width: 280 }}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingClub(undefined);
              setShowForm(true);
            }}
          >
            Thêm CLB
          </Button>
        </Space>
      }
    >
      <Table<Club>
        rowKey="id"
        loading={submitting}
        dataSource={filteredClubs}
        scroll={{ x: 1200 }}
        columns={[
          {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            width: 110,
            render: (value: string) => <Avatar shape="square" size={48} src={value} />,
          },
          {
            title: 'Tên câu lạc bộ',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
          },
          {
            title: 'Ngày thành lập',
            dataIndex: 'establishedDate',
            sorter: (a, b) => a.establishedDate.localeCompare(b.establishedDate),
            render: (value: string) => formatDate(value),
          },
          {
            title: 'Mô tả',
            dataIndex: 'descriptionHtml',
            render: (value: string) => (
              <div
                style={{ maxWidth: 300 }}
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ),
          },
          {
            title: 'Chủ nhiệm CLB',
            dataIndex: 'presidentName',
          },
          {
            title: 'Hoạt động',
            dataIndex: 'active',
            width: 120,
            filters: [
              { text: 'Có', value: true },
              { text: 'Không', value: false },
            ],
            onFilter: (value, record) => record.active === value,
            render: (value: boolean) => (
              <Switch checked={value} disabled checkedChildren="Có" unCheckedChildren="Không" />
            ),
          },
          {
            title: 'Thành viên',
            key: 'members',
            width: 120,
            render: (_, record) => <Tag color="cyan">{getClubMembers(record.id).length} thành viên</Tag>,
          },
          {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 250,
            render: (_, record) => (
              <Space>
                <Button
                  type="link"
                  onClick={() => {
                    setEditingClub(record);
                    setShowForm(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa CLB này?"
                  onConfirm={() => onDeleteClub(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="link" danger>
                    Xóa
                  </Button>
                </Popconfirm>
                <Button type="link" onClick={() => setViewingClub(record)}>
                  Xem thành viên
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <ClubFormModal
        visible={showForm}
        submitting={submitting}
        editingClub={editingClub}
        onCancel={() => {
          setShowForm(false);
          setEditingClub(undefined);
        }}
        onSubmit={handleSubmit}
      />

      <ClubMembersModal
        visible={Boolean(viewingClub)}
        club={viewingClub}
        members={viewingClub ? getClubMembers(viewingClub.id) : []}
        onCancel={() => setViewingClub(undefined)}
      />
    </Card>
  );
};

export default ClubsSection;
