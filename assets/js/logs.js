
$(document).ready(function(){
    
    start();
    
});

function start(){
    $("#searchBar").on('input',(e)=>{
        var textValue  = e.target.value;
        var dateValue = $("#searchDate").val()
        var url = "/api/logs";
        if(textValue && dateValue){
            url = "/api/logs?location="+textValue+"&date="+dateValue
        }
        else if(dateValue){
            url = "/api/logs?date="+dateValue
        }
        else if(textValue){
            url = "/api/logs?location="+textValue
        }
        console.log(url);
        $.ajax({
            "url":url,
            "method":"get",
        }).done(function(logs){
            var totalTime = 0;
            for(var i = 0; i < logs.length; i++){
                var timeIn = Date.parse(logs[i].timeIn);
                var timeOut = Date.parse(logs[i].timeOut);
                
                if(timeOut){
                    totalTime += timeOut - timeIn; 
                }
                    
                
            }
            
            $("#totaTime").html(`Total Time: ${Math.round((totalTime/3600000 + Number.EPSILON) * 100)/100} Hrs`);
            console.log(totalTime/36000000);
            $('#pagination').pagination({
                dataSource: logs,
                showGoInput: true,
                showGoButton: true,
                pageSize: 10,
                pageRange: 1,
                autoHidePrevious: true,
                autoHideNext: true,
                callback: function(data, pagination) {
                    // template method of yourself
                    var html = displayHtml(data);
                    $('#logDisplayTable').html(html);
                }
            })
            $(".logsDeleteBtnJQ").click(function(){
                if(confirm("Do you really want to delete this user log?")){
                    
                    $.ajax({
                        "url":"/api/logs/"+$(this).attr("data-id"),
                        "method":"DELETE",
                    }).done(function(data){
                        
                        start();
                        
                    }).fail(function(data){
                        alert("Error couldn't delete that log!");
                        location.reload();
                    });
                }
            });
        }).fail(function(data){
            alert("Error couldn't delete that building!");
            location.reload();
        });
        
    });
    
    $("#searchDate").on('input',(e)=>{
        var url = "/api/logs"
        if(e.target.value){
            url = "/api/logs?date="+e.target.value
        }

        $.ajax({
            "url": url,
            "method":"get",
        }).done(function(logs){
            var totalTime = 0;
            for(var i = 0; i < logs.length; i++){
                var timeIn = Date.parse(logs[i].timeIn);
                var timeOut = Date.parse(logs[i].timeOut);
                
                if(timeOut){
                    totalTime += timeOut - timeIn; 
                    console.log((timeOut - timeIn)/60000);
                } 
                
            }
            
            $("#totaTime").html(`Total Time: ${Math.round((totalTime/3600000 + Number.EPSILON) * 100)/100} Hrs`);
            $('#pagination').pagination({
                dataSource: logs,
                showGoInput: true,
                showGoButton: true,
                pageSize: 10,
                pageRange: 1,
                autoHidePrevious: true,
                autoHideNext: true,
                callback: function(data, pagination) {
                    // template method of yourself
                    var html = displayHtml(data);
                    $('#logDisplayTable').html(html);
                }
            })
            $(".logsDeleteBtnJQ").click(function(){
                if(confirm("Do you really want to delete this user log?")){
                    
                    $.ajax({
                        "url":"/api/logs/"+$(this).attr("data-id"),
                        "method":"DELETE",
                    }).done(function(data){
                        
                        start();
                        
                    }).fail(function(data){
                        alert("Error couldn't delete that log!");
                        location.reload();
                    });
                }
            });
        }).fail(function(data){
            alert("Error couldn't delete that building!");
            location.reload();
        });
    });

    $.ajax({
        "url":"/api/logs",
        "method":"get",
        }).done(function(logs){
            var totalTime = 0;
            for(var i = 0; i < logs.length; i++){
                var timeIn = Date.parse(logs[i].timeIn);
                var timeOut = Date.parse(logs[i].timeOut);
                
                if(timeOut){
                    totalTime += timeOut - timeIn; 
                }
                    
                
            }
            
            $("#totaTime").html(`Total Time: ${Math.round((totalTime/3600000 + Number.EPSILON) * 100)/100} Hrs`);
            $('#pagination').pagination({
                dataSource: logs,
                showGoInput: true,
                showGoButton: true,
                pageSize: 10,
                pageRange: 1,
                autoHidePrevious: true,
                autoHideNext: true,
                callback: function(data, pagination) {
                    // template method of yourself
                    var html = displayHtml(data);
                    $('#logDisplayTable').html(html);
                }
            })
            $(".logsDeleteBtnJQ").click(function(){
                if(confirm("Do you really want to delete this user log?")){
                    
                    $.ajax({
                        "url":"/api/logs/"+$(this).attr("data-id"),
                        "method":"DELETE",
                    }).done(function(data){
                        
                    start();
                        
                    }).fail(function(data){
                        alert("Error couldn't delete that log!");
                    
                    });
                }
            });
            
        }).fail(function(data){
            alert("Error couldn't delete that log!");
            location.reload();
        });
}

function displayHtml(logs){
    var displayData = "";

    for(var i = 0; i < logs.length;i++){

        displayData += `
            <tr class="bg-white border-b">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${logs[i].userCardID}</td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${logs[i].userName}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${logs[i].date}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${logs[i].locationBuilding}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${logs[i].timeIn}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${logs[i].timeOut}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${logs[i].timeTotal}
                </td>
                <td class="">
                    <a data-id="${logs[i]._id}" href="" class="p-3 logsDeleteBtnJQ"><img width="15" src="/img/buildings/trash.svg" alt="delete" style="filter: invert(24%) sepia(85%) saturate(2537%) hue-rotate(341deg) brightness(90%) contrast(91%);"></a>
                </td>
            </tr class="bg-white border-b">
        
        `;

    }

    return displayData;
}
