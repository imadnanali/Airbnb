import express from "express";
import User from "../models/user.js"
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
const router = express.Router();


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.flash("success", "Welcome to Airbnb");
        res.redirect("/listings")
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }),
    async (req, res) => {
        req.flash("success", "Welcome back to Aribnb!")
        res.redirect("/listings")
    })



    router.get("/logout", (req, res)=>{
        req.logout((err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "you are logged out!")
            res.redirect("/listings")
        })
    })
export default router;