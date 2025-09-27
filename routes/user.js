import express from "express";
import User from "../models/user.js"
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
const router = express.Router();
import { saveRedirectUrl } from "../middleware.js"


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to Airbnb");
            res.redirect("/listings")
        })

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
    saveRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }),
    async (req, res) => {
        req.flash("success", "Welcome back to Aribnb!") 
        let redirectPage = res.locals.RedirectUrl || "/listings"
        res.redirect(redirectPage)        
    })



router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    })
})
export default router;