const bcrypt = require('bcrypt');
const { User, LeaveType, LeaveAllocation } = require('../models');


// Registration (from previous)
exports.showRegister = (req, res) => {
    res.render('account/register');
};

exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        return res.render('account/register', { error: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('account/register', { error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role // Store the role selected by the user
        });


        if (newUser.role === 'Employee') {
            const leaveTypes = await LeaveType.findAll();
            for (const type of leaveTypes) {
                await LeaveAllocation.create({
                    userId: newUser.id,
                    leaveTypeId: type.id,
                    originalAllocations: type.defaultDays,
                    currentAllocations: type.defaultDays
                });
            }
        }

        res.redirect('/account/login');
    } catch (error) {
        res.render('account/register', { error: 'An error occurred during registration' });
    }
};


// Login
exports.showLogin = (req, res) => {
    res.render('account/login', { error: null });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('account/login', { error: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('account/login', { error: 'Invalid email or password' });
        }

        req.session.userId = user.id;
        res.redirect('/home');
    } catch (error) {
        res.render('account/login', { error: 'An error occurred during login' });
    }
};

// Logout (Added for completeness)
exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.redirect('/account/login');
    });
};