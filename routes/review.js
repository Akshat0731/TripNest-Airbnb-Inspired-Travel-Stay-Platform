const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Listing = require("../models/listing");
const {reviewSchema} = require("../schema.js");
const router = express.Router({mergeParams:true});

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//review

router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    
    let newReview = await new Review(req.body.review);
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review Added");
    res.redirect(`/listings/${id}`);
}));


//Delete review route

router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;