export type DestinationCategory = 'Biển' | 'Núi' | 'Thành phố';

export type BudgetCategory = 'Ăn uống' | 'Di chuyển' | 'Lưu trú' | 'Vé tham quan' | 'Khác';

export type EstimatedCosts = Record<BudgetCategory, number>;

export interface Destination {
  id: string;
  name: string;
  location: string;
  category: DestinationCategory;
  imageUrl: string;
  description: string;
  rating: number;
  priceLevel: number;
  visitDurationHours: number;
  latitude: number;
  longitude: number;
  estimatedCosts: EstimatedCosts;
}

export interface ItineraryItem {
  id: string;
  destinationId: string;
  day: number;
  order: number;
}

export interface BudgetSummary {
  total: number;
  byCategory: EstimatedCosts;
  travelHours: number;
}

export interface ItinerarySnapshot {
  id: string;
  createdAt: string;
  items: ItineraryItem[];
  totalCost: number;
  byCategory: EstimatedCosts;
  travelHours: number;
}

export interface TravelPlannerState {
  destinations: Destination[];
  itineraryItems: ItineraryItem[];
  totalBudget: number;
  snapshots: ItinerarySnapshot[];
}

export interface AdminStats {
  monthlyItineraries: {
    labels: string[];
    values: number[];
  };
  popularDestinations: {
    labels: string[];
    values: number[];
  };
  revenue: number;
  categoryTotals: EstimatedCosts;
}
