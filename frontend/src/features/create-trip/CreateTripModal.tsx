import React from 'react';
import { Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import type { Dayjs } from 'dayjs';
import type { Trip } from '../../entities/trip/types';

export interface CreateTripFormValues {
  destination: string;
  title: string;
  dates: [Dayjs, Dayjs];
  advanceAmount: number;
  employeeName?: string;
}

interface CreateTripModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (newTrip: Trip) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  open,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm<CreateTripFormValues>();

  const handleFinish = (values: CreateTripFormValues) => {
    const [start, end] = values.dates;
    const generatedId = `SZN-${Math.floor(100 + Math.random() * 900)}`;

    const newTrip: Trip = {
      id: generatedId,
      title: values.title.trim(),
      destination: values.destination.trim(),
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
      advanceAmount: values.advanceAmount,
      status: 'PENDING',
      employeeName: values.employeeName?.trim() || 'Елисей Т. Б.',
    };

    onCreate(newTrip);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Новая заявка на командировку"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Отправить на согласование"
      cancelText="Отмена"
      destroyOnClose
    >
      <Form<CreateTripFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ advanceAmount: 10000 }}
      >
        <Form.Item
          name="destination"
          label="Город / Локация"
          rules={[
            { required: true, message: 'Укажите город' },
            { min: 2, message: 'Название города должно быть не короче 2 символов' },
          ]}
        >
          <Input placeholder="Например, Екатеринбург" />
        </Form.Item>

        <Form.Item
          name="title"
          label="Цель поездки"
          rules={[
            { required: true, message: 'Укажите цель поездки' },
            { min: 3, message: 'Опишите цель поездки подробнее' },
          ]}
        >
          <Input placeholder="Монтаж оборудования" />
        </Form.Item>

        <Form.Item
          name="dates"
          label="Период командировки"
          rules={[{ required: true, message: 'Выберите даты начала и окончания' }]}
        >
          <DatePicker.RangePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
        </Form.Item>

        <Form.Item
          name="advanceAmount"
          label="Сумма аванса (руб.)"
          rules={[
            { required: true, message: 'Укажите сумму аванса' },
            {
              type: 'number',
              min: 1,
              message: 'Сумма аванса должна быть больше 0 ₽',
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0} step={1000} />
        </Form.Item>

        <Form.Item name="employeeName" label="Сотрудник">
          <Input placeholder="Елисей Т. Б." />
        </Form.Item>
      </Form>
    </Modal>
  );
};