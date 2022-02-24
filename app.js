const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// DataBase
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("article", articleSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// GET API'switch

app.get("/articles", (req, res) => {
  // Article.find({}, function(err, results) {
  Article.find(function(err, results) {
    if (!err) {
      console.log(results);
      res.send(results);

    } else {
      console.log(err);
    }
  })
})

app.post("/articles", (req, res) => {

  console.log(req.body.title);
  console.log(req.body.content);
  title = req.body.title;         // title is name of input field.
  content = req.body.content;     // content is name of input field.

  const newArticle = new Article({
    title: title,
    content: content,
  })

  newArticle.save();

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
