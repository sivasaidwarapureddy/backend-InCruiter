# **User Authentication System**  
📌 Available Endpoints: [View all endpoints](https://backend-incruiter-production.up.railway.app/)
A secure user authentication system built with **Node.js, Express, and MongoDB**. This application supports **user registration, login, and password reset** using **JWT authentication**.



✅ User Registration (with input validation)  
✅ Secure Password Hashing (bcrypt)  
✅ Login with JWT Authentication  
✅ Password Reset via Email  
✅ Error Handling and Security Best Practices  

## **Tech Stack**  

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT (JSON Web Token), bcrypt  
- **Validation:** express-validator  
- **Security:** Helmet, CORS, dotenv  

---

## **Installation and Setup**  

Clone the Repository
     

install  Dependencies
```sh
npm install
```
Create a .env file in the root directory and add the following:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
    
