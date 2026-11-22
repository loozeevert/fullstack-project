import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  Spin,
  Alert,
  Empty,
  Card,
  Segmented,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { mockTrips } from '../entities/trip/mockData';
import type { Trip, TripStatus } from '../entities/trip/types';
import { CreateTripModal } from '../features/create-trip/CreateTripModal';

type TripsViewState = 'normal' | 'loading' | 'empty' | 'error';

const statusColorMap: Record<TripStatus, string> = {
  DRAFT: 'default',
  PENDING: 'gold',
  APPROVED: 'green',
  REJECTED: 'red',
  COMPLETED: 'blue',
};

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [viewState, setViewState] = useState<TripsViewState>('loading');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadTrips = (targetState: TripsViewState = 'normal') => {
    setViewState('loading');
    setTimeout(() => {
      if (targetState === 'error') {
        setViewState('error');
        return;
      }
      if (targetState === 'empty') {
        setTrips([]);
        setViewState('empty');
        return;
      }
      setTrips(mockTrips);
      setViewState('normal');
    }, 400);
  };

  useEffect(() => {
    loadTrips('normal');
  }, []);

  const handleCreateTrip = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
    if (viewState === 'empty') {
      setViewState('normal');
    }
    setIsModalOpen(false);
    message.success(`Заявка ${newTrip.id} на командировку добавлена!`);
  };

  const columns: ColumnsType<Trip> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Город назначения', dataIndex: 'destination', key: 'destination' },
    { title: 'Цель командировки', dataIndex: 'title', key: 'title' },
    {
      title: 'Даты',
      key: 'dates',
      render: (_: unknown, record: Trip) => `${record.startDate} — ${record.endDate}`,
    },
    {
      title: 'Запрошенный аванс',
      dataIndex: 'advanceAmount',
      key: 'advanceAmount',
      render: (value: number) => `${value.toLocaleString()} ₽`,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: TripStatus) => (
        <Tag color={statusColorMap[status] ?? 'blue'}>{status}</Tag>
      ),
    },
  ];

  return (
    <div style={{ animation: 'tripsFadeIn 0.35s ease' }}>
      <style>{`
        @keyframes tripsFadeIn {
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
        <h2 style={{ margin: 0 }}>Реестр командировок</h2>
        <Space wrap>
          <Segmented<TripsViewState>
            value={viewState}
            onChange={(value) => {
              if (value === 'loading') {
                setViewState('loading');
              } else {
                loadTrips(value);
              }
            }}
            options={[
              { label: 'Список', value: 'normal' },
              { label: 'Загрузка', value: 'loading' },
              { label: 'Пусто', value: 'empty' },
              { label: 'Ошибка', value: 'error' },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={() => loadTrips('normal')}>
            Обновить
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Оформить заявку
          </Button>
        </Space>
      </div>

      {viewState === 'loading' && (
        <Card style={{ textAlign: 'center', padding: 32 }}>
          <Spin size="large" />
          <div style={{ marginTop: 12 }}>Загрузка реестра командировок...</div>
        </Card>
      )}

      {viewState === 'error' && (
        <Alert
          type="error"
          showIcon
          message="Ошибка при загрузке реестра командировок"
          description="Не удалось получить список заявок. Попробуйте обновить данные."
          action={
            <Button size="small" danger onClick={() => loadTrips('normal')}>
              Повторить
            </Button>
          }
        />
      )}

      {viewState === 'empty' && (
        <Card>
          <Empty description="Список командировок пока пуст">
            <Space>
              <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Оформить первую заявку
              </Button>
              <Button onClick={() => loadTrips('normal')}>Загрузить демо-данные</Button>
            </Space>
          </Empty>
        </Card>
      )}

      {viewState === 'normal' && (
        <Table dataSource={trips} columns={columns} rowKey="id" />
      )}

      <CreateTripModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onCreate={handleCreateTrip}
      />
    </div>
  );
};