const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const {listingSchema} = require("../schema.js");
const router = express.Router();
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");



//index route
router.get("/",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs",{listings:allListings});
}));

//New route
router.get("/new",isLoggedIn,(req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let place = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!place){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{place});
}));

//create route
router.post("/",validateListing,wrapAsync(async (req,res)=>{
    let newListing = await new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    console.log("saved");
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id",isOwner,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing.");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited Successfully!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
}));

module.exports = router;