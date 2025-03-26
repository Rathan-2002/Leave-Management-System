module.exports = function auth(req, res, next) {
    console.log("▶ Session User ID:", req.session.userId); // Debugging
    if (!req.session.userId) {
      return res.redirect('/account/login');
    }
    next();
  };
  