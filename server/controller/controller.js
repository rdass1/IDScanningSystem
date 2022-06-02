const {userDB} = require('../model/model.js');
const models = require('../model/model');
const gfs = require('../database/connection');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const {spawn} = require('child_process');
const moment = require('moment')
const bcrypt = require('bcrypt');
//create and save new user

exports.create = (req,res,next)=>{
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
        },
        regDate: moment().format()
    });

    user.save(user)
    .then(async data=>{
        if(data.role == "Employee" || data.role == "Admin"){
            let username = data.firstName.substring(0,1).toLowerCase()+data.lastName.toLowerCase();
        let password = data.firstName.substring(0,1).toLowerCase()+data.lastName.toLowerCase();
        if(req.body.employeeLoginUsername){
            username = req.body.employeeLoginUsername;
        }
        if(req.body.employeeLoginPassword){
            password = req.body.employeeLoginPassword;
        }

        const employeeLogin = models.employeeLoginDB({
            userObjID: data._id,
            username: username,
            password: await bcrypt.hash(password,10),
            role: data.role,
        });

        employeeLogin.save(employeeLogin)
        .then(data=>{
            res.status(201).redirect('/members');
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying save data"});
        })
        }else{
            res.status(201).redirect('/members');
        }
        
        

        
    })
    .catch(err=>{
        res.status(500).send({message:err.message || "Error occurred while trying save data"});
    })
}

exports.downloadImage = (req,res) => {
    if(req.params.id){
        const fileName = new mongoose.Types.ObjectId(req.params.id);
        console.log(fileName);
        gfs.gfs.find({fileName}).toArray((err,files)=>{
            if(files.length != 0){
                files.forEach((file)=>{ 
                    let _id = new mongoose.Types.ObjectId(file._id)
                    gfs.gfs.openDownloadStream(_id).pipe(fs.createWriteStream('./memberImages/'+file.filename+".png"));
                });
            }else{
                console.log('NO FILES FOUND')
            }
        });
        res.status(200).redirect('/members/view?id='+req.params.cardID);

    }else{
        res.sendStatus(400);
    }
    
}

exports.createID = (req,res) =>{
    if(req.body.id){
        const date = moment().format();
        const newID = "AB"+parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(10).toString().replace(".", ""))
        models.userDB.findOneAndUpdate({_id:req.body.id},{
            cardID: newID,
            cardIDData:{
                ISS : date,
                heightFT : req.body.memberHeightFT,
                heightIN: req.body.memberHeightIN,
                eyeColor: req.body.memberEyeColor,
                hairColor: req.body.memberHairColor
            }
        })
        .then(data => {
            data.cardID = newID,
            data.cardIDData = {
                ISS : date,
                heightFT : req.body.memberHeightFT,
                heightIN: req.body.memberHeightIN,
                eyeColor: req.body.memberEyeColor,
                hairColor: req.body.memberHairColor
            }
            //console.log(data);
            const idCreator = spawn('python',['./server/idCreator/idcreator.py', JSON.stringify(data)]);
            
            idCreator.stdout.on('data',(data)=>{
                console.log(`stdout: ${data}`);
            });

            // idCreator.stderr.on('data',(data)=>{
            //     console.error(`stderr: ${data}`);
            // })

            idCreator.on('close',(data)=>{
                const path = `./server/memberImages/${req.body.id}.png`
                fs.unlink(path, (err)=>{
                    if(err){
                        console.error(err)
                        return
                    }
                    console.log("Member image removed");
                })
            });
            res.status(200).redirect('/members/view?id='+newID);
           
            
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to update data"});
        });
    }else{
        res.sendStatus(400);
    }
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
                    from: "employeeLogin",
                    localField: "_id",
                    foreignField: "userObjID",
                    as: "loginInfo"
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
    }
    else if(req.query.cardID){
        models.userDB.aggregate([
            {
              $search: {
                "autocomplete": {
                    "query": req.query.cardID,
                    "path": "cardID",
                    
        
                }
              }
            },
          ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
    else if(req.query.mrnum){
        models.userDB.aggregate([
            {
              $search: {
                "autocomplete": {
                    "query": req.query.mrnum,
                    "path": "MRNum",
                    
        
                }
              }
            },
          ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });

    }
    else if(req.query.name){
        const name = req.query.name.split(' ');
        var params = [
            {
                "autocomplete": {
                    "query":name[0],
                    "path": 'firstName',
                },
            },
            {
                "autocomplete": {
                    "query":name[0],
                    "path": 'lastName',
                },
            },
        ];
        if(name[1]){
            params = [
                {
                    "autocomplete": {
                        "query":name[0],
                        "path": 'firstName',
                    },
                },
                {
                    "autocomplete": {
                        "query":name[1],
                        "path": 'lastName',
                    },
                },
                
            ]
        }
        models.userDB.aggregate([
            {
              $search: {
                "compound": {
                    "should": params,
                },
              }
            },
          ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
    else{
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
            models.facilityUsageDB.deleteMany({userObjID:req.params.id})
            .then(data=>{
                models.userClassesDB.deleteMany({userObjID:req.params.id})
                .then(data=>{
                    models.employeeLoginDB.deleteOne({userObjID:req.params.id})
                    .then(data=>{
                    })
                    const filename = new mongoose.Types.ObjectId(req.params.id);
                    gfs.gfs.find({filename}).toArray((err,files)=>{
                        if(files.length != 0){
                            console.log('FILES FOUND AND ARE GETTING DELETED!');
                            files.forEach((file)=>{
                                //console.log(file._id);
                                let _id =  new mongoose.Types.ObjectId(file._id);
                                gfs.gfs.delete(_id);
                            })
                            
                            
                        }
                    });
                    const path = `./server/memberIDImages/${req.params.id}-front.png`;
                    const path2 = `./server/memberIDImages/${req.params.id}-back.png`;
                    fs.unlink(path, (err)=>{
                        if(err){
                        }
                    });
                    fs.unlink(path2, (err)=>{
                        if(err){
                        }
                    });
                    res.status(200).redirect('/members');
                })
                .catch(err=>{
                    res.status(500).send({message:err.message || "Error occurred while trying to delete data"});
                });
            })
            .catch(err=>{
                res.status(500).send({message:err.message || "Error occurred while trying to delete data"});
            });
            
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to delete data"});
        });
    }else{
        res.sendStatus(400);
    }
}

exports.userFlag = (req,res) => {
    
    if(req.params.id){
        let status = {
            "status.flag" : true,
            "status.updatedAt": Date.now()
        };
        if(req.params.flag == "false"){
            status = {
                "status.flag" : false,
            }
        }
        models.userDB.updateOne({_id:req.params.id},status)
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
                models.userClassesDB.deleteMany({classObjID:req.params.id})
                .then(data=>{
                    res.sendStatus(200);
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

exports.userClasses = (req,res) => {
    if(req.params.id){
        models.userClassesDB.aggregate([
            {
                $match: {
                    userObjID:req.params.id
                }
            },
            {
                $lookup : {
                    from: "classes",
                    localField: "classObjID",
                    foreignField: "_id",
                    as: "classInfo"
                }
            }
        ])
        .then(data=>{
            console.log(data)
            res.status(200).send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to get data"});
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
    if(req.query.id && req.query.location && req.query.date){
        models.facilityUsageDB.aggregate([
            {
              $search: {
                "autocomplete": {
                    "query": req.query.location,
                    "path": "locationBuilding",
                    
        
                }
              }
            },
            {
                $match : {
                    date : req.query.date,
                    userObjID : new mongoose.Types.ObjectId(req.query.id),
                }
            },
            {
                $sort: {
                    "timeIn": -1
                }
            },
          ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
    else if(req.query.id && req.query.date){
        models.facilityUsageDB.aggregate([
            {
                $match : {
                    date : req.query.date,
                    userObjID : new mongoose.Types.ObjectId(req.query.id),
                }
            },
            {
                $sort: {
                    "timeIn": -1
                }
            },
            {
                $limit: 100
            },
          ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
    else if(req.query.id && req.query.location){
        models.facilityUsageDB.aggregate([
            {
              $search: {
                "autocomplete": {
                    "query": req.query.location,
                    "path": "locationBuilding",
                    
        
                }
              }
            },
            {
                $match : {
                    userObjID : new mongoose.Types.ObjectId(req.query.id),
                }
            },
            {
                $sort: {
                    "timeIn": -1
                }
            },
            {
                $limit: 100
            },
          ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
    else if(req.query.id){
        models.facilityUsageDB.aggregate([
            {
                $match : {
                    userObjID : new mongoose.Types.ObjectId(req.query.id),
                }
            },
            {
                $sort: {
                    "timeIn": -1
                }
            },
            {
                $limit: 100
            },
        ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        })
    }
    else if(req.query.location && req.query.date){
        models.facilityUsageDB.aggregate([
            {
              $search: {
                "autocomplete": {
                    "query": req.query.location,
                    "path": "locationBuilding",
                    
        
                }
              }
            },
            {
                $match : {
                    date : req.query.date
                }
            },
            {
                $sort: {
                    "timeIn": -1
                }
            },
          ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
    else if(req.query.date){
        models.facilityUsageDB.aggregate([
            {
                $match : {
                    date : req.query.date
                }
            },
            {
                $sort: {
                    "timeIn": -1
                }
            },
            {
                $limit: 100
            },
          ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
    else if(req.query.location){
        models.facilityUsageDB.aggregate([
            {
              $search: {
                "autocomplete": {
                    "query": req.query.location,
                    "path": "locationBuilding",
                    
        
                }
              }
            },
            {
                $sort: {
                    "timeIn": -1
                }
            },
            {
                $limit: 100
            },
          ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
    else{
        models.facilityUsageDB.aggregate([
            {
                $sort: {
                    "timeIn": -1
                }
            },
            {
                $limit: 100
            },
        ]).then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        })
    }
}

exports.deleteLogs = (req,res) => {
    if(req.params.id){
        models.facilityUsageDB.deleteOne({_id:req.params.id})
        .then(data=>{
            console.log(data)
            res.sendStatus(200);
        })
        .catch(err=>{
            console.log(err.message)
            res.status(500).send({message:err.message || "Error occurred while trying to delete data"});
        })
    }else{
        res.sendStatus(400);
    }
}

//Employee Login
exports.employeeLoginInfo = (req,res) => {
    if(req.query.id){
        models.employeeLoginDB.findOne({_id: req.query.id})
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }else{
        models.employeeLoginDB.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({message:err.message || "Error occurred while trying to retrieve data"});
        });
    }
}

exports.employeeLoginEdit = async (req,res) => {
    console.log(req.body.employeeUserName + ", " + req.body.employeePassword);
    console.log(req.user);
    let formUsername = req.body.employeeUserName;
    let formPassword = req.body.employeePassword;
    let formPrevPassword, memberUsername, memberPassword = "";
    if(req.body.employeePrevPassword){
        formPrevPassword = req.body.employeePrevPassword;
    }
    if(req.body.memberUsername){
        memberUsername = req.body.memberUsername;
    }

    if(req.body.memberPassword){
        memberPassword = req.body.memberPassword;
    }

    if(formUsername == memberUsername && await bcrypt.compare(formPassword,memberPassword)){
        res.redirect('/members/view?id='+req.body.userCardID);
    }else{
        if(req.user.role == "Admin" && formUsername != "" && formPassword != ""){
            models.employeeLoginDB.updateOne({userObjID: req.body.userObjID},{
                        $set: {
                            "username" : formUsername,
                            "password" : await bcrypt.hash(formPassword,10),
                            "role" : req.body.userRole,
                        }
                    },
                    {upsert: true}
                    )
                    .then((data)=>{
                        console.log(data);
                        res.redirect('/members/view?id='+req.body.userCardID);
                    })
                    .catch((err)=>{
                        res.status(400).send({message:err.message || "Error occurred while trying to save data"});
                    })
        }else{
            res.sendStatus(403);
        }
    }
}

exports.ownLoginEdit = async (req,res) => {
    let formUsername = req.body.employeeUserName;
    let formPassword = req.body.employeePassword;
    let formPrevPassword = req.body.employeePrevPassword;
    
    if(formUsername != "" && formPassword != "" && await bcrypt.compare(formPrevPassword, req.user.password)){
        models.employeeLoginDB.updateOne({userObjID: req.body.userObjID},{
            $set: {
                "username" : formUsername,
                "password" : await bcrypt.hash(formPassword,10),
                "role" : req.body.userRole
            }
        }
        )
        .then((data)=>{
            res.sendStatus(200);
        })
        .catch((err)=>{
            res.status(500).send({message:err.message || "Error occurred while trying to save data"});
        })
    }else{
        res.sendStatus(403);
        //res.redirect('/members/view?id='+req.body.userCardID,{message:"Incorrect password, please try again or contact an administrator"});
    }
}
