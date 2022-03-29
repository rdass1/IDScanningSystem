$(document).ready(function(){
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
});