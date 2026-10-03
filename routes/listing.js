const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listings = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage:storage});

router.route("/")
.get(wrapAsync(listings.index))           //index route
.post(isLoggedIn,upload.single('listing[image][url]'),validateListing,wrapAsync(listings.create));   //create route

//New route
router.get("/new",isLoggedIn,listings.newForm);


router.route("/:id")
.get(wrapAsync(listings.show))       //show route
.put(isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listings.update)) //update route
.delete(isLoggedIn,isOwner,wrapAsync(listings.delete)); //delete route


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listings.editForm));

module.exports = router;