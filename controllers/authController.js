const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Pass = require('../models/Pass');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// @desc    Auth Admin & Get Token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Standard DB Login
        const admin = await Admin.findOne({ username });

        if (admin && (await admin.comparePassword(password))) {
            const token = generateToken(admin._id);

            // Send token in HTTP-only cookie
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            res.json({
                _id: admin._id,
                username: admin.username,
                role: admin.role,
                department: admin.department,
                token: token, // Also sending token in body for flexibility
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout Admin / Clear Cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutAdmin = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Create Initial Admin (Setup)
// @route   POST /api/auth/setup
// @access  Public (Should be disabled after setup)
const setupAdmin = async (req, res) => {
    const { username, password, role, department } = req.body;

    try {
        const adminExists = await Admin.findOne({ username });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            username,
            password,
            role: role || 'superadmin',
            department
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                username: admin.username,
                role: admin.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dashboard Statistics
// @route   GET /api/auth/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const { role, department } = req.admin;

        // Unified Dashboard Stats for all roles
        const totalEvents = await Event.countDocuments();
        const totalRegistrations = await Registration.countDocuments({ paymentStatus: 'Completed' });
        const totalPasses = await Pass.countDocuments({ isActive: true });

        // Sum revenue from completed registrations
        const revenueData = await Registration.aggregate([
            { $match: { paymentStatus: 'Completed' } },
            {
                $project: {
                    amountVal: {
                        $convert: {
                            input: { $arrayElemAt: [{ $split: ["$amount", "/"] }, 0] },
                            to: "double",
                            onError: 0,
                            onNull: 0
                        }
                    }
                }
            },
            { $group: { _id: null, total: { $sum: '$amountVal' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Recent Activity
        const recentRegistrations = await Registration.find({ paymentStatus: 'Completed' })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('pass');

        // Chart Data for Admin:
        const registrationTrends = await Registration.aggregate([
            { $match: { paymentStatus: 'Completed' } },
            { $group: { _id: "$department", value: { $sum: 1 } } }
        ]);

        stats = {
            totalEvents,
            totalRegistrations,
            totalPasses,
            totalRevenue,
            recentRegistrations,
            registrationTrends
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    loginAdmin,
    logoutAdmin,
    setupAdmin,
    getDashboardStats
};
