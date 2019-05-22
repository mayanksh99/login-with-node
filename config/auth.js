module.exports = {
    ensureAuthenticated: function(req,res,next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'You have to log In');
        res.redirect('/users/login');
    }
}