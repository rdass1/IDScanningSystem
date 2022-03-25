const { default: axios } = require("axios")
const lodash = require('lodash');
const dotenv = require('dotenv');
dotenv.config({path:'config.env'});

exports.homeRoutes = (req,res)=>{
    if(req.query.active){
        axios.get(process.env.URL+process.env.PORT+'/api/active_members')
        .then(function(response){
            res.render('dashboard',{users:response.data})
        })
        .catch(err=>{
            res.send(err);
        });
    }else{
        axios.get(process.env.URL+process.env.PORT+'/api/members')
        .then(function(response){
            res.render('dashboard',{users:response.data})
            //console.log(response.data);
        })
        .catch(err=>{
            res.send(err);
        });
    }

    
}

exports.actives = (req, res) => {
    // if(!req.body){
    //     res.status(400).send({message:"Content cant be empty!"});
    //     return;
    // }
    // res.status(200).send();
    console.log(lodash.isEmpty(req.body));
    //console.log(req.body);
    res.redirect('/dashboard?active=true')
    
}

exports.index = (req, res) =>{
    res.render('index');
}
