const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));


// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/trustchain")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


// User Schema
const User = mongoose.model("User",{
name:String,
email:String,
password:String
});


// REGISTER API
app.post("/register", async (req,res)=>{

const {name,email,password} = req.body;

const user = new User({
name,
email,
password
});

await user.save();

res.json({
status:"success",
message:"User Registered Successfully"
});

});


// LOGIN API (Admin + User)
app.post("/login", async (req,res)=>{

const {email,password} = req.body;

try{

// ADMIN LOGIN
if(email === "admin@trustchain.com" && password === "admin123"){

return res.json({
status:"admin",
message:"Admin login successful"
});

}

// USER LOGIN
const user = await User.findOne({email,password});

if(user){

res.json({
status:"user",
message:"User login successful"
});

}else{

res.json({
status:"error",
message:"Invalid Email or Password"
});

}

}catch(error){

res.json({
status:"error",
message:"Server error"
});

}

});


// ADMIN FETCH USERS
app.get("/admin/users", async (req,res)=>{

try{

const users = await User.find();

res.json(users);

}catch(error){

res.json({
message:"Error fetching users"
});

}

});


// SERVER START
app.listen(5000,()=>{
console.log("Server running on port 5000");
});