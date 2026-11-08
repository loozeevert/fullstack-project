import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AppLayout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TripsPage } from './pages/TripsPage';
import { ExpenseReportPage } from './pages/ExpenseReportPage';
import { BudgetApprovalPage } from './pages/BudgetApprovalPage';

export const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgLayout: '#020c1c',     // Общий фон приложения (твой цвет)
          colorBgContainer: '#0b192c',  // Фон карточек, таблиц и модалок
          colorTextBase: '#f1f5f9',     // Цвет текста (светлый для читаемости)
          colorPrimary: '#38bdf8',      // Акцентный цвет (красивый синий для кнопок)
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="reports/new" element={<ExpenseReportPage />} />
            <Route path="approvals" element={<BudgetApprovalPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;