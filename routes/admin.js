const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Admin = require('../models/user');

const {isLoggedIn}  = require('../middleware.js');

router.get('/admin',(req,res)=>{
    res.render('admin/home');
})

router.get('/admin/secretPage', isLoggedIn, (req,res)=>{
    res.render('admin/secretPage');
})


router.get('/admin/login', (req, res) => {
    res.render('admin/login');
})

router.post('/admin/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/admin/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/admin';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/admin/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/admin');
})

router.get('/',(req,res)=>{
    res.render('admin/home');
})


module.exports = router;