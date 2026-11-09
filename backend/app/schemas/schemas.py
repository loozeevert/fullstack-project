from pydantic import BaseModel
from datetime import date
from typing import Optional, List

#Схемы подразделений (Departments)
class DepartmentBase(BaseModel):
    department: str
    allocated: float
    spent: float = 0.0

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int

    class Config:
        from_attributes = True

#Схемы командирово(Trips)
class TripBase(BaseModel):
    code: str
    title: str
    destination: str
    start_date: date
    end_date: date
    advance_amount: float = 0.0
    status: str = "PENDING"
    employee_name: str
    department_id: Optional[int] = None

class TripCreate(TripBase):
    pass

class TripResponse(TripBase):
    id: int

    class Config:
        from_attributes = True

# Схемы расходов/чеков (Expenses)
class ExpenseBase(BaseModel):
    trip_id: int
    category: str
    amount: float
    expense_date: date
    receipt_url: Optional[str] = None
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int

    class Config:
        from_attributes = True