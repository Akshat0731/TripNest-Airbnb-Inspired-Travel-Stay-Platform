const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./schema.js");

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

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"At Peacefull place",
//         price:5000,
//         location:"Flathead Lake",
//         country:"United States"
//     })
//     await sampleListing.save()
//     console.log("sample i saved");
//     res.send("saved successfully");
// });

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs",{listings:allListings});
}));

//New route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let place = await Listing.findById(id);
    res.render("listings/show.ejs",{place});
}));

// app.get("/listings/new",(req,res)=>{
//     res.render("/listings/new.ejs");
// });

//create route
app.post("/listings",wrapAsync(async (req,res)=>{
    let newListing = await new Listing(req.body.listing);
    await newListing.save();
    console.log("saved");
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing.");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


app.all("/*a",(req,res)=>{
    throw new ExpressError(404,"Page Not Found");
})
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!!"} = err;
    res.status(status).render("error.ejs",{message});
})