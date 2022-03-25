const { default: axios } = require("axios")
const lodash = require('lodash');

exports.homeRoutes = (req,res)=>{
    if(req.query.active){
        axios.get('http://localhost:3000/api/active_members')
        .then(function(response){
            res.render('index',{users:response.data})
            console.log(response.data);
        })
        .catch(err=>{
            res.send(err);
        });
    }else{
        axios.get('http://localhost:3000/api/members')
        .then(function(response){
            res.render('index',{users:response.data})
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
