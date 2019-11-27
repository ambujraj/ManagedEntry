const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/managedEntry", {useNewUrlParser: true},{useUnifiedTopology: true});
var entrySchema = new mongoose.Schema({
	name: String,
	email: String,
   number: String,
   checkint: String,
   checkind: String,
});
var Entry = mongoose.model("Entry", entrySchema);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", function(req, res){
   res.render("landing");
});

app.get("/checkin", function(req, res){
var dt = new Date();
var nam = req.query.name;
var ema = req.query.email;
var num = req.query.phone; 
var time = dt.toTimeString();
var date = dt.toDateString();
Entry.create({name: nam, email: ema, number: num, checkint: time, checkind: date});
});

app.get("*", function(req, res){
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, function(){
   console.log("Server Started");
});

