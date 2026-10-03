const User = require("../models/user.js");

module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res)=>{
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
}

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{
    req.flash("success","Welcome back to TripNest!");
    // console.log("post",res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // console.log("post",redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You logged out!!");
        res.redirect("/listings");
    });
}