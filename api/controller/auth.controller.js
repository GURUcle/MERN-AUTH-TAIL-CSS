import User from "../model/user.model.js";
import bcrypt from 'bcrypt';

const saltRounds = 10;

export const signup = async (req, res) => {
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
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
