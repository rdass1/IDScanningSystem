

$(document).ready(function(){
    $(".buildingDeleteBtnJQ").click(function(){
        if(confirm("Do you really want to delete this building?")){
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
    
});

