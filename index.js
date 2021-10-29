const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
//const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');
const Admin = require('./models/admin');
const Owner = require('./models/owner');

const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const ownerRoutes = require('./routes/owner');
const app = express();

const Connection = async () =>{
    try{
        const url = 'mongodb+srv://nandan:nandan123@test.v6ake.mongodb.net/TEST?retryWrites=true&w=majority';
        await mongoose.connect(url,{ useUnifiedTopology: true, useNewUrlParser: true});
        console.log("Database connnected successfully");
    }catch(error){
        console.log("Error while connecting database",error);
    }
}

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new LocalStrategy(Admin.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/',adminRoutes);
app.use('/',ownerRoutes);

app.get('*',(req,res)=>{
    res.send("Invalid Request");
})

app.listen(3000,()=>{
    console.log("Server is runnig on Port 3000");
})

Connection();