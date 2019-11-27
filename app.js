const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.get("/", function(req, res){
   res.render("landing");
});

app.get("*", function(req, res){
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, function(){
   console.log("Server Started");
});

