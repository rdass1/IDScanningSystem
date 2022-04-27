const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const gfs = require('../database/connection');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path:'config.env'});
const crypto = require('crypto');


const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        
        gfs.gfs.files.find({filename:req.params.id}).toArray((err,files) =>{
            if(files){
                console.log('file exists');
                gfs.gfs.remove({filename:req.params.id});
            }
            // console.log(files);
        });

        
        return new Promise((resolve,reject) =>{
            crypto.randomBytes(16,(err,buff) =>{
                if(err){
                    return reject(err);
                }
                const filename = buff.toString('hex')+path.extname(file.originalname);
                const fileInfo = {
                    filename: req.params.id,
                    bucketName: 'memberImages'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({storage});


module.exports = upload;
