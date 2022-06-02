$.ajax({
    "url":"/api/classes",
    "method":"GET",
}).done(function(data){
    classes(data);
})
.fail(()=>{
    alert("An error occurred! Check the database")
});

function classes(classes){
    let displayHtml = ``;

    for(var i = 0; i < classes.length; i++){
        displayHtml += `
        <div class="flex flex-col justify-end w-full bg-gray-700 rounded shadow-md " style="background-color: #fafafa;">
            <div class="w-full text-center">${classes[i].name}</div>
            <div class="w-full text-center">${classes[i].teacher}</div>
            <div class="w-full text-center">${classes[i].subject}</div>
            <div class="w-full text-center">${classes[i].locationObjID}, ${classes[i].buildingObjID}</div>
            <div class="w-full text-center">${classes[i].startTime}-${classes[i].endTime}</div>
            <div class="flex justify-end">
                <a data-id="${classes[i]._id}" href="" class="p-3 classesDeleteBtnJQ"><img width="20" src="/img/buildings/trash.svg" alt="delete" style="filter: invert(24%) sepia(85%) saturate(2537%) hue-rotate(341deg) brightness(90%) contrast(91%);"></a>
            </div>
        </div>
        `;
    }
    $("#main-grid").html(displayHtml);
    startListeners();
}