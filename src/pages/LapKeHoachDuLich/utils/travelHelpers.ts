import type { AdminStats, BudgetCategory, BudgetSummary, Destination, EstimatedCosts, ItineraryItem, ItinerarySnapshot } from '../types';

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  'Ăn uống',
  'Di chuyển',
  'Lưu trú',
  'Vé tham quan',
  'Khác',
];

export const DEFAULT_COSTS: EstimatedCosts = {
  'Ăn uống': 0,
  'Di chuyển': 0,
  'Lưu trú': 0,
  'Vé tham quan': 0,
  'Khác': 0,
};

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'des-1',
    name: 'Đà Nẵng - Cầu Rồng',
    location: 'Đà Nẵng',
    category: 'Thành phố',
    imageUrl: 'https://images.unsplash.com/photo-1617892716589-9f83a4d7a9f8?auto=format&fit=crop&w=1200&q=80',
    description: 'Thành phố biển hiện đại với nhiều điểm check-in và ẩm thực đa dạng.',
    rating: 4.7,
    priceLevel: 1800000,
    visitDurationHours: 8,
    latitude: 16.0678,
    longitude: 108.2208,
    estimatedCosts: {
      'Ăn uống': 400000,
      'Di chuyển': 300000,
      'Lưu trú': 900000,
      'Vé tham quan': 150000,
      'Khác': 50000,
    },
  },
  {
    id: 'des-2',
    name: 'Phú Quốc - Bãi Sao',
    location: 'Kiên Giang',
    category: 'Biển',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Bãi biển cát trắng, nước xanh, phù hợp cho nghỉ dưỡng và hoạt động biển.',
    rating: 4.8,
    priceLevel: 2800000,
    visitDurationHours: 9,
    latitude: 10.2272,
    longitude: 103.967,
    estimatedCosts: {
      'Ăn uống': 550000,
      'Di chuyển': 650000,
      'Lưu trú': 1300000,
      'Vé tham quan': 200000,
      'Khác': 100000,
    },
  },
  {
    id: 'des-3',
    name: 'Sapa - Bản Cát Cát',
    location: 'Lào Cai',
    category: 'Núi',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    description: 'Khí hậu mát mẻ quanh năm, cảnh núi non hùng vĩ và văn hóa bản địa đặc sắc.',
    rating: 4.6,
    priceLevel: 2200000,
    visitDurationHours: 10,
    latitude: 22.3364,
    longitude: 103.8438,
    estimatedCosts: {
      'Ăn uống': 500000,
      'Di chuyển': 700000,
      'Lưu trú': 850000,
      'Vé tham quan': 100000,
      'Khác': 50000,
    },
  },
  {
    id: 'des-4',
    name: 'Nha Trang - Hòn Mun',
    location: 'Khánh Hòa',
    category: 'Biển',
    imageUrl: 'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    description: 'Thiên đường biển đảo với hoạt động lặn ngắm san hô và vui chơi giải trí.',
    rating: 4.5,
    priceLevel: 2000000,
    visitDurationHours: 8,
    latitude: 12.2388,
    longitude: 109.1967,
    estimatedCosts: {
      'Ăn uống': 450000,
      'Di chuyển': 500000,
      'Lưu trú': 900000,
      'Vé tham quan': 100000,
      'Khác': 50000,
    },
  },
  {
    id: 'des-5',
    name: 'Đà Lạt - Hồ Xuân Hương',
    location: 'Lâm Đồng',
    category: 'Thành phố',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    description: 'Thành phố ngàn hoa với khí hậu se lạnh, phù hợp du lịch thư giãn.',
    rating: 4.4,
    priceLevel: 1700000,
    visitDurationHours: 7,
    latitude: 11.9404,
    longitude: 108.4583,
    estimatedCosts: {
      'Ăn uống': 350000,
      'Di chuyển': 300000,
      'Lưu trú': 850000,
      'Vé tham quan': 100000,
      'Khác': 100000,
    },
  },
  {
    id: 'des-6',
    name: 'Hà Giang - Mã Pí Lèng',
    location: 'Hà Giang',
    category: 'Núi',
    imageUrl: 'https://images.unsplash.com/photo-1519121782843-1d26f0bd87d1?auto=format&fit=crop&w=1200&q=80',
    description: 'Cung đường đèo huyền thoại và cảnh quan thiên nhiên hoang sơ tuyệt đẹp.',
    rating: 4.9,
    priceLevel: 2600000,
    visitDurationHours: 11,
    latitude: 23.1867,
    longitude: 105.2914,
    estimatedCosts: {
      'Ăn uống': 500000,
      'Di chuyển': 900000,
      'Lưu trú': 1000000,
      'Vé tham quan': 100000,
      'Khác': 100000,
    },
  },
];

const kmFromCoordinates = (a: Destination, b: Destination) => {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  return 2 * earthRadius * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const calculateBudgetSummary = (
  itineraryItems: ItineraryItem[],
  destinations: Destination[],
): BudgetSummary => {
  const byCategory: EstimatedCosts = { ...DEFAULT_COSTS };
  let travelHours = 0;

  const destinationMap = new Map(destinations.map((item) => [item.id, item]));

  itineraryItems.forEach((item) => {
    const destination = destinationMap.get(item.destinationId);
    if (!destination) return;

    BUDGET_CATEGORIES.forEach((category) => {
      byCategory[category] += destination.estimatedCosts[category] || 0;
    });

    travelHours += destination.visitDurationHours;
  });

  const groupedByDay = itineraryItems.reduce<Record<number, ItineraryItem[]>>((acc, current) => {
    acc[current.day] = acc[current.day] || [];
    acc[current.day].push(current);
    return acc;
  }, {});

  Object.values(groupedByDay).forEach((dayItems) => {
    const sorted = [...dayItems].sort((a, b) => a.order - b.order);
    sorted.forEach((item, index) => {
      if (index === 0) return;
      const previous = destinationMap.get(sorted[index - 1].destinationId);
      const current = destinationMap.get(item.destinationId);

      if (!previous || !current) return;

      const km = kmFromCoordinates(previous, current);
      const moveHours = km / 55;
      const moveCost = Math.round(km * 2200);

      travelHours += moveHours;
      byCategory['Di chuyển'] += moveCost;
    });
  });

  const total = BUDGET_CATEGORIES.reduce((sum, category) => sum + byCategory[category], 0);

  return {
    total,
    byCategory,
    travelHours,
  };
};

export const normalizeItineraryOrders = (items: ItineraryItem[]): ItineraryItem[] => {
  const groupedByDay = items.reduce<Record<number, ItineraryItem[]>>((acc, current) => {
    acc[current.day] = acc[current.day] || [];
    acc[current.day].push(current);
    return acc;
  }, {});

  return Object.entries(groupedByDay)
    .flatMap(([day, dayItems]) =>
      dayItems
        .sort((a, b) => a.order - b.order)
        .map((item, index) => ({ ...item, day: Number(day), order: index + 1 })),
    )
    .sort((a, b) => (a.day === b.day ? a.order - b.order : a.day - b.day));
};

export const buildAdminStats = (
  snapshots: ItinerarySnapshot[],
  destinations: Destination[],
): AdminStats => {
  const destinationMap = new Map(destinations.map((item) => [item.id, item]));

  const monthlyMap: Record<string, number> = {};
  const popularMap: Record<string, number> = {};
  const categoryTotals: EstimatedCosts = { ...DEFAULT_COSTS };

  let revenue = 0;

  snapshots.forEach((snapshot) => {
    const monthKey = snapshot.createdAt.slice(0, 7);
    monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
    revenue += snapshot.totalCost * 0.08;

    BUDGET_CATEGORIES.forEach((category) => {
      categoryTotals[category] += snapshot.byCategory[category] || 0;
    });

    snapshot.items.forEach((item) => {
      const destination = destinationMap.get(item.destinationId);
      if (!destination) return;
      popularMap[destination.name] = (popularMap[destination.name] || 0) + 1;
    });
  });

  const monthlyLabels = Object.keys(monthlyMap).sort();
  const monthlyValues = monthlyLabels.map((label) => monthlyMap[label]);

  const popularEntries = Object.entries(popularMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return {
    monthlyItineraries: {
      labels: monthlyLabels,
      values: monthlyValues,
    },
    popularDestinations: {
      labels: popularEntries.map((item) => item[0]),
      values: popularEntries.map((item) => item[1]),
    },
    revenue,
    categoryTotals,
  };
};
