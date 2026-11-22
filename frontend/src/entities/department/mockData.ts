import type { DepartmentBudget } from './types';

export const mockBudgets: DepartmentBudget[] = [
  { department: 'Бюджет на путешествие', allocated: 100000, spent: 0, remaining: 100000 },
  { department: 'Оборудование', allocated: 90000, spent: 72000, remaining: 18000 },
  { department: 'Билеты', allocated: 200000, spent: 50000, remaining: 150000 }
];