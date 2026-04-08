import { useMemo, useState } from 'react';
import { message } from 'antd';
import type { Destination, ItineraryItem, TravelPlannerState } from '../types';
import {
  INITIAL_DESTINATIONS,
  buildAdminStats,
  calculateBudgetSummary,
  normalizeItineraryOrders,
} from '../utils/travelHelpers';

const STORAGE_KEY = 'travel-planner-v1';

const loadState = (): TravelPlannerState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      destinations: INITIAL_DESTINATIONS,
      itineraryItems: [],
      totalBudget: 10000000,
      snapshots: [],
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      destinations: parsed.destinations || INITIAL_DESTINATIONS,
      itineraryItems: parsed.itineraryItems || [],
      totalBudget: parsed.totalBudget || 10000000,
      snapshots: parsed.snapshots || [],
    };
  } catch (error) {
    return {
      destinations: INITIAL_DESTINATIONS,
      itineraryItems: [],
      totalBudget: 10000000,
      snapshots: [],
    };
  }
};

export const useTravelPlanner = () => {
  const [state, setState] = useState<TravelPlannerState>(loadState);

  const persist = (nextState: TravelPlannerState) => {
    setState(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  const budgetSummary = useMemo(
    () => calculateBudgetSummary(state.itineraryItems, state.destinations),
    [state.itineraryItems, state.destinations],
  );

  const adminStats = useMemo(
    () => buildAdminStats(state.snapshots, state.destinations),
    [state.snapshots, state.destinations],
  );

  const addItineraryItem = (destinationId: string, day: number) => {
    const sameDayItems = state.itineraryItems.filter((item) => item.day === day);
    const item: ItineraryItem = {
      id: `${Date.now()}-${Math.random()}`,
      destinationId,
      day,
      order: sameDayItems.length + 1,
    };

    persist({
      ...state,
      itineraryItems: normalizeItineraryOrders([...state.itineraryItems, item]),
    });

    message.success('Đã thêm điểm đến vào lịch trình');
  };

  const removeItineraryItem = (itemId: string) => {
    const filtered = state.itineraryItems.filter((item) => item.id !== itemId);
    persist({
      ...state,
      itineraryItems: normalizeItineraryOrders(filtered),
    });
  };

  const moveItineraryItem = (itemId: string, direction: 'up' | 'down') => {
    const current = state.itineraryItems.find((item) => item.id === itemId);
    if (!current) return;

    const sameDayItems = [...state.itineraryItems]
      .filter((item) => item.day === current.day)
      .sort((a, b) => a.order - b.order);

    const currentIndex = sameDayItems.findIndex((item) => item.id === itemId);
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex < 0 || swapIndex >= sameDayItems.length) return;

    const target = sameDayItems[swapIndex];
    const reordered = state.itineraryItems.map((item) => {
      if (item.id === current.id) return { ...item, order: target.order };
      if (item.id === target.id) return { ...item, order: current.order };
      return item;
    });

    persist({
      ...state,
      itineraryItems: normalizeItineraryOrders(reordered),
    });
  };

  const updateItineraryDay = (itemId: string, nextDay: number) => {
    const updated = state.itineraryItems.map((item) =>
      item.id === itemId ? { ...item, day: nextDay, order: 999 } : item,
    );

    persist({
      ...state,
      itineraryItems: normalizeItineraryOrders(updated),
    });
  };

  const clearItinerary = () => {
    persist({
      ...state,
      itineraryItems: [],
    });
  };

  const saveSnapshot = () => {
    if (state.itineraryItems.length === 0) {
      message.warning('Bạn chưa có lịch trình để lưu');
      return;
    }

    const nextSnapshot = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: state.itineraryItems,
      totalCost: budgetSummary.total,
      byCategory: budgetSummary.byCategory,
      travelHours: budgetSummary.travelHours,
    };

    persist({
      ...state,
      snapshots: [nextSnapshot, ...state.snapshots],
    });

    message.success('Đã lưu lịch trình thành công');
  };

  const upsertDestination = (destination: Destination) => {
    const exists = state.destinations.some((item) => item.id === destination.id);
    const nextDestinations = exists
      ? state.destinations.map((item) => (item.id === destination.id ? destination : item))
      : [...state.destinations, destination];

    persist({
      ...state,
      destinations: nextDestinations,
    });

    message.success(exists ? 'Đã cập nhật điểm đến' : 'Đã thêm điểm đến mới');
  };

  const deleteDestination = (destinationId: string) => {
    const nextDestinations = state.destinations.filter((item) => item.id !== destinationId);
    const nextItems = state.itineraryItems.filter((item) => item.destinationId !== destinationId);

    persist({
      ...state,
      destinations: nextDestinations,
      itineraryItems: normalizeItineraryOrders(nextItems),
    });

    message.success('Đã xóa điểm đến');
  };

  return {
    state,
    budgetSummary,
    adminStats,
    setTotalBudget: (totalBudget: number) => persist({ ...state, totalBudget }),
    addItineraryItem,
    removeItineraryItem,
    moveItineraryItem,
    updateItineraryDay,
    clearItinerary,
    saveSnapshot,
    upsertDestination,
    deleteDestination,
  };
};
