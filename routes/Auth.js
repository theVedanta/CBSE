require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// --------------Sign-up routes-----------------

router.get('/signup', (req, res) => {

    //check if already logged in
    if(req.cookies['verify']!=null){
        return res.redirect("/");
    };

    res.render('auth/signup.ejs');
});

router.post("/signup", async (req, res) => {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass
    });

    // const user = await User.findOne({username: req.body.username})
    const emailExists= await User.findOne({email: req.body.email});
    const userExists = await User.findOne({username: req.body.username})
    if (emailExists) {
        // return res.status(400).send('Email already exists');
        return res.render("auth/signup.ejs", {error: "Email already exists!"});
    }

    if (userExists) {
        // return res.status(400).send('That username is taken');
        return res.render("auth/signup.ejs", {error: "User already exists!n"});        
    }

    try{
        await user.save();
        // let token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        // res.cookie("verify",token);
        // console.log(token)
        return res.redirect("/");
    }catch(err){
        console.log(err)
        return res.render('auth/signup.ejs',{error:"error"});
    }
})

// --------------Log-in routes-----------------

router.get('/login', (req, res) => {

    //check if already logged in
    if(req.cookies['verify']!=null){
        return res.redirect("/");
    };

    res.render('auth/login.ejs');
});

router.post("/login", async (req,res) => {

    const userExists = await User.findOne({username:req.body.username});
    if(!userExists){
        return res.render('auth/login.ejs',{error:"User doesn't exist"});
    }
    // console.log(userExists);

    const user = await User.findOne({username: req.body.username})
    const validPass = await bcrypt.compare(req.body.password, user.password);
    // console.log(validPass);
    if(!validPass){
        return res.render('auth/login.ejs',{error:"Incorrect password"});
    }
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
    res.cookie("verify",token);
    // console.log(token)
    return res.redirect("/");   
    
});

// --------------Log-out routes-----------------

router.get("/logout", (req, res) => {
    res.cookie('verify', '', {maxAge: 1});
    res.redirect('auth/login');
})

module.exports = router;