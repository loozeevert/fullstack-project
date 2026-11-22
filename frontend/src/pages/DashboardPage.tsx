import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Spin,
  Alert,
  Empty,
  Space,
  Button,
  Input,
  Segmented,
} from 'antd';
import {
  CheckOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { mockTrips } from '../entities/trip/mockData';
import { mockBudgets } from '../entities/department/mockData';
import type { Trip, TripStatus } from '../entities/trip/types';
import type { DepartmentBudget } from '../entities/department/types';

type ViewState = 'normal' | 'loading' | 'empty' | 'error';

const statusColorMap: Record<TripStatus, string> = {
  DRAFT: 'default',
  PENDING: 'gold',
  APPROVED: 'green',
  REJECTED: 'red',
  COMPLETED: 'blue',
};

export const DashboardPage: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [budgets, setBudgets] = useState<DepartmentBudget[]>([]);

  const loadDashboardData = (targetState: ViewState = 'normal') => {
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
    }, 500);
  };

  useEffect(() => {
    loadDashboardData('normal');
  }, []);

  const filteredTrips = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return trips;
    return trips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query) ||
        trip.employeeName.toLowerCase().includes(query) ||
        trip.id.toLowerCase().includes(query)
    );
  }, [trips, searchQuery]);

  const activeRequestsCount = useMemo(
    () => trips.filter((t) => t.status === 'PENDING' || t.status === 'DRAFT').length,
    [trips]
  );

  const totalAdvancesAmount = useMemo(
    () => trips.reduce((acc, t) => acc + t.advanceAmount, 0),
    [trips]
  );

  const completedTripsCount = useMemo(
    () => trips.filter((t) => t.status === 'COMPLETED').length,
    [trips]
  );

  const columns = [
    { title: 'Код', dataIndex: 'id', key: 'id' },
    { title: 'Цель / Направление', dataIndex: 'title', key: 'title' },
    { title: 'Сотрудник', dataIndex: 'employeeName', key: 'employeeName' },
    {
      title: 'Аванс',
      dataIndex: 'advanceAmount',
      key: 'advanceAmount',
      render: (val: number) => `${val.toLocaleString()} ₽`,
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
    <div style={{ animation: 'dashboardFadeIn 0.35s ease' }}>
      <style>{`
        @keyframes dashboardFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <h2 style={{ margin: 0 }}>Сводка по путешествиям и бюджету</h2>
        </Col>
        <Col>
          <Space wrap>
            <Segmented<ViewState>
              value={viewState}
              onChange={(value) => {
                if (value === 'loading') {
                  setViewState('loading');
                } else {
                  loadDashboardData(value);
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
              onClick={() => loadDashboardData('normal')}
            >
              Обновить
            </Button>
          </Space>
        </Col>
      </Row>

      {viewState === 'loading' && (
        <Card style={{ marginTop: 16, textAlign: 'center', padding: 32 }}>
          <Spin size="large" />
          <div style={{ marginTop: 12 }}>Загрузка показателей и поездок...</div>
        </Card>
      )}

      {viewState === 'error' && (
        <Alert
          style={{ marginTop: 16 }}
          type="error"
          showIcon
          message="Не удалось загрузить данные дашборда"
          description="Проверьте подключение или повторите попытку загрузки демонстрационных данных."
          action={
            <Button size="small" danger onClick={() => loadDashboardData('normal')}>
              Повторить
            </Button>
          }
        />
      )}

      {viewState === 'empty' && (
        <Card style={{ marginTop: 16 }}>
          <Empty
            description="Нет данных по поездкам и бюджетам для отображения"
          >
            <Button type="primary" onClick={() => loadDashboardData('normal')}>
              Загрузить демо-данные
            </Button>
          </Empty>
        </Card>
      )}

      {viewState === 'normal' && (
        <>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Активные заявки"
                  value={activeRequestsCount}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Сумма авансов"
                  value={totalAdvancesAmount}
                  suffix="₽"
                  prefix={<WalletOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Завершенные поездки"
                  value={completedTripsCount}
                  prefix={<CheckOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={16}>
              <Card
                title="Последние поездки"
                extra={
                  <Input
                    allowClear
                    placeholder="Поиск по коду, цели, городу..."
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: 240 }}
                  />
                }
              >
                {filteredTrips.length === 0 ? (
                  <Empty description="Поездки по текущему запросу не найдены" />
                ) : (
                  <Table
                    dataSource={filteredTrips}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Использование бюджетов">
                {budgets.map((b) => {
                  const percent =
                    b.allocated > 0 ? Math.round((b.spent / b.allocated) * 100) : 0;
                  return (
                    <div key={b.department} style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 4,
                        }}
                      >
                        <span>{b.department}</span>
                        <span>
                          {b.spent.toLocaleString()} / {b.allocated.toLocaleString()} ₽
                        </span>
                      </div>
                      <Progress
                        percent={percent}
                        status={percent > 90 ? 'exception' : 'active'}
                      />
                    </div>
                  );
                })}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};