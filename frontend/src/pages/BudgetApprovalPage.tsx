import React from 'react';
import { Table, Button, Space, Card, Row, Col, Progress, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { mockBudgets, mockTrips } from '../mock/mockData';

export const BudgetApprovalPage: React.FC = () => {
  const pendingTrips = mockTrips.filter(t => t.status === 'PENDING');

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    message.info(`Заявка ${id} ${action === 'approve' ? 'согласована' : 'отклонена'}`);
  };

  const columns = [
    { title: 'Сотрудник', dataIndex: 'employeeName', key: 'employeeName' },
    { title: 'Направление', dataIndex: 'destination', key: 'destination' },
    { 
      title: 'Сумма аванса', 
      dataIndex: 'advanceAmount', 
      key: 'advanceAmount', 
      render: (v: number) => `${v.toLocaleString()} ₽` 
    },
    {
      title: 'Действие',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            icon={<CheckOutlined />} 
            size="small" 
            onClick={() => handleAction(record.id, 'approve')}
          >
            Согласовать
          </Button>
          <Button 
            danger 
            icon={<CloseOutlined />} 
            size="small" 
            onClick={() => handleAction(record.id, 'reject')}
          >
            Отклонить
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2>Контроль бюджетов и согласование заявок</h2>

      <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
        <Col xs={24} md={14}>
          <Card title="Ожидают согласования руководителя">
            <Table dataSource={pendingTrips} columns={columns} rowKey="id" pagination={false} />
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card title="Лимиты отделов на текущий квартал">
            {mockBudgets.map(b => (
              <div key={b.department} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{b.department}</strong>
                  <span>Остаток: {b.remaining.toLocaleString()} ₽</span>
                </div>
                <Progress percent={Math.round((b.spent / b.allocated) * 100)} />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};