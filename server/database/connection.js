const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
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

