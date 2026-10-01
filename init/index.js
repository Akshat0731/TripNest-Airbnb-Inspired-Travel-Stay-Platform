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
    initdata.data = initdata.data.map((obj)=>({...obj,owner:'6abde56064b8c2545f186013'}));
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}

initDb();