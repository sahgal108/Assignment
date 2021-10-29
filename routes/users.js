const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

const {isLoggedIn}  = require('../middleware.js');

router.get('/user',(req,res)=>{
    res.render('users/home');
})

router.get('/user/register', (req, res) => {
    res.render('users/register');
});

router.get('/user/secretPage', isLoggedIn, (req,res)=>{
    res.render('users/secretPage');
})

router.post('/user/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect('/user');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/user/login', (req, res) => {
    res.render('users/login');
})

router.post('/user/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/user';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/user/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/user');
})

router.get('/',(req,res)=>{
    res.render('users/home');
})


module.exports = router;