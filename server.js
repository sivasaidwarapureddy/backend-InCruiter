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
    res.send("Hello world!!");
});

app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
    console.error(" Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
