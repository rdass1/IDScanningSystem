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
        console.log(userObj);
    });
});