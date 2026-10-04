if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoute = require("./routes/user.js");

const sessionOptions = {
    secret:process.env.SECRET,resave:false,saveUninitialized:true,
    cookie:{
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge:(7 * 24 * 60 * 60 * 1000)
    }
}
 let dbUr = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/tripnest');
}

main()
.then(()=>{
    console.log("connected with mongodb");
})
.catch((err)=>{
    console.log("ERROR:",err);
});

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
let port = 8080;

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(port,()=>{
    console.log(`listening at port:${port}`);
});

// app.get("/",(req,res)=>{
//     res.send("the root is working");
// });

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    return next();
});

app.get("/privacy",(req,res)=>{
    res.render("privacy.ejs");
});

app.get("/terms",(req,res)=>{
    res.render("terms.ejs");
});

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);

app.all("/*a",(req,res)=>{
    throw new ExpressError(404,"Page Not Found");
});
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!!"} = err;
    res.status(status).render("error.ejs",{message});
});