export type FieldType = 'String' | 'Number' | 'Date';

export interface DiplomaBook {
  id: number;
  year: number;
  currentEntryNumber: number;
}

export interface GraduationDecision {
  id: number;
  decisionNumber: string;
  issuedDate: string;
  summary: string;
  bookId: number;
  lookupCount: number;
}

export interface AppendixFieldConfig {
  id: number;
  name: string;
  key: string;
  type: FieldType;
}

export interface DiplomaRecord {
  id: number;
  bookId: number;
  decisionId: number;
  entryNumber: number;
  diplomaNumber: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  extraData: Record<string, string | number>;
}

export interface DiplomaState {
  books: DiplomaBook[];
  decisions: GraduationDecision[];
  fieldConfigs: AppendixFieldConfig[];
  diplomas: DiplomaRecord[];
  counters: {
    book: number;
    decision: number;
    field: number;
    diploma: number;
  };
}

export interface DecisionPayload {
  decisionNumber: string;
  issuedDate: string;
  summary: string;
  bookId: number;
}

export interface FieldPayload {
  name: string;
  type: FieldType;
}

export interface DiplomaPayload {
  decisionId: number;
  diplomaNumber: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  extraData: Record<string, string | number>;
}

export interface DiplomaSearchParams {
  diplomaNumber?: string;
  entryNumber?: number;
  studentCode?: string;
  fullName?: string;
  dateOfBirth?: string;
}
