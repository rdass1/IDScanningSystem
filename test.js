const db = require('./server/model/model.js');

function test(){
    console.log('testing some stuff');
    
    const user = new db.userDB({
        cardID: "AB"+parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(10).toString().replace(".", "")),
        MRNum: "2021-600",
        role: "Employee",
        firstName: "John",
        middleName: "",
        lastName: "Doe",
        DOB: new Date('11/02/2000'),
        gender: "male",
        pronoun: "He/Him",
        address: {
            address: "3140 South Michigan Avenue",
            aptSuite: "304",
            city: "Chicago",
            state: "IL",
            zipCode: 60504
        },
        phone: 6304871255,
        notes: [{
            madeBy: "Dan H.",
            message: "This is a test to see how the database setup is going"
        }],
        classes: [],
        status: {
            active: false,
            flag: false
        }
    });

    const classes = new db.classesDB({
        name: "Music 304",
        teacher: "John Smith",
        subject: "Music",
        locationObjID: "624149cc8804f09323a10238",
        buildingObjID: "624148ef0da4f2e606e015f8",
        startTime: "1:30 pm",
        endTime: "2:30 pm"
    });

    const buildings = new db.buildingsDB({
        name: 'Food Center',
        company: "Franciscan Outreach",
        address: {
            street: "2715 W Harrison St",
            aptSuite: "",
            city: "Chicago",
            state: "IL",
            zipCode: 60612

        }

    });

    const locations = new db.locationsDB({
        buildingObjID: "62414db41b3d01624c0701f8",
        name: "Commons",
        roomNumber: "36",
        floorNumber: "2"
    });

    const facilityUsage = new db.facilityUsageDB({
        userObjID : "624004e77e3b5f7849f7f36c",
        locationObjID: "624149cc8804f09323a10238",
        buildingObjID: "624148ef0da4f2e606e015f8",
        timeIn: Date.now()
    });

    const userClasses = new db.userClassesDB({
        userObjID: "624004e77e3b5f7849f7f36c",
        classObjID: "6265ce45a9cc1c803bf76cc2"
    }); 
    userClasses.save(userClasses)
    .then(data =>{
        console.log('saved sucessfully');
        console.log(data);
    })
    .catch(err=>{
        console.log("There was an error");
        console.log(err);
    });
    
}

module.exports = test;