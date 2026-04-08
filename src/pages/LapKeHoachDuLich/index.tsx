import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Grid, Tabs, Tag } from 'antd';
import AdminSection from './components/AdminSection';
import BudgetSection from './components/BudgetSection';
import DiscoverSection from './components/DiscoverSection';
import ItinerarySection from './components/ItinerarySection';
import { useTravelPlanner } from './hooks/useTravelPlanner';
import './style.less';

const { useBreakpoint } = Grid;

const LapKeHoachDuLich: React.FC = () => {
  const screens = useBreakpoint();
  const {
    state,
    budgetSummary,
    adminStats,
    setTotalBudget,
    addItineraryItem,
    removeItineraryItem,
    moveItineraryItem,
    updateItineraryDay,
    clearItinerary,
    saveSnapshot,
    upsertDestination,
    deleteDestination,
  } = useTravelPlanner();

  return (
    <PageContainer
      title="Lập Kế Hoạch Du Lịch"
      subTitle="Khám phá điểm đến, thiết kế lịch trình, theo dõi ngân sách và quản trị dữ liệu"
      tags={[
        <Tag color="processing" key="responsive">Responsive mobile/tablet</Tag>,
        <Tag color="success" key="admin">Admin dashboard</Tag>,
      ]}
      className="travel-planner-page"
    >
      <Tabs
        defaultActiveKey="discover"
        type={screens.md ? 'line' : 'card'}
        tabBarGutter={screens.md ? 24 : 8}
      >
        <Tabs.TabPane key="discover" tab="1. Khám phá điểm đến">
          <DiscoverSection
            destinations={state.destinations}
            onAddToItinerary={addItineraryItem}
          />
        </Tabs.TabPane>

        <Tabs.TabPane key="itinerary" tab="2. Tạo lịch trình">
          <ItinerarySection
            itineraryItems={state.itineraryItems}
            destinations={state.destinations}
            totalCost={budgetSummary.total}
            travelHours={budgetSummary.travelHours}
            onRemoveItem={removeItineraryItem}
            onMoveItem={moveItineraryItem}
            onUpdateDay={updateItineraryDay}
            onClear={clearItinerary}
            onSave={saveSnapshot}
          />
        </Tabs.TabPane>

        <Tabs.TabPane key="budget" tab="3. Quản lý ngân sách">
          <BudgetSection
            totalBudget={state.totalBudget}
            totalEstimated={budgetSummary.total}
            byCategory={budgetSummary.byCategory}
            onBudgetChange={setTotalBudget}
          />
        </Tabs.TabPane>

        <Tabs.TabPane key="admin" tab="4. Trang quản trị">
          <AdminSection
            destinations={state.destinations}
            adminStats={adminStats}
            snapshotsCount={state.snapshots.length}
            onUpsertDestination={upsertDestination}
            onDeleteDestination={deleteDestination}
          />
        </Tabs.TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default LapKeHoachDuLich;
