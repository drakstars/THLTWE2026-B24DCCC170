import moment from 'moment';
import {
  Appointment,
  AppointmentDataSnapshot,
  CreateAppointmentPayload,
  CreateReviewPayload,
  CreateServicePayload,
  CreateStaffPayload,
  ReplyReviewPayload,
  Review,
  ServiceItem,
  Staff,
  UpdateAppointmentStatusPayload,
  UpdateServicePayload,
  UpdateStaffPayload,
} from '../types';
import {
  addMinutesToTime,
  countStaffAppointmentsPerDay,
  hasAppointmentConflict,
  isWithinWorkingSchedule,
} from '../utils/appointment';

const STORAGE_KEY = 'quan_ly_lich_hen_v1';
const LATENCY = 250;

const seedStaffs: Staff[] = [
  {
    id: 1,
    name: 'Nguyễn Thị Lan',
    maxCustomersPerDay: 8,
    workingSlots: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
    ],
  },
  {
    id: 2,
    name: 'Trần Văn Minh',
    maxCustomersPerDay: 6,
    workingSlots: [
      { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '18:00' },
    ],
  },
];

const seedServices: ServiceItem[] = [
  { id: 1, name: 'Cắt tóc nam', price: 120000, durationMinutes: 45 },
  { id: 2, name: 'Gội đầu thư giãn', price: 150000, durationMinutes: 60 },
  { id: 3, name: 'Chăm sóc da cơ bản', price: 350000, durationMinutes: 90 },
  { id: 4, name: 'Khám tổng quát', price: 500000, durationMinutes: 30 },
];

const seedAppointments: Appointment[] = [
  {
    id: 1,
    customerName: 'Lê Anh',
    customerPhone: '0911222333',
    staffId: 1,
    serviceId: 1,
    date: moment().format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '09:45',
    status: 'Xác nhận',
    createdAt: moment().toISOString(),
  },
];

const seedReviews: Review[] = [];

let store: AppointmentDataSnapshot = {
  staffs: seedStaffs,
  services: seedServices,
  appointments: seedAppointments,
  reviews: seedReviews,
};

const nextId = (list: Array<{ id: number }>): number => {
  if (list.length === 0) {
    return 1;
  }
  return Math.max(...list.map((item) => item.id)) + 1;
};

const cloneStore = (): AppointmentDataSnapshot => JSON.parse(JSON.stringify(store));

const normalizeLegacyText = (value: string): string => {
  const map: Record<string, string> = {
    'Nguyen Thi Lan': 'Nguyễn Thị Lan',
    'Tran Van Minh': 'Trần Văn Minh',
    'Cat toc nam': 'Cắt tóc nam',
    'Goi dau thu gian': 'Gội đầu thư giãn',
    'Cham soc da co ban': 'Chăm sóc da cơ bản',
    'Kham tong quat': 'Khám tổng quát',
    'Le Anh': 'Lê Anh',
  };
  return map[value] || value;
};

const normalizeStoreData = (input: AppointmentDataSnapshot): AppointmentDataSnapshot => {
  return {
    ...input,
    staffs: input.staffs.map((item) => ({ ...item, name: normalizeLegacyText(item.name) })),
    services: input.services.map((item) => ({ ...item, name: normalizeLegacyText(item.name) })),
    appointments: input.appointments.map((item) => ({
      ...item,
      customerName: normalizeLegacyText(item.customerName),
    })),
    reviews: input.reviews.map((item) => ({
      ...item,
      customerName: normalizeLegacyText(item.customerName),
    })),
  };
};

const loadStore = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }
  try {
    store = normalizeStoreData(JSON.parse(raw));
    saveStore();
  } catch (error) {
    store = {
      staffs: seedStaffs,
      services: seedServices,
      appointments: seedAppointments,
      reviews: seedReviews,
    };
  }
};

const saveStore = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const simulate = async <T>(result: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), LATENCY);
  });
};

loadStore();

const getService = (serviceId: number): ServiceItem => {
  const service = store.services.find((item) => item.id === serviceId);
  if (!service) {
    throw new Error('Dịch vụ không tồn tại');
  }
  return service;
};

const getStaff = (staffId: number): Staff => {
  const staff = store.staffs.find((item) => item.id === staffId);
  if (!staff) {
    throw new Error('Nhân viên không tồn tại');
  }
  return staff;
};

export const appointmentService = {
  async getSnapshot(): Promise<AppointmentDataSnapshot> {
    return simulate(cloneStore());
  },

  async createStaff(payload: CreateStaffPayload): Promise<Staff> {
    const staff: Staff = {
      id: nextId(store.staffs),
      ...payload,
    };
    store.staffs = [...store.staffs, staff];
    saveStore();
    return simulate(staff);
  },

  async updateStaff(payload: UpdateStaffPayload): Promise<Staff> {
    const existing = getStaff(payload.id);
    const updated: Staff = {
      ...existing,
      ...payload,
    };
    store.staffs = store.staffs.map((item) => (item.id === payload.id ? updated : item));
    saveStore();
    return simulate(updated);
  },

  async deleteStaff(staffId: number): Promise<void> {
    const hasInUse = store.appointments.some((item) => item.staffId === staffId && item.status !== 'Hủy');
    if (hasInUse) {
      throw new Error('Không thể xóa nhân viên đang có lịch hẹn');
    }
    store.staffs = store.staffs.filter((item) => item.id !== staffId);
    saveStore();
    return simulate(undefined);
  },

  async createService(payload: CreateServicePayload): Promise<ServiceItem> {
    const service: ServiceItem = {
      id: nextId(store.services),
      ...payload,
    };
    store.services = [...store.services, service];
    saveStore();
    return simulate(service);
  },

  async updateService(payload: UpdateServicePayload): Promise<ServiceItem> {
    const existing = getService(payload.id);
    const updated: ServiceItem = {
      ...existing,
      ...payload,
    };
    store.services = store.services.map((item) => (item.id === payload.id ? updated : item));
    saveStore();
    return simulate(updated);
  },

  async deleteService(serviceId: number): Promise<void> {
    const hasInUse = store.appointments.some((item) => item.serviceId === serviceId && item.status !== 'Hủy');
    if (hasInUse) {
      throw new Error('Không thể xóa dịch vụ đang có lịch hẹn');
    }
    store.services = store.services.filter((item) => item.id !== serviceId);
    saveStore();
    return simulate(undefined);
  },

  async createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
    const service = getService(payload.serviceId);
    const staff = getStaff(payload.staffId);

    const endTime = addMinutesToTime(payload.startTime, service.durationMinutes);

    if (!isWithinWorkingSchedule(staff, payload.date, payload.startTime, endTime)) {
      throw new Error('Lịch hẹn nằm ngoài khung giờ làm việc của nhân viên');
    }

    const dailyCount = countStaffAppointmentsPerDay(store.appointments, payload.staffId, payload.date);
    if (dailyCount >= staff.maxCustomersPerDay) {
      throw new Error('Nhân viên đã đạt giới hạn phục vụ trong ngày');
    }

    if (
      hasAppointmentConflict(
        store.appointments,
        payload.staffId,
        payload.date,
        payload.startTime,
        endTime,
      )
    ) {
      throw new Error('Khung giờ này đã có lịch hẹn, vui lòng chọn giờ khác');
    }

    const appointment: Appointment = {
      id: nextId(store.appointments),
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      staffId: payload.staffId,
      serviceId: payload.serviceId,
      date: payload.date,
      startTime: payload.startTime,
      endTime,
      status: 'Chờ duyệt',
      createdAt: moment().toISOString(),
    };

    store.appointments = [...store.appointments, appointment];
    saveStore();
    return simulate(appointment);
  },

  async updateAppointmentStatus(payload: UpdateAppointmentStatusPayload): Promise<Appointment> {
    const appointment = store.appointments.find((item) => item.id === payload.appointmentId);
    if (!appointment) {
      throw new Error('Lịch hẹn không tồn tại');
    }
    const updated = { ...appointment, status: payload.status };
    store.appointments = store.appointments.map((item) =>
      item.id === payload.appointmentId ? updated : item,
    );
    saveStore();
    return simulate(updated);
  },

  async createReview(payload: CreateReviewPayload): Promise<Review> {
    const appointment = store.appointments.find((item) => item.id === payload.appointmentId);
    if (!appointment) {
      throw new Error('Lịch hẹn không tồn tại');
    }

    if (appointment.status !== 'Hoàn thành') {
      throw new Error('Chỉ được đánh giá sau khi lịch hẹn hoàn thành');
    }

    const existed = store.reviews.some((item) => item.appointmentId === payload.appointmentId);
    if (existed) {
      throw new Error('Lịch hẹn này đã có đánh giá');
    }

    const review: Review = {
      id: nextId(store.reviews),
      appointmentId: appointment.id,
      staffId: appointment.staffId,
      serviceId: appointment.serviceId,
      customerName: appointment.customerName,
      rating: payload.rating,
      comment: payload.comment,
      createdAt: moment().toISOString(),
    };

    store.reviews = [...store.reviews, review];
    saveStore();
    return simulate(review);
  },

  async replyReview(payload: ReplyReviewPayload): Promise<Review> {
    const review = store.reviews.find((item) => item.id === payload.reviewId);
    if (!review) {
      throw new Error('Đánh giá không tồn tại');
    }

    const updated: Review = {
      ...review,
      employeeReply: payload.employeeReply,
    };

    store.reviews = store.reviews.map((item) => (item.id === payload.reviewId ? updated : item));
    saveStore();
    return simulate(updated);
  },
};
