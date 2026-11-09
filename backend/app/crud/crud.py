from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas

#функции для работы с подразделениями
def get_department(db: Session, department_id: int):
    return db.query(models.DepartmentBudget).filter(models.DepartmentBudget.id == department_id).first()

def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DepartmentBudget).offset(skip).limit(limit).all()

def create_department(db: Session, department: schemas.DepartmentCreate):
    db_department = models.DepartmentBudget(**department.model_dump())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

#фукции для работы с поездками
def get_trips(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Trip).offset(skip).limit(limit).all()

def create_trip(db: Session, trip: schemas.TripCreate):
    db_trip = models.Trip(**trip.model_dump())
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

def get_trip(db: Session, trip_id: int):
    return db.query(models.Trip).filter(models.Trip.id == trip_id).first()

#логика для обновления и удаления 
def update_trip(db: Session, trip_id: int, trip_data: schemas.TripCreate):
    db_trip = get_trip(db, trip_id)
    if db_trip:
        # Обновляем все поля на новые
        for key, value in trip_data.model_dump().items():
            setattr(db_trip, key, value)
        db.commit()
        db.refresh(db_trip)
    return db_trip

def delete_trip(db: Session, trip_id: int):
    db_trip = get_trip(db, trip_id)
    if db_trip:
        db.delete(db_trip)
        db.commit()
    return db_trip