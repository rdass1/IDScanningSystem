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
    if(req.query.id){
        console.log(req.query.id);
    }
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

exports.actives = (req, res) => {
    // if(!req.body){
    //     res.status(400).send({message:"Content cant be empty!"});
    //     return;
    // }
    // res.status(200).send();
    console.log(lodash.isEmpty(req.body));
    //console.log(req.body);
    res.render('index');
    
}

exports.viewmember = (req,res,next) => {
    if(req.query.id){
        console.log(req.query.id);
        res.status(200).redirect('/dashboard');
        
    }else{
        res.status(404).redirect('/dashboard');
    }
}

exports.index = (req, res) =>{
    res.render('index');
}
