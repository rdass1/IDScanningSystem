const {userDB} = require('../model/model.js');


//create and save new user

exports.create = (req,res)=>{
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content cant be empty!"});
        return;
    }
    console.log(req.body);
}

exports.find = (req,res) =>{
    if(req.query.id){
        userDB.findOne({"cardID":req.query.id})
        .then(user =>{
            res.send(user);
        })
        .catch(err => {
            res.status(500).send({message:err.message || "Error occurred while trying to get data"});
        });
    }else{
        userDB.find()
        .then(user=>{
            res.send(user);
            // user.forEach(function(item,index){
            //     console.log(index+": "+ item.cardID+", "+item.firstName+","+item.address.get("0"));
            // });
            
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"})
        })
    }
    
}

exports.update = (req, res) => {

}

exports.delete = (req, res) => {

}

exports.login = (req, res) => {
    res.render('login.ejs');
}

exports.activeMember = (req,res) => {
    userDB.find({'status.active':'true'})
    .then(user=>{
        res.send(user);
    }).catch(err=>{
        res.status(500).send({message:err.message || "Error occured while trying to retrive data"})
    })
}