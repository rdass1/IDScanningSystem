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
    email: String,
    phone: Number,
    notes: [notesObj],
    classes: [userClassObjID],
    status: {
        active: Boolean,
        flag: Boolean,
        updatedAt: Date,
        locationObjID: {
            type:mongoose.ObjectId,
        },
        buildingObjID: {
            type:mongoose.ObjectId,
        }
    }

},{ collection : 'memberInfo'});

const logsObj = {
    date: {
        type: Date,
        default: Date.now
    },
    locationObjID: {
        type:mongoose.ObjectId,
    },
    buildingObjID: {
        type:mongoose.ObjectId,
    },
    timeIn: Date,
    timeOut: Date,
    hours: Number,

};

const facilityUsageSchema = new mongoose.Schema({
    userObjID: mongoose.ObjectId,
    date: {
        type: String,
    },
    locationObjID: {
        type:mongoose.ObjectId,
    },
    buildingObjID: {
        type:mongoose.ObjectId,
    },
    timeIn: Date,
    timeOut: Date,
    hours: Number,
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
        aptSuite: String,
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
    startTime: String,
    endTime: String
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
const facilityUsageDB = mongoose.model('facilityUsage',facilityUsageSchema);
const locationsDB = mongoose.model('locations',locationsSchema);
const buildingsDB = mongoose.model('buildings',buildingsSchema);
const classesDB = mongoose.model('classes',classesSchema);
// ,facilityUsageDB,locationsDB,buildingsDB,classesDB
// exports.userDB2= userDB2;
exports.userDB = userDB2;
exports.facilityUsageDB = facilityUsageDB;
exports.locationsDB = locationsDB;
exports.buildingsDB = buildingsDB;
exports.classesDB = classesDB;


// $replaceRoot: { newRoot: { $mergeObjects: [ "$locations", "$$ROOT" ] } }

// {
//     $replaceRoot: { 
//         newRoot: { 
//             $mergeObjects: ["$$ROOT","$locations"]
//         }
//     }
// }



