import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, Alert, Space, Typography, Progress, Tag, Statistic, Row, Col, Badge } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { SmileOutlined, FrownOutlined, TrophyOutlined, RedoOutlined, ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './style.less';

const { Title, Text, Paragraph } = Typography;

const TroChoiDoanSo: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const maxAttempts = 10;
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'info' | 'warning' | 'error'>('info');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => startNewGame(), []);

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess(null);
    setAttempts(0);
    setMessage('Hãy bắt đầu đoán một số từ 1 đến 100!');
    setMessageType('info');
    setGameOver(false);
    setGameWon(false);
    setHistory([]);
  };

  const handleGuess = () => {
    if (!guess || guess < 1 || guess > 100) {
      setMessage('Vui lòng nhập một số từ 1 đến 100!');
      setMessageType('warning');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setHistory([...history, guess]);

    if (guess === targetNumber) {
      setMessage(`🎉 Chúc mừng! Bạn đã đoán đúng số ${targetNumber} sau ${newAttempts} lần đoán!`);
      setMessageType('success');
      setGameOver(true);
      setGameWon(true);
    } else if (newAttempts >= maxAttempts) {
      setMessage(`😢 Bạn đã hết lượt! Số đúng là ${targetNumber}.`);
      setMessageType('error');
      setGameOver(true);
    } else {
      const isTooLow = guess < targetNumber;
      setMessage(`${isTooLow ? '🔼' : '🔽'} Bạn đoán quá ${isTooLow ? 'thấp' : 'cao'}! Còn ${maxAttempts - newAttempts} lượt.`);
      setMessageType('warning');
    }
    setGuess(null);
  };

  const getProgressColor = () => {
    const remaining = maxAttempts - attempts;
    return remaining <= 2 ? '#ff4d4f' : remaining <= 5 ? '#faad14' : '#52c41a';
  };

  const renderIcon = () => gameWon ? <TrophyOutlined style={{ color: '#52c41a' }} /> : 
                                    gameOver ? <FrownOutlined style={{ color: '#ff4d4f' }} /> :
                                    <SmileOutlined style={{ color: '#1890ff' }} />;

  return (
    <PageContainer title="Trò Chơi Đoán Số" subTitle="Đoán số từ 1 đến 100">
      <Card className="game-container">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card type="inner" className="game-header">
            <Title level={2}>{renderIcon()} Trò Chơi Đoán Số</Title>
            <Paragraph type="secondary">
              Hệ thống đã tạo một số ngẫu nhiên từ 1 đến 100. Bạn có {maxAttempts} lượt để đoán.
            </Paragraph>
          </Card>

          <Row gutter={16}>
            {[
              { title: 'Lượt đã dùng', value: attempts, suffix: `/ ${maxAttempts}` },
              { title: 'Lượt còn lại', value: maxAttempts - attempts, color: getProgressColor() },
              { title: 'Tiến độ', value: (attempts / maxAttempts) * 100, suffix: '%', precision: 0, color: getProgressColor() }
            ].map((stat, idx) => (
              <Col span={8} key={idx}>
                <Card>
                  <Statistic {...stat} valueStyle={{ color: stat.color }} />
                </Card>
              </Col>
            ))}
          </Row>

          <Progress 
            percent={(attempts / maxAttempts) * 100} 
            strokeColor={getProgressColor()}
            status={gameOver ? (gameWon ? 'success' : 'exception') : 'active'}
          />

          {message && <Alert message={message} type={messageType} showIcon />}

          {!gameOver && (
            <Card className="input-section">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Text strong>Nhập dự đoán của bạn:</Text>
                <Space size="large">
                  <InputNumber
                    min={1}
                    max={100}
                    value={guess}
                    onChange={setGuess}
                    onPressEnter={handleGuess}
                    placeholder="Nhập số từ 1-100"
                    size="large"
                    style={{ width: 200 }}
                    autoFocus
                  />
                  <Button type="primary" size="large" onClick={handleGuess} disabled={!guess} icon={<CheckCircleOutlined />}>
                    Đoán
                  </Button>
                </Space>
              </Space>
            </Card>
          )}

          {history.length > 0 && (
            <Card title={`Lịch sử đoán (${history.length} lần)`}>
              <Space wrap size="middle">
                {history.map((num, idx) => {
                  const isCorrect = num === targetNumber;
                  const isTooLow = num < targetNumber;
                  return (
                    <Badge key={idx} count={idx + 1}>
                      <Tag 
                        color={isCorrect ? 'success' : isTooLow ? 'warning' : 'error'} 
                        icon={isCorrect ? <CheckCircleOutlined /> : isTooLow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        style={{ fontSize: 16, padding: '8px 16px', fontWeight: 'bold' }}
                      >
                        {num}
                      </Tag>
                    </Badge>
                  );
                })}
              </Space>
            </Card>
          )}

          {gameOver && (
            <Card className={`result-card ${gameWon ? 'win' : 'lose'}`}>
              <Space direction="vertical" size="middle">
                <Text strong style={{ fontSize: 16 }}>
                  {gameWon ? '🎉 Xin chúc mừng!' : '😢 Chúc bạn may mắn lần sau!'}
                </Text>
                <Button type="primary" size="large" icon={<RedoOutlined />} onClick={startNewGame}>
                  Chơi lại
                </Button>
              </Space>
            </Card>
          )}
        </Space>
      </Card>
    </PageContainer>
  );
};

export default TroChoiDoanSo;
