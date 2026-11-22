export type ExpenseCategory = 'HOTEL' | 'TRANSPORT' | 'FOOD' | 'OTHER';

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