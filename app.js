const express = require('express');
const app = express();
const dotenv = require('dotenv/config');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({  //https://www.nexmo.com and the messaging service works from 9am to 9pm
   apiKey: process.env.APIKEY,
   apiSecret: process.env.APISECRET,
 });
const nodemailer = require('nodemailer'); //nodemailer to send email
const from = 'ManagedEntry';
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/managedEntry", {useNewUrlParser: true,useUnifiedTopology: true});
// Creating Database Schema
var entrySchema = new mongoose.Schema({
	name: String,
	email: String,
   phoneNumber: String,
   checkint: String,
   hostNam: String,
   hostAd: String,
   hostE: String,
   hostPh: String
});
var Entry = mongoose.model("Entry", entrySchema);
app.enable('trust proxy');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
// Home 
app.get("/", function(req, res){
   res.render("landing");
});
var nam,dt,ema,num,tim,hostName,hostEmail,hostPhone,hostAdd;
// CheckIn 
app.post("/checkin", function(req, res){
dt = new Date();
nam = req.body.name;
ema = req.body.email;
num = req.body.phone;
tim = dt.toTimeString();
hostName = "Ambuj Raj";
hostEmail = "ambujm143@gmail.com";
hostPhone = process.env.MYNUMBER;
const to = '91'+hostPhone;
hostAdd = "BH-6, LPU, Jalandhar";
Entry.create({name: nam, email: ema, phoneNumber: num, checkint: tim,hostNam: hostName, hostAd: hostAdd, hostE: hostEmail, hostPh: hostPhone});
var tex = 'Name: '+nam+'\nEmail: '+ema+'\nPhone Number: '+num+'\nCheckin Time: '+tim;
const text = tex;
nexmo.message.sendSms(from, to, text);

const output = `
    <h3>New visitor Detail:</h3>
    <ul>  
      <li>Name: ${nam}</li>
      <li>Email: ${ema}</li>
      <li>Phone: ${num}</li>
      <li>Check-in time: ${tim}</li>
    </ul>
  `;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'jackkapoor12@gmail.com', 
        pass: process.env.EPASS
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  let mailOptions = {
      from: 'jackkapoor12@gmail.com', 
      to: hostEmail, 
      subject: 'New Visitor Info', 
      text: '', 
      html: output 
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
  });

res.render("checkin", {uname: nam});
});

// Checkout
app.post("/checkout",function(req, res){
   var tt = new Date().toTimeString();
   const output = `
    <h3>Visitors Details</h3>
    <ul>  
      <li>Name: ${nam}</li>
      <li>Email: ${ema}</li>
      <li>Phone: ${num}</li>
      <li>Check-in time: ${tim}</li>
      <li>Check-out time: ${tt}</li>
      <li>Host Name: ${hostName}</li>
      <li>Address Visited: ${hostAdd}</li>
    </ul>
    <h3>Message</h3>
    <p>Thank you for Visiting. Do visit us again.</p>
  `;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'jackkapoor12@gmail.com', 
        pass: process.env.EPASS
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  let mailOptions = {
      from: 'jackkapoor12@gmail.com', 
      to: ema, 
      subject: 'Visitor Info', 
      text: '', 
      html: output 
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
  });
   
   res.render("checkout");
});
// Default
app.get("*", function(req, res){
    res.redirect("/");
});

// Listening
app.listen(process.env.PORT || 3000, function(){
   console.log("Server Started");
});