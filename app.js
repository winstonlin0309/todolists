const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

main().catch(err => console.log(err));

async function main() {
  app.set("view engine", 'ejs');
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(express.static('public'));

  //connect to todolistDB, if not exit, then create it
  await mongoose.connect('mongodb://127.0.0.1:27017/todolistDB'); 

  const itemSchema = new mongoose.Schema({
    name : String
  });

  const Item = new mongoose.model("Item", itemSchema);

  const item1 = new Item({
    name: "Welcome to your todolist!"
  });

  const item2 = new Item({
    name: "Welcome to your todolist!"
  });
  
  const item3 = new Item({
    name: "Welcome to your todolist!"
  });

  const defaultItem = [item1, item2, item3];

  app.get("/", (req, res) => {
    Item.find({}).then((foundItem) => {
      if(foundItem.length === 0){
        return Item.insertMany(defaultItem);
      } else {
        return foundItem;
      }
    }).then((saveItems) => {
        res.render("list", {listTitle: "Today", newListItems: saveItems});
    }).catch((err) => {
      console.log(err);
    });

  });

  app.get("/delete", (req, res) => {
    
  });

  app.get("/:customListName", (req, res) => {
    const customListName = req.params.customListName;

  });

  app.get("/about", (req, res) => {
    res.render("about");
  });

  app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listTitle = req.body.list;

    const item = new Item({
          name:itemName,
        });

    if(listTitle === 'Today') {
      item.save();
      res.redirect("/");
    }

  })

  app.listen(3000, () => {
    console.log("Connect Successfully");
  });
}// end of main function