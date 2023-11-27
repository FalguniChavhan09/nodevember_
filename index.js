const express = require("express");
const bodyParser=require("body-parser");
const app = express();
const blogPostArray=require("./data");
const mongoose=require("mongoose");
// app.get('/', (request,response)=>{
//    response.send("Welcome to home page");
// })

app.use(bodyParser.urlencoded({extended :true}));

const MONGO_URL="mongodb+srv://ishapatil298:789@rcpit.cepbvoh.mongodb.net/";
mongoose.connect(MONGO_URL)
.then(()=>{
   console.log("DB connected succesfully");
})
.catch((err)=>{
    console.log("Erroe occured at db connection",err);
});

const blogSchema=new mongoose.Schema({
    title:String,
    imageURL:String,
    description:String
});

const Blog=new mongoose.model("blog",blogSchema);


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.get("/",(req,res)=>{
    Blog.find({})
    .then((arr)=>{
        res.render("index",{blogPostArray:arr});
     })
     .catch((err)=>{
        console.log("can't find blogs");
        res.render("404"); 
     });
    //res.render("index",{blogPostArray:blogPostArray})
})

app.get("/contact",(req,res)=>{
    res.render("contact");
})

app.get("/about",(req,res)=>{
    res.render("about");
})

app.get("/compose",(req,res)=>{
    res.render("compose");
})

app.post("/compose",(req,res)=>{
    //const newID=blogPostArray.length+1;
    const image=req.body.imageURL;
    const title=req.body.title;
    const description=req.body.description;

    const newBlog=new Blog({
       imageURL:image,
       title:title,
       description:description
    })
    // const obj=new Blog(){
    //    imageURL:image,
    //    title:title,
    //    description:description
    // }
   //blogPostArray.push(obj);
   newBlog.save()
   .then(()=>{
    console.log("Blog posted succesfully");
 })
 .catch((err)=>{
     console.log("error occured at posting blog ",err);
 });
    res.redirect("/");
})

app.get("/post/:id",(req,res)=>{
    //console.log(req.params.a);
    //blogPostArray.forEach();
    const id=req.params.id;
    let title="";
    let imageURL="";
    let description="";
    blogPostArray.forEach(post =>{
        if(post._id == id){
            title=post.title;
            imageURL=post.imageURL;
            description=post.description;
        }
    });
    const post={
        title:title,
        imageURL:imageURL,
        description:description
    }
    res.render("post",{post:post});
    
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})




