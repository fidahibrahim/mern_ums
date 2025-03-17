import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const adminLogin = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body

        const admin = await User.findOne({ email })

        if (admin && admin.isAdmin && (await admin.matchPassword(password))) {
            const genToken = generateToken(res, admin._id, 'adminJwt')
            console.log(genToken, "tok");

            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
            })
        } else {
            throw new Error('Invalid email or password')
        }
    }
)

const adminLogout = asyncHandler(
    async (req, res) => {
        res.cookie('adminJwt', '', {
            httpOnly: true,
            expires: new Date(0)
        })
        res.status(200).json({ message: 'Admin Logged out' })
    }
)

const getUsers = asyncHandler(
    async (req, res) => {
        const search = req.query.search || ''

        const searchRegex = new RegExp(search, 'i')

        const userData = await User.find({
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } }
            ]
        }).select('-password').sort({ updatedAt: -1 })
        console.log("user",userData);
        
        res.status(200).json(userData)
    }
)

const addNewUser = asyncHandler(
    async (req, res) => {
        const { name, email, password } = req.body;
        console.log(req.body, "body");


        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('user already exists');
        }

        const user = await User.create({ name, email, password })
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            })
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
)

const editUser = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.body.userId)
        console.log(user, "user from body");

        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email;
            user.password = req.body.password || user.password;

            const updatedUser = await user.save()

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
            })
        } else {
            res.status(404)
            throw new Error('User not found')
        }
    }
)
const deleteUser = asyncHandler(
    async (req, res) => {
        const { userId } = req.body;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        } else {
            await User.deleteOne({ _id: userId });
            res.status(200).json({ message: 'User deleted' });
        }
    }
)

export {
    adminLogin,
    adminLogout,
    getUsers,
    addNewUser,
    editUser,
    deleteUser
}