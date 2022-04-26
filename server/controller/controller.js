const {userDB} = require('../model/model.js');
const models = require('../model/model');


//create and save new user

exports.create = (req,res)=>{
    const user = models.userDB({
        cardID: "AB"+parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(10).toString().replace(".", "")),
        MRNum: req.body.mrNum,
        role: req.body.role,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        DOB: req.body.dob,
        gender: req.body.gender,
        pronoun: req.body.pronoun,
        address: {
            street: req.body.street,
            aptSuite: req.body.aptSuite,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode
        },
        phone: req.body.phone,
        email: req.body.email,
        notes: "",
        status: {
            active: false,
            flag: false
        }
    });

    user.save(user)
    .then(data=>{
        res.status(201).redirect('/members');
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying save data"});
    })
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
                    pipeline: [
                        {
                            $sort : {
                                timeIn : -1
                            }
                        }
                    ],
                    as: "logs"
                }
            },
            {
                $lookup:{
                    from: "memberClasses",
                    let: {userid : "$_id"},
                    pipeline : [
                        {
                            $match : {
                                $expr: {
                                    $eq:["$userObjID","$$userid"]
                                }
                            }
                        },
                        {
                            $lookup : {
                                from: "classes",
                                let: {classesid: "$classObjID"},
                                pipeline:[
                                    {
                                        $match : {
                                            $expr: {
                                                $eq:["$_id","$$classesid"]
                                            }
                                        }
                                        
                                    }
                                ],
                                as: "classInfo"
                            }
                        },
                        {
                            $unwind : "$classInfo"
                        }
                    ],
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

exports.updateUser = (req, res) => {
    if(req.params.id){
        models.userDB.updateOne({_id:req.params.id},{
            MRNum: req.body.mrNum,
            role: req.body.role,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            DOB: req.body.dob,
            gender: req.body.gender,
            pronoun: req.body.pronoun,
            address: {
                street: req.body.street,
                aptSuite: req.body.aptSuite,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode
            },
            phone: req.body.phone,
            email: req.body.email,
        })
        .then(data => {
            res.status(200).redirect('/members/view?id='+req.body.cardID);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to delete data"});
        });
    }else{
        res.sendStatus(400);
    }
}

exports.updateUserNotes = (req,res) => {
    if(req.params.id){
        
        if(req.body.notes != ""){
            let result = '';
            let lines= req.body.notes.split("\n");
            for(var i=0; i<lines.length; i++){
                if(i==0){
                result += "" + lines[i].trim();  
                }
                else if(lines[i].startsWith(" ")){
                    result += " " + lines[i].trim();  
                  }else{
                result += "\\n" + lines[i].trim();  
                }    
            }
            models.userDB.updateOne({_id:req.params.id},{
                notes: result
            })
            .then(data => {
                res.status(200).redirect('/members/view?id='+req.body.cardID);
            })
            .catch(err=>{
                res.status(500).send({message:err.message || "Error occurred while trying to save data"});
            });
        }else{
            models.userDB.updateOne({_id:req.params.id},{
                notes: ""
            })
            .then(data => {
                res.status(200).redirect('/members/view?id='+req.body.cardID);
            })
            .catch(err=>{
                res.status(500).send({message:err.message || "Error occurred while trying to save data"});
            });
        }
        
        
    }else{
        res.sendStatus(400);
    }
}
exports.deleteUser = (req, res) => {
    
    if(req.params.id){
        models.userDB.deleteOne({_id:req.params.id})
        .then(data=>{

            res.status(200).redirect('/members');
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to delete data"});
        });
    }else{
        res.sendStatus(400);
    }
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
        models.classesDB.find()
        .then(data => {
            console.log('RETRIEVE CLASSES')
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        })

        // models.classesDB.aggregate([
        //     {
        //         $lookup:{
        //             from: "locations",
        //             localField: "locationObjID",
        //             foreignField: "_id",
        //             as: "location"
        //         }
                
        //     },
        //     {
        //         $lookup:{
        //             from: "buildings",
        //             localField: "buildingObjID",
        //             foreignField: "_id",
        //             as: "building"
        //         }
                
        //     }
        // ])
        // .then(data => {
        //     res.send(data);
        // })
        // .catch(err=>{
        //     res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        // });
    }
    
}

exports.createClass = (req,res) => {
    let tConvert = (time) => {
        // Check correct time format and split into components
        time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
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

exports.createUserClass = (req,res) => {
    const classes = models.userClassesDB({
        userObjID: req.body.id,
        classObjID: req.body.classObjID,
    });
    classes.save(classes)
    .then(data=>{
        console.log(data);
        res.status(201).redirect('/members/view?id='+req.body.cardID);
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying save data"});
    })
}

exports.deleteUserClass = (req,res) => {
    console.log(req.params.id);
    if(req.params.id){
        models.userClassesDB.deleteOne({_id:req.params.id})
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
        models.facilityUsageDB.find(null,null,{
            sort: {
                "timeIn": -1
            },
        })
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