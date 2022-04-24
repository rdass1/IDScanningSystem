const { default: axios } = require("axios")
const lodash = require('lodash');
const dotenv = require('dotenv');

const $ = require('jquery');
dotenv.config({path:'config.env'});




exports.homeRoutes = (req,res)=>{
    
    axios.get(process.env.URL+process.env.PORT+'/api/active_members')
    .then(function(response){
        if(lodash.isEmpty(response.data)){
            res.render('dashboard',{users:response.data});
        }else{
            res.render('dashboard',{users:response.data});
        }
        
       
        
    })
    .catch(err=>{
        res.send(err);
    });
    // else{
    //     axios.get(process.env.URL+process.env.PORT+'/api/active_members')
    //     .then(function(response){
    //         res.render('dashboard',{users:response.data})
    //         //console.log(response.data);
    //     })
    //     .catch(err=>{
    //         res.send(err);
    //     });
    // }

    
}

exports.viewmember = (req,res,next) => {
    if(req.query.id){
        axios.get(process.env.URL+process.env.PORT+'/api/members?id='+req.query.id)
        .then(function(response){
            if(!lodash.isEmpty(response.data)){
                res.render('viewmember',{user:response.data[0]});
            }else{
                res.send("can't get user");
            }
            
            
        })
        .catch(err=>{
            res.send(err);
        });
        // console.log(req.query.id);
        // res.status(200).redirect('/dashboard');
        
    }else{
        res.status(404).redirect('/dashboard');
    }
}

exports.createBuilding = (req,res) => {
    res.render('create_building');
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

exports.createLocation = (req,res) => {
    axios.get(process.env.URL+process.env.PORT+'/api/building')
    .then(function(response){
        console.log(response.data[0]._id);
        res.render('create_location',{buildings:response.data});
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
    });
}

exports.location = (req,res) => {
    axios.get(process.env.URL+process.env.PORT+'/api/locations')
    .then(function(response){
        res.render('locations',{locations:response.data});
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


exports.createClass = (req,res) => {
    axios.get(process.env.URL+process.env.PORT+'/api/buildings')
    .then(function(response){
        
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
    });
    res.render('create_location',{buildings:response.data});
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
