from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

#главный узел связи с бд
engine = create_engine(settings.DATABASE_URL, echo=False)
#создание локальной сессии для работы с бд
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#создание базового класса для моделей sqlalchemy
Base = declarative_base()

#генератор сессий. Когда приходит новый http запрос, функция открывает новую сессию.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()