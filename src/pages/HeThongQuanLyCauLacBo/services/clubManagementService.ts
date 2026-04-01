import moment from 'moment';
import {
  ApplicationFormPayload,
  ApplicationHistory,
  ApplicationHistoryAction,
  ApplicationStatus,
  Club,
  ClubFormPayload,
  ClubManagementSnapshot,
  MemberApplication,
} from '../types';

const STORAGE_KEY = 'he_thong_quan_ly_clb_v1';
const LATENCY = 220;

const seedClubs: Club[] = [
  {
    id: 1,
    avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200',
    name: 'CLB Công Nghệ Số',
    establishedDate: '2021-09-15',
    descriptionHtml: '<p>CLB Công Nghệ Số tập trung vào AI, Web, Cloud.</p>',
    presidentName: 'Nguyen Hoang Long',
    active: true,
    createdAt: moment().subtract(2, 'year').toISOString(),
  },
  {
    id: 2,
    avatar: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200',
    name: 'CLB Truyền Thông',
    establishedDate: '2020-03-10',
    descriptionHtml: '<p>CLB Truyền Thông chuyên về nội dung, media, sự kiện.</p>',
    presidentName: 'Tran Quynh Anh',
    active: true,
    createdAt: moment().subtract(3, 'year').toISOString(),
  },
];

const seedApplications: MemberApplication[] = [
  {
    id: 1,
    fullName: 'Le Minh Tuan',
    email: 'tuanlm@gmail.com',
    phone: '0912345678',
    gender: 'Male',
    address: 'Hà Nội',
    talent: 'Lập trình frontend',
    clubId: 1,
    reason: 'Muốn học thêm React và tham gia dự án',
    status: 'Approved',
    adminNote: 'Ứng viên tiềm năng',
    createdAt: moment().subtract(7, 'day').toISOString(),
    updatedAt: moment().subtract(5, 'day').toISOString(),
  },
  {
    id: 2,
    fullName: 'Pham Thu Ha',
    email: 'hapt@gmail.com',
    phone: '0987654321',
    gender: 'Female',
    address: 'Hải Phòng',
    talent: 'MC và viết nội dung',
    clubId: 2,
    reason: 'Yêu thích truyền thông nội bộ',
    status: 'Pending',
    createdAt: moment().subtract(2, 'day').toISOString(),
    updatedAt: moment().subtract(2, 'day').toISOString(),
  },
];

const seedHistories: ApplicationHistory[] = [
  {
    id: 1,
    applicationId: 1,
    action: 'CREATED',
    adminName: 'System',
    createdAt: moment().subtract(7, 'day').toISOString(),
    note: 'Khởi tạo đơn đăng ký',
  },
  {
    id: 2,
    applicationId: 1,
    action: 'APPROVED',
    adminName: 'Admin HeThong',
    createdAt: moment().subtract(5, 'day').toISOString(),
    note: 'Duyệt đơn đăng ký',
  },
];

let store: ClubManagementSnapshot = {
  clubs: seedClubs,
  applications: seedApplications,
  histories: seedHistories,
};

const cloneStore = (): ClubManagementSnapshot => JSON.parse(JSON.stringify(store));

const nextId = (list: Array<{ id: number }>): number => {
  if (!list.length) {
    return 1;
  }
  return Math.max(...list.map((item) => item.id)) + 1;
};

const saveStore = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const loadStore = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }
  try {
    store = JSON.parse(raw);
  } catch (error) {
    store = {
      clubs: seedClubs,
      applications: seedApplications,
      histories: seedHistories,
    };
  }
};

const simulate = async <T>(result: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), LATENCY);
  });
};

const assertClubExists = (clubId: number): void => {
  const club = store.clubs.find((item) => item.id === clubId);
  if (!club) {
    throw new Error('CLB không tồn tại');
  }
};

const createHistory = (
  applicationId: number,
  action: ApplicationHistoryAction,
  adminName: string,
  note?: string,
): void => {
  const history: ApplicationHistory = {
    id: nextId(store.histories),
    applicationId,
    action,
    adminName,
    createdAt: moment().toISOString(),
    note,
  };
  store.histories = [history, ...store.histories];
};

loadStore();

export const clubManagementService = {
  async getSnapshot(): Promise<ClubManagementSnapshot> {
    return simulate(cloneStore());
  },

  async createClub(payload: ClubFormPayload): Promise<Club> {
    const duplicatedName = store.clubs.some(
      (item) => item.name.trim().toLowerCase() === payload.name.trim().toLowerCase(),
    );
    if (duplicatedName) {
      throw new Error('Tên CLB đã tồn tại');
    }

    const club: Club = {
      id: nextId(store.clubs),
      ...payload,
      createdAt: moment().toISOString(),
    };

    store.clubs = [club, ...store.clubs];
    saveStore();
    return simulate(club);
  },

  async updateClub(clubId: number, payload: ClubFormPayload): Promise<Club> {
    const current = store.clubs.find((item) => item.id === clubId);
    if (!current) {
      throw new Error('CLB không tồn tại');
    }

    const duplicatedName = store.clubs.some(
      (item) =>
        item.id !== clubId && item.name.trim().toLowerCase() === payload.name.trim().toLowerCase(),
    );
    if (duplicatedName) {
      throw new Error('Tên CLB đã tồn tại');
    }

    const updated: Club = {
      ...current,
      ...payload,
    };

    store.clubs = store.clubs.map((item) => (item.id === clubId ? updated : item));
    saveStore();
    return simulate(updated);
  },

  async deleteClub(clubId: number): Promise<void> {
    assertClubExists(clubId);
    const inUse = store.applications.some((item) => item.clubId === clubId);
    if (inUse) {
      throw new Error('Không thể xóa CLB đã có đơn đăng ký/thành viên');
    }

    store.clubs = store.clubs.filter((item) => item.id !== clubId);
    saveStore();
    return simulate(undefined);
  },

  async createApplication(payload: ApplicationFormPayload, adminName: string): Promise<MemberApplication> {
    assertClubExists(payload.clubId);
    const now = moment().toISOString();

    const created: MemberApplication = {
      id: nextId(store.applications),
      ...payload,
      status: 'Pending',
      rejectionNote: undefined,
      createdAt: now,
      updatedAt: now,
    };

    store.applications = [created, ...store.applications];
    createHistory(created.id, 'CREATED', adminName, 'Tạo mới đơn đăng ký');
    saveStore();
    return simulate(created);
  },

  async updateApplication(
    applicationId: number,
    payload: ApplicationFormPayload,
    adminName: string,
  ): Promise<MemberApplication> {
    assertClubExists(payload.clubId);
    const current = store.applications.find((item) => item.id === applicationId);
    if (!current) {
      throw new Error('Đơn đăng ký không tồn tại');
    }

    const updated: MemberApplication = {
      ...current,
      ...payload,
      updatedAt: moment().toISOString(),
    };

    store.applications = store.applications.map((item) => (item.id === applicationId ? updated : item));
    createHistory(applicationId, 'UPDATED', adminName, 'Cập nhật đơn đăng ký');
    saveStore();
    return simulate(updated);
  },

  async deleteApplication(applicationId: number, adminName: string): Promise<void> {
    const current = store.applications.find((item) => item.id === applicationId);
    if (!current) {
      throw new Error('Đơn đăng ký không tồn tại');
    }

    store.applications = store.applications.filter((item) => item.id !== applicationId);
    createHistory(applicationId, 'DELETED', adminName, 'Xóa đơn đăng ký');
    saveStore();
    return simulate(undefined);
  },

  async changeStatus(
    applicationIds: number[],
    status: ApplicationStatus,
    adminName: string,
    rejectionReason?: string,
  ): Promise<MemberApplication[]> {
    if (!applicationIds.length) {
      return simulate([]);
    }
    if (status === 'Rejected' && !rejectionReason?.trim()) {
      throw new Error('Vui lòng nhập lý do từ chối');
    }

    const updatedItems: MemberApplication[] = [];

    store.applications = store.applications.map((item) => {
      if (!applicationIds.includes(item.id)) {
        return item;
      }

      const updated: MemberApplication = {
        ...item,
        status,
        rejectionNote: status === 'Rejected' ? rejectionReason?.trim() : undefined,
        updatedAt: moment().toISOString(),
      };

      updatedItems.push(updated);

      createHistory(
        item.id,
        status === 'Approved' ? 'APPROVED' : 'REJECTED',
        adminName,
        status === 'Rejected' ? `Lý do: ${rejectionReason}` : 'Duyệt đơn đăng ký',
      );

      return updated;
    });

    saveStore();
    return simulate(updatedItems);
  },

  async transferMembers(
    applicationIds: number[],
    targetClubId: number,
    adminName: string,
  ): Promise<MemberApplication[]> {
    assertClubExists(targetClubId);
    if (!applicationIds.length) {
      return simulate([]);
    }

    const updatedItems: MemberApplication[] = [];

    store.applications = store.applications.map((item) => {
      if (!applicationIds.includes(item.id)) {
        return item;
      }
      if (item.status !== 'Approved') {
        return item;
      }

      const updated: MemberApplication = {
        ...item,
        clubId: targetClubId,
        updatedAt: moment().toISOString(),
      };

      updatedItems.push(updated);
      createHistory(item.id, 'TRANSFERRED', adminName, `Chuyển sang CLB ID ${targetClubId}`);
      return updated;
    });

    saveStore();
    return simulate(updatedItems);
  },

  async getApplicationHistories(applicationId: number): Promise<ApplicationHistory[]> {
    const rows = store.histories.filter((item) => item.applicationId === applicationId);
    return simulate(rows);
  },
};
