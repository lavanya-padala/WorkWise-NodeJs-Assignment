# Workwise E-commerce API

Workwise E-commerce API is a Node.js-based backend application designed to handle user registration, login, product management, and cart functionality for an e-commerce platform. The API interacts with a PostgreSQL database to perform various CRUD operations.

## Features

- User Signup and Login (with validation and hashed passwords)
- Product Management (Add, Edit, Search, Delete)
- Cart Management (Add, Remove products)
- Role-based authentication (Buyer, Seller)
- Soft Deletion (Mark products and users as deleted)

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Error Handling**: Custom messages and status codes
- **Security**: Password hashing with Bcrypt

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- Git
- Postman (for API testing, optional)

### Steps to Set Up

1. **Clone the Repository**

   ```bash
   git clone "https://github.com/lavanya-padala/WorkWise-NodeJs-Assignment"
   cd workwise-ecommerce-api

2. **Install Dependencies**

   ```bash
   Use npm to install all the required dependencies for the project.
   npm install

3. **Create PostgreSQL Database**

   ```bash
    Restore the database in postgresql using sql dump file available in github

4. **Configure Environment Variables**

   ```bash
   Create a .env file in the root directory and add your PostgreSQL credentials,Redis Credentials and JWT secret.
   npm install

5. **Start the Server**

   ```bash
   Start the server in development mode.
    npm run dev

5. **Test the API**

   ```bash
    Export given postman API documentation available in github and perform API testing

    

