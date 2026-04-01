import moment from 'moment';
import { Club, ClubManagementSnapshot, MemberApplication, ReportData } from '../types';

export const DEFAULT_ADMIN_NAME = 'Admin HeThong';

export const STATUS_LABELS = {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
} as const;

export const formatDateTime = (value: string): string => {
  return moment(value).format('HH:mm DD/MM/YYYY');
};

export const formatDate = (value: string): string => {
  return moment(value).format('DD/MM/YYYY');
};

export const getClubName = (clubs: Club[], clubId: number): string => {
  const found = clubs.find((club) => club.id === clubId);
  return found?.name || 'Không xác định';
};

export const getApprovedMembers = (applications: MemberApplication[]): MemberApplication[] => {
  return applications.filter((item) => item.status === 'Approved');
};

export const buildReportData = (snapshot: ClubManagementSnapshot): ReportData => {
  const stats = {
    totalClubs: snapshot.clubs.length,
    totalPending: snapshot.applications.filter((item) => item.status === 'Pending').length,
    totalApproved: snapshot.applications.filter((item) => item.status === 'Approved').length,
    totalRejected: snapshot.applications.filter((item) => item.status === 'Rejected').length,
  };

  const xAxis: string[] = [];
  const pending: number[] = [];
  const approved: number[] = [];
  const rejected: number[] = [];

  snapshot.clubs.forEach((club) => {
    xAxis.push(club.name);
    pending.push(
      snapshot.applications.filter((item) => item.clubId === club.id && item.status === 'Pending').length,
    );
    approved.push(
      snapshot.applications.filter((item) => item.clubId === club.id && item.status === 'Approved').length,
    );
    rejected.push(
      snapshot.applications.filter((item) => item.clubId === club.id && item.status === 'Rejected').length,
    );
  });

  return {
    stats,
    chart: {
      xAxis,
      pending,
      approved,
      rejected,
    },
  };
};
