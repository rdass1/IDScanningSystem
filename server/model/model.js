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

const notesObj = {
    _id: false,
    madeBy: String,
    date: {
        type: Date,
        default: Date
    },
    message: String
};

const userClassObjID = {
    type: mongoose.ObjectId,
    unique: true
}



const userSchema = new mongoose.Schema({
    cardID: {
        type: String,
        index: true,
        unique: true
    },
    MRNum: String,
    role : String,
    firstName: String,
    middleName: String,
    lastName: String,
    DOB: Date,
    gender: String,
    pronoun: String,
    regDate: {
        type: String,
        default: Date
    },
    address: {
        street: String,
        aptSuite: String,
        city: String,
        state: String,
        zipCode: Number
    },
    phone: Number,
    notes: [notesObj],
    classes: [userClassObjID],
    status: {
        active: Boolean,
        flag: Boolean,
        locationObjID: {
            type:mongoose.ObjectId,
        },
        buildingObjID: {
            type:mongoose.ObjectId,
        }
    }

},{ collection : 'memberInfo'});

const logsObj = {
    date: Date,
    locationObjID: {
        type:mongoose.ObjectId,
        default: "No-location"
    },
    buildingObjID: {
        type:mongoose.ObjectId,
        default: "No-Building"
    },
    timeIn: Date,
    timeOut: Date,
    hours: Number,

};

const facilityUsageSchema = new mongoose.Schema({
    userObjID: mongoose.ObjectId,
    logs: [logsObj]
},{ collection : 'facilityUsage' });

const locationsSchema = new mongoose.Schema({
    buildingObjID: mongoose.ObjectId,
    name: String,
    roomNumber: String,
    floorNumber: String
},{ collection : 'locations' });

const buildingsSchema = new mongoose.Schema({
    name: String,
    company: String,
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: Number
    }, 
},{ collection : 'buildings'});

const classesSchema = new mongoose.Schema({
    name: String,
    teacher: String,
    subject: String,
    locationObjID: mongoose.ObjectId,
    buildingObjID: mongoose.ObjectId,
    startTime: Date,
    endTime: Date
},{ collection : 'classes'});


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
const userDB2 = mongoose.model('member',userSchema);
// const facilityUsageDB = mongoose.model('',facilityUsageSchema);
// const locationsDB = mongoose.model('',locationsSchema);
// const buildingsDB = mongoose.model('',buildingsSchema);
// const classesDB = mongoose.model('',classesSchema);
// ,facilityUsageDB,locationsDB,buildingsDB,classesDB
// exports.userDB2= userDB2;
exports.userDB = userDB2;

