const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
var gfs;
const connectDB = async ()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        // con.once('open', () =>{
        //     gfs = Grid(con.db, mongoose.mongo);
        //     gfs.collection('memberImages');
        // });
        console.log(`MongoDB connected: ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;
exports.gfs = gfs;