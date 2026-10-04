const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding-v6');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs",{listings:allListings});
}

module.exports.newForm = (req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.filter = async (req,res)=>{
    let {category} = req.params;
    let listings = await Listing.find({category:category});
    res.render("listings/index.ejs",{listings});
}

module.exports.search = async (req,res)=>{
    // console.log(req.query);
    let {location} = req.query;
    let listings = await Listing.find({location:location});
    res.render("listings/index.ejs",{listings})
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

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        proximity: [-95.4431142, 33.6875431],
        limit:1
    }).send()

    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = await new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let save = await newListing.save();
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
    let originalimg = listing.image.url;
    originalimg = originalimg.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalimg});
}

module.exports.update = async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing.");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing Edited Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
}