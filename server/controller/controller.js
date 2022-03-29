const {userDB} = require('../model/model.js');
const models = require('../model/model');


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
        res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
    })
}


//Classes Controller
exports.createClass = (req, res) => {

}

//Buildings Controller
exports.createBuilding = (req,res)=>{
    const building = models.buildingsDB({
        name: req.body.name,
        company: req.body.company,
        address: {
            street: req.body.street,
            aptSuite: req.body.aptSuite,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode

        }
    });

    building.save(building)
    .then(data=>{
        console.log(data);
        res.status(201).redirect('/buildings');
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying save data"});
    })
}

exports.findBuilding = (req,res)=>{
    if(req.query.name){
        models.buildingsDB.find({name:req.query.name})
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }else{
        models.buildingsDB.find()
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        })
    }
    
}

exports.deleteBuilding = (req,res) => {
    //console.log(req.params.id);
    if(req.params.id){
        models.buildingsDB.deleteOne({_id:req.params.id})
        .then(data=>{
            res.sendStatus(200);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to delete data"});
        })
    }else{
        res.sendStatus(400);
    }
}

exports.findLocation = (req,res) => {
    if(req.query.name){
        models.locationsDB.aggregate([
            {
                $match:{
                    name : req.query.name
                }
            },
            {
                $lookup:{
                    from: "buildings",
                    localField: "buildingObjID",
                    foreignField: "_id",
                    as: "building"
                }
            }
        ])
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }else{
        models.locationsDB.aggregate([
            {
                $lookup:{
                    from: "buildings",
                    localField: "buildingObjID",
                    foreignField: "_id",
                    as: "building"
                }
            },
            {
                $unwind: "$building"
            }
        ])
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        })
    }
}

exports.createLocation = (req,res) => {
    const location = models.locationsDB({
        buildingObjID: req.body.building,
        name: req.body.name,
        roomNumber: req.body.roomNumber,
        floorNumber: req.body.floorNumber
    })
    location.save(location)
    .then(data=>{
        res.status(201).redirect('/locations');
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying save data"});
    })
}

exports.deleteLocation = (req,res) => {
    //console.log(req.params.id);
    if(req.params.id){
        models.locationsDB.deleteOne({_id:req.params.id})
        .then(data=>{
            res.sendStatus(200);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to delete data"});
        })
    }else{
        res.sendStatus(400);
    }
}