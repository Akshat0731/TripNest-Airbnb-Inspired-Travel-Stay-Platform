const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({email,username});
        let registered = await User.register(newUser,password);
        req.login(registered,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to TripNest!");
            res.redirect("/listings");  
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/listings");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",redirectUrl, passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(async (req,res)=>{
    req.flash("success","Welcome back to TripNest!");
    // console.log("post",res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // console.log("post",redirectUrl);
    res.redirect(redirectUrl);
}));

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You logged out!!");
        res.redirect("/listings");
    });
});
module.exports = router;