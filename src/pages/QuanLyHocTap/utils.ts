import moment from 'moment';

export const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];

export const DEFAULT_SUBJECTS = [
  { id: '1', name: 'Toán', color: '#1890ff' },
  { id: '2', name: 'Văn', color: '#52c41a' },
  { id: '3', name: 'Anh', color: '#faad14' },
  { id: '4', name: 'Khoa học', color: '#f5222d' },
  { id: '5', name: 'Công nghệ', color: '#722ed1' },
];

export const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

export const saveToStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getCurrentMonth = () => moment().format('YYYY-MM');
