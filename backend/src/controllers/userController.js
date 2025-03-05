import User from "../models/userModel.js";  // Import the User model
import asyncHandler from "express-async-handler"; // To handle async errors
import generateToken from "../utils/generateToken.js";  // JWT Token Generator

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, type } = req.body;  // Type: 'candidate' or 'interviewer'

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        type,  // Storing the user type
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
            token: generateToken(user._id, user.type), // JWT Token
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

export { registerUser };
