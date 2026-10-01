const Listing = require("./models/listing");
const Review = require("./models/review")
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const {reviewSchema} = require("./schema.js");
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!(res.locals.currUser._id.equals(listing.owner._id))){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.isAuthor = async (req,res,next) =>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId).populate("author");
    // console.log(review);
    if(!(res.locals.currUser._id.equals(review.author._id))){
        req.flash("error","You are not the owner of the review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
