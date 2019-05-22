const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// user model
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/register', (req, res) => {
    res.render("register");
});

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let error = [];

    //Check required fields
    if (!name || !email || !password || !password2) {
        error.push({ msg: 'Please fill in all fields' });
    }

    //Check password match
    if (password != password2) {
        error.push({ msg: 'Password not matched' });
    }

    //Check password length
    if (password.length < 6) {
        error.push({ msg: 'Password should be of more than 6 characters' });
    }

    if (error.length > 0) {
        res.render('register', {
            error,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    error.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        error,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'Registration succesfully');
                                //req.flash('error_msg', 'Something went wrong');
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err))
                    }))
                }
            })
    }
})

// login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next)
});

// logout
router.get('/logout', (req,res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged Out');
    res.redirect('/users/login');
})
module.exports = router;
