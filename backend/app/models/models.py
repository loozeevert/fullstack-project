from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class DepartmentBudget(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    department = Column(String, unique=True, index=True, nullable=False)
    allocated = Column(Float, nullable=False, default=0.0)
    spent = Column(Float, nullable=False, default=0.0)

    # связь один-ко-многим с поездками
    trips = relationship("Trip", back_populates="department_rel", cascade="all, delete-orphan")


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False) # например, TRP-201 или SZN-3
    title = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    advance_amount = Column(Float, nullable=False, default=0.0)
    status = Column(String, nullable=False, default="PENDING") # PENDING, APPROVED, COMPLETED, REJECTED
    employee_name = Column(String, nullable=False)

    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)

    # связи
    department_rel = relationship("DepartmentBudget", back_populates="trips")
    expenses = relationship("Expense", back_populates="trip", cascade="all, delete-orphan")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    category = Column(String, nullable=False) # Билеты, Отель, Суточные и т.д.
    amount = Column(Float, nullable=False)
    expense_date = Column(Date, nullable=False)
    receipt_url = Column(String, nullable=True) # ссылка на фото чека или имя файла
    description = Column(String, nullable=True)

    # связь с поездкой
    trip = relationship("Trip", back_populates="expenses")