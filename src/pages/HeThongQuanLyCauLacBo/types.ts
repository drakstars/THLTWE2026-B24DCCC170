export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Club {
  id: number;
  avatar: string;
  name: string;
  establishedDate: string;
  descriptionHtml: string;
  presidentName: string;
  active: boolean;
  createdAt: string;
}

export interface MemberApplication {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  address: string;
  talent: string;
  clubId: number;
  reason: string;
  status: ApplicationStatus;
  rejectionNote?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationHistoryAction =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'APPROVED'
  | 'REJECTED'
  | 'TRANSFERRED';

export interface ApplicationHistory {
  id: number;
  applicationId: number;
  action: ApplicationHistoryAction;
  adminName: string;
  createdAt: string;
  note?: string;
}

export interface ClubManagementSnapshot {
  clubs: Club[];
  applications: MemberApplication[];
  histories: ApplicationHistory[];
}

export interface ClubFormPayload {
  avatar: string;
  name: string;
  establishedDate: string;
  descriptionHtml: string;
  presidentName: string;
  active: boolean;
}

export interface ApplicationFormPayload {
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  address: string;
  talent: string;
  clubId: number;
  reason: string;
  adminNote?: string;
}

export interface OverviewStats {
  totalClubs: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
}

export interface ReportData {
  stats: OverviewStats;
  chart: {
    xAxis: string[];
    pending: number[];
    approved: number[];
    rejected: number[];
  };
}
