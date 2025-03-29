# Simple Social Media Platform with Express.js

## Overview
This project is a simple social media platform backend built using **Express.js**. It provides a RESTful API to handle creating, reading, updating, and deleting posts, along with user authentication using **JWT (JSON Web Token)**.

## Prerequisites
Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/en/download/)
- [Express.js](https://expressjs.com/)
- A tool like [Postman](https://www.postman.com/) for API testing

## Features
- ✅ Set up an Express.js server
- ✅ CRUD operations for posts
- ✅ Middleware for handling JSON requests
- ✅ User authentication with JWT
- ✅ Protected routes requiring authentication
- ✅ Static file serving for image uploads

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SiyumiSathnaraKumarasinghe/AF-Lab-05-.git
   cd SocialMediaBackend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the server**:
   ```bash
   node server.js
   ```
   The server will run at `http://localhost:5000/`

## API Endpoints

### **1. Authentication**
#### **User Login**
- **Endpoint:** `POST /login`
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "1234"
  }
  ```
- **Response:** JWT Token
  ```json
  {
    "token": "your-generated-jwt-token"
  }
  ```

### **2. Posts API**
#### **Get All Posts**
- **Endpoint:** `GET /posts`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "First Post",
      "content": "Hello World!",
      "image": "/uploads/sample.jpg"
    }
  ]
  ```

#### **Create a Post (Requires Authentication)**
- **Endpoint:** `POST /posts`
- **Headers:**
  ```
  Authorization: Bearer <your-token>
  ```
- **Request Body:**
  ```json
  {
    "title": "My New Post",
    "content": "This is a test post."
  }
  ```
- **Response:**
  ```json
  {
    "id": 2,
    "title": "My New Post",
    "content": "This is a test post."
  }
  ```

#### **Update a Post**
- **Endpoint:** `PUT /posts/:id`
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated Content"
  }
  ```

#### **Delete a Post**
- **Endpoint:** `DELETE /posts/:id`
- **Response:** `{ "message": "Post deleted successfully" }`

### **3. Image Uploads**
- Ensure images are stored in the `/uploads/` folder.
- Serve static files:
  ```js
  app.use('/uploads', express.static('uploads'));
  ```
- Use the image URL format:
  ```html
  <img src="http://localhost:5000/uploads/sample.jpg" />
  ```

## Testing with Postman
1. **Login** (`POST /login`) to get a token.
2. **Copy the token** from the response.
3. **Use the token** in `Authorization: Bearer <your-token>` header for protected routes.
4. Test creating, updating, and deleting posts.

## Future Improvements
- Add a registration system (`POST /register`)
- Implement a database (MongoDB, MySQL) instead of an in-memory array
- Add user roles (admin, regular users)
- Implement image uploads using `multer`


---
### 📌 **Project by:** Siyumi Kumarasinghe
