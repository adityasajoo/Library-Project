const Book = require("./model/books"),
      csvtojson = require("csvtojson")

//Fucntion to add data to the database from a csv file
function addData(fileName){
        
    csvtojson()
    .fromFile(fileName)
    .then(csvData=>{
        Book.collection.insert(csvData,(err,dataInserted)=>{
            if(err){
                console.log(err)
            }else{
                console.log(dataInserted)
                console.log("Insertion Sucessfull")
            }
        })
    })
}

//Export the defined function ,so that we can use it in the app.js file
module.exports = addData