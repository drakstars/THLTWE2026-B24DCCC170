import React from 'react';
import { Alert, Button, Space, Spin } from 'antd';

interface AsyncStateProps {
  loading: boolean;
  error?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

const AsyncState: React.FC<AsyncStateProps> = ({ loading, error, onRetry, children }) => {
  if (loading) {
    return (
      <Space align="center" style={{ width: '100%', justifyContent: 'center', padding: 40 }}>
        <Spin size="large" />
      </Space>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Lỗi kết nối"
        description={
          <Space direction="vertical">
            <span>{error}</span>
            {onRetry && <Button onClick={onRetry}>Thử lại</Button>}
          </Space>
        }
      />
    );
  }

  return <>{children}</>;
};

export default AsyncState;
