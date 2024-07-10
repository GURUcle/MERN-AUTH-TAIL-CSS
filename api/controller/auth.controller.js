import User from "../model/user.model.js";
import bcrypt from 'bcrypt';
import { errorHandler } from "../routes/utils/error.js";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

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

export const signin = async (req, res, next) => {
    const {email, password} = req.body;

    try {
const validUser = await User.findOne({email});
if (!validUser) return next(errorHandler(404, 'user not found'));

const validPassword = await bcrypt.compareSync(password,validUser.password);
if (!validPassword) return next(errorHandler(401, 'user credential invalid'));
const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET,{ expiresIn: 60 * 60 });
const {password: hashedPassword, ...rest} = validUser._doc;
res
.cookie('access_token', token, {httpOnly:true})
.status(200)
.json(rest)
    }catch(error) {
        next(error)
    }
}
