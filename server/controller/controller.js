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
        models.userDB.aggregate([
            {
                $match:{
                    cardID : req.query.id
                }
            },
            {
                $lookup:{
                    from: "facilityUsage",
                    localField: "_id",
                    foreignField: "userObjID",
                    as: "logs"
                }
            },
            {
                $lookup:{
                    from: "memberClasses",
                    localField: "_id",
                    foreignField: "userObjID",
                    as: "classesList",
                    
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
    userDB.find({'status.active':'true'},null,{
        sort: {
            "status.updatedAt": -1
        },
    })
    .then(user=>{
        res.send(user);
    }).catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
    })
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
        res.status(201).redirect('/facilities');
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
        models.buildingsDB.aggregate([
            {
                $lookup:{
                    from: "locations",
                    localField: "_id",
                    foreignField: "buildingObjID",
                    as: "locations"
                }
            }
        ])
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
    
}

exports.deleteBuilding = (req,res) => {
    //console.log(req.params.id);
    if(req.params.id){
        models.buildingsDB.deleteOne({_id:req.params.id})
        .then(data=>{
            models.locationsDB.deleteMany({buildingObjID:req.params.id}).then(data=>{
                res.status(200).redirect('/facilities');
            })
            .catch(err=>{
                res.status(500).send({message:err.message || "Error occurred while trying to delete data"});
            })
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
        console.log(data);
        res.status(201).redirect('/facilities');
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

//Classes
exports.findClasses = (req,res)=>{
    if(req.query.name){
        models.classesDB.find({name:req.query.name})
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }else{
        // models.classesDB.find()
        // .then(data => {
        //     res.send(data);
        // })
        // .catch(err=>{
        //     res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        // })

        models.classesDB.aggregate([
            {
                $lookup:{
                    from: "locations",
                    localField: "locationObjID",
                    foreignField: "_id",
                    as: "location"
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
    }
    
}

exports.createClass = (req,res) => {
    let tConvert = (time) => {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
    }
    let newStartTime = tConvert(req.body.startTime);
    let newEndTime = tConvert(req.body.endTime);
    const classes = models.classesDB({
        name: req.body.name,
        teacher: req.body.teacher,
        subject: req.body.subject,
        locationObjID: req.body.location,
        buildingObjID: req.body.building,
        startTime: newStartTime,
        endTime: newEndTime
    });
    classes.save(classes)
    .then(data=>{
        res.status(201).redirect('/classes');
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying save data"});
    })
}

exports.deleteClass = (req,res) => {
    //console.log(req.params.id);
    if(req.params.id){
        models.classesDB.deleteOne({_id:req.params.id})
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

exports.findLogs = (req,res) => {
    if(req.query.name){
        models.facilityUsageDB.find({name:req.query.name},null,{
            sort: {
                "timeIn": -1
            },
        })
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }else{
        models.facilityUsageDB.find()
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        })
    }
}

exports.deleteLogs = (req,res) => {
    
}