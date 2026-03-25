import React from 'react';
import { DiplomaProvider } from './context/DiplomaContext';
import DiplomaManagementView from './components/DiplomaManagementView';

const QuanLyVanBang: React.FC = () => (
  <DiplomaProvider>
    <DiplomaManagementView />
  </DiplomaProvider>
);

export default QuanLyVanBang;
