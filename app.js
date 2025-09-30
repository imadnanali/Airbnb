import express from "express";
import mongoose from "mongoose"
import { fileURLToPath } from "url";
import path from "path";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";
import ExpressError from "./utils/ExpressError.js";
import dotenv from "dotenv";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport"
import LocalStrategy from "passport-local"
import User from "./models/user.schema.js";


dotenv.config();

import listingRouter from "./routes/listing.route.js";
import reviewsRouter from "./routes/review.route.js";
import userRouter from "./routes/user.route.js";


const port = process.env.PORT || 3000;



const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));


main().then(res => {
    console.log("Connect to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};




const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     // Set current page for active nav highlighting
//     const path = req.path;
//     if (path === '/') {
//         res.locals.currentPage = 'home';
//     } else if (path === '/listings') {
//         res.locals.currentPage = 'listings';
//     } else if (path === '/listings/new') {
//         res.locals.currentPage = 'new';
//     } else if (path.startsWith('/listings/') && path.endsWith('/edit')) {
//         res.locals.currentPage = 'edit';
//     } else if (path.startsWith('/listings/')) {
//         res.locals.currentPage = 'show';
//     }
//     next();
// });

app.use((req, res, next) => {
  res.locals.currentPage = req.path; // gives you the URL like "/", "/listings", etc.
  next();
});

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next()
})

    // app.get("/demouser", async (req, res)=>{
    //     let fakeUser = new User({
    //         email: "student@gmail.com",
    //         username: "delta-student"
    //     })
    //    let newUser = await User.register(fakeUser, "helloworld")
    //    res.send(newUser)
    
    // })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//Review 

// app.use((req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong!" } = err;
//     res.status(statusCode).render("listings/error.ejs", {
//         statusCode,
//         message
//     });
// });

app.get("/", (req, res) => {
    res.send(`I'm root`);
});

app.listen(port, () => {
    console.log(`App is running at port ${port}`);
});