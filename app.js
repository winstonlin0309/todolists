const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

main().catch(err => console.log(err));

async function main() {
  app.set("view engine", 'ejs');
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(express.static('public'));

  //connect to todolistDB, if not exit, then create it
  await mongoose.connect('mongodb+srv://winstonlin0309:Taozibaobao520.@cluster0.crrgcqo.mongodb.net/todolistDB'); 

  const itemSchema = new mongoose.Schema({
    name : String
  });

  const Item = new mongoose.model("Item", itemSchema);

  const listSchema = new mongoose.Schema({
    title: String,
    items:[itemSchema]
  });

  const List = new mongoose.model("List", listSchema);

  const item1 = new Item({
    name: "Welcome to your todolist!"
  });

  const item2 = new Item({
    name: "Hit the + button to add a new item"
  });
  
  const item3 = new Item({
    name: "<-- Hit this check box to delete an item"
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

  app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
   
    List.findOne({title: customListName}).then((foundName) => {
      if(foundName === null) {
        const list = new List({
          title: customListName,
          items: defaultItem
        })

        console.log("Title name not found, creating the todolist");
        return list.save();
      } else {

        console.log("Title name found");
        return foundName;
      }
    }).then((saveItems) => {
        console.log("locating to the todolist");
        res.render("list", {listTitle : customListName, newListItems : saveItems.items});
    }).catch((err) => {
      console.log(err);
    });

  });

  app.get("/about", (req, res) => {
    res.render("about");
  });


  app.post("/", (req, res) => {
    const itemName = _.capitalize(req.body.newItem);
    const listTitle = req.body.list;
    const item = new Item({
      name:itemName,
    });

    if(listTitle === 'Today') {
      item.save();
      res.redirect("/");
    } else {
      List.findOne({title : listTitle}).then((foundItem) =>{
        console.log(foundItem);
        foundItem.items.push(item);
        foundItem.save();
        res.redirect("/" + listTitle);
      }).catch((err) => {
        console.log(err);
      });

    }

  });

  app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox;
    const listTitle = req.body.listTitle;
    
    console.log(listTitle);
    if(listTitle === "Today") {
      Item.deleteOne({_id:itemId}).then(() => {
        console.log("Delete successfully");
        res.redirect("/");

      }).catch((err) => {
        console.log(err);
      });
    } else {
      List.findOneAndUpdate({title : listTitle}, {$pull : {items : {_id : itemId}}}).then(() => {
        res.redirect("/" + listTitle);

      }).catch((err) => {
        console.log(err);
      });
    }

  });

  app.listen(3000, () => {
    console.log("Connect Successfully");
  });
}// end of main function