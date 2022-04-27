const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const connectDB = async ()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const con2 = mongoose.createConnection(process.env.MONGO_URL);
        con2.once('open', function () {
            let gfs = Grid(con2.db, mongoose.mongo);
            gfs.collection('memberImages');
            // gfs.files.find().toArray((err,files) =>{
            //     if(!files || files.length == 0){
            //         return res.status(404).json({
            //             err:"No files exist"
            //         })
            //     }
            //     console.log(files);
            // });
            exports.gfs = gfs;
          })
        
        console.log(`MongoDB connected: ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}


exports.connectDB = connectDB;

