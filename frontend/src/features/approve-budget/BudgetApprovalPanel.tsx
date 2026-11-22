import React from 'react';
import { Table, Button, Space, Card, Progress, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { Trip } from '../../entities/trip/types';
import type { DepartmentBudget } from '../../entities/department/types';

interface BudgetApprovalPanelProps {
  pendingTrips: Trip[];
  budgets: DepartmentBudget[];
  onDecision: (tripId: string, action: 'approve' | 'reject') => void;
}

export const BudgetApprovalPanel: React.FC<BudgetApprovalPanelProps> = ({
  pendingTrips,
  budgets,
  onDecision,
}) => {
  const columns: ColumnsType<Trip> = [
    { title: 'Сотрудник', dataIndex: 'employeeName', key: 'employeeName' },
    { title: 'Направление', dataIndex: 'destination', key: 'destination' },
    {
      title: 'Сумма аванса',
      dataIndex: 'advanceAmount',
      key: 'advanceAmount',
      render: (value: number) => `${value.toLocaleString()} ₽`,
    },
    {
      title: 'Действие',
      key: 'action',
      render: (_: unknown, record: Trip) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            size="small"
            onClick={() => onDecision(record.id, 'approve')}
          >
            Согласовать
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            size="small"
            onClick={() => onDecision(record.id, 'reject')}
          >
            Отклонить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="Ожидают согласования руководителя">
        {pendingTrips.length === 0 ? (
          <Empty description="Заявок в статусе PENDING сейчас нет" />
        ) : (
          <Table
            dataSource={pendingTrips}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        )}
      </Card>

      <Card title="Лимиты отделов на текущий квартал" style={{ marginTop: 24 }}>
        {budgets.length === 0 ? (
          <Empty description="Данные по лимитам отделов отсутствуют" />
        ) : (
          budgets.map((budget) => {
            const percent =
              budget.allocated > 0
                ? Math.min(100, Math.round((budget.spent / budget.allocated) * 100))
                : 0;

            return (
              <div key={budget.department} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{budget.department}</strong>
                  <span>Остаток: {budget.remaining.toLocaleString()} ₽</span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    marginBottom: 4,
                  }}
                >
                  Потрачено: {budget.spent.toLocaleString()} ₽ из{' '}
                  {budget.allocated.toLocaleString()} ₽
                </div>
                <Progress
                  percent={percent}
                  status={percent > 90 ? 'exception' : 'active'}
                />
              </div>
            );
          })
        )}
      </Card>
    </>
  );
};