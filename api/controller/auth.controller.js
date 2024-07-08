import User from "../model/user.model.js";
import bcrypt from 'bcrypt';
import { errorHandler } from "../routes/utils/error.js";

const saltRounds = 10;

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with hashed password
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();
        // Send success response
        res.status(201).json({ message: 'User saved successfully' });
    } catch (error) {
        // Handle errors
        next(error);
    }
};
