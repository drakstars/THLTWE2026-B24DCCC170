import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DiplomaState,
  DecisionPayload,
  FieldPayload,
  DiplomaPayload,
  DiplomaSearchParams,
  DiplomaRecord,
} from '../types';
import { diplomaApi } from '../services/diplomaApi';

interface DiplomaContextValue {
  state: DiplomaState;
  loading: boolean;
  booksById: Record<number, DiplomaState['books'][number]>;
  decisionsById: Record<number, DiplomaState['decisions'][number]>;
  refreshState: () => Promise<void>;
  createBook: (year: number) => Promise<void>;
  saveDecision: (payload: DecisionPayload, editingId?: number) => Promise<void>;
  removeDecision: (decisionId: number) => Promise<void>;
  saveField: (payload: FieldPayload, editingId?: number) => Promise<void>;
  removeField: (fieldId: number) => Promise<void>;
  saveDiploma: (payload: DiplomaPayload, editingId?: number) => Promise<void>;
  removeDiploma: (diplomaId: number) => Promise<void>;
  searchDiplomas: (params: DiplomaSearchParams) => Promise<DiplomaRecord[]>;
  increaseLookup: (decisionId: number) => Promise<void>;
}

const defaultState: DiplomaState = {
  books: [],
  decisions: [],
  fieldConfigs: [],
  diplomas: [],
  counters: {
    book: 1,
    decision: 1,
    field: 1,
    diploma: 1,
  },
};

const DiplomaContext = createContext<DiplomaContextValue | null>(null);

export const DiplomaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DiplomaState>(defaultState);
  const [loading, setLoading] = useState(false);

  const refreshState = async () => {
    setLoading(true);
    try {
      const data = await diplomaApi.fetchState();
      setState(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshState();
  }, []);

  const runAndSync = async (callback: () => Promise<DiplomaState>) => {
    setLoading(true);
    try {
      const nextState = await callback();
      setState(nextState);
    } finally {
      setLoading(false);
    }
  };

  const booksById = useMemo(
    () => Object.fromEntries(state.books.map((book) => [book.id, book])),
    [state.books],
  );

  const decisionsById = useMemo(
    () => Object.fromEntries(state.decisions.map((decision) => [decision.id, decision])),
    [state.decisions],
  );

  const value: DiplomaContextValue = {
    state,
    loading,
    booksById,
    decisionsById,
    refreshState,
    createBook: async (year) => runAndSync(() => diplomaApi.createBook(year)),
    saveDecision: async (payload, editingId) =>
      runAndSync(() => diplomaApi.upsertDecision(payload, editingId)),
    removeDecision: async (decisionId) => runAndSync(() => diplomaApi.deleteDecision(decisionId)),
    saveField: async (payload, editingId) => runAndSync(() => diplomaApi.upsertField(payload, editingId)),
    removeField: async (fieldId) => runAndSync(() => diplomaApi.deleteField(fieldId)),
    saveDiploma: async (payload, editingId) => runAndSync(() => diplomaApi.upsertDiploma(payload, editingId)),
    removeDiploma: async (diplomaId) => runAndSync(() => diplomaApi.deleteDiploma(diplomaId)),
    searchDiplomas: async (params) => diplomaApi.searchDiplomas(params),
    increaseLookup: async (decisionId) => runAndSync(() => diplomaApi.increaseDecisionLookup(decisionId)),
  };

  return <DiplomaContext.Provider value={value}>{children}</DiplomaContext.Provider>;
};

export const useDiplomaContext = () => {
  const context = useContext(DiplomaContext);
  if (!context) {
    throw new Error('useDiplomaContext must be used inside DiplomaProvider');
  }
  return context;
};
