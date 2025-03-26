const { User } = require('../models');

exports.showHome = async (req, res) => {
    let user = null;
    if (req.session.userId) {
        user = await User.findByPk(req.session.userId);
    }
    res.render('home/index', { user });
};