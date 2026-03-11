import React, { useState } from 'react';
import { Card, Button, Space, List, Row, Col, Badge, Statistic, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { ScissorOutlined, CloseCircleOutlined, FileOutlined, RedoOutlined } from '@ant-design/icons';

type Choice = 'scissors' | 'rock' | 'paper';
type Result = 'win' | 'lose' | 'draw';

interface GameHistory {
  id: number;
  playerChoice: Choice;
  computerChoice: Choice;
  result: Result;
  timestamp: string;
}

const choices = [
  { value: 'scissors' as Choice, label: 'Kéo', icon: <ScissorOutlined />, emoji: '✌️' },
  { value: 'rock' as Choice, label: 'Búa', icon: <CloseCircleOutlined />, emoji: '✊' },
  { value: 'paper' as Choice, label: 'Bao', icon: <FileOutlined />, emoji: '✋' },
];

const OanTuTi: React.FC = () => {
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
  const [lastResult, setLastResult] = useState<GameHistory | null>(null);

  const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'draw';
    if ((player === 'scissors' && computer === 'paper') ||
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock')) return 'win';
    return 'lose';
  };

  const handlePlay = (playerChoice: Choice) => {
    const computerChoice = choices[Math.floor(Math.random() * 3)].value;
    const result = determineWinner(playerChoice, computerChoice);
    
    const gameRecord: GameHistory = {
      id: Date.now(),
      playerChoice,
      computerChoice,
      result,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
    };

    setHistory([gameRecord, ...history]);
    setLastResult(gameRecord);
    setStats({
      wins: stats.wins + (result === 'win' ? 1 : 0),
      losses: stats.losses + (result === 'lose' ? 1 : 0),
      draws: stats.draws + (result === 'draw' ? 1 : 0),
    });
  };

  const getEmoji = (choice: Choice) => choices.find(c => c.value === choice)?.emoji || '';
  const getLabel = (choice: Choice) => choices.find(c => c.value === choice)?.label || '';
  const getResultText = (r: Result) => ({ win: '🎉 Bạn thắng!', lose: '😢 Bạn thua!', draw: '🤝 Hòa!' }[r]);
  const getResultColor = (r: Result) => ({ win: 'success', lose: 'error', draw: 'warning' }[r]);

  return (
    <PageContainer title="Trò Chơi Oẳn Tù Tì">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Chọn lựa chọn của bạn">
            <Row gutter={[16, 16]} justify="center">
              {choices.map((choice) => (
                <Col key={choice.value} xs={8}>
                  <Button type="primary" size="large" block onClick={() => handlePlay(choice.value)}
                    style={{ height: '100px', fontSize: '16px' }}>
                    <Space direction="vertical">
                      <span style={{ fontSize: '32px' }}>{choice.emoji}</span>
                      <span>{choice.label}</span>
                    </Space>
                  </Button>
                </Col>
              ))}
            </Row>

            {lastResult && (
              <Card type="inner" title="Kết quả" style={{ marginTop: 16, textAlign: 'center' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Row gutter={16} justify="center" align="middle">
                    <Col>
                      <Space direction="vertical" align="center">
                        <div style={{ fontSize: '48px' }}>{getEmoji(lastResult.playerChoice)}</div>
                        <span>Bạn: {getLabel(lastResult.playerChoice)}</span>
                      </Space>
                    </Col>
                    <Col><span style={{ fontSize: '24px' }}>VS</span></Col>
                    <Col>
                      <Space direction="vertical" align="center">
                        <div style={{ fontSize: '48px' }}>{getEmoji(lastResult.computerChoice)}</div>
                        <span>Máy: {getLabel(lastResult.computerChoice)}</span>
                      </Space>
                    </Col>
                  </Row>
                  <Tag color={getResultColor(lastResult.result)} style={{ fontSize: '18px', padding: '8px 16px' }}>
                    {getResultText(lastResult.result)}
                  </Tag>
                </Space>
              </Card>
            )}
          </Card>

          <Card title="Thống kê" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={8}><Statistic title="Thắng" value={stats.wins} valueStyle={{ color: '#3f8600' }} /></Col>
              <Col span={8}><Statistic title="Thua" value={stats.losses} valueStyle={{ color: '#cf1322' }} /></Col>
              <Col span={8}><Statistic title="Hòa" value={stats.draws} valueStyle={{ color: '#faad14' }} /></Col>
            </Row>
            <Button icon={<RedoOutlined />} onClick={() => { setHistory([]); setStats({ wins: 0, losses: 0, draws: 0 }); setLastResult(null); }}
              style={{ marginTop: 16 }} block>Chơi lại từ đầu</Button>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Lịch sử đấu" extra={<Badge count={history.length} />}>
            <List
              dataSource={history}
              locale={{ emptyText: 'Chưa có lịch sử' }}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Space><span style={{ fontSize: '24px' }}>{getEmoji(item.playerChoice)}</span> VS 
                      <span style={{ fontSize: '24px' }}>{getEmoji(item.computerChoice)}</span></Space>}
                    title={<Space><span>Ván {history.length - index}:</span>
                      <Tag color={getResultColor(item.result)}>
                        {item.result === 'win' ? 'Thắng' : item.result === 'lose' ? 'Thua' : 'Hòa'}
                      </Tag></Space>}
                    description={`${getLabel(item.playerChoice)} vs ${getLabel(item.computerChoice)} - ${item.timestamp}`}
                  />
                </List.Item>
              )}
              style={{ maxHeight: '600px', overflow: 'auto' }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default OanTuTi;
