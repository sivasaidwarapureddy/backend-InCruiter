const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { Router } = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/User");

dotenv.config();
const router = Router();
router.use(cookieParser());

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});

//  Register Route .. 
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Received body:", req.body);

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        console.error("Error during registration:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//  Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000,
        });

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//  Logout Route .. 
router.post("/logout", (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({ message: "Logout successful" });
    } catch (err) {
        console.error("Error during logout:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//  Forgot Password (Send Token) ..
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 10 * 60 * 1000; 
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Code",
            text: `Your password reset code is: ${resetToken}`,
        });

        res.json({ message: "Reset token sent to email" });
    } catch (err) {
        console.error("Error during forgot password:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//  Reset Password ..
router.post("/reset-password", async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        if (!email || !token || !newPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email, resetToken: token });
        if (!user || user.resetTokenExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error("Error during password reset:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
