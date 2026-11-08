export type TripStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
export type ExpenseCategory = 'HOTEL' | 'TRANSPORT' | 'FOOD' | 'OTHER';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  advanceAmount: number;
  status: TripStatus;
  employeeName: string;
}

export interface ExpenseReceipt {
  id: string;
  tripId: string;
  imageUrl?: string;
  extractedAmount?: number;
  extractedDate?: string;
  category: ExpenseCategory;
  description: string;
  isConfirmed: boolean;
}

export interface DepartmentBudget {
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
}