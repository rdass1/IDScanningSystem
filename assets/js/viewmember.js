$(document).ready(function(){
    let userObj = JSON.parse(user);
    $("#notesBtn").click(() => {
        displayText = `
            <textarea class="w-full h-full border-2" style="resize:none;">${userObj.notes}</textarea>
        `;
        $("#displayUserTable").html(displayText);
    });

    $("#logsBtn").click(() => {
        var displayText = `<div class="flex flex-col w-full">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-4 inline-block min-w-full sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class="min-w-full text-center">
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
        
        
        
        
        <div class="flex flex-col">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-4 inline-block sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class="text-center">
                <thead class="border-b bg-gray-800">
                  <tr>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
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
    });
});