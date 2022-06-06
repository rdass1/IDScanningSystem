
let userObj = null;
$(document).ready(function(){
   
});
$.ajax({
    "url":"/api/members?id="+userID,
    "method":"GET",
}).done(async function(data){
    userObj = data[0];
    try{
        userObj.loginInfo = userObj.loginInfo[0];
    }catch{

    }
    editLoginForm(userObj);
    displayUserData(userObj);
    $("#editForm").attr("action",`/api/members_edit/${userObj._id}`);
    editForm(userObj);
    $("#createIDCardForm").attr("action",`/api/uploadMemberImage/${userObj._id}/${userObj.cardID}`);
    idForm(userObj);
    addClassForm(userObj);
    if(userObj.status.flag){
    $("#flagBtn").html("Unflag");
    }else{
    $("#flagBtn").html("Flag");
    } 
})
.fail((err)=>{
console.log(err);
});

      




function displayUserData(user){
    if(user.phone==null){
        user.phone = "";
    }
    if(user.address.zipCode == null){
        user.address.zipCode = "";
    }
    let btnHtml = `
        <div class="mr-1 md:mr-4">
            <button id="id-modal" class="bg-sky-500 rounded text-white px-8 py-2" >Create ID</button>
        </div>
        <div class="mr-1 md:mr-4 ">
            <button id="downloadID"class="bg-indigo-500 rounded text-white px-8 py-2">Download ID</button>
            <!--<button id="id-print-btn" class="bg-indigo-500 rounded text-white px-8 py-2" >Print ID</button> -->
        </div>
        <div class="mr-1 md:mr-4">
            <button  class="bg-red-600 rounded text-white px-6 py-2" onclick="window.location.href='/members';">Back</button>
        </div>
    `;
    if((user.role == "Employee" && sessionUser.role == "Admin")){
        btnHtml= `
            <div class="mr-1 md:mr-4">
                <button id="editLoginModalBtn" class="bg-green-500 rounded text-white px-8 py-2" >Login</button>
            </div>
            <div class="mr-1 md:mr-4">
                <button id="id-modal" class="bg-sky-500 rounded text-white px-8 py-2" >Create ID</button>
            </div>
            <div class="mr-1 md:mr-4 ">
                <button id="id-print-btn" class="bg-indigo-500 rounded text-white px-8 py-2" >Print ID</button>
            </div>
            <div class="mr-1 md:mr-4">
                <button  class="bg-red-600 rounded text-white px-6 py-2" onclick="window.location.href='/members';">Back</button>
            </div>
        
        `
    }
    $("#BtnField").html(btnHtml);
    let displayHtml = `<div class="flex flex-col items-center">`;
      
    if(user.status.flag){
      displayHtml += `
      <div class="p-5 bg-rose-600">
          <img class="object-scale-down w-52 h-64" src="api/getMemberImages/${user._id}">
      </div>
      `
      
    }else{
      displayHtml += `
        <div class="p-5 bg-green-400">
          <img class="object-scale-down w-52 h-64" src="api/getMemberImages/${user._id}">
      </div>
      `
    }
  
    displayHtml += `
      <div class="p-2">
            `;
            if(user.role != "Admin" && user.role != "Employee" || sessionUser.role == "Admin"){
                 displayHtml += `
                 <button id="edit-modal" class="bg-green-500 text-white px-3 py-1 rounded">Edit</button>
                  `;
            }
            else if(user.loginInfo.username == sessionUser.username){
                displayHtml += `
                 <button id="edit-modal" class="bg-green-500 text-white px-3 py-1 rounded">Edit</button>
                  `;
            }
            if(user.role != "Employee" || sessionUser.role == "Admin"){
                displayHtml += `
                <button id="flagBtn" class="bg-amber-500 rounded text-white px-3 py-1">Flag</button>
                `;
              }
              if(user.role != "Employee" || sessionUser.role == "Admin" || user.loginInfo.username == sessionUser.username){
                displayHtml += `
                <button id="deleteUserBtn"data-id="${user._id}"class="bg-rose-600 rounded text-white px-3 py-1">Delete</button>
                `;
              }
              displayHtml += `
          </div>
        </div>
        <div class="grow w-full" style="background-color:#F8F8F8;">
          <table class="w-full h-full">
              <tbody class="h-full grid grid-rows-12 md:grid-rows-6 md:grid-flow-col">
                  <tr class="border-2 border-transparent border-b-gray-400 p-2">
                      <td>
                          Name:
                      </td>
                      <td class="text-center w-full">
                          ${user.lastName} , ${user.firstName} ${user.middleName}
                      </td>
                      
                  </tr>
                  <tr class="border-2 border-transparent border-b-gray-400 p-2">
                      <td>ID:</td>
                      <td class="text-center w-full"> ${user.cardID}</td>
                      
                  </tr>
                  <tr class="border-2 border-gray-50 border-b-gray-400 p-2 border-transparent">
                      <td>MR#:</td>
                      <td class="text-center w-full"> ${user.MRNum}</td>
                      
                  </tr>
                  <tr class="border-2 border-b-gray-400 p-2 border-transparent">
                      <td>Role:</td>
                      <td class="text-center w-full"> ${user.role}</td>
                      
                  </tr>
                  <tr class="border-2 border-b-gray-400 p-2 border-transparent">
                      <td>DOB:</td>
                      <td class="text-center w-full"> 
                          
    `
    if(user.DOB != null){
        let dob = new Date(Date.parse(user.DOB.substring(0,user.DOB.length-1)));
      displayHtml += `${dob.getUTCMonth()+1}/${dob.getDate()}/${dob.getFullYear()}`
                              
    }
    let regDate = new Date(Date.parse(user.regDate.substring(0,user.regDate.length-1)));

    displayHtml += `
    </td>
    </tr>
                  <tr class="border-2 border-b-gray-400 p-2 border-transparent">
                      <td>Gender:</td>
                      <td class="text-center w-full"> ${user.gender}</td>
                  </tr>
                  <tr class="border-2 border-b-gray-400 p-2 border-transparent">
                      <td>ProNoun:</td>
                      <td class="text-center w-full"> ${user.pronoun}</td>
                      
                  </tr>
                  <tr class="border-2 border-b-gray-400 p-2 border-transparent">
                      <td>Reg.Date:</td>
                      <td class="text-center w-full">
                          ${regDate.getUTCMonth()+1}/${regDate.getUTCDate()}/${regDate.getUTCFullYear()}
                      </td>
                  </tr>
                  <tr class="border-2 border-b-gray-400 p-2 border-transparent">
                      <td>Email:</td>
                      <td class="text-center w-full"> ${user.email}</td>
                  </tr>
                  <tr class="border-2 border-b-gray-400 p-2 border-transparent">
                      <td>Phone:</td>
                      <td class="text-center w-full"> ${user.phone}</td>
                  </tr>
                  <tr class="border-2 border-b-gray-400 p-2 border-transparent">
                      <td valign="top" class="">Address:</td>
                      <td class="text-center w-full">
      
    `
    if(user.address.street != ""){
      displayHtml += `${user.address.street}, ${user.address.aptSuite}, ${user.address.city}, ${user.address.state},  ${user.address.zipCode}`
    }
    displayHtml += `
      </td>
      </tr>
      </tbody>
      </table>
      </div>
    
    `
  
    $("#userInformation").html(displayHtml);
    startBtns();
  }
  
  function editForm(user){
      let dob = ""
    if(user.DOB){
        dob = new Date(Date.parse(user.DOB.substring(0,user.DOB.length-1))).toISOString().substring(0, 10);
        
    }
    let displayHtml = `
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Edit Member</h3>
                      <div class="overflow-y-scroll m-0" style="height:24rem">
                          <div>
                              <label for="memberIDImage" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Picture</label>
                              <input type="file" name="memberIDImage" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                          </div>
                          <div>
                              <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">First Name</label>
                              <input type="text" name="firstName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required value="${user.firstName}">
                          </div>
                          <div>
                              <label for="middleName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Middle Name</label>
                              <input type="text" name="middleName"class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.middleName}">
                          </div>
                          <div>
                              <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Last Name</label>
                              <input type="text" name="lastName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required value="${user.lastName}">
                          </div>
                          <div>
                              <label for="mrNum" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">MR#</label>
                              <input type="text" name="mrNum" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.MRNum}">
                          </div>
                          <div>
                            <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Role</label>
                            `;
                            if(user.role == "Employee" && sessionUser.role != "Admin"){
                                displayHtml += `
                                        <input name="role" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required value="${user.loginInfo.role}" readonly>
                                `;
                            }
                            else if(sessionUser.role == "Employee" && user.role != "Employee"){
                                displayHtml += `
                                <select id="memberAddRole" name="role" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
                                <option value="Patient">Patient</option>
                                <option value="Alumni">Alumni</option>
                                <option value="Volunteer">Volunteer</option>
                            </select>
                                `;
                            }else{
                                displayHtml += `
                                        <select id="memberAddRole" name="role" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>`;
                                    if(user.role == "Patient")
                                        displayHtml += `<option value="Patient" selected>Patient</option>`;
                                    else
                                        displayHtml += `<option value="Patient" >Patient</option>`;
                                    if(user.role == "Alumni")
                                        displayHtml += `<option value="Alumni" selected>Alumni</option>`;
                                    else
                                        displayHtml += `<option value="Alumni">Alumni</option>`;
                                    if(user.role == "Volunteer")
                                        displayHtml += `<option value="Volunteer" selected>Volunteer</option>`;
                                    else
                                        displayHtml += `<option value="Volunteer">Volunteer</option>`;
                                    if(user.role == "Employee")
                                        displayHtml += `<option value="Employee" selected>Employee</option>`;
                                    else 
                                        displayHtml += `<option value="Employee">Employee</option>`;
                                    if(user.role == "Admin")
                                        displayHtml += `<option value="Admin" selected>Admin</option>`;
                                    else
                                        displayHtml += `<option value="Admin">Admin</option>`;
                                    
                                    displayHtml += `</select>
                                `;
                            }
                            displayHtml += `
                            
                          </div>
                          <div>
                              <label for="dob" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Date of Birth</label>
                              <input type="date" name="dob" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                              value="${dob}">
                          </div>
                          <div>
                              <label for="gender" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Gender</label>
                              <input type="text" name="gender" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.gender}">
                          </div>
                          <div>
                              <label for="pronoun" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Pronoun</label>
                              <input type="text" name="pronoun" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.pronoun}">
                          </div>
                          <div>
                              <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Phone Number</label>
                              <input type="text" name="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.phone}">
                          </div>
                          <div>
                              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email</label>
                              <input type="text" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.email}">
                          </div>
                          <div>
                              <label for="street" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Address</label>
                              <input type="text" name="street" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.address.street}">
                          </div>
                          <div>
                              <label for="aptSuite" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Apt/Suite</label>
                              <input type="text" name="aptSuite" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.address.aptSuite}">
                          </div>
                          <div>
                              <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">City</label>
                              <input type="text" name="city" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.address.city}">
                          </div>
                          <div>
                              <label for="state" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">State</label>
                              <input name="state" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.address.state}">
                          </div>
                          <div>
                              <label for="zipCode" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">ZipCode</label>
                              <input type="text" name="zipCode" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.address.zipCode}">
                          </div>
                          <input hidden type="text" name="cardID" value="${user.cardID}">
                      </div>
  
                      <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
            
    `;
    $("#editForm").html(displayHtml)
  }
  
  function idForm(user){
      if(user.cardIDData.heightFT == null){
        user.cardIDData.heightFT = "";
      }
      if(user.cardIDData.heightIN == null){
        user.cardIDData.heightIN = "";
      }
    let displayHtml = `
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">ID Card</h3>
    <div class="">
        <div>
            <label for="memberIDImage" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Picture</label>
            <input type="file" id="memberIDImage" name="memberIDImage" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
            
        </div>
    `;
    if(user.cardIDData.eyeColor !== undefined && user.cardIDData.hairColor !== undefined){
      displayHtml += `
            <div>
            <label for="memberHeightFT" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Height</label>
            <div class="flex gap-2">
                <input type="number" name="memberHeightFT" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="ft" value="${user.cardIDData.heightFT}">
                <input type="number" name="memberHeightIN" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="in" value="${user.cardIDData.heightIN}">
            </div>
            
        </div>
        <div>
            <label for="memberEyeColor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Eye Color</label>
            <input type="text" name="memberEyeColor" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.cardIDData.eyeColor}">
        </div>
        <div>
            <label for="memberHairColor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Hair Color</label>
            <input type="text" name="memberHairColor" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="${user.cardIDData.hairColor}">
        </div>
      `;
      
  }else{
    displayHtml += `
      <div>
      <label for="memberHeightFT" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Height</label>
      <div class="flex gap-2">
          <input type="number" name="memberHeightFT" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="ft">
          <input type="number" name="memberHeightIN" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="in">
      </div>
      
  </div>
  <div>
      <label for="memberEyeColor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Eye Color</label>
      <input type="text" name="memberEyeColor" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" >
  </div>
  <div>
      <label for="memberHairColor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Hair Color</label>
      <input type="text" name="memberHairColor" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
  </div>
    `;
  
    
  
  }
    displayHtml += `
    </div>
    <input name="cardID" hidden type="text" value="${user.cardID}">
    <input name="id" hidden type="text" value="${user._id}">    
    
    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create ID</button>
    `;
  
    $("#createIDCardForm").html(displayHtml);
  }
  
  function addClassForm(user){
    let displayHtml = `
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">Add Class</h3>
    <div class="">
        <div>
            <label for="classObjID" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Classes</label>
            <select id="list-all-classes" name="classObjID" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
            </select>
            
        </div>
    </div>
    <input name="cardID" hidden type="text" value="${user.cardID}">
    <input name="id" hidden type="text" value="${user._id}">    
  
    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
    `;
  
    $("#addClassForm").html(displayHtml);
  }

function editLoginForm(user){
    if(user.role == "Employee" || user.role == "Admin"){
        let userName = "";
    let role = "";
    let password = "";
    if(user.loginInfo){
        userName = user.loginInfo.username;
        role = user.loginInfo.role;
    }
    let displayHtml = ``;
    
        if(sessionUser.role == 'Admin'){
            displayHtml = `
        <div class="h-full flex flex-col">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-5">Edit Employee Login</h3>
        <h3 id="loginErrorEmployeeMessage" class="text-md text-red-400 hidden">Invalid password or username already exists, try again or contact an administrator</h3>
        <div>
            <label for="employeeUserName" class="block mb-3 text-sm font-medium text-gray-900 dark:text-gray-300">Username:</label>
            <input id="employeeUserName" type="text" name="employeeUserName" class="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required value="${userName}">
        </div>
        <div>
            <label for="employeePassword" class="block mb-3 text-sm font-medium text-gray-900 dark:text-gray-300">Password</label>
            <input id="employeePassword" type="password" name="employeePassword"class="mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" value="">
            <input id="userObjIDForm"  hidden name="userObjID" value='${user._id}'>
            <input id="userCardIDForm" hidden name="userCardID" value='${user.cardID}'>
            <input id="userRoleForm" hidden name="userRole" value='${user.role}'>

            `;
        if(user.loginInfo){
            displayHtml += `
                <input id="memberUsernameForm" hidden name="memberUsername" value='${user.loginInfo.username}'>
                <input id="memberPasswordForm" hidden name="memberPassword" value='${user.loginInfo.password}'>
            `;
        }
        displayHtml += `
        </div>
        

    <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
    </div>    
    
    `;
        }
    
    
    $("#editLoginForm").html(displayHtml);
    }
    
    
}