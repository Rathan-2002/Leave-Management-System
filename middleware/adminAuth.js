const { User } = require('../models');

module.exports = async (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/account/login');
    }
    const user = await User.findByPk(req.session.userId);
    if (user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    next();
};