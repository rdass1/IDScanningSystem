const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const gfs = require('../database/connection');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path:'config.env'});
const crypto = require('crypto');




const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        

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
        
        return new Promise((resolve,reject) =>{
            crypto.randomBytes(16,(err,buff) =>{
                if(err){
                    return reject(err);
                }
                const filename = buff.toString('hex')+path.extname(file.originalname);
                const fileInfo = {
                    filename: new mongoose.Types.ObjectId(req.params.id),
                    bucketName: 'memberImages'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({storage});


module.exports = upload;
