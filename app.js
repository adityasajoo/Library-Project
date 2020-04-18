const express = require("express"), 
      app = express(),                 
      mongoose = require("mongoose"),  //mongoose to interact with the database
      Book = require("./model/books"), //The book model we defined
      bodyParser = require("body-parser"),  //To get the data from the html forms
      falsh = require("connect-flash"),  //To display flash meassages 
      session = require("express-session");  //To handle express sessions (Not really req, used only to support flash messages)

//Setup body-parser
app.use(bodyParser.urlencoded({extended:true}))

//Set view engine as ejs
app.set("view engine","ejs")

//Serve bootstrap folder
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

//Server the public folder 
app.use(express.static(__dirname+"/public"));

//setup express session
app.use(session({
    secret: 'GRV Library Adi',  //Any string
    resave: true,
    saveUninitialized: true,
}))


//Connect flash
app.use(falsh())


//Middlewares: Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");  
    res.locals.error_msg = req.flash("error_msg");
    next();
})


//--------------------------------------------------------------------------
//Add data using a csv fil
//TO add a csv file ,add the filename and run the "addData" function
// let fileName = "books_new.csv"
// const addData = require("./add")(fileName)
//---------------------------------------------------------------------------


//Connect to the database
const url = "mongodb+srv://library:library@cluster0-aa5bc.mongodb.net/test?retryWrites=true&w=majority"; //mongo url
mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{ 
    console.log("Connected to mongo") }
    ).catch(err=> console.log("Error:"+err))






//routes
app.get("/",(req,res)=>{
    res.render("landing")
})


app.post("/",(req,res)=>{
    let title = req.body.title,
        author = req.body.author;
    //Check empty fields
    //If author was empty
    if(author=="" && title!=""){
        Book.find({title: {$regex: title , $options: "i"}},(err,foundBooks)=>{
            if(err){
                console.log(err)
            }else{
                //check the number of books found
                if(foundBooks.length==0){
                    req.flash("error_msg","No Books Found")
                    res.redirect("/")
                }
                //If one or more books found
                res.render("landing",{books:foundBooks,msg:foundBooks.length})
            }
        })
    }
    //If not title was empty
    else if(title=="" && author!=""){
        Book.find({author: {$regex: author , $options: "i"}},(err,foundBooks)=>{
            if(err){
                console.log(err)
            }else{
                //check the number of books found
                if(foundBooks.length==0){
                    req.flash("error_msg","No Books Found")
                    res.redirect("/")
                }
                //If one or more books found
                res.render("landing",{books:foundBooks, msg:foundBooks.length})
            }
        })
    }

    else{
        //please enter any one
        //Go back to same page
        //And show flash message
        req.flash("error_msg","Fill any one of the field!")
        res.redirect("/")
    }

})



//listen in a port
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Connected and Running");
});
