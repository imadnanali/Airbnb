import express from "express";
import User from "../models/user.schema.js"
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
const router = express.Router();
import { saveRedirectUrl } from "../middleware.js"
import { loginPage, loginUser, logoutUser, newUser, signupPage } from "../controllers/user.controller.js";

//Signup page
router
    .route("/signup")
    .get(signupPage)
    .post(wrapAsync(newUser));


//login page
router.route("/login")
    .get(loginPage)
    .post(saveRedirectUrl,
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }),
        loginUser);




//logout
router.get("/logout", logoutUser)


export default router;