#файл для загрузки конфигурации из .env файла
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    #переменная со значением по умолчанию
    PROJECT_NAME: str = "TravelBroke API"
    #переменная строго обязательна, Если pydentic не найдет её в .env файле, то сервер не запустится
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

#доходя до этой строки, он читает .env файл и загружает переменные в объект settings
settings = Settings()