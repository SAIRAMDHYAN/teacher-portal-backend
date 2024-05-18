require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser=require('cookie-parser')
const cors=require('cors')
const multer=require('multer')
const jwt=require('jsonwebtoken')
const port = 3002;
const app = express();
const connectDB = require('./connection/mongodbConnection');
const TeachersModel = require('./models/teachersModel');
const StudentModel=require('./models/studentModel')
const bodyParser = require('body-parser');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));connectDB();
const upload = multer();

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));


app.post('/register',upload.none(), async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password)
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = await TeachersModel.create({ 
            name, 
            email, 
            password: hashedPassword 
        });
        res.status(201).json(teacher);
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error
            res.status(400).json({ error: "A teacher with this name already exists." });
        } else {
            console.error(err);
            res.status(500).json({ error: "Failed to register user", details: err });
        }

    }
});


app.post('/login',upload.none(),async(req,res)=>{
    const{email,password}=req.body
    console.log('email=>',email,'password=>',password)

   try {
    const teacher=await TeachersModel.findOne({email})
    console.log('teacher==>',teacher    )
    if(!teacher){
       return res.status(404).json({error:'Teacher not found'})
    }
    const isMatch=await bcrypt.compare(password,teacher.password)    

    if(!isMatch){
       return res.status(400).json({error:'Invalid Password'})
    }
    let token=jwt.sign(
        {email:teacher.email}, process.env.SECRET_KEY,{expiresIn:'1h'}
    )

    res.json({
        token,
        message:'Login Success'
    })
   } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: err.toString() });
   }
})

app.post('/student',upload.none(),async(req,res)=>{
    let{name,subject,marks}=req.body
    console.log(req.body)
      try {
        const student=await StudentModel.create({
            name,
            subject,
            marks
        })
        res.status(200).json(student)

    } catch (error) {
        res.status(500).json({error:'failed to add student details'})
        
      }
})

//create
app.post('/create',async(req,res)=>{
           
    console.log(req.body)
    let data=await StudentModel.create(req.body)
    await data.save()
    res.send({Success:true,message:'data saved successfully',data:data})
})


//update data

app.put('/update',upload.none(),async(req,res)=>{
    console.log(req.body)
    let {_id,...rest}=req.body
    console.log(rest)
    let data=await StudentModel.updateOne({_id:_id},rest)
    res.send({Success:true,message:'data updated successfully',data:data})
})


//delete data

app.delete('/delete/:id',async(req,res)=>{
    let id=req.params.id
    console.log(id)
    const data=await StudentModel.deleteOne({_id:id})
    res.send({Success:true,message:'data Delete successfully',data:data})

})

//get data
app.get('/studentList', async(req, res) => {
     try {
        let response=await StudentModel.find()
        console.log(response)
        res.json(response)
     } catch (error) {
        res.status(500).json({error:'failed to get student data'})
     }
});

app.listen(port, () => {
    console.log('server running on port', port);
});
