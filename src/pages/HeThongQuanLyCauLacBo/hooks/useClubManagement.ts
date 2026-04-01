import { useCallback, useMemo, useState } from 'react';
import { message } from 'antd';
import {
  ApplicationFormPayload,
  ApplicationHistory,
  ApplicationStatus,
  Club,
  ClubFormPayload,
  ClubManagementSnapshot,
  MemberApplication,
} from '../types';
import { clubManagementService } from '../services/clubManagementService';
import { buildReportData, DEFAULT_ADMIN_NAME, getApprovedMembers } from '../utils/clubHelpers';

const initialSnapshot: ClubManagementSnapshot = {
  clubs: [],
  applications: [],
  histories: [],
};

export const useClubManagement = () => {
  const [snapshot, setSnapshot] = useState<ClubManagementSnapshot>(initialSnapshot);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [histories, setHistories] = useState<ApplicationHistory[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clubManagementService.getSnapshot();
      setSnapshot(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không tải dữ liệu được';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createClub = useCallback(async (payload: ClubFormPayload) => {
    setSubmitting(true);
    try {
      await clubManagementService.createClub(payload);
      message.success('Thêm mới CLB thành công');
      await loadData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Thêm CLB thất bại';
      message.error(msg);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [loadData]);

  const updateClub = useCallback(async (clubId: number, payload: ClubFormPayload) => {
    setSubmitting(true);
    try {
      await clubManagementService.updateClub(clubId, payload);
      message.success('Cập nhật CLB thành công');
      await loadData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Cập nhật CLB thất bại';
      message.error(msg);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [loadData]);

  const deleteClub = useCallback(async (clubId: number) => {
    setSubmitting(true);
    try {
      await clubManagementService.deleteClub(clubId);
      message.success('Xóa CLB thành công');
      await loadData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Xóa CLB thất bại';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [loadData]);

  const createApplication = useCallback(async (payload: ApplicationFormPayload) => {
    setSubmitting(true);
    try {
      await clubManagementService.createApplication(payload, DEFAULT_ADMIN_NAME);
      message.success('Thêm đơn đăng ký thành công');
      await loadData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Thêm đơn thất bại';
      message.error(msg);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [loadData]);

  const updateApplication = useCallback(async (applicationId: number, payload: ApplicationFormPayload) => {
    setSubmitting(true);
    try {
      await clubManagementService.updateApplication(applicationId, payload, DEFAULT_ADMIN_NAME);
      message.success('Cập nhật đơn thành công');
      await loadData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Cập nhật đơn thất bại';
      message.error(msg);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [loadData]);

  const deleteApplication = useCallback(async (applicationId: number) => {
    setSubmitting(true);
    try {
      await clubManagementService.deleteApplication(applicationId, DEFAULT_ADMIN_NAME);
      message.success('Xóa đơn thành công');
      await loadData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Xóa đơn thất bại';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [loadData]);

  const changeStatus = useCallback(
    async (applicationIds: number[], status: ApplicationStatus, rejectionReason?: string) => {
      setSubmitting(true);
      try {
        const rows = await clubManagementService.changeStatus(
          applicationIds,
          status,
          DEFAULT_ADMIN_NAME,
          rejectionReason,
        );
        message.success(`Cập nhật trạng thái ${rows.length} đơn`);
        await loadData();
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Cập nhật trạng thái thất bại';
        message.error(msg);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [loadData],
  );

  const transferMembers = useCallback(async (applicationIds: number[], targetClubId: number) => {
    setSubmitting(true);
    try {
      const rows = await clubManagementService.transferMembers(
        applicationIds,
        targetClubId,
        DEFAULT_ADMIN_NAME,
      );
      message.success(`Đã chuyển ${rows.length} thành viên`);
      await loadData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Chuyển CLB thất bại';
      message.error(msg);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [loadData]);

  const loadApplicationHistories = useCallback(async (applicationId: number) => {
    setSubmitting(true);
    try {
      const rows = await clubManagementService.getApplicationHistories(applicationId);
      setHistories(rows);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không tải lịch sử được';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const members = useMemo<MemberApplication[]>(() => {
    return getApprovedMembers(snapshot.applications);
  }, [snapshot.applications]);

  const reportData = useMemo(() => buildReportData(snapshot), [snapshot]);

  const getClubMembers = useCallback(
    (clubId: number): MemberApplication[] => {
      return members.filter((item) => item.clubId === clubId);
    },
    [members],
  );

  const getClubById = useCallback(
    (clubId: number): Club | undefined => {
      return snapshot.clubs.find((item) => item.id === clubId);
    },
    [snapshot.clubs],
  );

  return {
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
    getClubById,
  };
};
