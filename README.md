![image](https://github.com/Mehdi-Zarei/Clothing-Store/raw/main/public/images/products/how-to-start-an-online-clothing-store-1-1200x385.jpg)

# 👗 Trendora - Fashion Store Backend

Trendora is the backend API of an online clothing store developed using **Node.js** and **Express.js**.  
This project supports full user authentication, shopping cart, product management with image uploads, and payment integration via Zarinpal.

---

## 🚀 Features

### 🔐 Authentication with OTP

- Users login using OTPs (One-Time Passwords) sent to their email.
- OTPs are valid for **60 seconds** and are stored in **Redis**.
- No passwords are required for login — simple and secure.

### 🛡️ Token Management

- **Access Token**: Valid for **30 days**
- **Refresh Token**: Valid for **15 minutes**
- Tokens are signed with **JWT** and the refresh tokens are:
  - Hashed with **bcrypt**
  - Stored securely in **Redis**

### 👮‍♂️ Auth Guard & Role Guard

- Authenticated routes protected with custom **AuthGuard** middleware.
- Support for **Role-based access control** (RBAC) for admin functionalities.

### 🛍️ Shopping Cart & Orders

- Users can add and remove products from their cart.
- Checkout is integrated with **Zarinpal Payment Gateway**.
- Order data is stored securely after successful transactions.

### 👕 Product Management

- Products include:
  - Name, price, type, description, availability, ingredients
  - Images (uploaded using **Multer**)
- Each image is saved only if the full product creation succeeds.
- Admins can delete old images and upload new ones as needed.
- Products are **paginated** for efficient frontend rendering.

### 👤 User Management

- Users have:
  - Favorite products
  - Shopping cart
  - Order history
- Admins can access a **paginated list** of all users.

### 🔐 Password & Token Security

- Refresh tokens and passwords (if used later) are **hashed using bcrypt**.
- Redis is used for securely storing:

  - OTPs
  - Refresh tokens

## ⚙️ Database & Transactions

- This project uses **Sequelize** as the ORM for interacting with the MySQL database.
- To ensure data integrity and consistency, **Sequelize transactions** are implemented in critical operations such as order processing and payment.
- Transactions help to **atomically execute multiple queries**, so if any step fails, all changes are rolled back automatically.

---

## 🧰 Tech Stack

| Layer       | Technology                |
| ----------- | ------------------------- |
| Backend     | Node.js + Express.js      |
| Validation  | Joi                       |
| Database    | MySQL (via Sequelize ORM) |
| Caching     | Redis                     |
| File Upload | Multer                    |
| Auth        | JWT                       |
| HTTP Client | Axios                     |
| Payment     | Zarinpal                  |

---

## 🏗️ System Architecture

```bash
Trendora Backend
├── Authentication Layer 🔐
│   ├── JWT Token Generation
│   ├── Refresh Token Rotation
│   └── OTP Verification
│
├── Product Management 👚
│   ├── Image Upload/Delete
│   ├── Pagination
│   └── Inventory Control
│
├── Order Processing 🛒
│   ├── Cart Management
│   └── Payment Gateway
│
├── Data Storage 💾
│   ├── MySQL (Primary Data)
│   └── Redis (Temporary Data)
│
└── Security Layer 🛡️
    ├── Input Validation
    ├── Role Guards
    └── Error Handling
```

---

## 📦 Dependencies

```json
"dependencies": {
  "axios": "^1.10.0",
  "bcrypt": "^6.0.0",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "express": "^5.1.0",
  "ioredis": "^5.6.1",
  "joi": "^17.13.3",
  "jsonwebtoken": "^9.0.2",
  "multer": "^2.0.1",
  "mysql2": "^3.14.1",
  "sequelize": "^6.37.7"
}
```

## ⚙️ Validation

- All request data is validated with **Joi**.
- Each module has its own schema for strict and descriptive validation.
- Validation errors are handled via a global error handler.

## 🧠 Error Handling

- A centralized global error handler manages all thrown errors.
- Each error response is clean, consistent, and informative.

## 🖼️ Image Uploads

- Images are uploaded with **Multer**.
- If an error happens during the request (e.g., invalid data), the image is not saved, helping to avoid unused file storage.

**Admin can:**

- Delete old images.
- Upload new images for products.

## 📁 Folder Structure

```bash
project-root/
├── public/
│ └── images/
│ └── products/ # ✅ If this folder does not exist, Multer is configured to create it automatically on image upload
├── src/
│ ├── configs/
│ ├── helpers/
│ ├── middlewares/
│ ├── models/
│ ├── modules/
│ │ ├── auth/
│ │ ├── cart/
│ │ ├── category/
│ │ ├── product/
│ │ └── user/
│ ├── services/
│ ├── utils/
│ ├── app.js
│ └── server.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
```

## 📄 Environment Variables

```env
NODE_ENV = development
PORT = 3000
DOMAIN = http://localhost:3000

REDIS_URI = redis://localhost:6379/

DB_HOST = localhost
DB_USERNAME= root
DB_PASSWORD= ""
DB_NAME= online_clothing_store

ACCESS_TOKEN_SECRET = 343afc19-2204-49ba-97db-32c3ce3567f9
REFRESH_TOKEN_SECRET = a09955e4-067b-4cb9-8fbe-25475c69665a
ACCESS_TOKEN_EXPIRES = 15m
REFRESH_TOKEN_EXPIRES = 30d

COOKIE_SECRET = a09955e4-067b-4cb9-97db-32c3ce3567f9

# SMS
OTP_PATTERN = hspuui...
OTP_VARIABLE = verification-code
OTP_USER = 1234567890
OTP_PASS = 3@iXHQMn...

# Zarinpal
ZARINPAL_MERCHANT_ID = 0d2f8625-7c1d-40ef-a080-597bf4004c4b
ZARINPAL_PAYMENT_CALLBACK_URL = http://127.0.0.1:3000/api/checkouts/verify
ZARINPAL_API_BASE_URL=https://sandbox.zarinpal.com/pg/v4/payment
ZARINPAL_PAYMENT_BASE_URL=https://sandbox.zarinpal.com/pg/StartPay/
```

## 👨‍💻 Author

- Made with 💚 by Mehdi Zarei

## 📜 License

MIT License

[Copyright (c) 2025 Mehdi Zarei](https://github.com/Mehdi-Zarei)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
