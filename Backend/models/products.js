const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true

    },
    price:{
        type:Number,
        required:true
   },
quantity:{
    type:Number,
    required:true
},
 category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
},
storeName:{
    type:String,
    required:true,
    unique:false,
   

}
},{timestamps:true})

module.exports = productSchema