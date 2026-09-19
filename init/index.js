const mongoose = require("mongoose");
const initdata = require("./data.js");

const Listing = require("../models/listing.js");


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

const initDb = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}

initDb();