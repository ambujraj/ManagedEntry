const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/managedEntry", {useNewUrlParser: true,useUnifiedTopology: true});
var entrySchema = new mongoose.Schema({
	name: String,
	email: String,
   phoneNumber: String,
   checkint: String
});
var Entry = mongoose.model("Entry", entrySchema);
app.enable('trust proxy');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", function(req, res){
   res.render("landing");
});

app.post("/checkin", function(req, res){
var dt = new Date();
var nam = req.body.name;
var ema = req.body.email;
var num = req.body.phone; 
var tim = dt.toTimeString();
var hostName = "Ambuj Raj";
var hostEmail = "ambujm143@gmail.com";
var hostPhone = "7541989846";
var hostAdd = "BH-6, LPU, Jalandhar";
Entry.create({name: nam, email: ema, phoneNumber: num, checkint: tim});
res.render("checkin", {uname: nam});
});

app.get("*", function(req, res){
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, function(){
   console.log("Server Started");
});

