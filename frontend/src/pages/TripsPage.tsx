import React, { useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, DatePicker, InputNumber, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { mockTrips } from '../mock/mockData';

export const TripsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Город назначения', dataIndex: 'destination', key: 'destination' },
    { title: 'Цель командировки', dataIndex: 'title', key: 'title' },
    { title: 'Даты', key: 'dates', render: (_: any, r: any) => `${r.startDate} — ${r.endDate}` },
    { 
      title: 'Запрошенный аванс', 
      dataIndex: 'advanceAmount', 
      key: 'advanceAmount', 
      render: (v: number) => `${v.toLocaleString()} ₽` 
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

  const handleCreate = () => {
    message.success('Заявка на командировку успешно создана!');
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Реестр командировок</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Оформить заявку
        </Button>
      </div>

      <Table dataSource={mockTrips} columns={columns} rowKey="id" />

      <Modal
        title="Новая заявка на командировку"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Отправить на согласование"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="destination" label="Город / Локация" rules={[{ required: true, message: 'Укажите город' }]}>
            <Input placeholder="Например, Екатеринбург" />
          </Form.Item>
          <Form.Item name="title" label="Цель поездки" rules={[{ required: true, message: 'Укажите цель поездки' }]}>
            <Input placeholder="Монтаж оборудования" />
          </Form.Item>
          <Form.Item name="dates" label="Период командировки" rules={[{ required: true, message: 'Выберите даты' }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="advanceAmount" label="Сумма аванса (руб.)" rules={[{ required: true, message: 'Укажите сумму' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};