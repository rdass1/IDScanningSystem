
$(document).ready(function(){
    $("#activesOnlyForm").on("change","input:checkbox",function(){
        if(this.checked){
            // $.ajax({
            //     "url":"/api/active_members",
            //     "method":"GET",
            // }).done(function(data){
            //     console.log($("#tableBody").html());
            // });
            $.ajax({
                "url":"/api/members",
                "method":"GET",
            }).done(function(data){
                console.log('check ticked');
                console.log(data);
                var displayData = "";
                for(var i = 0; i < data.length; i++){
                    displayData += `
                    <tr>
                    <td>${i}</td>
                    <td>${data[i].cardID}</td>
                    <td>${data[i].firstName}</td>
                    <td>${data[i].lastname}</td>
                    <td>${data[i].lastname}</td>
                    </tr>
                    `
                }
                $("#tableBody").html(displayData);
            
            });
        }else{
            $.ajax({
                "url":"/api/active_members",
                "method":"GET",
            }).done(function(data){

                console.log('check unticked');
                var displayData = "";
                for(var i = 0; i < data.length; i++){
                    displayData += `
                    <tr>
                    <td>${i}</td>
                    <td>${data[i].cardID}</td>
                    <td>${data[i].firstName}</td>
                    <td>${data[i].lastname}</td>
                    <td>${data[i].lastname}</td>
                    </tr>
                    `
                }
                $("#tableBody").html(displayData);
                
            });
        }
       

    });
});