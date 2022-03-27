const {userDB2} = require('./server/model/model.js');

function test(){
    console.log('testing some stuff');
    
    const user = new userDB2({
        cardID: "AB"+parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(10).toString().replace(".", "")),
        MRNum: "2021-202",
        role: "Employee",
        firstName: "Rishon",
        middleName: "Noel",
        lastName: "Dass",
        DOB: new Date('12/31/2001'),
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
    user.save(user)
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