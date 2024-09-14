Node.js-based backend application designed to handle user registration, login, product management, and cart functionality. The API interacts with a PostgreSQL database to perform various CRUD operations.

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
- **Security**: Password hashing with bcrypt

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

2. **Install Dependencies**

   ```bash
   Use npm to install all the required dependencies for the project.
   npm install

3. **Create PostgreSQL Database**

   ```bash
    Restore the database in Postgresql using SQL dump file(WorkWise.Database) available on GitHub

4. **Configure Environment Variables**

   ```bash
   Create a .env file in the root directory and add your PostgreSQL credentials, Redis Credentials, and JWT secret.
   npm install

5. **Start the Server**

   ```bash
   Start the server in development mode.
    npm run dev

5. **Test the API**

   ```bash
    Export given postman API documentation(WorkWise.postman_collection.json) available on GitHub and perform API testing

    

