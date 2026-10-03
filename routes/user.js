const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const users = require("../controllers/users.js");

router.route("/signup")
.get(users.signupForm)
.post(wrapAsync(users.signup));

router.route("/login")
.get(users.loginForm)
.post(redirectUrl, passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(users.login));

router.get("/logout",users.logout);
module.exports = router;