# Basic Express.js JWT Authentication Demo

This is a **super-basic Express.js project** split into two distinct server steps to demonstrate the fundamental concepts of **user registration, password hashing, and JWT (JSON Web Token) authentication**. 

⚠️ **WARNING:** This project is for educational purposes only. **Do not use it for production.**

## Architectural Breakdown
The project is divided into two separate server environments to isolate user credential handling from resource protection:

* **`npm run dev1` (Register & Login Server):** Handles user registration (`POST /users`) with secure `bcrypt` password hashing, handles user listing (`GET /users`), and processes user login to issue short-lived JWTs.
* **`npm run dev2` (JWT Verification Server):** Focuses entirely on route protection. It uses custom Express middleware to intercept incoming requests, verify the validity of the JWT, and serve protected assets.

## Prerequisites
Before running either server, you must configure your environment variables.

1. Create a `.env` file in the root directory of your project.
2. Add the `ACCESS_TOKEN_SECRET` variable with a secure key of your choice:

```env
ACCESS_TOKEN_SECRET=your_super_secret_key_here
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Phase 1: Initial Register & Login**
   Run the primary credential and onboarding server:
   ```bash
   npm run dev1
   ```

3. **Phase 2: Authentication with JWT**
   Run the resource verification server to test token authorization:
   ```bash
   npm run dev2
   ```