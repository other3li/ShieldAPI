# ShieldAPI 🛡️

🚀 RESTful API with JWT Authentication & CRUD Operations

## 📌 Project Overview
**ShieldAPI** is a secure RESTful API built using **Node.js, Express, MySQL, and JWT Authentication**. It provides user authentication, token-based authorization, and CRUD operations for managing users and products.

---

## 🛠️ Technologies Used
- **Node.js** + **Express.js** - Backend framework
- **MySQL** - Database for storing users & products
- **JWT (JSON Web Token)** - Secure authentication
- **bcryptjs** - Password hashing
- **dotenv** - Manage environment variables

---

## 📂 Project Structure
```
restful-api/
│-- node_modules/      # Project dependencies
│-- .env               # Environment variables (Not pushed to GitHub)
│-- .gitignore         # Ignore unnecessary files
│-- package.json       # Project metadata & dependencies
│-- package-lock.json  # Lockfile for dependencies
│-- server.js          # Main API server file
│-- db.js              # Database connection file
│-- README.md          # Project documentation
```

---

## 🔐 Setup & Installation
### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/restful-api.git
cd restful-api
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Create a `.env` file and add:
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the server
```bash
node server.js
```
📌 **Server will run on:** `http://localhost:5000`

---

## 📌 API Endpoints

### 🔹 **Authentication**
| Method | Endpoint      | Description |
|--------|-------------|-------------|
| POST   | `/signup`   | Register a new user |
| POST   | `/login`    | Authenticate user & return JWT token |

### 🔹 **User Operations**
| Method | Endpoint         | Description |
|--------|----------------|-------------|
| PUT    | `/users/{id}`   | Update user details (Requires JWT) |

### 🔹 **Product Operations (Require JWT Token)**
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | `/products`      | Add a new product |
| GET    | `/products`      | Retrieve all products |
| GET    | `/products/{pid}` | Retrieve a single product by ID |
| PUT    | `/products/{pid}` | Update product details |
| DELETE | `/products/{pid}` | Delete a product |

---

## ⚡ Usage (Postman Testing)
1️⃣ **Signup a user** → `POST /signup`
```json
{
  "name": "ali",
  "username": "ali",
  "password": "ali"
}
```

2️⃣ **Login and get JWT Token** → `POST /login`
```json
{
  "username": "ali",
  "password": "ali"
}
```
📌 The response will contain a `token` that you must include in Authorization headers for protected routes.

3️⃣ **Access protected routes** → Add `Authorization: Bearer <token>` in headers.

---

## 🛡️ Security Measures
✅ Passwords are securely hashed before storage using **bcryptjs**.
✅ JWT tokens are used for authentication & expire in **10 minutes**.
✅ Sensitive data (like DB credentials & JWT secret) is stored in **.env file**.
✅ Middleware ensures only authenticated users access protected routes.

---

## 🎯 Future Enhancements
- ✅ Role-based access control (Admin/User)
- ✅ Refresh tokens for longer session management
- ✅ Unit testing with Jest

---

---

🚀 **Made with ❤️ by [OTHER3LI]**

