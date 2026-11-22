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
  Alert,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import {
  UploadOutlined,
  ScanOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import type { ExpenseCategory, ExpenseReceipt } from '../../entities/expense/types';

export interface ExpenseFormValues {
  amount: number;
  date: Dayjs;
  category: ExpenseCategory;
  description?: string;
}

interface AddExpenseFormProps {
  tripId?: string;
  onAddExpense: (expense: ExpenseReceipt) => void;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  tripId = 'SZN-1',
  onAddExpense,
}) => {
  const [form] = Form.useForm<ExpenseFormValues>();
  const [scanning, setScanning] = useState<boolean>(false);
  const [ocrSuccess, setOcrSuccess] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleOcrSimulation = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setOcrSuccess(true);
      form.setFieldsValue({
        amount: 2450.0,
        date: dayjs('2026-11-02'),
        category: 'FOOD',
        description: 'Обед в командировке (ООО Ресторан-Сервис, ИНН 7701234567)',
      });
      message.success('Данные успешно извлечены из фото чека!');
    }, 1200);
  };

  const handleFinish = (values: ExpenseFormValues) => {
    const uploadedFile = fileList[0];
    const previewUrl =
      uploadedFile?.url ||
      (uploadedFile?.originFileObj
        ? URL.createObjectURL(uploadedFile.originFileObj)
        : undefined);

    const newExpense: ExpenseReceipt = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      tripId,
      imageUrl: previewUrl,
      extractedAmount: values.amount,
      extractedDate: values.date.format('YYYY-MM-DD'),
      category: values.category,
      description: values.description?.trim() || 'Расход по командировке',
      isConfirmed: true,
    };

    onAddExpense(newExpense);
    form.resetFields();
    setOcrSuccess(false);
    setFileList([]);
    message.success('Позиция расхода добавлена в авансовый отчет');
  };

  return (
    <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
      <Col xs={24} md={10}>
        <Card
          title="Фотография чека"
          bordered={false}
          style={{ background: '#0f172a', border: '1px solid #1e293b' }}
        >
          <Upload.Dragger
            beforeUpload={() => false}
            maxCount={1}
            listType="picture"
            fileList={fileList}
            onChange={({ fileList: nextList }) => setFileList(nextList)}
            style={{ background: '#0b192c', borderColor: '#334155' }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 36, color: '#38bdf8' }} />
            </p>
            <p className="ant-upload-text" style={{ color: '#f1f5f9' }}>
              Нажмите или перетащите фото чека сюда
            </p>
            <p className="ant-upload-hint" style={{ color: '#94a3b8' }}>
              Поддерживаются форматы JPG, PNG, PDF
            </p>
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

          <Form<ExpenseFormValues>
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{ category: 'FOOD' }}
          >
            <Form.Item
              name="amount"
              label="Сумма расхода (руб.)"
              rules={[
                { required: true, message: 'Введите сумму' },
                {
                  type: 'number',
                  min: 0.01,
                  message: 'Сумма должна быть больше 0 ₽',
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} precision={2} min={0} />
            </Form.Item>

            <Form.Item
              name="date"
              label="Дата чека"
              rules={[{ required: true, message: 'Выберите дату' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Категория"
              rules={[{ required: true, message: 'Выберите категорию' }]}
            >
              <Select>
                <Select.Option value="FOOD">Питание и суточные</Select.Option>
                <Select.Option value="HOTEL">Проживание / Гостиница</Select.Option>
                <Select.Option value="TRANSPORT">Билеты / Транспорт</Select.Option>
                <Select.Option value="OTHER">Прочие представительские</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Назначение платежа / Комментарий"
              rules={[
                { max: 300, message: 'Комментарий не должен превышать 300 символов' },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Сохранить в отчет
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};