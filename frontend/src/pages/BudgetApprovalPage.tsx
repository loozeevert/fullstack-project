import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Spin,
  Alert,
  Empty,
  Space,
  Button,
  Segmented,
  message,
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { mockTrips } from '../entities/trip/mockData';
import { mockBudgets } from '../entities/department/mockData';
import type { Trip } from '../entities/trip/types';
import type { DepartmentBudget } from '../entities/department/types';
import { BudgetApprovalPanel } from '../features/approve-budget/BudgetApprovalPanel';

type ApprovalViewState = 'normal' | 'loading' | 'empty' | 'error';

export const BudgetApprovalPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [budgets, setBudgets] = useState<DepartmentBudget[]>([]);
  const [viewState, setViewState] = useState<ApprovalViewState>('loading');

  const loadApprovalData = (targetState: ApprovalViewState = 'normal') => {
    setViewState('loading');
    setTimeout(() => {
      if (targetState === 'error') {
        setViewState('error');
        return;
      }
      if (targetState === 'empty') {
        setTrips([]);
        setBudgets([]);
        setViewState('empty');
        return;
      }
      setTrips(mockTrips);
      setBudgets(mockBudgets);
      setViewState('normal');
    }, 400);
  };

  useEffect(() => {
    loadApprovalData('normal');
  }, []);

  const pendingTrips = useMemo(
    () => trips.filter((trip) => trip.status === 'PENDING'),
    [trips]
  );

  const handleDecision = (tripId: string, action: 'approve' | 'reject') => {
    const targetTrip = trips.find((t) => t.id === tripId);

    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? { ...trip, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
          : trip
      )
    );

    if (action === 'approve' && targetTrip) {
      setBudgets((prev) =>
        prev.map((budget, index) => {
          if (index !== 0) return budget;
          const nextSpent = budget.spent + targetTrip.advanceAmount;
          const nextRemaining = Math.max(0, budget.allocated - nextSpent);
          return {
            ...budget,
            spent: nextSpent,
            remaining: nextRemaining,
          };
        })
      );
    }

    message.info(
      `Заявка ${tripId} ${action === 'approve' ? 'согласована' : 'отклонена'}`
    );
  };

  return (
    <div style={{ animation: 'approvalFadeIn 0.35s ease' }}>
      <style>{`
        @keyframes approvalFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Контроль бюджетов и согласование заявок</h2>
        <Space wrap>
          <Segmented<ApprovalViewState>
            value={viewState}
            onChange={(value) => {
              if (value === 'loading') {
                setViewState('loading');
              } else {
                loadApprovalData(value);
              }
            }}
            options={[
              { label: 'Данные', value: 'normal' },
              { label: 'Загрузка', value: 'loading' },
              { label: 'Пусто', value: 'empty' },
              { label: 'Ошибка', value: 'error' },
            ]}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => loadApprovalData('normal')}
          >
            Сбросить
          </Button>
        </Space>
      </div>

      {viewState === 'loading' && (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <Spin size="large" />
          <div style={{ marginTop: 12 }}>
            Загрузка заявок на согласование и лимитов бюджетов...
          </div>
        </Card>
      )}

      {viewState === 'error' && (
        <Alert
          type="error"
          showIcon
          message="Ошибка при загрузке данных согласования"
          description="Не удалось загрузить заявки или бюджеты отделов. Повторите попытку."
          action={
            <Button
              size="small"
              danger
              onClick={() => loadApprovalData('normal')}
            >
              Повторить
            </Button>
          }
        />
      )}

      {viewState === 'empty' && (
        <Card>
          <Empty description="Нет заявок и бюджетов для отображения">
            <Button type="primary" onClick={() => loadApprovalData('normal')}>
              Загрузить демо-данные
            </Button>
          </Empty>
        </Card>
      )}

      {viewState === 'normal' && (
        <BudgetApprovalPanel
          pendingTrips={pendingTrips}
          budgets={budgets}
          onDecision={handleDecision}
        />
      )}
    </div>
  );
};