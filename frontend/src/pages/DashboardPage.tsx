import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress } from 'antd';
import { CheckOutlined, ClockCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { mockTrips, mockBudgets } from '../mock/mockData';

export const DashboardPage: React.FC = () => {
  const columns = [
    { title: 'Код', dataIndex: 'id', key: 'id' },
    { title: 'Цель / Направление', dataIndex: 'title', key: 'title' },
    { title: 'Сотрудник', dataIndex: 'employeeName', key: 'employeeName' },
    { 
      title: 'Аванс', 
      dataIndex: 'advanceAmount', 
      key: 'advanceAmount', 
      render: (val: number) => `${val.toLocaleString()} ₽` 
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'APPROVED' ? 'green' : status === 'PENDING' ? 'gold' : 'blue';
        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  return (
    <div>
      <h2>Сводка по путешествиям и бюджету</h2>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Активные заявки" value={1} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Утвержденные авансы" value={124000} suffix="₽" prefix={<WalletOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Закрытые отчеты (за месяц)" value={67} prefix={<CheckOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Последние поездки">
            <Table dataSource={mockTrips} columns={columns} rowKey="id" pagination={false} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Использование бюджетов">
            {mockBudgets.map(b => {
              const percent = Math.round((b.spent / b.allocated) * 100);
              return (
                <div key={b.department} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>{b.department}</span>
                    <span>{b.spent.toLocaleString()} / {b.allocated.toLocaleString()} ₽</span>
                  </div>
                  <Progress percent={percent} status={percent > 90 ? 'exception' : 'active'} />
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>
    </div>
  );
};