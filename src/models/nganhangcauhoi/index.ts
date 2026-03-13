// Models for Question Bank Management System

export interface KhoiKienThuc {
  id?: string;
  maKhoiKienThuc: string;
  tenKhoiKienThuc: string;
  moTa?: string;
  thuTu?: number;
  trangThai?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MonHoc {
  id?: string;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  moTa?: string;
  trangThai?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type MucDoKho = 'De' | 'TrungBinh' | 'Kho' | 'RatKho';

export interface CauHoi {
  id?: string;
  maCauHoi: string;
  monHocId: string;
  monHoc?: MonHoc;
  khoiKienThucId: string;
  khoiKienThuc?: KhoiKienThuc;
  noiDung: string;
  mucDoKho: MucDoKho;
  dapAn?: string;
  diemToiDa?: number;
  trangThai?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CauTrucDeThi {
  id?: string;
  tenCauTruc: string;
  monHocId: string;
  monHoc?: MonHoc;
  moTa?: string;
  chiTiet: CauTrucChiTiet[];
  tongSoCau?: number;
  tongDiem?: number;
  trangThai?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CauTrucChiTiet {
  khoiKienThucId: string;
  khoiKienThuc?: KhoiKienThuc;
  mucDoKho: MucDoKho;
  soCauHoi: number;
  diemMoiCau?: number;
}

export interface DeThi {
  id?: string;
  maDeThi: string;
  tenDeThi: string;
  monHocId: string;
  monHoc?: MonHoc;
  cauTrucDeThiId?: string;
  cauTrucDeThi?: CauTrucDeThi;
  danhSachCauHoi: DeThiCauHoi[];
  tongSoCau: number;
  tongDiem: number;
  thoiGianLamBai?: number; // minutes
  ngayTao?: string;
  nguoiTao?: string;
  trangThai?: boolean;
  ghiChu?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeThiCauHoi {
  cauHoiId: string;
  cauHoi?: CauHoi;
  thuTu: number;
  diem: number;
}

export interface FilterCauHoi {
  monHocId?: string;
  khoiKienThucId?: string;
  mucDoKho?: MucDoKho;
  tuKhoa?: string;
}

export interface TaoDeThiRequest {
  tenDeThi: string;
  monHocId: string;
  cauTrucDeThiId?: string;
  cauTrucChiTiet: CauTrucChiTiet[];
  thoiGianLamBai?: number;
  ghiChu?: string;
}

export interface TaoDeThiResponse {
  success: boolean;
  message?: string;
  deThi?: DeThi;
  errors?: {
    khoiKienThucId: string;
    mucDoKho: MucDoKho;
    yeuCau: number;
    coSan: number;
  }[];
}

// Mock data storage keys
export const STORAGE_KEYS = {
  KHOI_KIEN_THUC: 'nganhangcauhoi_khoikienthuc',
  MON_HOC: 'nganhangcauhoi_monhoc',
  CAU_HOI: 'nganhangcauhoi_cauhoi',
  CAU_TRUC_DE_THI: 'nganhangcauhoi_cautrucdethi',
  DE_THI: 'nganhangcauhoi_dethi',
};

// Utility functions for difficulty level
export const getMucDoKhoLabel = (mucDoKho: MucDoKho): string => {
  const labels: Record<MucDoKho, string> = {
    'De': 'Dễ',
    'TrungBinh': 'Trung bình',
    'Kho': 'Khó',
    'RatKho': 'Rất khó',
  };
  return labels[mucDoKho];
};

export const getMucDoKhoColor = (mucDoKho: MucDoKho): string => {
  const colors: Record<MucDoKho, string> = {
    'De': 'green',
    'TrungBinh': 'blue',
    'Kho': 'orange',
    'RatKho': 'red',
  };
  return colors[mucDoKho];
};

export const MUC_DO_KHO_OPTIONS = [
  { value: 'De', label: 'Dễ' },
  { value: 'TrungBinh', label: 'Trung bình' },
  { value: 'Kho', label: 'Khó' },
  { value: 'RatKho', label: 'Rất khó' },
];
