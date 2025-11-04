# ⚙️ Backend API — Restaurant Management System

This is the **Backend Server** for the Restaurant Management System — connecting the **User App** and **Restaurant Dashboard**.  
Built using **Node.js**, **Express**, and **MongoDB**, it manages orders, chefs, tables, and menu data with a clean RESTful API design.

---

## 🚀 Live API  
🔗 **Base URL:** [[https://your-backend-url.onrender.com](https://hotelbackend-7ibf.onrender.com)](#)

---

## 🧠 Overview  

The backend handles:
- 🧾 Order Management (Create,Fetch Orders)
- 🍴 Table Management (Add and Retrieve Tables)
- 👨‍🍳 Chef Tracking (Assign and Manage Chef Orders)
- 🍛 Menu Management (Seeded data)
- 🌐 CORS enabled for frontend communication (User & Restaurant)

---

## 🧩 Folder Structure  
```bash
backend/
├── models/ # MongoDB models
│ ├── Order.js
│ ├── Chef.js
│ ├── Table.js
│ └── Menu.js
│
├── routes/ # Express routes for each model
│ ├── orderRoutes.js
│ ├── chefRoutes.js
│ ├── tableRoutes.js
│ └── menuRoutes.js
│
├── .env # Environment variables (DB URI, PORT)
├── server.js # Entry point of the backend
└── package.json
```
---

## 🧠 API Endpoints  

### 📦 Orders
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/order` | Create a new order |
| `GET`  | `/api/order` | Get all orders |
| `PUT`  | `/api/order/:id` | Update orders |

---

### 👨‍🍳 Chefs
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/chef` | Get all chefs |

---

### 🍽️ Tables
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/table` | Get all tables |
| `POST` | `/api/table` | Add new table |

---

### 🍕 Items
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/item` | Fetch menu items |

---

## 🧰 Tech Stack

| Layer | Technology |
|--------|-------------|
| Server | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| Hosting | Render |
| Environment | dotenv |
| Data Validation | Mongoose Schema |

---
## ⚙️ Setup Instructions  

```bash
# Clone the repository
git clone https://github.com/htanmai/backend.git

# Navigate into project
cd backend

# Install dependencies
npm install

# Create a .env file with:
MONGO_URI=your_mongo_connection
PORT=5000

# Start the server
npm start
```
Server will run on
👉 http://localhost:3000

## 🧾 Sample Data Schema
🧾 Order Model
```
{
  "_id": {
    "$oid": "6901e765a9567ea06f03363f"
  },
  "name": "thrinadh",
  "numberOfPeople": 5,
  "address": "hyderbad",
  "phoneNumber": 741258965,
  "orderItem": [
    {
      "name": "Cheese",
      "category": "Pizza",
      "quantity": 2,
      "_id": {
        "$oid": "6901e765a9567ea06f033640"
      }
    }
  ],
  "averageTime": 35,
  "time": {
    "$date": "2025-10-29T10:07:33.756Z"
  },
  "dineIn": false,
  "status": "served",
  "table": null,
  "__v": 0
}
```
## 🔗 Related Repositories
- 👤 User App: https://github.com/htanmai/user

- ⚙️ Backend API: https://github.com/htanmai/backend

- 🍽️ Main Full Stack Repo: https://github.com/htanmai/fullstack

## 👩‍💻 Author
Hekkadka Tanmai 📧 htanmai.23@gmail.com
