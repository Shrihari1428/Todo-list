//jshint esversion:6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const _ = require("lodash");

//------------------------------------------------------------------------------

mongoose.connect("mongodb+srv://admin-shrihari:admin123@todo-cluster.ymtme.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const todoSchema = {
  name: {
    type: String,
    required: true
  }
};

const listSchema = {
  name: {
    type: String,
    required: true
  },
  listItem: [todoSchema]
};

const todoModel = mongoose.model("Todolist", todoSchema);
const listModel = mongoose.model("CustomList", listSchema);

const defaulItems = [];

//------------------------------------------------------------------------------

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(process.env.PORT||3000, function() {
  console.log("Server has started on port 3000....");
});

//------------------------------------------------------------------------------

app.get("/", function(req, res) {
  var currentDay = date.getDay();

  todoModel.find(function(err, resItems) {
    if (err)
      console.log("Error");
    res.render("weekDays", {
      listTitle: "Today",
      tasks: resItems,
    });
  });
});

//*******************************

app.post("/", function(req, res) {
  var task = req.body.task;
  var route = req.body.submit;
  console.log(req.body);
  const newItem = new todoModel({
    name: task,
  });
  if (route === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    listModel.findOne({
      name: route
    }, function(err, foundItem) {
      if (!err) {
        foundItem.listItem.push(newItem);
        foundItem.save();
        res.redirect("/" + route);
      }
    })
  }
});

//------------------------------------------------------------------------------

app.get("/:customListName", function(req, res) {
  const listName = _.capitalize(req.params.customListName);
  listModel.findOne({
    name: listName
  }, function(err, foundItem) {
    if (!err) {
      if (!foundItem) {
        const list = new listModel({
          name: listName,
          listItem: defaulItems
        });
        list.save();
        res.redirect("/" + listName);
      } else {
        res.render("weekDays", {
          listTitle: foundItem.name,
          tasks: foundItem.listItem,
        });
      }
    }
  });
});

//------------------------------------------------------------------------------

app.post("/delete", function(req, res) {
  const deleteItem = req.body.checkedItem;
  const routeName = req.body.listName;
  if (routeName === "Today") {
    todoModel.findByIdAndRemove(deleteItem, function(err) {
      if (!err)
        console.log("Deleted");
    });
    res.redirect("/");
  } else {
    listModel.findOneAndUpdate({
      name: routeName
    }, {
      $pull: {
        listItem: {
          _id: deleteItem
        }
      }
    }, function(err, foundItem) {
      if (!err) {
        res.redirect("/" + routeName);
      }
    })
  }

})
