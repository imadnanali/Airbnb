import Listing from "./models/listing.schema.js";
import { listingSchema, reviewSchema } from "./schema.js";
import ExpressError from "./utils/ExpressError.js";


function isLoggedin(req, res, next) {
  // console.log(req.originalUrl, "..", req.path);
  
      if(!req.isAuthenticated()){
        req.session.originalUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}


function saveRedirectUrl(req, res, next){
  // console.log(req.session.originalUrl);
  if(req.session.originalUrl){
    res.locals.RedirectUrl = req.session.originalUrl;
  }
  next();
}

async function isOwner(req, res, next){
  let { id } = req.params;
  let listing = await Listing.findById(id)
  if(!listing.owner.equals(res.locals.curruser._id)){
    req.flash("error", "You're not the owner!");
    return res.redirect(`/listings/${id}`)
  }
  next();
}



function validationListing(req, res, next){
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    else {
        next()
    }
}



function validationReview(req, res, next){
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    else {
        next()
    }
}



export { isLoggedin, saveRedirectUrl, isOwner, validationListing, validationReview };