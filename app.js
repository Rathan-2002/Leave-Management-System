const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const accountRoutes = require('./routes/account');
const leaveRoutes = require('./routes/leave');
const adminRoutes = require('./routes/admin');
const session = require('express-session');
const homeRoutes = require('./routes/home');
const { User } = require('./models'); // Import User model (adjust path if needed)

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'myVerySecretKey123!',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to inject `user` object into all views
app.use(async (req, res, next) => {
    if (req.session.userId) {
        const user = await User.findByPk(req.session.userId); // Fetch the user from the database
        res.locals.user = user; // Make `user` available in all views
    } else {
        res.locals.user = null; // If no user, set as null
    }
    next();
});

app.use('/account', accountRoutes);
app.use('/leave', leaveRoutes);
app.use('/admin', adminRoutes);
app.use('/', homeRoutes);

// Sync database
sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n ▶ Server running at http://localhost:${PORT} \n`);
});
