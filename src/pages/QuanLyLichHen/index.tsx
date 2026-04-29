import React, { Suspense, lazy } from 'react';
import { Alert, Space, Spin, Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import AsyncState from './components/common/AsyncState';
import { useAppointmentManager } from './hooks/useAppointmentManager';

const StaffManagement = lazy(() => import('./components/StaffManagement'));
const ServiceManagement = lazy(() => import('./components/ServiceManagement'));
const AppointmentManagement = lazy(() => import('./components/AppointmentManagement'));
const ReviewManagement = lazy(() => import('./components/ReviewManagement'));
const ReportsPanel = lazy(() => import('./components/ReportsPanel'));

const fallback = (
  <Space align="center" style={{ width: '100%', justifyContent: 'center', padding: 24 }}>
    <Spin />
  </Space>
);

const QuanLyLichHen: React.FC = () => {
  const {
    data,
    loading,
    submitting,
    error,
    stats,
    averageRatingByStaff,
    completedAppointmentsWithoutReview,
    loadData,
    createStaff,
    updateStaff,
    deleteStaff,
    createServiceItem,
    updateServiceItem,
    deleteServiceItem,
    createAppointment,
    updateAppointmentStatus,
    createReview,
    replyReview,
  } = useAppointmentManager();

  const canCreateAppointment = data.staffs.length > 0 && data.services.length > 0;

  return (
    <PageContainer title={<span>"Quản Lý Lịch Hẹn"</span>}>
      <AsyncState loading={loading} error={error} onRetry={loadData}>
        {!canCreateAppointment ? (
          <Alert
            type="warning"
            showIcon
            message="Cần có ít nhất 1 nhân viên và 1 dịch vụ để tạo lịch hẹn"
            style={{ marginBottom: 16 }}
          />
        ) : null}

        <Tabs defaultActiveKey="appointments" destroyInactiveTabPane>
          <Tabs.TabPane tab="Lịch hẹn" key="appointments">
            <Suspense fallback={fallback}>
              <AppointmentManagement
                staffs={data.staffs}
                services={data.services}
                appointments={data.appointments}
                submitting={submitting}
                onCreate={createAppointment}
                onUpdateStatus={updateAppointmentStatus}
              />
            </Suspense>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Nhân viên" key="staffs">
            <Suspense fallback={fallback}>
              <StaffManagement
                staffs={data.staffs}
                averageRatingByStaff={averageRatingByStaff}
                submitting={submitting}
                onCreate={createStaff}
                onUpdate={updateStaff}
                onDelete={deleteStaff}
              />
            </Suspense>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Dịch vụ" key="services">
            <Suspense fallback={fallback}>
              <ServiceManagement
                services={data.services}
                submitting={submitting}
                onCreate={createServiceItem}
                onUpdate={updateServiceItem}
                onDelete={deleteServiceItem}
              />
            </Suspense>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Đánh giá" key="reviews">
            <Suspense fallback={fallback}>
              <ReviewManagement
                staffs={data.staffs}
                services={data.services}
                reviews={data.reviews}
                completedAppointmentsWithoutReview={completedAppointmentsWithoutReview}
                submitting={submitting}
                onCreate={createReview}
                onReply={replyReview}
              />
            </Suspense>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Thống kê" key="reports">
            <Suspense fallback={fallback}>
              <ReportsPanel
                appointmentsToday={stats.appointmentsToday}
                appointmentsThisMonth={stats.appointmentsThisMonth}
                revenueThisMonth={stats.revenueThisMonth}
                revenueByService={stats.revenueByService}
                revenueByStaff={stats.revenueByStaff}
              />
            </Suspense>
          </Tabs.TabPane>
        </Tabs>
      </AsyncState>
    </PageContainer>
  );
};

export default QuanLyLichHen;
