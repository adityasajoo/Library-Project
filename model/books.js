const mongoose = require("mongoose");


//Schema of the book we store in the database
var bookSchema = new mongoose.Schema({
    title : String,
    author : String,
    genre : String,
    publisher : String
})

//export the schema
module.exports = mongoose.model("Book",bookSchema);