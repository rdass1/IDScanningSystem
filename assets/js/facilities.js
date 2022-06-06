
function startListeners(){
    $(document).ready(function(){
        $(".buildingDeleteBtnJQ").click(function(){
            if(confirm("Do you really want to delete this building AND all its locations?")){
                $.ajax({
                    "url":"/api/building/"+$(this).attr("data-id"),
                    "method":"DELETE",
                }).done(function(data){
                    
                  location.reload();
                    
                }).fail(function(data){
                    alert("Error couldn't delete that building!");
                    location.reload();
                });
            }
           
        });
        $(".locationDeleteBtnJQ").click(function(){
            if(confirm("Do you really want to delete this location?")){
                $.ajax({
                    "url":"/api/locations/"+$(this).attr("data-id"),
                    "method":"DELETE",
                }).done(function(data){
                    
                  location.reload();
                    
                }).fail(function(data){
                    alert("Error couldn't delete that location!");
                    location.reload();
                });
            }
           
        });
    
        let modalBackground = document.getElementById('add-modal-background');
        let modalBackgroundLocation = document.getElementById('add-modal-background-location');
    
        $("#add-modal").click(() => {
            modalBackground.classList.toggle('hidden');
        });
        $("#add-modal-close").click(() => {
            modalBackground.classList.toggle('hidden');
        });
    
        $(".add-modal-location").click(function() {
            modalBackgroundLocation.classList.toggle('hidden');
            $("#location-add-modal-building-id").attr("value",$(this).attr("buildingID"));
            $("#location-add-modal-building-name").html($(this).attr("buildingName"));
        });
        $("#add-modal-close-location").click(() => {
            modalBackgroundLocation.classList.toggle('hidden');
        });
    
    
        
    });
}


