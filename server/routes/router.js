const express = require('express');
const route = express.Router();
const passport = require('passport');
require('../middleware/passport-setup');
const services = require('../services/render.js');
const controller = require('../controller/controller.js');
const {userDB} = require('../model/model.js');
const upload = require('../middleware/multer');
const { runInContext } = require('lodash');
const mongoose = require('mongoose');
const gfs = require('../database/connection');
const fs = require('fs');



/**
 * @description Root Route
 * @method GET /
 */
 
route.get('/',services.index);





//Needs to be moved

const isLoggedIn = (req,res,next) =>{
    if(req.user){
        next();
    }else{
        res.status(401).send("Please log in first");
    }
}





//

route.get("/sse", (req,res) =>{
    res.set("Content-Type", "text/event-stream");
    res.set("Connection", "keep-alive");
    res.set("Cache-Control","no-cache");
    res.set("Access-Control-Allow-Origin", "*");
    console.log('client connected.');
    
    userDB.watch().
        on('change', data => {
        res.status(200).write(`data: update\n\n`);
        });
    // facilityUsageDB.watch().
    //     on('change', data => {
    //         res.status(200).write(`data: update\n\n`);
    //     })
    
});


route.get('/good', isLoggedIn, (req,res) =>{
    res.send(`Welcome ${req.user.displayName}!`);
});

route.get('/failed', (req,res) =>{
    res.send("failed login");
});

route.get('/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));



route.get('/login', services.login);

route.post('/login', 
  passport.authenticate('local',{
      successRedirect: "/dashboard",
      failureRedirect: "/login"
  }));
// route.post('/login', (req,res) => {
//     res.send(req.body);
// });

route.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/dashboard',
        failureRedirect: '/failed'
}));

route.get('/logout', (req,res)=>{
    req.logout();
    res.send('Logged OUt');
});

//Dashboard Routes

route.get('/dashboard',services.homeRoutes);



//Building Routes
route.get('/facilities',services.building);


//Classes Routes
route.get('/classes',services.classes);



//Logs Routes
route.get('/logs',services.logs);


//Members Routes
route.get('/members',services.allMembers);
route.get('/members/view',services.viewmember);


//Employee Login
route.get('/employee_management',services.employeeLoginManagement);





//Images Routes & ID Routes
route.post('/api/uploadMemberImage/:id/:cardID',upload.single('memberIDImage'),(req,res) =>{
    if(!req.params.id || req.params.id === 'undefined') return res.status(400).send('no image id');
    const filename = new mongoose.Types.ObjectId(req.params.id);
    gfs.gfs.find({filename}).toArray((err,files) =>{
        if(!files || files.length === 0){
            console.log('no images exist!');
        }else{
            const _id = new mongoose.Types.ObjectId(files[0]._id);
            console.log("downloading image!")
            gfs.gfs.openDownloadStream(_id).pipe(fs.createWriteStream('./server/memberImages/'+files[0].filename+".png"));
        }
        
    })
    controller.createID(req,res);
});

route.get('/api/downloadMemberImage/:id/:cardID',controller.downloadImage);

route.get('/api/getMemberImages/:id', ({params: id},res) => {
    if(!id || id === 'undefined') return res.status(400).send('no image id');
    const filename = new mongoose.Types.ObjectId(id);
    gfs.gfs.find({filename}).toArray((err,files) =>{
        if(!files || files.length === 0){
            return res.status(400).send('no files exist');
        }
        const _id = new mongoose.Types.ObjectId(files[0]._id);
        gfs.gfs.openDownloadStream(_id).pipe(res);
    })

})

route.get('/members/api/getMemberImages/:id', ({params: id},res) => {
    if(!id || id === 'undefined') return res.status(400).send('no image id');
    const filename = new mongoose.Types.ObjectId(id);
    gfs.gfs.find({filename}).toArray((err,files) =>{
        if(!files || files.length === 0){
            return res.status(400).send('no files exist');
        }
        const _id = new mongoose.Types.ObjectId(files[0]._id);
        //gfs.gfs.openDownloadStream(_id).pipe(fs.createWriteStream('./memberImages/'+files[0].filename+".png"));
        //console.log('downloaded IMage');
        gfs.gfs.openDownloadStream(_id).pipe(res);
    })

})

route.post('/api/getMemberIDCard/:id',({params:id},res)=>{
    let exists = true;
    setTimeout(()=>{
        const path = `./server/memberIDImages/${id.id}-front.png`;
        const path2 = `./server/memberIDImages/${id.id}-back.png`;
        fs.unlink(path, (err)=>{
            if(err){
                exists = false;
            }
        });
        fs.unlink(path2, (err)=>{
            if(err){
                exists = false;
            }
        });
        if(!exists){
            res.status(404).send({message:"You must create an ID before trying to print!"});
        }
    },5000);
        
})


//Member API
route.get('/api/memberSearch/:id')
route.post('/api/members',controller.create);
route.post('/api/members_edit/:id',upload.single('memberIDImage'),controller.updateUser);
route.post('/api/members_notes/:id',controller.updateUserNotes);
route.get('/api/members',controller.find);
route.get('/api/active_members',controller.activeMember);
route.post('/api/members_delete/:id',controller.deleteUser);

//Building API
route.get('/api/building',controller.findBuilding);
route.post('/api/create_building',controller.createBuilding);
route.delete('/api/building/:id',controller.deleteBuilding);

//Location API
route.get('/api/locations',controller.findLocation);
route.post('/api/create_location',controller.createLocation);
route.delete('/api/locations/:id',controller.deleteLocation);

//Classes API
route.get('/api/classes',controller.findClasses);
route.post('/api/create_class',controller.createClass);
route.delete('/api/classes/:id',controller.deleteClass);

//UserClasses API
route.get('/api/userClasses/:id',controller.userClasses);
route.post('/api/add_user_class',controller.createUserClass);
route.delete('/api/userClass/:id',controller.deleteUserClass);
route.post('/api/user_flag/:id/:flag',controller.userFlag);
//Logs API
route.get('/api/logs',controller.findLogs);
route.delete('/api/logs/:id',controller.deleteLogs);

//Employee Login API
route.get('/api/employeeLogin',controller.employeeLoginInfo);




//Classes API
// route.get('/api/classes',controller.findClass);
// route.post('/api/create_class',controller.createClass);
// route.delete('/api/classes/:id',controller.deleteClass);



module.exports = route;

route.get('*',(req,res) => {
   
    res.redirect("..");
})