# Basic Express.js JWT Authentication Demo

This is a **super-basic Express.js server** that demonstrates the fundamental concepts of **JWT (JSON Web Token) authentication**. 

⚠️ **WARNING:** This project is for educational purposes only. **Do not use it for production.**

## Features & Limitations
* 🔐 **Authentication Only:** This project demonstrates how to protect routes using JWTs. It **does not** include user authorization (login/registration) or refresh token logic.

## Prerequisites
Before running the server, you must configure your environment variables.

1. Create a `.env` file in the root directory of your project.
2. Add the `ACCESS_TOKEN_SECRET` variable with a secure key of your choice:

```env
ACCESS_TOKEN_SECRET=your_super_secret_key_here
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm run dev
   ```
