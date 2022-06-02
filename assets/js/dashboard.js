
$(document).ready(function(){
    var eventSource = new EventSource("/sse");

    eventSource.addEventListener("message",function(e){
        try{
            //console.log('update');
            if(!document. getElementById('activesOnlyCheckBox'). checked){
                $.ajax({
                    "url":"/api/active_members",
                    "method":"GET",
                }).done(function(data){
                    //console.log('update incoming...');
                    displayMemberHtml("#main-grid-dashboard",data);
                    
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
                displayMemberHtml("#main-grid-dashboard",data);
            
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
                displayMemberHtml("#main-grid-dashboard",data);
                
            });
        }
       

    });


    $.ajax({
        "url":"/api/active_members",
        "method":"GET",
    }).done(function(data){
        displayMemberHtml("#main-grid-dashboard",data);
    });
});




const displayMemberHtml = (elementID,data) => {
    if(data.length == 0){
        $(elementID).html('');
    }else{
        let displayData = "";
        for(var i = 0; i < data.length; i++){
            let backgroundColor = "#FFFFFF"; let flagColor = "#4ADE80"; let textColor = "#000000";
            switch(data[i].role){
                case "Patient":
                    backgroundColor = "#FE6100"
                    break;
                case "Alumni":
                    backgroundColor = "#DC267F"
                    break;
                case "Employee":
                    backgroundColor = "#648FFF"
                    break;
                case "Admin":
                    backgroundColor = "#648FFF"
                    break;
                case "Volunteer":
                    backgroundColor = "#785EF0"
                    break;
            }
            if(data[i].status.flag ){
                flagColor = '#E11D48'
                textColor = '#FFFFFF'
            }
            displayData += `
                <div class="w-full h-full rounded-md flex flex-col" style="cursor: pointer;background-color: ${backgroundColor}" onclick="window.location='/members/view?id=${data[i].cardID}';">
                    <div class="m-4 self-center">
                        <img class="object-scale-down w-52 h-64 text-center" src="api/getMemberImages/${data[i]._id}" alt="profile picture">
                    </div>
                    
                    <div class="flex text-white flex-col rounded-b-md h-full" style="background-color: ${flagColor};color:${textColor}">
                        <div class="ml-2 mt-2 ">
                        ${data[i].lastName}, ${data[i].firstName}
                        </div>
                        <div class="ml-2 mb-2 ">
                        ${data[i].cardID}
                        </div>
                        <div class="ml-2 mb-2 text-sm w-full h-full">
                            `;
                        if(data[i].status.location)
                            displayData += `${data[i].status.location}`;
                        displayData += `
                        </div>
                    </div>
                    
                </div>
            `
            $(elementID).html(displayData);
            
            
        }
    }
   
    

}