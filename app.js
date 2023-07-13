const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

main().catch(err => console.log(err));

async function main() {
  app.set("view engine", 'ejs');
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(express.static('public'));

  app.get("/", (req, res) => {
    res.render("list", {listTitle : "Today"});
  })

  
  

  app.get("/about", (req, res) => {
    res.render("about");
  });

  app.listen(3000, () => {
    console.log("Connect Successfully");
  });
}// end of main function