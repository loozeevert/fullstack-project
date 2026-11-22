import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Spin,
  Alert,
  Empty,
  Segmented,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ExpenseCategory, ExpenseReceipt } from '../entities/expense/types';
import { AddExpenseForm } from '../features/add-expense/AddExpenseForm';

type ReportViewState = 'normal' | 'loading' | 'empty' | 'error';

const categoryLabelMap: Record<ExpenseCategory, string> = {
  FOOD: 'Питание и суточные',
  HOTEL: 'Проживание / Гостиница',
  TRANSPORT: 'Билеты / Транспорт',
  OTHER: 'Прочие представительские',
};

const initialExpenses: ExpenseReceipt[] = [
  {
    id: 'EXP-101',
    tripId: 'SZN-1',
    extractedAmount: 6800,
    extractedDate: '2025-10-12',
    category: 'HOTEL',
    description: 'Гостиница в Анкаре (2 ночи)',
    isConfirmed: true,
  },
];

export const ExpenseReportPage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseReceipt[]>([]);
  const [viewState, setViewState] = useState<ReportViewState>('loading');

  const loadReport = (targetState: ReportViewState = 'normal') => {
    setViewState('loading');
    setTimeout(() => {
      if (targetState === 'error') {
        setViewState('error');
        return;
      }
      if (targetState === 'empty') {
        setExpenses([]);
        setViewState('empty');
        return;
      }
      setExpenses(initialExpenses);
      setViewState('normal');
    }, 350);
  };

  useEffect(() => {
    loadReport('normal');
  }, []);

  const handleAddExpense = (expense: ExpenseReceipt) => {
    setExpenses((prev) => [expense, ...prev]);
    if (viewState === 'empty') {
      setViewState('normal');
    }
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (next.length === 0) {
        setViewState('empty');
      }
      return next;
    });
  };

  const columns: ColumnsType<ExpenseReceipt> = [
    { title: 'ID чека', dataIndex: 'id', key: 'id' },
    {
      title: 'Дата',
      dataIndex: 'extractedDate',
      key: 'extractedDate',
      render: (val?: string) => val || '—',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      render: (cat: ExpenseCategory) => <Tag color="cyan">{categoryLabelMap[cat]}</Tag>,
    },
    { title: 'Назначение / Комментарий', dataIndex: 'description', key: 'description' },
    {
      title: 'Сумма',
      dataIndex: 'extractedAmount',
      key: 'extractedAmount',
      render: (val?: number) =>
        typeof val === 'number' ? `${val.toLocaleString()} ₽` : '—',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: ExpenseReceipt) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveExpense(record.id)}
        >
          Удалить
        </Button>
      ),
    },
  ];

  const totalAmount = expenses.reduce(
    (sum, item) => sum + (item.extractedAmount ?? 0),
    0
  );

  return (
    <div style={{ animation: 'reportFadeIn 0.35s ease' }}>
      <style>{`
        @keyframes reportFadeIn {
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
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Авансовый отчет: Внесение расходов</h2>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            Загрузите фотографию фискального чека. Система автоматически распознает сумму, дату и категорию.
          </p>
        </div>

        <Space wrap>
          <Segmented<ReportViewState>
            value={viewState}
            onChange={(value) => {
              if (value === 'loading') {
                setViewState('loading');
              } else {
                loadReport(value);
              }
            }}
            options={[
              { label: 'Отчет', value: 'normal' },
              { label: 'Загрузка', value: 'loading' },
              { label: 'Пусто', value: 'empty' },
              { label: 'Ошибка', value: 'error' },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={() => loadReport('normal')}>
            Сбросить
          </Button>
        </Space>
      </div>

      <AddExpenseForm onAddExpense={handleAddExpense} />

      <Card
        title={`Позиции отчета (итого: ${totalAmount.toLocaleString()} ₽)`}
        style={{ marginTop: 24 }}
      >
        {viewState === 'loading' && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin size="large" />
            <div style={{ marginTop: 12 }}>Загрузка позиций авансового отчета...</div>
          </div>
        )}

        {viewState === 'error' && (
          <Alert
            type="error"
            showIcon
            message="Ошибка при загрузке позиций отчета"
            description="Не удалось получить список расходов. Повторите попытку."
            action={
              <Button size="small" danger onClick={() => loadReport('normal')}>
                Повторить
              </Button>
            }
          />
        )}

        {viewState === 'empty' && (
          <Empty description="В авансовом отчете пока нет добавленных чеков">
            <Button onClick={() => loadReport('normal')}>Восстановить пример</Button>
          </Empty>
        )}

        {viewState === 'normal' && (
          <Table
            dataSource={expenses}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
};