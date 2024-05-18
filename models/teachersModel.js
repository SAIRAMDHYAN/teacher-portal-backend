const mongoose=require('mongoose')

const TeachersSchema=new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
})

const TeachersModel=mongoose.model('teachers',TeachersSchema)

module.exports=TeachersModel