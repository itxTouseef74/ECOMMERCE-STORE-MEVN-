const mongoose = require("mongoose")
const categorySchema = new mongoose.Schema({
    cat_name:{
        type:String,
        unique:true,
        required:true,

    },
    storeName:{
        type:String,
        required:true,
        unique:false
}
},{timestamps:true})

module.exports = categorySchema