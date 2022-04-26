const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const gfs = require('../database/connection');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path:'config.env'});
const crypto = require('crypto');

let id = 0; let cardID = 0;
const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        return new Promise((resolve,reject) =>{
            crypto.randomBytes(16,(err,buff) =>{
                if(err){
                    return reject(err);
                }
                const filename = buff.toString('hex')+path.extname(file.originalname);
                const fileInfo = {
                    filename: cardID,
                    userOBjID: id,
                    bucketName: 'memberImages'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({storage},id,cardID);

module.exports = upload;
