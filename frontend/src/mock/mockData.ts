import type { Trip, DepartmentBudget } from '../types';

export const mockTrips: Trip[] = [
  {
    id: 'SZN-1',
    title: 'Путешествие в Турцию',
    destination: 'Анкара',
    startDate: '2025-10-11',
    endDate: '2025-11-10',
    advanceAmount: 40000,
    status: 'COMPLETED',
    employeeName: 'Елисей Т. Б.'
  },
  {
    id: 'SZN-2',
    title: 'Путешествие в Узбекистан',
    destination: 'Ташкент',
    startDate: '2025-12-27',
    endDate: '2025-12-30',
    advanceAmount: 32000,
    status: 'COMPLETED',
    employeeName: 'Елисей Т. Б.'
  },
  {
    id: 'SZN-3',
    title: 'Путешествие в Тай',
    destination: 'Бангкок',
    startDate: '2026-05-03',
    endDate: '2026-10-18',
    advanceAmount: 52000,
    status: 'COMPLETED',
    employeeName: 'Елисей Т. Б.'
  },
  {
    id: 'SZN-4',
    title: 'Путешествие в ???',
    destination: '???',
    startDate: '2026-??-??',
    endDate: '2026-??-??',
    advanceAmount: 390000,
    status: 'PENDING',
    employeeName: 'Елисей Т. Б.'
  }
];

export const mockBudgets: DepartmentBudget[] = [
  { department: 'Бюджет на путешествие', allocated: 100000, spent: 0, remaining: 100000 },
  { department: 'Оборудование', allocated: 90000, spent: 72000, remaining: 18000 },
  { department: 'Билеты', allocated: 200000, spent: 50000, remaining: 150000 }
];