import User from "../models/user.schema.js"


function signupPage(req, res){
    res.render("users/signup.ejs");
}

async function newUser(req, res){
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
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
}


function loginPage(req, res){
    res.render("users/login.ejs");
}

async function loginUser(req, res){
        req.flash("success", "Welcome back to Aribnb!") 
        let redirectPage = res.locals.RedirectUrl || "/listings"
        res.redirect(redirectPage)        
    }



function logoutUser(req, res){
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    })
}

export { signupPage, newUser, loginPage, loginUser, logoutUser }