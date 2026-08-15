# Smart Expense Tracker (Django + React)

A full-stack expense tracking app that solves a real everyday problem:
knowing where your money goes and staying within budget.

## Why this project shows OOP well
- **Abstraction**: `TimeStampedModel` and `BudgetPolicy` define contracts/base behavior.
- **Inheritance**: `Category`/`Expense` inherit `TimeStampedModel`; `StrictBudgetPolicy` extends `MonthlyBudgetPolicy`.
- **Polymorphism**: `ExpenseAnalyzer` works with any `BudgetPolicy` subclass interchangeably.
- **Encapsulation**: Business logic (budget %, totals) is hidden behind clean methods/properties, not scattered in views.
- **Frontend OOP**: `ExpenseService` class wraps all API calls (singleton-style export).

## Project structure
```
expense-tracker/
├── backend/            Django + Django REST Framework
│   ├── expense_tracker/  (project settings/urls)
│   └── tracker/          (app: models, services, serializers, views)
└── frontend/            React app
    └── src/
        ├── api/ExpenseService.js
        └── components/ (ExpenseForm, ExpenseList, Dashboard)
```

## Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py loaddata tracker/fixtures/sample_data.json   # sample categories
python manage.py createsuperuser   # optional, for /admin

python manage.py runserver
```
API will run at `http://127.0.0.1:8000/api/`

Key endpoints:
- `GET/POST /api/categories/`
- `GET/POST /api/expenses/` (supports `?category=<id>`)
- `DELETE /api/expenses/<id>/`
- `GET /api/summary/` (add `?strict=true` for stricter budget warnings)

## Frontend setup
```bash
cd frontend
npm install
npm start
```
Runs at `http://localhost:3000` and talks to the Django API automatically.

## Notes
- SQLite is used for zero-config local development.
- CORS is wide-open (`CORS_ALLOW_ALL_ORIGINS = True`) since this is a dev setup — lock this down before deploying anywhere real.
- To reset data: delete `backend/db.sqlite3` and re-run `migrate` + `loaddata`.
