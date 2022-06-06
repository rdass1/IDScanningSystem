
$(document).ready(function(){
    let modalBackground = document.getElementById('add-modal-background');
    $("#add-modal").click(() => {
        modalBackground.classList.toggle('hidden'); 
    });
    $("#add-modal-close").click(() => {
        modalBackground.classList.toggle('hidden');
    });

    $("#searchBar").on('input',(e)=>{
        textValue  = e.target.value;
        
        
        if(textValue){
            var url = "";
            if(textValue.substring(0,2)=="AB"){
                url = "/api/members/?cardID="+textValue;
            }
            else if(Number.isInteger(parseInt(textValue))){
                url = "/api/members/?mrnum="+textValue;
            }
            else{
                url = "/api/members/?name="+textValue;
            }
            $.ajax({
                "url": url,
                "method":"get",
            }).done(function(data){
                if(data.length > 0){
                    $('#pagination').pagination({
                        dataSource: data,
                        showGoInput: true,
                        showGoButton: true,
                        callback: function(data, pagination) {
                            // template method of yourself
                            var html = displayHtml(data);
                            $('.memberDisplayTable').html(html);
                        }
                    })
                }
            }).fail(function(data){
                alert("Error couldn't get the data!");
                location.reload();
            });

            
        }else{
            $.ajax({
                "url":"/api/members",
                "method":"get",
            }).done(function(members){
                $('#pagination').pagination({
                    dataSource: members,
                    showGoInput: true,
                    showGoButton: true,
                    callback: function(data, pagination) {
                        // template method of yourself
                        var html = displayHtml(data);
                        $('.memberDisplayTable').html(html);
                    }
                })
                
            }).fail(function(data){
                alert("Error couldn't delete that building!");
                location.reload();
            });
        }
        
    });
    
    $.ajax({
        "url":"/api/members",
        "method":"get",
    }).done(function(members){
        $('#pagination').pagination({
            dataSource: members,
            showGoInput: true,
            showGoButton: true,
            pageSize: 10,
            pageRange: 5,
            autoHidePrevious: true,
            autoHideNext: true,
            callback: function(data, pagination) {
                // template method of yourself
                var html = displayHtml(data);
                $('.memberDisplayTable').html(html);
                $('#memberAddRole').change(()=> {
                    let usernameField = document.getElementById("employeeLoginUsername");
                    let passwordField = document.getElementById("employeeLoginPassword");
                    let selection = $('#memberAddRole').val();
                    if(selection == "Employee" || selection == "Admin"){
                        usernameField.classList.remove("hidden");
                        passwordField.classList.remove("hidden");
                    }else{
                        usernameField.classList.add("hidden");
                        passwordField.classList.add("hidden");
                    }
                });
            }
        })
        
    }).fail(function(data){
        alert("Error get members");
        location.reload();
    });

    
    
});

function displayHtml(users){
    var displayData = "";

    for(var i = 0; i < users.length;i++){

        displayData += `
            <tr onclick="window.location='/members/view?id=${users[i].cardID}';" class="bg-white border-b hover:bg-gray-200" style="cursor: pointer">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${users[i].cardID}</td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${users[i].firstName}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${users[i].lastName}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${users[i].role}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${users[i].MRNum}
                </td>
                
            </tr class="bg-white border-b">
        
        `;

    }

    return displayData;
}

