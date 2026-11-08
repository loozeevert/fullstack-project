import React, { useState } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  InputNumber, 
  message, 
  Row, 
  Col, 
  Alert 
} from 'antd';
import { UploadOutlined, ScanOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export const ExpenseReportPage: React.FC = () => {
  const [form] = Form.useForm();
  const [scanning, setScanning] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  const handleOcrSimulation = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setOcrSuccess(true);
      form.setFieldsValue({
        amount: 2450.00,
        date: dayjs('2026-11-02'),
        category: 'FOOD',
        description: 'Обед в командировке (ООО Ресторан-Сервис, ИНН 7701234567)'
      });
      message.success('Данные успешно извлечены из фото чека!');
    }, 1200);
  };

  const onFinish = () => {
    message.success('Позиция расхода добавлена в авансовый отчет');
  };

  return (
    <div>
      <h2>Авансовый отчет: Внесение расходов</h2>
      <p style={{ color: '#666' }}>
        Загрузите фотографию фискального чека. Система автоматически распознает сумму, дату и категорию.
      </p>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={10}>
          <Card 
          title="Фотография чека" 
          bordered={false} 
          style={{ background: '#0f172a', border: '1TPx solid #1e293b' }}
          >
            <Upload.Dragger 
            beforeUpload={() => false} 
            maxCount={1} 
            listType="picture"
            style={{ background: '#0b192c', borderColor: '#334155' }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: 36, color: '#38bdf8' }} />
              </p>
              <p className="ant-upload-text" style={{ color: '#f1f5f9' }}>Нажмите или перетащите фото чека сюда</p>
              <p className="ant-upload-hint" style={{ color: '#94a3b8' }}>Поддерживаются форматы JPG, PNG, PDF</p>
            </Upload.Dragger>

            <Button 
              type="primary" 
              icon={<ScanOutlined />} 
              onClick={handleOcrSimulation} 
              loading={scanning}
              style={{ marginTop: 16, width: '100%' }}
            >
              Распознать чек (OCR)
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={14}>
          <Card title="Параметры расхода (валидация)" bordered={false}>
            {ocrSuccess && (
              <Alert
                message="Данные распознаны автоматически"
                description="Проверьте правильность извлеченной суммы и даты перед подтверждением."
                type="info"
                showIcon
                icon={<CheckCircleOutlined />}
                style={{ marginBottom: 16 }}
              />
            )}

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="amount" label="Сумма расхода (руб.)" rules={[{ required: true, message: 'Введите сумму' }]}>
                <InputNumber style={{ width: '100%' }} precision={2} />
              </Form.Item>

              <Form.Item name="date" label="Дата чека" rules={[{ required: true, message: 'Выберите дату' }]}>
                <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
              </Form.Item>

              <Form.Item name="category" label="Категория" rules={[{ required: true, message: 'Выберите категорию' }]}>
                <Select>
                  <Select.Option value="FOOD">Питание и суточные</Select.Option>
                  <Select.Option value="HOTEL">Проживание / Гостиница</Select.Option>
                  <Select.Option value="TRANSPORT">Билеты / Транспорт</Select.Option>
                  <Select.Option value="OTHER">Прочие представительские</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="description" label="Назначение платежа / Комментарий">
                <Input.TextArea rows={3} />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Сохранить в отчет
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};