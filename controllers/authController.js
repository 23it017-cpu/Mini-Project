const { User } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
    };
    res.cookie('token', token, cookieOptions);
};

const registerUser = async (req, res) => {
    const { name, email, password, profile_id, department } = req.body;

    if (!name || !email || !password || !profile_id || !department) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ 
        where: {
            [Op.or]: [{ email }, { profile_id }] 
        }
    });

    if (userExists) {
        return res.status(400).json({ message: 'User with this email or profile ID already exists' });
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            profile_id,
            department,
        });

        if (user) {
            const token = generateToken(user.id);
            setTokenCookie(res, token);
            
            res.status(201).json({
                _id: user.id, // alias for frontend
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user.id);
        setTokenCookie(res, token);
        
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const getMe = async (req, res) => {
    const userData = req.user.toJSON();
    userData._id = userData.id; // Alias
    res.status(200).json(userData);
};

const logoutUser = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'User logged out' });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
};
