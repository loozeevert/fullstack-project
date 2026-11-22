Лабораторная работа N1:

npm run dev -- --host 127.0.0.1 – команда для запуска

Frontend - React, TypeScript, Vite
UI-библиотека - Ant Design
Роутинг - React Router DOM
Работа с датами - Day.js

Лабораторная работа N2:

uvicorn app.main:app –reload - команда для запуска

http://127.0.0.1:8000/api/departments/ - для работы с подразделениями
http://127.0.0.1:8000/api/trips/ - для работы с поездками 

Фреймворк - FastAPI (Python)
База данных - PostgreSQL 18
ORM - SQLAlchemy
Валидация данных - Pydantic
Драйвер БД - psycopg2


Лабораторная работа N3 — Рефакторинг Feature-Sliced Design (FSD)

Приложение было переведено на архитектуру Feature-Sliced Design с разделением слоёв `app`, `entities`, `features`, `pages` и `shared`, добавлением валидации форм, состояний интерфейса (`normal`, `loading`, `empty`, `error`) и анимаций.

Перенос сущностей и типов в слой `entities`
* Исходный файл `src/mock/mockData.ts` удалил после переноса данных в доменные сущности: создал `src/entities/trip/mockData.ts` и `src/entities/department/mockData.ts`.
* Типы и мок-данные разнес по сущностям `trip`, `expense` и `department` (`src/entities/*/types.ts` и `mockData.ts`), чтобы страницы и фичи работали с типизированными моделями (`Trip`, `ExpenseReceipt`, `DepartmentBudget`).

Вынос пользовательских сценариев в слой `features`
* Страницу `src/pages/TripsPage.tsx` разделил на два файла: сама страница `src/pages/TripsPage.tsx` и форма создания заявки `src/features/create-trip/CreateTripModal.tsx`. Теперь `CreateTripModal.tsx` содержит в себе модальное окно, валидацию полей (город, цель, диапазон дат, сумма аванса > 0, сотрудник) и генерацию новой заявки `Trip`, а `TripsPage.tsx` отвечает за отображение реестра, управление состоянием списка и переключатели режимов просмотра.
* Страницу `src/pages/ExpenseReportPage.tsx` разделил на два файла: страницу отчёта `src/pages/ExpenseReportPage.tsx` и форму расхода `src/features/add-expense/AddExpenseForm.tsx`. Теперь `AddExpenseForm.tsx` содержит в себе загрузку чека, симуляцию OCR-распознавания с автозаполнением полей, валидацию суммы/даты/категории/комментария и создание позиции `ExpenseReceipt`, а `ExpenseReportPage.tsx` отвечает за отображение таблицы расходов, расчёт итоговой суммы и управление состояниями отчёта.
* Страницу `src/pages/BudgetApprovalPage.tsx` разделил на два файла: страницу согласования `src/pages/BudgetApprovalPage.tsx` и панель согласования и бюджетов `src/features/approve-budget/BudgetApprovalPanel.tsx`. Теперь `BudgetApprovalPanel.tsx` содержит в себе таблицу заявок в статусе `PENDING`, кнопки согласования/отклонения и прогресс-бары лимитов по отделам, а `BudgetApprovalPage.tsx` отвечает за обновление статусов заявок, пересчёт потраченного/оставшегося бюджета и состояния загрузки/ошибки/пустых данных.

Состояния UI, анимации и обновление окружения сборки
* На страницах добавлены состояния `loading`, `empty` и `error` с возможностью переключения и сброса, а также плавное появление контента (`fade-in`).
* Для корректной сборки Vite v8 / Rolldown версия Node.js обновлена до LTS (`v26.13.1`), после чего выполнена проверка `npm run build`.
