const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors"); 
const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

app.use(cors());

//  Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => {
        console.error(" MongoDB Connection Failed:", err);
        process.exit(1);
    });

//  Middleware
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
app.use(cookieParser());

//  Logging Middleware for Debugging
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`, req.body);
    next();
});

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the User Authentication System!",
        endpoints: {
            "GET /": "Show all available API endpoints",
            "GET /api/auth/users": "Get all registered users (Admin only)",
            "GET /api/auth/profile": "Get logged-in user profile",
            "GET /api/protected": "Example protected route",
            "POST /api/auth/register": "Register a new user",
            "POST /api/auth/login": "User login",
            "POST /api/auth/reset-password": "Request password reset",
        }
    });
});
app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
    console.error(" Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
