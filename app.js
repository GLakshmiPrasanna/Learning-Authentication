//jshint esversion:6
require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption'); 


const app=express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema=new mongoose.Schema({
    email: String,
    password: String
})

const secret="iamlearningauthentication.";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});

const UserModel=mongoose.model('Secret',userSchema);


app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.get('/register',(req,res)=>{
    res.render('register');
})


app.post('/register',(req,res)=>{
    const newUser= new UserModel({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save().then(()=>{
        res.render('secrets');
    }).catch((err)=>{
        console.log(err);
    });
})

app.post('/login',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    UserModel.findOne({email:username}).then((found)=>{
        if(found && found.password===password){
            res.render('secrets');
        }
        else{
            console.log('User not found');
        }
    }).catch((err)=>{
        console.log(err);
    })
})

app.listen(3000,()=>{
    console.log('Server started!');
})