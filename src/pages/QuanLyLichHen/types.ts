export type AppointmentStatus = 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';

export interface WorkingSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Staff {
  id: number;
  name: string;
  maxCustomersPerDay: number;
  workingSlots: WorkingSlot[];
}

export interface ServiceItem {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Appointment {
  id: number;
  customerName: string;
  customerPhone: string;
  staffId: number;
  serviceId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Review {
  id: number;
  appointmentId: number;
  staffId: number;
  serviceId: number;
  customerName: string;
  rating: number;
  comment: string;
  employeeReply?: string;
  createdAt: string;
}

export interface AppointmentDataSnapshot {
  staffs: Staff[];
  services: ServiceItem[];
  appointments: Appointment[];
  reviews: Review[];
}

export interface CreateStaffPayload {
  name: string;
  maxCustomersPerDay: number;
  workingSlots: WorkingSlot[];
}

export interface UpdateStaffPayload extends CreateStaffPayload {
  id: number;
}

export interface CreateServicePayload {
  name: string;
  price: number;
  durationMinutes: number;
}

export interface UpdateServicePayload extends CreateServicePayload {
  id: number;
}

export interface CreateAppointmentPayload {
  customerName: string;
  customerPhone: string;
  staffId: number;
  serviceId: number;
  date: string;
  startTime: string;
}

export interface UpdateAppointmentStatusPayload {
  appointmentId: number;
  status: AppointmentStatus;
}

export interface CreateReviewPayload {
  appointmentId: number;
  rating: number;
  comment: string;
}

export interface ReplyReviewPayload {
  reviewId: number;
  employeeReply: string;
}
