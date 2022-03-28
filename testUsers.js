const users = [
    {
        cardID: '',
        MRNum: '',
        role: '',
        firstName : 'test',
        middleName: '',
        lastName : '',
        DOB: '',
        gender: '',
        pronoun: '',
        regDate: '',
        address: {
            address: '',
            city: '',
            state: '',
            zipCode: ''
        },
        phone: '',
        notes: [
            {
                madeBy: '',
                date: '',
                message: ''
            }
        ],
        classes: ['classObjID'],
        status: {
            active: '',
            flag: '',
            locationObjID: '',
            buildingObjID: ''
        }
    }
];

const facilityUsage = [
    {
        userObjID: '',
        logs: [
            {
                date: '',
                locationObjID: '',
                buildingObjID: '',
                timeIn: '',
                timeOut: '',
                hours: '',

            }
        ]

        
    }
];

const locations = [
    {
        buildingObjID: '',
        name : '',
        roomNumber: '',
        floorNumber: ''
    }
];

const buildings = [
    {
        name: '',
        company: '',
        address: {
            address: '',
            city: '',
            state: '',
            zipCode: ''
        }
    }
];

const classes = [
    {
        name: '',
        teacher: '',
        subject: '',
        locationObjID: '',
        buildingObjID: '',
        startTime: '',
        endTime: '',
    }
];



var test = [classObjID= {
        var1: "testing"
    },
    
]

console.log(test[0]);
console.log(new Date('11:30 am'));

const test = db.buildings.aggregate([
    {
        
        $lookup:{
            from: "locations",
            localField: "_id",
            foreignField: "buildingObjID",
            as: "locations"
        }
    },
    {
        $project: {
            __v: 0,
            "locations.buildingObjID": 0,

        }
    }
]).pretty();

const test2 = db.classes.aggregate([
    {
        $lookup:{
            from: "locations",
            localField: "locationObjID",
            foreignField: "_id",
            as: "locations"
        }
    },
    {
        $lookup:{
            from: "buildings",
            localField: "buildingObjID",
            foreignField: "_id",
            as: "buildings"
        }
    },
    {
        $project:{
            __v : 0,
            "locations.__v":0,
            "buildings.__v":0
        }
    }
]).pretty();

const test3 = db.classes.aggregate([
    {
        $lookup:{
            from: "locations",
            localField: "locationObjID",
            foreignField: "_id",
            as: "locations"
        }
    },
    {
        $lookup:{
            from: "buildings",
            localField: "buildingObjID",
            foreignField: "_id",
            as: "buildings"
        }
    },
    {
        $project:{
            __v : 0,
            "locations.__v":0,
            "buildings.__v":0
        }
    }
]).pretty()


