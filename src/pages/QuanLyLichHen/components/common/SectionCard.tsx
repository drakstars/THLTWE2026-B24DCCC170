import React from 'react';
import { Card } from 'antd';

interface SectionCardProps {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, extra, children }) => {
  return (
    <Card title={title} extra={extra} bordered>
      {children}
    </Card>
  );
};

export default SectionCard;
