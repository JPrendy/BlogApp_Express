var express = require("express");
var app = express();
var methodOverride = require("method-override");
bodyParser = require("body-parser");
var mongoose = require("mongoose");

//this creates the DB in MongoDB
//this is for the localhost, remember to change it when hosting online.
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//create the schema for MongoDB
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}   //automatically added when called to the db
})
// created gets the current date for the blog schema

//this is how we add things to the table that is called "Blogs"
var Blog = mongoose.model("Blog", blogSchema);

//good example to how to make a call to mongoDB
/*Blog.create({
    title: "Test Blog",
    image: "test",
    body: "Hello this is a blog post"
})*/ 


app.get("/", function(req, res){
   res.redirect("/blogs");
});

//Index Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, resp){
        if(err){
            console.log("error");
        }
        else{
            res.render("index", {blogs: resp});
        }
    }).sort({_id:-1}) ; //this will sort the post by latest insertion into the DB
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, respBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
          res.render("edit", {blog: respBlog});
        }
    });
});




//New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
});


//Create the New Route
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }

    })
})

//Show the Route
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, resp){
       if(err){
           res.redirect("/blogs");
       }
       else{
           res.render("show", {blog: resp});
       }
    });
});

//Update Route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, respUpdate){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete Route
//the delete is called from show.ejs when the delete button is pressed.
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs"); 
        }
    });
});


app.listen(3000, function(){
    console.log("server is running");
});


