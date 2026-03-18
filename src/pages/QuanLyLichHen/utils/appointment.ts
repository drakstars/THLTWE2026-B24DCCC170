import moment from 'moment';
import { Appointment, Review, Staff } from '../types';

export const WEEKDAY_OPTIONS = [
  { label: 'Chủ nhật', value: 0 },
  { label: 'Thứ 2', value: 1 },
  { label: 'Thứ 3', value: 2 },
  { label: 'Thứ 4', value: 3 },
  { label: 'Thứ 5', value: 4 },
  { label: 'Thứ 6', value: 5 },
  { label: 'Thứ 7', value: 6 },
];

export const toMinutes = (time: string): number => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  return moment(time, 'HH:mm').add(minutes, 'minutes').format('HH:mm');
};

export const isOverlapTimeRange = (
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean => {
  const aStart = toMinutes(startA);
  const aEnd = toMinutes(endA);
  const bStart = toMinutes(startB);
  const bEnd = toMinutes(endB);
  return aStart < bEnd && bStart < aEnd;
};

export const isWithinWorkingSchedule = (
  staff: Staff,
  date: string,
  startTime: string,
  endTime: string,
): boolean => {
  const dayOfWeek = moment(date, 'YYYY-MM-DD').day();
  return staff.workingSlots.some((slot) => {
    if (slot.dayOfWeek !== dayOfWeek) {
      return false;
    }
    return toMinutes(startTime) >= toMinutes(slot.startTime) && toMinutes(endTime) <= toMinutes(slot.endTime);
  });
};

export const hasAppointmentConflict = (
  appointments: Appointment[],
  staffId: number,
  date: string,
  startTime: string,
  endTime: string,
  excludedAppointmentId?: number,
): boolean => {
  return appointments.some((item) => {
    if (item.staffId !== staffId || item.date !== date || item.status === 'Hủy') {
      return false;
    }

    if (excludedAppointmentId && item.id === excludedAppointmentId) {
      return false;
    }

    return isOverlapTimeRange(startTime, endTime, item.startTime, item.endTime);
  });
};

export const countStaffAppointmentsPerDay = (
  appointments: Appointment[],
  staffId: number,
  date: string,
): number => {
  return appointments.filter((item) => item.staffId === staffId && item.date === date && item.status !== 'Hủy').length;
};

export const calculateAverageRatingByStaff = (staffId: number, reviews: Review[]): number => {
  const staffReviews = reviews.filter((review) => review.staffId === staffId);
  if (staffReviews.length === 0) {
    return 0;
  }
  const sum = staffReviews.reduce((acc, item) => acc + item.rating, 0);
  return Number((sum / staffReviews.length).toFixed(2));
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
