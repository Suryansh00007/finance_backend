# Finance Backend Project

A REST API backend for a finance dashboard with role-based access control.

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose

## Features
- User management (admin / analyst / viewer roles)
- Financial records (income & expense)
- Dashboard summary
- Role-based access control via middleware

## How to Run
1. Clone the repo
2. Run `npm install`
3. Add your MongoDB URI in `.env`
4. Run `node server.js`

## API Endpoints
| Method | Endpoint | Role Required |
|--------|----------|---------------|
| POST | /users | Any |
| GET | /users | Any |
| POST | /records | Admin |
| GET | /records | Admin, Analyst |
| PUT | /records/:id | Admin |
| DELETE | /records/:id | Admin |
| GET | /dashboard/summary | All roles |