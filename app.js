const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");


app.use(methodOverride("_method"));
let port = 8080;
app.listen(port,()=>{
    console.log(`listening at port:${port}`);
})

app.get("/",(req,res)=>{
    res.send("the root is working");
})

app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/tripnest');
}

main()
.then(()=>{
    console.log("connected with mongodb");
})
.catch((err)=>{
    console.log("ERROR:",err);
})

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"At Peacefull place",
//         price:5000,
//         location:"Flathead Lake",
//         country:"United States"
//     })
//     await sampleListing.save()
//     console.log("sample i saved");
//     res.send("saved successfully");
// });


app.get("/listings",async (req,res)=>{
    let allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs",{listings:allListings});
})

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let place = await Listing.findById(id);
    res.render("listings/show.ejs",{place});
})

// app.get("/listings/new",(req,res)=>{
//     res.render("/listings/new.ejs");
// })

app.post("/listings",async (req,res)=>{
    let newListing = await new Listing(req.body.listing);
    await newListing.save();
    console.log("saved");
    res.redirect("/listings");
})

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})