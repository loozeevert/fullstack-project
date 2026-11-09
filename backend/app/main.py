from fastapi import FastAPI
from app.db.session import engine, Base
from app.models import models
from app.api.endpoints import router

# Автоматическое создание всех таблиц в PostgreSQL при запуске
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TravelBroke API", description="API для портала командировок")

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Сервер TravelBroke успешно запущен, таблицы созданы!"}