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
        }catch{

        }
    });


    $("#activesOnlyForm").on("change","input:checkbox",function(){
        if(this.checked){
            $.ajax({
                "url":"/api/members",
                "method":"GET",
            }).done(function(data){
                var test = 'test';
                var displayData = "";
                for(var i = 0; i < data.length; i++){
                    displayData += `
                    <div >
                        <tr style='cursor: pointer;' onclick="test(${data[i].cardID})">
                        <td>${i}</td>
                        <td>${data[i].cardID}</td>
                        <td>${data[i].firstName}</td>
                        <td>${data[i].lastname}</td>
                        <td>${data[i].lastname}</td>
                        </tr>
                    </div>
                    `
                }
                $("#tableBody").html(displayData);
            
            });
        }else{
            $.ajax({
                "url":"/api/active_members",
                "method":"GET",
            }).done(function(data){
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