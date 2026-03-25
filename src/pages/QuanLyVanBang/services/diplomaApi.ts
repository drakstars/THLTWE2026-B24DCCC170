import moment from 'moment';
import {
  DiplomaState,
  DecisionPayload,
  FieldPayload,
  DiplomaPayload,
  DiplomaSearchParams,
} from '../types';

const STORAGE_KEY = 'quan-ly-van-bang-state-v2';

const delay = (ms: number = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const toFieldKey = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

const getInitialState = (): DiplomaState => {
  const currentYear = moment().year();
  return {
    books: [{ id: 1, year: currentYear, currentEntryNumber: 0 }],
    decisions: [],
    fieldConfigs: [
      { id: 1, name: 'Điểm trung bình', key: 'diem_trung_binh', type: 'Number' },
      { id: 2, name: 'Nơi sinh', key: 'noi_sinh', type: 'String' },
    ],
    diplomas: [],
    counters: { book: 2, decision: 1, field: 3, diploma: 1 },
  };
};

const loadState = (): DiplomaState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getInitialState();

  try {
    const parsed = JSON.parse(raw) as DiplomaState;
    if (!parsed.books || !parsed.decisions || !parsed.fieldConfigs || !parsed.diplomas || !parsed.counters) {
      return getInitialState();
    }
    return parsed;
  } catch (_error) {
    return getInitialState();
  }
};

const saveState = (nextState: DiplomaState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
};

const readState = async () => {
  await delay();
  return loadState();
};

const writeState = async (mutator: (state: DiplomaState) => DiplomaState) => {
  await delay();
  const current = loadState();
  const next = mutator(current);
  saveState(next);
  return next;
};

export const diplomaApi = {
  async fetchState() {
    return readState();
  },

  async createBook(year: number) {
    return writeState((state) => {
      if (state.books.some((book) => book.year === year)) {
        throw new Error('Mỗi năm chỉ có 1 sổ văn bằng. Năm này đã tồn tại.');
      }

      return {
        ...state,
        books: [...state.books, { id: state.counters.book, year, currentEntryNumber: 0 }],
        counters: { ...state.counters, book: state.counters.book + 1 },
      };
    });
  },

  async upsertDecision(payload: DecisionPayload, editingId?: number) {
    return writeState((state) => {
      if (editingId) {
        return {
          ...state,
          decisions: state.decisions.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  decisionNumber: payload.decisionNumber,
                  issuedDate: payload.issuedDate,
                  summary: payload.summary,
                  bookId: payload.bookId,
                }
              : item,
          ),
        };
      }

      return {
        ...state,
        decisions: [
          ...state.decisions,
          {
            id: state.counters.decision,
            decisionNumber: payload.decisionNumber,
            issuedDate: payload.issuedDate,
            summary: payload.summary,
            bookId: payload.bookId,
            lookupCount: 0,
          },
        ],
        counters: { ...state.counters, decision: state.counters.decision + 1 },
      };
    });
  },

  async deleteDecision(decisionId: number) {
    return writeState((state) => {
      const isUsed = state.diplomas.some((item) => item.decisionId === decisionId);
      if (isUsed) {
        throw new Error('Quyết định đã có văn bằng, không thể xóa.');
      }

      return {
        ...state,
        decisions: state.decisions.filter((item) => item.id !== decisionId),
      };
    });
  },

  async upsertField(payload: FieldPayload, editingId?: number) {
    return writeState((state) => {
      const nextKey = toFieldKey(payload.name);
      if (!nextKey) {
        throw new Error('Tên trường không hợp lệ.');
      }

      const duplicated = state.fieldConfigs.some(
        (item) => item.key === nextKey && item.id !== editingId,
      );
      if (duplicated) {
        throw new Error('Tên trường đã tồn tại. Vui lòng đặt tên khác.');
      }

      if (editingId) {
        const target = state.fieldConfigs.find((item) => item.id === editingId);
        if (!target) return state;

        return {
          ...state,
          fieldConfigs: state.fieldConfigs.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  name: payload.name,
                  key: nextKey,
                  type: payload.type,
                }
              : item,
          ),
          diplomas: state.diplomas.map((diploma) => {
            const nextExtraData = { ...diploma.extraData };
            if (target.key !== nextKey && Object.prototype.hasOwnProperty.call(nextExtraData, target.key)) {
              nextExtraData[nextKey] = nextExtraData[target.key];
              delete nextExtraData[target.key];
            }
            return {
              ...diploma,
              extraData: nextExtraData,
            };
          }),
        };
      }

      return {
        ...state,
        fieldConfigs: [
          ...state.fieldConfigs,
          {
            id: state.counters.field,
            name: payload.name,
            key: nextKey,
            type: payload.type,
          },
        ],
        counters: { ...state.counters, field: state.counters.field + 1 },
      };
    });
  },

  async deleteField(fieldId: number) {
    return writeState((state) => {
      const target = state.fieldConfigs.find((item) => item.id === fieldId);
      if (!target) return state;

      return {
        ...state,
        fieldConfigs: state.fieldConfigs.filter((item) => item.id !== fieldId),
        diplomas: state.diplomas.map((diploma) => {
          const nextExtraData = { ...diploma.extraData };
          delete nextExtraData[target.key];
          return {
            ...diploma,
            extraData: nextExtraData,
          };
        }),
      };
    });
  },

  async upsertDiploma(payload: DiplomaPayload, editingId?: number) {
    return writeState((state) => {
      const duplicateDiplomaNumber = state.diplomas.some(
        (item) =>
          item.diplomaNumber.trim().toLowerCase() === payload.diplomaNumber.trim().toLowerCase() &&
          item.id !== editingId,
      );
      if (duplicateDiplomaNumber) {
        throw new Error('Số hiệu văn bằng đã tồn tại.');
      }

      if (editingId) {
        return {
          ...state,
          diplomas: state.diplomas.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  diplomaNumber: payload.diplomaNumber,
                  studentCode: payload.studentCode,
                  fullName: payload.fullName,
                  dateOfBirth: payload.dateOfBirth,
                  extraData: payload.extraData,
                }
              : item,
          ),
        };
      }

      const decision = state.decisions.find((item) => item.id === payload.decisionId);
      if (!decision) {
        throw new Error('Không tìm thấy quyết định tốt nghiệp.');
      }

      const book = state.books.find((item) => item.id === decision.bookId);
      if (!book) {
        throw new Error('Không tìm thấy sổ văn bằng tương ứng.');
      }

      const nextEntryNumber = book.currentEntryNumber + 1;

      return {
        ...state,
        diplomas: [
          ...state.diplomas,
          {
            id: state.counters.diploma,
            bookId: book.id,
            decisionId: payload.decisionId,
            entryNumber: nextEntryNumber,
            diplomaNumber: payload.diplomaNumber,
            studentCode: payload.studentCode,
            fullName: payload.fullName,
            dateOfBirth: payload.dateOfBirth,
            extraData: payload.extraData,
          },
        ],
        books: state.books.map((item) =>
          item.id === book.id
            ? {
                ...item,
                currentEntryNumber: nextEntryNumber,
              }
            : item,
        ),
        counters: { ...state.counters, diploma: state.counters.diploma + 1 },
      };
    });
  },

  async deleteDiploma(diplomaId: number) {
    return writeState((state) => ({
      ...state,
      diplomas: state.diplomas.filter((item) => item.id !== diplomaId),
    }));
  },

  async searchDiplomas(params: DiplomaSearchParams) {
    const state = await readState();

    return state.diplomas.filter((diploma) => {
      const checks = [
        !params.diplomaNumber ||
          diploma.diplomaNumber.toLowerCase().includes(params.diplomaNumber.toLowerCase().trim()),
        params.entryNumber === undefined || diploma.entryNumber === params.entryNumber,
        !params.studentCode || diploma.studentCode.toLowerCase().includes(params.studentCode.toLowerCase().trim()),
        !params.fullName || diploma.fullName.toLowerCase().includes(params.fullName.toLowerCase().trim()),
        !params.dateOfBirth ||
          moment(diploma.dateOfBirth).format('YYYY-MM-DD') === moment(params.dateOfBirth).format('YYYY-MM-DD'),
      ];
      return checks.every(Boolean);
    });
  },

  async increaseDecisionLookup(decisionId: number) {
    return writeState((state) => ({
      ...state,
      decisions: state.decisions.map((item) =>
        item.id === decisionId
          ? {
              ...item,
              lookupCount: item.lookupCount + 1,
            }
          : item,
      ),
    }));
  },
};
