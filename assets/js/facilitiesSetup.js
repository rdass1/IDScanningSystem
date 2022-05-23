$.ajax({
    "url":"/api/building",
    "method":"GET",
}).done(function(data){
    buildings(data);
})
.fail(()=>{
    alert("An error occurred! Check the database")
});

function buildings(buildings){
    let displayHtml = "";
    for(var i = 0; i < buildings.length; i++){
        displayHtml += `
        <div class="w-full bg-gray-700 rounded shadow-md " style="background-color: #fafafa;">
        <div class="w-full text-center">${buildings[i].name}</div>
        <div class="w-full text-center">${buildings[i].company}</div>
        <div class="w-full text-center">
        `;

        if(buildings[i].address.aptSuite != ""){
            displayHtml += `${buildings[i].address.street+', '+buildings[i].address.aptSuite + ', '+ buildings[i].address.city+ ', '+ buildings[i].address.state+ ', '+ buildings[i].address.zipCode }`;
        }else{
            displayHtml += `${buildings[i].address.street+ ', '+ buildings[i].address.city+ ', '+ buildings[i].address.state+ ', '+ buildings[i].address.zipCode}`;
        }
        displayHtml += `
        </div>
        <div class="flex justify-center w-full">
          <table class="w-11/12">
            <thead class="flex bg-gray-800 text-white rounded-t-lg w-full" >
              <tr class="flex w-full">
                <th class="p-2 w-2/4">Location</th>
                <th class="p-2 w-2/4">Room</th>
                <th class="p-2 w-2/4">Floor</th>
                <th  class="p-2 w-1/6">
                    <button buildingID="${buildings[i]._id}" buildingName="${buildings[i].name}" class="add-modal-location">
                        <img width="20" alt="add" src="/img/buildings/square-plus-solid.svg" style="filter: invert(62%) sepia(84%) saturate(2926%) hue-rotate(78deg) brightness(107%) contrast(109%);
                        ">
                    </button>
                </th>
              </tr>
            </thead>
            <!-- Remove the nasty inline CSS fixed height on production and replace it with a CSS class — this is just for demonstration purposes! -->
            <tbody class="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll h-20 text-center mb-3 xl:w-full md:w-full" >
            `;
            for(var j = 0; j < buildings[i].locations.length;j++){
                displayHtml += `
                        <tr class="flex w-full odd:bg-white even:bg-neutral-200">
                            <td class=" p-2
                            w-2/4 overflow-x-hidden">${buildings[i].locations[j].name}</td>
                            <td class=" p-2
                            w-2/4">${buildings[i].locations[j].roomNumber}</td>
                            <td class=" p-2
                            w-2/4">${buildings[i].locations[j].floorNumber}</td>
                            <td class="p-3
                            w-1/6"><a class= "locationDeleteBtnJQ" data-id="${buildings[i].locations[j]._id}" href=""><img width="16" src="/img/buildings/trash.svg" alt="delete" style="filter: invert(24%) sepia(85%) saturate(2537%) hue-rotate(341deg) brightness(90%) contrast(91%);"></a></td>
                        </tr>

                `;
              
            }
            displayHtml += `
            </tbody>
          </table>
        
        
        
        </div>
        <div class="flex justify-end">
            <a data-id="${buildings[i]._id}" href="" class="p-3 buildingDeleteBtnJQ"><img width="20" src="/img/buildings/trash.svg" alt="delete" style="filter: invert(24%) sepia(85%) saturate(2537%) hue-rotate(341deg) brightness(90%) contrast(91%);"></a>
        </div>
    </div>

        
        `;
        

    }
    $("#main-grid").html(displayHtml);
}