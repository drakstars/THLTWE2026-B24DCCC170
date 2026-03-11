import { 
  KhoiKienThuc, 
  MonHoc, 
  CauHoi, 
  CauTrucDeThi, 
  DeThi,
  FilterCauHoi,
  TaoDeThiRequest,
  TaoDeThiResponse,
  STORAGE_KEYS,
  DeThiCauHoi
} from '@/models/nganhangcauhoi';

// Helper function to simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generic CRUD operations
class LocalStorageService<T extends { id?: string }> {
  constructor(private storageKey: string) {}

  private getAll(): T[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveAll(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  async getList(): Promise<T[]> {
    await delay();
    return this.getAll();
  }

  async getById(id: string): Promise<T | undefined> {
    await delay();
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  async create(item: T): Promise<T> {
    await delay();
    const items = this.getAll();
    const newItem = { 
      ...item, 
      id: `${this.storageKey}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    this.saveAll(items);
    return newItem;
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    await delay();
    const items = this.getAll();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    items[index] = { 
      ...items[index], 
      ...item, 
      updatedAt: new Date().toISOString(),
    };
    this.saveAll(items);
    return items[index];
  }

  async delete(id: string): Promise<boolean> {
    await delay();
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    
    this.saveAll(filtered);
    return true;
  }
}

// Khoi Kien Thuc Service
class KhoiKienThucService extends LocalStorageService<KhoiKienThuc> {
  constructor() {
    super(STORAGE_KEYS.KHOI_KIEN_THUC);
  }

  async checkMaKhoiKienThucExists(ma: string, excludeId?: string): Promise<boolean> {
    const items = await this.getList();
    return items.some(item => item.maKhoiKienThuc === ma && item.id !== excludeId);
  }

  async initSampleData(): Promise<void> {
    const existing = await this.getList();
    if (existing.length > 0) return;

    const sampleData: KhoiKienThuc[] = [
      { maKhoiKienThuc: 'KKT001', tenKhoiKienThuc: 'Tổng quan', moTa: 'Kiến thức tổng quan', thuTu: 1, trangThai: true },
      { maKhoiKienThuc: 'KKT002', tenKhoiKienThuc: 'Chuyên sâu', moTa: 'Kiến thức chuyên sâu', thuTu: 2, trangThai: true },
      { maKhoiKienThuc: 'KKT003', tenKhoiKienThuc: 'Nâng cao', moTa: 'Kiến thức nâng cao', thuTu: 3, trangThai: true },
    ];

    for (const item of sampleData) {
      await this.create(item);
    }
  }
}

// Mon Hoc Service
class MonHocService extends LocalStorageService<MonHoc> {
  constructor() {
    super(STORAGE_KEYS.MON_HOC);
  }

  async checkMaMonHocExists(ma: string, excludeId?: string): Promise<boolean> {
    const items = await this.getList();
    return items.some(item => item.maMonHoc === ma && item.id !== excludeId);
  }

  async initSampleData(): Promise<void> {
    const existing = await this.getList();
    if (existing.length > 0) return;

    const sampleData: MonHoc[] = [
      { maMonHoc: 'IT001', tenMonHoc: 'Lập trình căn bản', soTinChi: 3, moTa: 'Môn học về lập trình căn bản', trangThai: true },
      { maMonHoc: 'IT002', tenMonHoc: 'Cấu trúc dữ liệu và giải thuật', soTinChi: 4, moTa: 'Môn học về cấu trúc dữ liệu', trangThai: true },
      { maMonHoc: 'IT003', tenMonHoc: 'Cơ sở dữ liệu', soTinChi: 3, moTa: 'Môn học về cơ sở dữ liệu', trangThai: true },
    ];

    for (const item of sampleData) {
      await this.create(item);
    }
  }
}

// Cau Hoi Service
class CauHoiService extends LocalStorageService<CauHoi> {
  constructor() {
    super(STORAGE_KEYS.CAU_HOI);
  }

  async checkMaCauHoiExists(ma: string, excludeId?: string): Promise<boolean> {
    const items = await this.getList();
    return items.some(item => item.maCauHoi === ma && item.id !== excludeId);
  }

  async filter(filter: FilterCauHoi): Promise<CauHoi[]> {
    await delay();
    let items = await this.getList();

    if (filter.monHocId) {
      items = items.filter(item => item.monHocId === filter.monHocId);
    }

    if (filter.khoiKienThucId) {
      items = items.filter(item => item.khoiKienThucId === filter.khoiKienThucId);
    }

    if (filter.mucDoKho) {
      items = items.filter(item => item.mucDoKho === filter.mucDoKho);
    }

    if (filter.tuKhoa) {
      const keyword = filter.tuKhoa.toLowerCase();
      items = items.filter(item => 
        item.maCauHoi.toLowerCase().includes(keyword) ||
        item.noiDung.toLowerCase().includes(keyword)
      );
    }

    return items;
  }

  async getByCondition(monHocId: string, khoiKienThucId: string, mucDoKho: string): Promise<CauHoi[]> {
    await delay();
    const items = await this.getList();
    return items.filter(item => 
      item.monHocId === monHocId &&
      item.khoiKienThucId === khoiKienThucId &&
      item.mucDoKho === mucDoKho &&
      item.trangThai !== false
    );
  }
}

// Cau Truc De Thi Service
class CauTrucDeThiService extends LocalStorageService<CauTrucDeThi> {
  constructor() {
    super(STORAGE_KEYS.CAU_TRUC_DE_THI);
  }

  async getByMonHoc(monHocId: string): Promise<CauTrucDeThi[]> {
    await delay();
    const items = await this.getList();
    return items.filter(item => item.monHocId === monHocId);
  }
}

// De Thi Service
class DeThiService extends LocalStorageService<DeThi> {
  constructor() {
    super(STORAGE_KEYS.DE_THI);
  }

  async checkMaDeThiExists(ma: string, excludeId?: string): Promise<boolean> {
    const items = await this.getList();
    return items.some(item => item.maDeThi === ma && item.id !== excludeId);
  }

  async taoDeThi(request: TaoDeThiRequest): Promise<TaoDeThiResponse> {
    await delay(500);

    const errors: TaoDeThiResponse['errors'] = [];
    const danhSachCauHoi: DeThiCauHoi[] = [];
    let thuTu = 1;
    let tongDiem = 0;

    // Check each requirement
    for (const chiTiet of request.cauTrucChiTiet) {
      const cauHoiList = await cauHoiService.getByCondition(
        request.monHocId,
        chiTiet.khoiKienThucId,
        chiTiet.mucDoKho
      );

      if (cauHoiList.length < chiTiet.soCauHoi) {
        errors.push({
          khoiKienThucId: chiTiet.khoiKienThucId,
          mucDoKho: chiTiet.mucDoKho,
          yeuCau: chiTiet.soCauHoi,
          coSan: cauHoiList.length,
        });
      } else {
        // Randomly select questions
        const shuffled = [...cauHoiList].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, chiTiet.soCauHoi);
        
        const diem = chiTiet.diemMoiCau || 1;
        selected.forEach(cauHoi => {
          danhSachCauHoi.push({
            cauHoiId: cauHoi.id!,
            cauHoi,
            thuTu: thuTu++,
            diem,
          });
          tongDiem += diem;
        });
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: 'Không đủ câu hỏi phù hợp để tạo đề thi',
        errors,
      };
    }

    // Create exam
    const deThi: DeThi = {
      maDeThi: `DT${Date.now()}`,
      tenDeThi: request.tenDeThi,
      monHocId: request.monHocId,
      cauTrucDeThiId: request.cauTrucDeThiId,
      danhSachCauHoi,
      tongSoCau: danhSachCauHoi.length,
      tongDiem,
      thoiGianLamBai: request.thoiGianLamBai,
      ngayTao: new Date().toISOString(),
      ghiChu: request.ghiChu,
      trangThai: true,
    };

    const created = await this.create(deThi);

    return {
      success: true,
      message: 'Tạo đề thi thành công',
      deThi: created,
    };
  }

  async getByMonHoc(monHocId: string): Promise<DeThi[]> {
    await delay();
    const items = await this.getList();
    return items.filter(item => item.monHocId === monHocId);
  }
}

// Export service instances
export const khoiKienThucService = new KhoiKienThucService();
export const monHocService = new MonHocService();
export const cauHoiService = new CauHoiService();
export const cauTrucDeThiService = new CauTrucDeThiService();
export const deThiService = new DeThiService();

// Initialize sample data
export const initSampleData = async () => {
  await khoiKienThucService.initSampleData();
  await monHocService.initSampleData();
};
