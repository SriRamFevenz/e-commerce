# E-Commerce API Server

This is the robust backend server for the E-Commerce application, built with Node.js, Express, and MongoDB.

## 🚀 Features

-   **Authentication**: Secure Register and Login using JWT and bcrypt.
-   **Authorization**: Role-based access control (Admin vs. User).
-   **User Management**: Profile retrieval and management.
-   **Product Management**: Full CRUD operations (Admin protected).
-   **Order Management**: Create orders, calculate totals securely, and view order history.
-   **QR Payments**: Generate QR codes for orders and simulate payment verification.

##  Getting Started

### Installation

1.  Navigate to the server directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create `.env` file:
    ```env
    PORT=3000
    MONGO_URL=mongodb://localhost:27017/ecommerce
    JWT_SECRET=your_super_secret_key
    ```
4.  Run server: `npm run dev`

## 📡 API Reference

Base URL: `http://localhost:3000/api`

### 🔐 Authentication

#### Register User
-   **URL**: `/auth/register`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```

#### Login User
-   **URL**: `/auth/login`
-   **Method**: `POST`
-   **Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
-   **Response**: `{ "token": "eyJhbGciOi..." }`

### 👤 Users

#### Get Profile
-   **URL**: `/users/profile`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <TOKEN>`

### 🛒 Products

#### Get All Products
-   **URL**: `/products`
-   **Method**: `GET`

#### Get Single Product
-   **URL**: `/products/:id`
-   **Method**: `GET`

#### Create Product (Admin Only)
-   **URL**: `/products`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
-   **Body**:
    ```json
    {
      "title": "Product Name",
      "description": "Description",
      "price": 99.99,
      "category": "Electronics",
      "image": "http://image.url",
      "stock": 10
    }
    ```

#### Update Product (Admin Only)
-   **URL**: `/products/:id`
-   **Method**: `PUT`
-   **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
-   **Body**: (Partial object)
    ```json
    {
      "price": 89.99
    }
    ```

#### Delete Product (Admin Only)
-   **URL**: `/products/:id`
-   **Method**: `DELETE`
-   **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`

### � Orders

#### Create Order
-   **URL**: `/orders`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <TOKEN>`
-   **Body**:
    ```json
    {
      "items": [
        { "product": "<PRODUCT_ID>", "quantity": 2 }
      ]
    }
    ```

#### Get My Orders
-   **URL**: `/orders/myorders`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <TOKEN>`

### 💳 QR Payments

#### Generate QR Code
-   **URL**: `/orders/:id/qr`
-   **Method**: `GET`
-   **Headers**: `Authorization: Bearer <TOKEN>`
-   **Response**: `{ "qrCodeUrl": "data:image/png;base64...", "amount": 499 }`

#### Verify Payment
-   **URL**: `/orders/:id/pay`
-   **Method**: `POST`
-   **Headers**: `Authorization: Bearer <TOKEN>`
-   **Body**:
    ```json
    {
      "amount": 499
    }
    ```
