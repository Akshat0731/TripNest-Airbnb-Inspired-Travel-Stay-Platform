const Listing = require("../models/listing");
module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs",{listings:allListings});
}

module.exports.newForm = (req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.show = async (req,res)=>{
    let {id} = req.params;
    let place = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!place){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{place});
}

module.exports.create = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = await new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    console.log("saved");
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.editForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.update = async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing.");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
}