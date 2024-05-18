let mongoose=require('mongoose')

let studentSchema=new mongoose.Schema({
    name:{type:String},
    subject:{type:String},
    marks:{type:Number}
})

let StudentModel=mongoose.model('student',studentSchema)

module.exports=StudentModel