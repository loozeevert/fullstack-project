from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.crud import crud
from app.schemas import schemas
from app.db.session import get_db

router = APIRouter()

#маршруты для подразделений
@router.post("/departments/", response_model=schemas.DepartmentResponse, status_code=201)
def create_department(department: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    return crud.create_department(db=db, department=department)

@router.get("/departments/", response_model=List[schemas.DepartmentResponse])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_departments(db, skip=skip, limit=limit)

@router.get("/departments/{department_id}", response_model=schemas.DepartmentResponse)
def read_department(department_id: int, db: Session = Depends(get_db)):
    db_department = crud.get_department(db, department_id=department_id)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Подразделение не найдено")
    return db_department

#маршруты для поздок
@router.post("/trips/", response_model=schemas.TripResponse, status_code=201)
def create_trip(trip: schemas.TripCreate, db: Session = Depends(get_db)):
    return crud.create_trip(db=db, trip=trip)

@router.get("/trips/", response_model=List[schemas.TripResponse])
def read_trips(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_trips(db, skip=skip, limit=limit)

@router.get("/trips/{trip_id}", response_model=schemas.TripResponse)
def read_trip(trip_id: int, db: Session = Depends(get_db)):
    db_trip = crud.get_trip(db, trip_id=trip_id)
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Поездка не найдена")
    return db_trip

#маршруты для добавления и удаления
@router.put("/trips/{trip_id}", response_model=schemas.TripResponse)
def update_trip(trip_id: int, trip: schemas.TripCreate, db: Session = Depends(get_db)):
    db_trip = crud.get_trip(db, trip_id=trip_id)
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Поездка не найдена")
    return crud.update_trip(db=db, trip_id=trip_id, trip_data=trip)

@router.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    db_trip = crud.get_trip(db, trip_id=trip_id)
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Поездка не найдена")
    crud.delete_trip(db=db, trip_id=trip_id)
    return {"message": f"Поездка с ID {trip_id} успешно удалена"}