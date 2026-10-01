const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Listing = require("../models/listing");
const {reviewSchema} = require("../schema.js");
const router = express.Router({mergeParams:true});
const {validateReview,isLoggedIn,isAuthor} = require("../middleware.js");
//review

router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    
    let newReview = await new Review(req.body.review);
    let listing = await Listing.findById(id);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    // console.log(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review Added");
    res.redirect(`/listings/${id}`);
}));


//Delete review route

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;