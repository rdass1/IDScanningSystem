function test(id){
    console.log(id);
}


$(document).ready(function(){
    var eventSource = new EventSource("/sse");

    eventSource.addEventListener("message",function(e){
        try{
            if(!document. getElementById('activesOnlyCheckBox'). checked){
                $.ajax({
                    "url":"/api/active_members",
                    "method":"GET",
                }).done(function(data){
                    
                    displayMemberHtml("#membersDashboardDisplay",data);
                    
                });
            }
        }catch{

        }
    });


    


    


    $("#activesOnlyForm").on("change","input:checkbox",function(){
        if(this.checked){
            $.ajax({
                "url":"/api/members",
                "method":"GET",
            }).done(function(data){
                // var test = 'test';
                // var displayData = "";
                // for(var i = 0; i < data.length; i++){
                //     displayData += `
                //     <div >
                //         <tr style='cursor: pointer;' onclick="test(${data[i].cardID})">
                //         <td>${i}</td>
                //         <td>${data[i].cardID}</td>
                //         <td>${data[i].firstName}</td>
                //         <td>${data[i].lastname}</td>
                //         <td>${data[i].lastname}</td>
                //         </tr>
                //     </div>
                //     `
                // }
                // $("#tableBody").html(displayData);
                displayMemberHtml("#membersDashboardDisplay",data);
            
            });
        }else{
            $.ajax({
                "url":"/api/active_members",
                "method":"GET",
            }).done(function(data){
                // var displayData = "";
                // for(var i = 0; i < data.length; i++){
                //     displayData += `
                //     <tr>
                //     <td>${i}</td>
                //     <td>${data[i].cardID}</td>
                //     <td>${data[i].firstName}</td>
                //     <td>${data[i].lastname}</td>
                //     <td>${data[i].lastname}</td>
                //     </tr>
                //     `
                // }
                // $("#tableBody").html(displayData);
                displayMemberHtml("#membersDashboardDisplay",data);
                
            });
        }
       

    });

    

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




const displayMemberHtml = (elementID,data) => {
    if(data.length == 0){
        $(elementID).html('');
    }else{
        let displayData = "";
        for(var i = 0; i < data.length; i++){
            displayData += `
                <div class="user-profile-box" style="cursor: pointer;" onclick="window.location='/dashboard/viewmember?id=${data[i].cardID}';">
                        <table>
                            <tbody class="tableBody">
                                        <tr>
                                           <td style="padding: 80px;">Image</td> 
                                        </tr>
                                        <tr>
                                            <td>${data[i].lastName}, ${data[i].firstName}</td>
                                        </tr>
                                        <tr>
                                            <td>${data[i].cardID}</td>
                                        </tr>
                                        
                            </tbody>
                        </table>
                    </div>
            `
            $(elementID).html(displayData);
        }
    }
   
    

}