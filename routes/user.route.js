import express from "express";
import User from "../models/user.schema.js"
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
const router = express.Router();
import { saveRedirectUrl } from "../middleware.js"
import { loginPage, loginUser, logoutUser, newUser, signupPage } from "../controllers/user.controller.js";

//Signup page
router.get("/signup", signupPage);

// SignUp
router.post("/signup", wrapAsync(newUser));

//login page
router.get("/login", loginPage);

//login
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }),
    loginUser)


//logout
router.get("/logout", logoutUser)


export default router;