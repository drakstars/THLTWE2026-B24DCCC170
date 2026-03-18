import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import {
  Appointment,
  AppointmentDataSnapshot,
  AppointmentStatus,
  CreateAppointmentPayload,
  CreateReviewPayload,
  CreateServicePayload,
  CreateStaffPayload,
  ReplyReviewPayload,
  ServiceItem,
  Staff,
  UpdateServicePayload,
  UpdateStaffPayload,
} from '../types';
import { appointmentService } from '../services/appointmentService';
import { calculateAverageRatingByStaff } from '../utils/appointment';

interface SummaryReport {
  appointmentsToday: number;
  appointmentsThisMonth: number;
  revenueThisMonth: number;
  revenueByService: Array<{ serviceId: number; serviceName: string; revenue: number }>;
  revenueByStaff: Array<{ staffId: number; staffName: string; revenue: number }>;
}

const initialData: AppointmentDataSnapshot = {
  staffs: [],
  services: [],
  appointments: [],
  reviews: [],
};

export const useAppointmentManager = () => {
  const [data, setData] = useState<AppointmentDataSnapshot>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const snapshot = await appointmentService.getSnapshot();
      setData(snapshot);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : 'Không tải dữ liệu được';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      try {
        const snapshot = await appointmentService.getSnapshot();
        if (mounted) {
          setData(snapshot);
          setError('');
        }
      } catch (err) {
        if (mounted) {
          const messageText = err instanceof Error ? err.message : 'Không tải dữ liệu được';
          setError(messageText);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    boot();

    return () => {
      mounted = false;
    };
  }, []);

  const withSubmit = useCallback(async (job: () => Promise<void>, successMessage: string) => {
    setSubmitting(true);
    try {
      await job();
      message.success(successMessage);
      setError('');
    } catch (err) {
      const messageText = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      message.error(messageText);
      setError(messageText);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const createStaff = useCallback(
    async (payload: CreateStaffPayload) => {
      await withSubmit(async () => {
        const staff = await appointmentService.createStaff(payload);
        setData((prev) => ({ ...prev, staffs: [...prev.staffs, staff] }));
      }, 'Thêm nhân viên thành công');
    },
    [withSubmit],
  );

  const updateStaff = useCallback(
    async (payload: UpdateStaffPayload) => {
      await withSubmit(async () => {
        const updated = await appointmentService.updateStaff(payload);
        setData((prev) => ({
          ...prev,
          staffs: prev.staffs.map((item) => (item.id === updated.id ? updated : item)),
        }));
      }, 'Cập nhật nhân viên thành công');
    },
    [withSubmit],
  );

  const deleteStaff = useCallback(
    async (staffId: number) => {
      await withSubmit(async () => {
        await appointmentService.deleteStaff(staffId);
        setData((prev) => ({ ...prev, staffs: prev.staffs.filter((item) => item.id !== staffId) }));
      }, 'Xóa nhân viên thành công');
    },
    [withSubmit],
  );

  const createServiceItem = useCallback(
    async (payload: CreateServicePayload) => {
      await withSubmit(async () => {
        const service = await appointmentService.createService(payload);
        setData((prev) => ({ ...prev, services: [...prev.services, service] }));
      }, 'Thêm dịch vụ thành công');
    },
    [withSubmit],
  );

  const updateServiceItem = useCallback(
    async (payload: UpdateServicePayload) => {
      await withSubmit(async () => {
        const updated = await appointmentService.updateService(payload);
        setData((prev) => ({
          ...prev,
          services: prev.services.map((item) => (item.id === updated.id ? updated : item)),
        }));
      }, 'Cập nhật dịch vụ thành công');
    },
    [withSubmit],
  );

  const deleteServiceItem = useCallback(
    async (serviceId: number) => {
      await withSubmit(async () => {
        await appointmentService.deleteService(serviceId);
        setData((prev) => ({
          ...prev,
          services: prev.services.filter((item) => item.id !== serviceId),
        }));
      }, 'Xóa dịch vụ thành công');
    },
    [withSubmit],
  );

  const createAppointment = useCallback(
    async (payload: CreateAppointmentPayload) => {
      await withSubmit(async () => {
        const appointment = await appointmentService.createAppointment(payload);
        setData((prev) => ({ ...prev, appointments: [appointment, ...prev.appointments] }));
      }, 'Đặt lịch thành công');
    },
    [withSubmit],
  );

  const updateAppointmentStatus = useCallback(
    async (appointmentId: number, status: AppointmentStatus) => {
      await withSubmit(async () => {
        const updated = await appointmentService.updateAppointmentStatus({ appointmentId, status });
        setData((prev) => ({
          ...prev,
          appointments: prev.appointments.map((item) => (item.id === updated.id ? updated : item)),
        }));
      }, 'Cập nhật trạng thái lịch hẹn thành công');
    },
    [withSubmit],
  );

  const createReview = useCallback(
    async (payload: CreateReviewPayload) => {
      await withSubmit(async () => {
        const review = await appointmentService.createReview(payload);
        setData((prev) => ({ ...prev, reviews: [review, ...prev.reviews] }));
      }, 'Gửi đánh giá thành công');
    },
    [withSubmit],
  );

  const replyReview = useCallback(
    async (payload: ReplyReviewPayload) => {
      await withSubmit(async () => {
        const updated = await appointmentService.replyReview(payload);
        setData((prev) => ({
          ...prev,
          reviews: prev.reviews.map((item) => (item.id === updated.id ? updated : item)),
        }));
      }, 'Phản hồi đánh giá thành công');
    },
    [withSubmit],
  );

  const stats = useMemo<SummaryReport>(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const monthPrefix = now.toISOString().slice(0, 7);

    const appointmentById = new Map<number, Appointment>();
    data.appointments.forEach((item) => {
      appointmentById.set(item.id, item);
    });

    const serviceById = new Map<number, ServiceItem>();
    data.services.forEach((item) => {
      serviceById.set(item.id, item);
    });

    const staffById = new Map<number, Staff>();
    data.staffs.forEach((item) => {
      staffById.set(item.id, item);
    });

    const completedAppointments = data.appointments.filter((item) => item.status === 'Hoàn thành');

    const appointmentsToday = data.appointments.filter((item) => item.date === today).length;
    const appointmentsThisMonth = data.appointments.filter((item) => item.date.startsWith(monthPrefix)).length;

    const revenueByServiceMap = new Map<number, number>();
    const revenueByStaffMap = new Map<number, number>();

    completedAppointments.forEach((item) => {
      const service = serviceById.get(item.serviceId);
      if (!service) {
        return;
      }
      const currentServiceRevenue = revenueByServiceMap.get(item.serviceId) || 0;
      revenueByServiceMap.set(item.serviceId, currentServiceRevenue + service.price);

      const currentStaffRevenue = revenueByStaffMap.get(item.staffId) || 0;
      revenueByStaffMap.set(item.staffId, currentStaffRevenue + service.price);
    });

    const revenueByService = Array.from(revenueByServiceMap.entries()).map(([serviceId, revenue]) => ({
      serviceId,
      serviceName: serviceById.get(serviceId)?.name || `Dịch vụ #${serviceId}`,
      revenue,
    }));

    const revenueByStaff = Array.from(revenueByStaffMap.entries()).map(([staffId, revenue]) => ({
      staffId,
      staffName: staffById.get(staffId)?.name || `Nhân viên #${staffId}`,
      revenue,
    }));

    const revenueThisMonth = completedAppointments
      .filter((item) => item.date.startsWith(monthPrefix))
      .reduce((sum, item) => sum + (serviceById.get(item.serviceId)?.price || 0), 0);

    return {
      appointmentsToday,
      appointmentsThisMonth,
      revenueThisMonth,
      revenueByService,
      revenueByStaff,
    };
  }, [data.appointments, data.services, data.staffs]);

  const averageRatingByStaff = useMemo(() => {
    return data.staffs.reduce<Record<number, number>>((acc, staff) => {
      acc[staff.id] = calculateAverageRatingByStaff(staff.id, data.reviews);
      return acc;
    }, {});
  }, [data.staffs, data.reviews]);

  const completedAppointmentsWithoutReview = useMemo(() => {
    const reviewedAppointmentIds = new Set(data.reviews.map((item) => item.appointmentId));
    return data.appointments.filter(
      (item) => item.status === 'Hoàn thành' && !reviewedAppointmentIds.has(item.id),
    );
  }, [data.appointments, data.reviews]);

  return {
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
  };
};
