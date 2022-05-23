const { default: axios } = require("axios")
const lodash = require('lodash');
const dotenv = require('dotenv');
const fs = require('fs');

const $ = require('jquery');
dotenv.config({path:'config.env'});




exports.homeRoutes = (req,res)=>{
    res.render('dashboard');
}

exports.viewmember = (req,res,next) => {
    if(req.query.id){
        res.render('viewmember',{cardID: req.query.id, user:req.user});
    }else{
        res.status(404).redirect('/dashboard');
    }
}

exports.building = (req,res) => {
    axios.get(process.env.URL+process.env.PORT+'/api/building')
    .then(function(response){
        res.render('facilities',{buildings:response.data});
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
    });
}



exports.classes = (req,res) => {
    axios.get(process.env.URL+process.env.PORT+'/api/classes')
    .then(function(response){
        res.render('classes',{classes:response.data});
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
    });
}





exports.logs = (req,res) => {
    axios.get(process.env.URL+process.env.PORT+'/api/logs')
    .then(function(response){
        res.render('logs',{logs:response.data});
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
    });
}



exports.index = (req, res) =>{
    res.render('index');
}


exports.login = (req, res) =>{
    res.render('login');
}

//Members
exports.allMembers = (req,res) => {
    //console.log(req.user)
    res.render('members',{user:req.user});
}

exports.employeeLoginManagement = (req,res)=>{
    res.render('employeeLoginManagement',{user:req.user});
}