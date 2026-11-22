import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  SendOutlined, 
  FileTextOutlined, 
  AccountBookOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Дашборд' },
    { key: '/trips', icon: <SendOutlined />, label: 'Заявки на поездки' },
    { key: '/reports/new', icon: <FileTextOutlined />, label: 'Авансовый отчет и чеки' },
    { key: '/approvals', icon: <AccountBookOutlined />, label: 'Контроль бюджетов' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
          TravelBroke
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', fontSize: 18, fontWeight: 500 }}>
          Портал командировок и расходов
        </Header>
        <Content style={{ margin: '24px 16px 0', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};