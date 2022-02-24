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

app.route("/articles")

// GET API's

.get((req, res) => {
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

// POST API's

.post((req, res) => {

  // console.log(req.body.title);
  // console.log(req.body.content);
  title = req.body.title;         // title is name of input field.
  content = req.body.content;     // content is name of input field.

  const newArticle = new Article({
    title: title,
    content: content,
  })

  newArticle.save(function(err) {
    if (!err) {
      res.send(newArticle);
    } else {
      res.send(err);
    }
  });

})

// DELETE ALL API

.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send({"message": "Deleted All Records from DB"});
    } else {
      res.send(err);
    }
  });
});

// ------------ SINGLE API's ---------------

app.route("/articles/:articleTitle")

.get((req, res) => {
  Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
    if (!err) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send({"message": "No article found"});
      }
    } else {
      res.send(err);
    }
  });
})

.put(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    // {overwrite: true},
    function(err) {
      if(!err) {
        res.send("SuccessFully updated article.");
      } else {
        res.send(err)
      }
    }
  )
})

.patch(function(req, res) {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if(!err) {
        res.send("SuccessFully Updated Article")
      } else {
        res.send(err)
      }
    }
  );
})

.delete((req, res) => {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
      if (!err) {
        res.send("SuccessFully delete the corresponding article.")
      } else {
        res.send(err)
      }
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
