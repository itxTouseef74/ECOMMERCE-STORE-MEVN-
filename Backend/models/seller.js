const mongoose = require("mongoose")
const sellerSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
    },
   
    password:{
    type:String,
    required:true
    },
    email:{
        type:String,
        unique:true,
     
    },
    storeName:{
        type:String,
        required:true,
        unique:false,
       
}
})


module.exports = sellerSchema