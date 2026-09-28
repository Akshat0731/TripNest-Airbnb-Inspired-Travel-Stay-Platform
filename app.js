const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
    secret:"jkfskdfiurge",resave:false,saveUninitialized:true,
    cookie:{
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge:(7 * 24 * 60 * 60 * 1000)
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
let port = 8080;

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

app.listen(port,()=>{
    console.log(`listening at port:${port}`);
});

app.get("/",(req,res)=>{
    res.send("the root is working");
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    return next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("/*a",(req,res)=>{
    throw new ExpressError(404,"Page Not Found");
});
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!!"} = err;
    res.status(status).render("error.ejs",{message});
});