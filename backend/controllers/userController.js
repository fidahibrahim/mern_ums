import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import cloudinary from '../utils/clodinary.js'
import bcrypt from 'bcryptjs/dist/bcrypt.js'

const authUser = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body
        console.log("fsf", req.body);


        const user = await User.findOne({ email })
        console.log("dd", user);

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id, 'userJwt')
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            })
        } else {
            res.status(400)
            throw new Error('Invalid Email or Password')
        }
    }
)

const registerUser = asyncHandler(
    async (req, res) => {
        const { name, email, password } = req.body

        const userExists = await User.findOne({ email })
        if (userExists) {
            res.status(400)
            throw new Error('User already exists')
        }

        const user = await User.create({
            name,
            email,
            password
        })
        if (user) {
            generateToken(res, user._id, 'userJwt')
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            })
        } else {
            res.status(400)
            throw new Error('Invalid user data')
        }
    }
)

const logoutUser = asyncHandler(
    async (req, res) => {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        })
        res.status(200).json({ message: 'User logged out' })
    }
)

const getUserProfile = asyncHandler(
    async (req, res) => {
        const user = {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            profileImage: req.user.profileImage
        }
        res.status(200).json(user)
    }
)

const updateUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);
    if (user) {

        const userExists = await User.findOne({ email: req.body.email });
        if (userExists && userExists._id.toString() !== user._id.toString()) {
            res.status(400);
            throw new Error('Email is already taken by another user');
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (user?.profileImage) {
            const publicIdMatch = user.profileImage.match(/\/v\d+\/([^/]+)\.[a-z]{3,4}$/);
            if (publicIdMatch && publicIdMatch[1]) {
                const publicId = publicIdMatch[1];
                await cloudinary.uploader.destroy(publicId);
            } else {
                console.log('No publicId found in profileImg url');
            }
        }

        if (req.body.currentPassword || req.body.newPassword) {
            if (!req.body.currentPassword || !req.body.newPassword) {
                return res.status(400).json({ message: "Both current password and new password are required" });
            }

            const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            user.password = req.body.newPassword;
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'profile_images'
            });
            user.profileImage = result.secure_url;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});



export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}