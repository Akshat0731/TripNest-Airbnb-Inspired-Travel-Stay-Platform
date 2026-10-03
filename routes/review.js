const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({mergeParams:true});
const {validateReview,isLoggedIn,isAuthor} = require("../middleware.js");
const reviews = require("../controllers/reviews.js");
//review

router.post("/",isLoggedIn,validateReview,wrapAsync(reviews.create));


//Delete review route

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviews.delete));

module.exports = router;