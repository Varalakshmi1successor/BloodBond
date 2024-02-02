import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();
import User from './../models/user.js';

router.post("/recipient", async (req, res) => {
});

router.post("/donor", async (req, res) => {
    const { name, email, phone, password, age, bloodGroup, address, district, state, country, pincode } = req.body;

    // Check if user already exists
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "A user with this email or phone number already exists." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred while checking the database." });
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!(hasUpperCase && hasLowerCase && hasSpecialChar && hasNumber)) {
        return res.status(400).json({ error: "Password must contain at least one uppercase letter, one lowercase letter, one special character, and one number." });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address format." });
    }

    if (age < 18) {
        return res.status(400).json({ error: "We appreciate your responsibility, but you must be at least 18 years old to register." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the user with the hashed password
    const newUser = new User({ name, email, phone, password: hashedPassword, age, bloodGroup, address, district, state, country, pincode });
    
    try {
        await newUser.save();
        res.status(200).json({ message: `Registration successful! Name: ${name}, Email: ${email}, Phone: ${phone}, Age: ${age}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while saving the user to the database." });
    }
});


router.post("/login", async (req, res) => {
    const { contact, password } = req.body;

    try {
        // Check if a user with the provided email exists
        const existingUser = await User.findOne({ contact });

        if (existingUser) {
            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, existingUser.password);

            if (passwordMatch) {
                return res.status(200).json({ message: "Login successful!" });
            } else {
                return res.status(401).json({ error: "Incorrect password. Please try again." });
            }
        } else {
            return res.status(401).json({ error: "No user found with the provided email. Please check your email or register." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred while checking the database." });
    }
});
router.post("/search", async (req, res) => {
    const { bloodGroup, district, state } = req.body;

    try {
        const searchResults = await User.find({
            bloodGroup,
            district,
            state,
        });

        res.status(200).json({ results: searchResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while searching the database." });
    }
});

export default router;
