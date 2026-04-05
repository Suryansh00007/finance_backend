# Finance Backend Project

A backend REST API system built for a **Finance Dashboard** where users can manage financial records based on their roles. Built with Node.js, Express.js, and MongoDB.

---

## What This Project Does

This project is a backend server that:
- Manages **users** with different roles (admin, analyst, viewer)
- Stores **financial records** like income and expenses in a database
- Provides a **dashboard summary** showing total income, expenses, and balance
- Controls **who can do what** using role-based access middleware
- Validates all incoming data and returns proper error messages

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime to run the server |
| Express.js | Web framework to handle routes and requests |
| MongoDB Atlas | Cloud database to store users and records |
| Mongoose | ODM library to define schemas and interact with MongoDB |
| dotenv | To manage environment variables securely |

---

## Project Structure

```
finance-backend/
│
├── server.js                  # Main entry point - starts the server
├── .env                       # Environment variables (MongoDB URI, PORT)
├── .gitignore                 # Tells Git to ignore node_modules and .env
├── package.json               # Project dependencies
├── test.http                  # API test file for VS Code REST Client
│
├── config/
│   └── db.js                  # MongoDB connection logic
│
├── models/
│   ├── User.js                # Mongoose schema for users
│   └── Record.js              # Mongoose schema for financial records
│
├── routes/
│   ├── userRoutes.js          # API routes for user management
│   ├── recordRoutes.js        # API routes for financial records
│   └── dashboardRoutes.js     # API route for dashboard summary
│
└── middleware/
    └── roleMiddleware.js      # Role-based access control logic
```

---

## Features Built

### 1. User Management
- Create a new user with name, email, role, and active status
- Get all users from the database
- Each user has a role: **admin**, **analyst**, or **viewer**

### 2. Financial Records
- Create income or expense records with amount, category, date, and notes
- Get all records (with optional filter by type)
- Update an existing record
- Delete a record

### 3. Dashboard Summary
- Returns total income, total expense, and net balance
- Calculated dynamically from all records in the database

### 4. Role-Based Access Control
Access is controlled by passing `x-role` in the request header:

| Action | Admin | Analyst | Viewer |
|--------|-------|---------|--------|
| Create record | ✅ Yes | ❌ No (403) | ❌ No (403) |
| Update record | ✅ Yes | ❌ No (403) | ❌ No (403) |
| Delete record | ✅ Yes | ❌ No (403) | ❌ No (403) |
| View all records | ✅ Yes | ✅ Yes | ❌ No (403) |
| View dashboard | ✅ Yes | ✅ Yes | ✅ Yes |

### 5. Validation
- Returns `400 Bad Request` if required fields are missing
- Returns proper error messages for invalid data (e.g. wrong role, negative amount)
- Prevents duplicate email addresses for users

---

## API Endpoints

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /users | Create a new user | None |
| GET | /users | Get all users | None |

### Records
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| POST | /records | Create a record | Admin only |
| GET | /records | Get all records | Admin or Analyst |
| PUT | /records/:id | Update a record | Admin only |
| DELETE | /records/:id | Delete a record | Admin only |

### Dashboard
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | /dashboard/summary | Get income, expense, balance | All roles |

---

## How to Run This Project Locally

### Step 1 - Clone the Repository
```bash
git clone https://github.com/YOURUSERNAME/finance-backend.git
cd finance-backend
```

### Step 2 - Install Dependencies
```bash
npm install
```

### Step 3 - Set Up Environment Variables
Create a `.env` file in the root folder and add:
```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```
To get your MongoDB URI:
- Go to https://cloud.mongodb.com
- Create a free cluster
- Click Connect → Drivers → Copy the connection string
- Replace `<password>` with your actual password

### Step 4 - Start the Server
```bash
node server.js
```
You should see:
```
Server running on http://localhost:5000
MongoDB connected successfully!
```

---

## How to Test the APIs

### Option - VS Code REST Client
1. Install the **REST Client** extension in VS Code (by Huachao Mao)
2. Open the `test.http` file in VS Code
3. Click **"Send Request"** above any request to run it
4. The response appears in a panel on the right side

### Example Requests

**Create a user:**
```
POST http://localhost:5000/users
Content-Type: application/json

{
  "name": "Alice Admin",
  "email": "alice@example.com",
  "role": "admin"
}
```

**Create a financial record (Admin only):**
```
POST http://localhost:5000/records
Content-Type: application/json
x-role: admin

{
  "amount": 75000,
  "type": "income",
  "category": "Salary",
  "date": "2024-01-15",
  "notes": "January salary"
}
```

**Get dashboard summary (any role):**
```
GET http://localhost:5000/dashboard/summary
x-role: viewer
```

**Expected dashboard response:**
```json
{
  "summary": {
    "totalIncome": 90000,
    "totalExpense": 25000,
    "netBalance": 65000,
    "totalRecords": 4
  }
}
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB Atlas connection string |
| PORT | Port number for the server (default: 5000) |

> The `.env` file is not uploaded to GitHub for security reasons. You must create it manually.

---

## Key Implementation Details

- **No JWT used** — role is passed simply via `x-role` request header
- **Mongoose validators** handle data validation at the schema level
- **`runValidators: true`** is used on update operations to enforce schema rules
- **MongoDB Atlas** is used as the cloud database (free tier M0 cluster)
- **nodemon** can be used during development for auto-restart on file changes

---

## Author

Built as a backend development assignment demonstrating:
- REST API design with Express.js
- MongoDB database integration with Mongoose
- Middleware-based role access control
- Input validation and error handling