let buildingData;


$(document).ready(function(){
    let modalBackground = document.getElementById('add-modal-background');
    $("#add-modal").click(() => {
        modalBackground.classList.toggle('hidden');
        $.ajax({
            "url":"/api/building",
            "method":"GET",
        }).done(function(data){
            buildingData = data;
            var displayData = "";
            var displayData2 = "";
            for(var i = 0; i < data.length; i++){
                displayData += `
                <option value="${data[i].name}">${data[i].name}</option>
                `;
                
            }
            for(var j = 0; j < data[0].locations.length; j++){
                displayData2 += `
                <option value="${data[0].locations[j].name}">${data[0].locations[j].name}</option>
                `;
            }
            $("#list-all-buildings").html(displayData);
            $("#list-all-locations").html(displayData2);
            
        });
    });
    $("#add-modal-close").click(() => {
        modalBackground.classList.toggle('hidden');
    });

    $("#list-all-buildings").change(() => {
        let buildingName = $("#list-all-buildings").find(":selected").text();
        let displayData2 = "";
        for(var i = 0; i < buildingData.length; i++){
            if(buildingData[i].name == buildingName && buildingData[i].locations.length != 0){
                for(var j = 0; j < buildingData[i].locations.length; j++){
                    displayData2 += `
                    <option value="${buildingData[i].locations[j].name}">${buildingData[i].locations[j].name}</option>
                    `;
                }
            }
        }
        $("#list-all-locations").html(displayData2);
    });
    
    $(".classesDeleteBtnJQ").click(function(){
        if(confirm("Do you really want to delete this class?")){
            $.ajax({
                "url":"/api/classes/"+$(this).attr("data-id"),
                "method":"DELETE",
            }).done(function(data){
                
              location.reload();
                
            }).fail(function(data){
                alert("Error couldn't delete that building!");
                location.reload();
            });
        }
       
    });
    
    
});