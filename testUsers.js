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
console.log(new Date('12/31/2001').toDateString());

