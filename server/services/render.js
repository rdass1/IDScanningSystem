const { default: axios } = require("axios")
const lodash = require('lodash');
const dotenv = require('dotenv');
const fs = require('fs');

const $ = require('jquery');
dotenv.config({path:'config.env'});




exports.homeRoutes = (req,res)=>{
    res.render('dashboard',{user:req.user});
}

exports.viewmember = (req,res,next) => {
    if(req.query.id){
        res.render('viewmember',{cardID: req.query.id, user:req.user});
    }else{
        res.status(404).redirect('/dashboard');
    }
}

exports.building = (req,res) => {
    res.render('facilities',{user:req.user});
}



exports.classes = (req,res) => {
    res.render('classes',{user:req.user});
}





exports.logs = (req,res) => {
    res.render('logs',{user:req.user});
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