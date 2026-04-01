import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import ClubsSection from './components/ClubsSection';
import ApplicationsSection from './components/ApplicationsSection';
import MembersSection from './components/MembersSection';
import ReportsSection from './components/ReportsSection';
import { useClubManagement } from './hooks/useClubManagement';

const HeThongQuanLyCauLacBo: React.FC = () => {
  const {
    snapshot,
    loading,
    submitting,
    histories,
    members,
    reportData,
    loadData,
    createClub,
    updateClub,
    deleteClub,
    createApplication,
    updateApplication,
    deleteApplication,
    changeStatus,
    transferMembers,
    loadApplicationHistories,
    getClubMembers,
  } = useClubManagement();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <PageContainer title={<span>Hệ Thống Quản Lý Câu Lạc Bộ</span>} loading={loading}>
      <Tabs defaultActiveKey="clubs" destroyInactiveTabPane>
        <Tabs.TabPane tab="Danh sách CLB" key="clubs">
          <ClubsSection
            clubs={snapshot.clubs}
            submitting={submitting}
            getClubMembers={getClubMembers}
            onCreateClub={createClub}
            onUpdateClub={updateClub}
            onDeleteClub={deleteClub}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Đơn đăng ký" key="applications">
          <ApplicationsSection
            clubs={snapshot.clubs}
            applications={snapshot.applications}
            histories={histories}
            submitting={submitting}
            onCreate={createApplication}
            onUpdate={updateApplication}
            onDelete={deleteApplication}
            onApprove={(ids) => changeStatus(ids, 'Approved')}
            onReject={(ids, reason) => changeStatus(ids, 'Rejected', reason)}
            onLoadHistory={loadApplicationHistories}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Thành viên CLB" key="members">
          <MembersSection
            clubs={snapshot.clubs}
            members={members}
            submitting={submitting}
            onTransfer={transferMembers}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Báo cáo thống kê" key="reports">
          <ReportsSection reportData={reportData} />
        </Tabs.TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default HeThongQuanLyCauLacBo;
