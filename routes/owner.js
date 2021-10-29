const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Owner = require('../models/user');

const {isLoggedIn}  = require('../middleware.js');

router.get('/owner',(req,res)=>{
    res.render('owner/home');
})

router.get('/owner/secretPage', isLoggedIn, (req,res)=>{
    res.render('owner/secretPage');
})


router.get('/owner/login', (req, res) => {
    res.render('owner/login');
})

router.post('/owner/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/owner/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/owner';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/owner/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/owner');
})

router.get('/',(req,res)=>{
    res.render('owner/home');
})


module.exports = router;