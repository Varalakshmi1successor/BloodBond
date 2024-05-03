import express from "express";
import bcrypt from "bcrypt";
import User from './../models/user.js';
import twilio from 'twilio';

const accountSid = 'AC5640f6769e92e5adc8107d9d1c9ff1fc';
const authToken = '76aead2e31533334f000bc3226ad2bd3';

const client = twilio(accountSid, authToken);
const router = express.Router();


router.post("/recipient", async (req, res) => {
    // Your recipient route logic here
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
        return res.status(400).json({ error: "You must be at least 18 years old to register." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the user with the hashed password
    const newUser = new User({ name, email, phone, password: hashedPassword, age, bloodGroup, address, district, state, country, pincode });

    try {
        await newUser.save();
        res.status(200).json({ message: `Registration successful!` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while saving the user to the database." });
    }
});


router.post("/login", async (req, res) => {
    const { contact, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email: contact }, { phone: contact }] });

        if (existingUser) {
            const passwordMatch = await bcrypt.compare(password, existingUser.password);

            if (passwordMatch) {
                req.session.user = {
                    name: existingUser.name,
                    email: existingUser.email,
                    phone: existingUser.phone,
                    age: existingUser.age,
                    bloodGroup: existingUser.bloodGroup,
                    address: existingUser.address,
                    district: existingUser.district,
                    state: existingUser.state,
                    country: existingUser.country,
                    pincode: existingUser.pincode,
                    // Add other user properties as needed
                };

                return res.status(200).json({
                    message: "Login successful!",
                    user: req.session.user,
                });
            } else {
                return res.status(401).json({ error: "Incorrect password. Please try again." });
            }
        } else {
            return res.status(401).json({ error: "No user found with the provided email or phone. Please check your email or register." });
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

router.post("/reset-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "No user found with the provided email." });
        }

        // Generate a unique token
        const token = crypto.randomBytes(20).toString('hex');

        // Store the token in the user document
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

        // Send an email with the reset link
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_email_password'
            }
        });

        const resetLink = `http://yourdomain.com/reset-password/${token}`;
        const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: 'Password Reset - BLOODBOND',
            text: `To reset your password, click the following link: ${resetLink}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "An error occurred while sending the reset email." });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: "Password reset instructions sent to your email." });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred while processing the password reset request." });
    }
});

router.post('/update-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match.' });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password and clear the reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while updating the password.' });
    }
});

router.post("/request", async (req, res) => {
    const { donorName, donorPhone, recipientName, recipientMobile, hospital } = req.body;

    try {
        // Logic to send SMS notification using Twilio
        await client.messages.create({
            body: `Hello ${donorName}, you have a blood request from ${recipientName} at ${hospital}. Please consider donating blood. Your immediate help could make a life-saving difference. Contact the recipient at ${recipientMobile} for more details. Thank you for your generosity and kindness.`,
            from: +18722405443,
            to: donorPhone
        });

        console.log(`Blood request from ${recipientName} (${recipientMobile}) at ${hospital} to ${donorName}.`);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while processing the blood request." });
    }
});

export default router;
