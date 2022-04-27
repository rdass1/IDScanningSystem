const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { createReadStream } = require('fs'); //remove
const { createModel } = require('mongoose-gridfs'); //remove
const fs = require('fs')

const connectDB = async ()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(()=>{
            let gfs;
            gfs = new mongoose.mongo.GridFSBucket(mongoose.connections[0].db,{bucketName:"memberImages"});
            console.log(`MongoDB connected: ${mongoose.connection.host}`);

            gfs.find({}).toArray((err,files)=>{
                if(files.length != 0){
                    files.forEach((file)=>{ 
                        let _id = new mongoose.Types.ObjectId(file._id)
                        gfs.openDownloadStream(_id).pipe(fs.createWriteStream('./memberImages/'+file.filename+".png"));
                    });
                }
            });
            exports.gfs = gfs;
            


            
        })
        // const con2 = mongoose.createConnection(process.env.MONGO_URL);
        // con2.once('open', function () {
        //     let gfs = Grid(con2.db, mongoose.mongo);
        //     gfs.collection('memberImages');
        //     // // gfs.files.find().toArray((err,files) =>{
        //     // //     if(!files || files.length == 0){
        //     // //         return res.status(404).json({
        //     // //             err:"No files exist"
        //     // //         })
        //     // //     }
        //     // //     console.log(files);
        //     // // });
        //     var readStream = gfs.createReadStream({_id:"6268c5d700361fa09626a7d7"})
        //     exports.gfs = gfs;

        //   })
        
       
        
       
        
        
    }catch(err){
        console.log(err);
        process.exit(1);
    }
    
}



exports.connectDB = connectDB;

