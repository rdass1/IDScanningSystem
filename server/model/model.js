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
    active: Boolean,

}, 
    { collection : 'memberInfo' });   // collection name
//const userDB = mongoose.model('memberInfo', new mongoose.Schema({}));
const userDB = mongoose.model('', schema);

userDB.watch().
on('change', data => console.log(new Date(), data));

module.exports = userDB;