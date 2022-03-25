const mongoose = require('mongoose');

// var schema = new mongoose.Schema({
//     id:{
//         type: String,
//         required: true
//     },
//     firstName:{
//         type: String,
//         required: true
//     },
//     lastName:{
//         type: String,
//         required: true
//     },
//     status:{
//         type: String,
//         required: true
//     }
// });


var schema = new mongoose.Schema({
    cardID: String,
    firstName: String,
    lastName: String,
    address: Map,

}, 
    { collection : 'memberInfo' });   // collection name
//const userDB = mongoose.model('memberInfo', new mongoose.Schema({}));
const userDB = mongoose.model('', schema);

module.exports = userDB;