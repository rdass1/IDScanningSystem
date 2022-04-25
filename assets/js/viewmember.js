$(document).ready(function(){
    let userObj = JSON.parse(user);
    $("#notesBtn").click(() => {
        displayText = `
            <textarea class="w-full h-full border-2" style="resize:none;" readonly>${userObj.notes}</textarea>
        `;
        $("#displayUserTable").html(displayText);
    });

    $("#logsBtn").click(() => {
        var displayText = `<div class="flex flex-col w-full">
        <div class="overflow-x-auto ">
                      <div class="py-4 inline-block w-full">
                        <div class="overflow-x-auto ">
                          <table class="text-center w-full">
                <thead class="border-b bg-gray-800">
                  <tr>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      #
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Date
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Location
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Time In
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Time Out
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Total Time
                      </th>
                    
                  </tr>
                </thead class="border-b">
                <tbody>`;
            for(var i = 0; i < userObj.logs.length;i++){
                displayText += `
                <tr class="bg-white border-b">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${i}</td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.logs[i].date}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.logs[i].locationBuilding}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.logs[i].timeIn}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.logs[i].timeOut}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.logs[i].timeTotal}
                                </td>
                              </tr class="bg-white border-b">
                
                `
            }
            
            displayText += `</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>`;

            $("#displayUserTable").html(displayText);
            
    })

    $("#classesBtn").click(() => {
        var displayText = `
        <div class="flex justify-end py-2 px-4 w-full">
                    <button id="add-modal">
                        <img width="30" alt="add" src="/img/buildings/square-plus-solid.svg" style="filter: invert(62%) sepia(84%) saturate(2926%) hue-rotate(78deg) brightness(107%) contrast(109%);
                        ">
                    </button> 
                </div>
        
        
        
            <div class="overflow-x-auto overflow-y-scroll h-40">
                <div class="py-4 inline-block w-full">
                  <div class="overflow-x-auto">
                    <table class="text-center w-full">
                <thead class="border-b bg-gray-800">
                  <tr>
                    <th class="text-sm font-medium text-white px-6 py-4">
                    #
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Name
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Teacher
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Subject
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Start Time
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        End Time
                      </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Location
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                    </th>
                    
                  </tr>
                </thead class="border-b">
                <tbody>`;
            for(var i = 0; i < userObj.classesList.length;i++){
                displayText += `
                <tr class="bg-white border-b">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${i}</td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.name}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.teacher}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.subject}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.startTime}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.endTime}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.locationObjID} , ${userObj.classesList[i].classInfo.buildingObjID}
                                </td>
                                <td class="class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"">
                                    <button class= "classDeleteBtnJQ" data-id="${userObj.classesList[i]._id}" href="">
                                        <img width="16" src="/img/buildings/trash.svg" alt="delete" style="filter: invert(24%) sepia(85%) saturate(2537%) hue-rotate(341deg) brightness(90%) contrast(91%);">
                                    </button>
                                </td>
                              </tr class="bg-white border-b">
                
                `
            }
            
            displayText += `</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>`;

            $("#displayUserTable").html(displayText);
            let modalBackground = document.getElementById('add-modal-background');
            $("#add-modal").click(() => {
                modalBackground.classList.toggle('hidden');
                $.ajax({
                    "url":"/api/classes",
                    "method":"GET",
                }).done(function(data){
                    var displayData = "";
                    
                    for(var i = 0; i < data.length; i++){
                        displayData += `
                        <option value="${data[i]._id}">${data[i].name}</option>
                        `;
                        
                    }
                    $("#list-all-classes").html(displayData);
                    
                });
            });
            $("#add-modal-close").click(() => {
                modalBackground.classList.toggle('hidden');
            });
            $(".classDeleteBtnJQ").click((e) => {
                id = $(e.currentTarget).data('id')
                if(confirm("Are you sure you want to delete the user class?")){
                    $.ajax({
                        "url":"/api/userClass/"+id,
                        "method":"DELETE",
                    }).done(function(data){
                        
                      location.reload();
                        
                    }).fail(function(data){
                        alert("Error couldn't delete that class!");
                        location.reload();
                    });
                }
            });
    });

    

    
});