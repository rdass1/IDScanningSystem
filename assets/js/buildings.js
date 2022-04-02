

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

let nav = document.getElementById("main-nav");
let open = document.getElementById("nav-toggle-open");
let close = document.getElementById("nav-toggle-close")
let main = document.getElementById("main");

const showNav = (flag) => {
    if (flag) {
        nav.classList.toggle("-translate-x-full");
        nav.classList.toggle("translate-x-0");
        open.classList.toggle("hidden");
        close.classList.toggle("hidden");
        main.classList.toggle("-translate-x-72");
        main.classList.toggle("translate-x-0");
        

    }
}


