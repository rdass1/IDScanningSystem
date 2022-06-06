
function startBtns(){
  $(document).ready(function(){
  
    
    $("#notesBtn").click(() => {
        var parseText = ``;
        if(userObj.notes != "" && userObj.notes){
          var lines = userObj.notes.split("\\n");
          for(var i = 0; i < lines.length;i++){
            parseText += lines[i]+"\n";
          }
        }
        
        displayText = `
            <form action="/api/members_notes/${userObj._id}" method="POST">
              <textarea name="notes" id="notesTextArea" class="w-full h-full border-2" style="resize:none;height:18rem">${parseText}</textarea>
              <input hidden name="cardID" value="${userObj.cardID}">
              <button id="saveBtn" type="submit" class="hidden w-20 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
            </form>
            
        `;
        $("#displayUserTable").html(displayText);

        $("#notesTextArea").on('input propertychange',()=>{
          let saveBtn = document.getElementById('saveBtn');
          saveBtn.classList.remove('hidden');
        })
    });

    $("#logsBtn").click(() => {
        var displayText = `<div class="flex flex-col w-full" style="height:100%;">
        <div id="totalTime" class="text-center text-xl"></div>
        <div class="flex justify-center">
          <div class=" flex w-96  rounded-lg bg-white border-2 border-gray-100 ">
                    
                    <img class="m-1" src="/img/searchIcon.svg" width="20" alt="search icon" style="filter: invert(61%) sepia(0%) saturate(1950%) hue-rotate(205deg) brightness(87%) contrast(79%);">
                    <input id="searchBar" class="px-2 py-1 w-full rounded-r-lg outline-none focus:ring-2 focus:ring-blue-100" type="text" placeholder="location">
                </div>
                <div class="mx-3 w-40 rounded-lg bg-white border-2 border-gray-100">
                    <input id="searchDate" class="px-2 py-1 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-100" type="date" placeholder="">
                </div>
        
        </div>
        
        <div class="overflow-x-auto">
                      <div class="py-4 inline-block w-full">
                        <div class="">
                          <table class="text-center w-full ">
                <thead class="border-b bg-gray-800">
                  <tr>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      #
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Date
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Location
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Time In
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Time Out
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Total Time
                      </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                    </th>
                  </tr>
                </thead class="border-b">
                <tbody id="logDisplayTable">  
                `;
              
            
            
            displayText += `</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="pagination"></div>
                  `;

            $("#displayUserTable").html(displayText);
            $('#pagination').pagination({
              dataSource: userObj.logs,
              showGoInput: true,
              showGoButton: true,
              pageSize: 3,
              pageRange: 1,
              autoHidePrevious: true,
              autoHideNext: true,
              callback: function(data, pagination) {
                  var html = printLogs(data,pagination);
                  $('#logDisplayTable').html(html);
              }
            });
            let totalTime = 0;
            for(var i = 0; i < userObj.logs.length; i++){
                let timeIn = Date.parse(userObj.logs[i].timeIn);
                let timeOut = Date.parse(userObj.logs[i].timeOut);
                
                if(timeOut){
                    totalTime += timeOut - timeIn; 
                }
            }
            $("#totalTime").html(`Total Time: ${Math.round((totalTime/3600000 + Number.EPSILON) * 100)/100} Hrs`);
            $(".logsDeleteBtnJQ").click(function(){
              if(confirm("Do you really want to delete this user log?")){
                  
                  $.ajax({
                      "url":"/api/logs/"+$(this).attr("data-id"),
                      "method":"DELETE",
                  }).done(function(data){
                      
                    location.reload();
                      
                  }).fail(function(data){
                      alert("Error couldn't delete that log!");
                      location.reload();
                  });
              }
          });
          
          $("#searchBar").on('input',(e)=>{
            var textValue  = e.target.value;
            var dateValue = $("#searchDate").val()
            var url = "/api/logs?id="+userObj._id;
            if(textValue && dateValue){
                url = "/api/logs?id="+userObj._id+"&location="+textValue+"&date="+dateValue
            }
            else if(dateValue){
                url = "/api/logs?id="+userObj._id+"&date="+dateValue
            }
            else if(textValue){
                url = "/api/logs?id="+userObj._id+"&location="+textValue
            }
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
                
                $("#totalTime").html(`Total Time: ${Math.round((totalTime/3600000 + Number.EPSILON) * 100)/100} Hrs`);
                $('#pagination').pagination({
                    dataSource: logs,
                    showGoInput: true,
                    showGoButton: true,
                    pageSize: 3,
                    pageRange: 1,
                    autoHidePrevious: true,
                    autoHideNext: true,
                    callback: function(data, pagination) {
                        // template method of yourself
                        var html = printLogs(data,pagination);
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
            var url = "/api/logs?id="+userObj._id;
            if(e.target.value){
                url = "/api/logs?id="+userObj._id+"&date="+e.target.value
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
                    } 
                    
                }
                
                $("#totalTime").html(`Total Time: ${Math.round((totalTime/3600000 + Number.EPSILON) * 100)/100} Hrs`);
                $('#pagination').pagination({
                    dataSource: logs,
                    showGoInput: true,
                    showGoButton: true,
                    pageSize: 3,
                    pageRange: 1,
                    autoHidePrevious: true,
                    autoHideNext: true,
                    callback: function(data, pagination) {
                        // template method of yourself
                        var html = printLogs(data,pagination);
                        $('#logDisplayTable').html(html);
                    }
                })
        });
        });

    });

    

    $("#classesBtn").click(() => {
        var displayText = `
        <div class="flex justify-end py-2 px-4 w-full style="height:20rem;"">
                    <button id="add-class-modal">
                        <img width="30" alt="add" src="/img/buildings/square-plus-solid.svg" style="filter: invert(62%) sepia(84%) saturate(2926%) hue-rotate(78deg) brightness(107%) contrast(109%);
                        ">
                    </button> 
                </div>
            <div class="overflow-x-auto overflow-y-auto h-full">
                <div class="py-4 inline-block w-full">
                  <div class="overflow-x-auto">
                    <table class="text-center w-full">
                <thead class="border-b bg-gray-800">
                  <tr>
                    <th class="text-sm font-medium text-white px-6 py-4">
                    #
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Name
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        Teacher
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Subject
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Start Time
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                        End Time
                      </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                      Location
                    </th>
                    <th scope="col" class="text-sm font-medium text-white px-6 py-4">
                    </th>
                    
                  </tr>
                </thead class="border-b">
                <tbody>`;
            
            for(var i = 0; i < userObj.classesList.length;i++){
                
                displayText += `
                <tr class="bg-white border-b">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${i}</td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.name}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.teacher}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.subject}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.startTime}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.endTime}
                                </td>
                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                ${userObj.classesList[i].classInfo.locationObjID} , ${userObj.classesList[i].classInfo.buildingObjID}
                                </td>
                                <td class="class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"">
                                    <button class= "classDeleteBtnJQ" data-id="${userObj.classesList[i]._id}" href="">
                                        <img width="16" src="/img/buildings/trash.svg" alt="delete" style="filter: invert(24%) sepia(85%) saturate(2537%) hue-rotate(341deg) brightness(90%) contrast(91%);">
                                    </button>
                                </td>
                              </tr class="bg-white border-b">
                
                `
            }
            
            displayText += `</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>`;

            $("#displayUserTable").html(displayText);
            let modalBackground = document.getElementById('add-class-modal-background');
            $("#add-class-modal").click(() => {
                modalBackground.classList.toggle('hidden');
                $.ajax({
                    "url":"/api/classes",
                    "method":"GET",
                }).done(function(data){
                    var displayData = "";
                    
                    for(var i = 0; i < data.length; i++){
                        displayData += `
                        <option value="${data[i]._id}">${data[i].name}</option>
                        `;
                        
                    }
                    $("#list-all-classes").html(displayData);
                    
                });
            });
            $("#close-add-class-modal-background").click(() => {
                modalBackground.classList.toggle('hidden');
            });
            $(".classDeleteBtnJQ").click((e) => {
                id = $(e.currentTarget).data('id')
                if(confirm("Are you sure you want to delete the user class?")){
                    $.ajax({
                        "url":"/api/userClass/"+id,
                        "method":"DELETE",
                    }).done(function(data){
                      location.reload();
                    }).fail(function(data){
                        alert("Error couldn't delete that class!");
                        location.reload();
                    });
                    
                }
            });
    });
    let modalBackground = document.getElementById('edit-modal-background');
      $("#edit-modal").on("click",function(){
          
          modalBackground.classList.toggle('hidden'); 
      });
      $("#edit-modal-close").click(() => {
          modalBackground.classList.toggle('hidden');
      });
    
      $("#deleteUserBtn").click(()=>{
        if(confirm("Do you really want to delete the user and all their data?")){
          $.ajax({
            "url":"/api/members_delete/"+userObj._id,
            "method":"POST",
            }).done(function(data){
              
              window.location.href = "/members";
                    
            }).fail(function(data){
              window.location.href = "/members";
            });
        }
      })
    let idModal = document.getElementById("id-modal-background");
    let form = document.getElementById("createIDCardForm");
    
     $("#id-modal").click(() => {
      idModal.classList.toggle('hidden'); 
    });
    $("#close-id-modal-background").click(() => {
      form.classList.remove('hidden');
      idModal.classList.toggle('hidden');
    });
    let editLoginModal = document.getElementById("edit-login-modal-background");
    $("#editLoginModalBtn").click(()=>{
      editLoginModal.classList.remove('hidden');
    })
    $("#edit-login-modal-close").click(()=>{
      editLoginModal.classList.add('hidden');
    });

    $("#flagBtn").click(()=>{
      let flag = true;
      if(userObj.status.flag){
        flag = false;
      }
      $.ajax({
        "url":"/api/user_flag/"+userObj._id+"/"+flag,
        "method":"POST",
        }).done(function(data){
          location.reload();
                
        }).fail(function(data){
            alert("Error couldn't delete that user!");
            location.reload();
        });
    });

    $("#id-print-btn").on("click", ()=>{
      // setTimeout(() => {
        
      // }, 1000);
      printJS({
        printable : [`/memberIDImages/${userObj._id}-front.png`,`/memberIDImages/${userObj._id}-back.png`],
        type: 'image',
        imageStyle: 'float:left;',
        onError: (error) =>{
          alert(error);
        },
        showModal: true,
        modalMessage: "Retrieving IDCard", 
      });

      $.ajax({
        "url":"/api/getMemberIDCard/"+userObj._id,
        "method":"POST",
        }).done(function(data){

        }).fail(function(data){
            alert("Error couldn't print that ID!");
            location.reload();
        });
        
    });

    $("#downloadID").click(function(e){
      e.preventDefault();
      setTimeout(()=>{
        var filesForDownload = [];
      filesForDownload.push( { path: `/memberIDImages/${userObj._id}-front.png`, name: `${userObj.lastName},${userObj.firstName}-front.png`} );
      filesForDownload.push( { path: `/memberIDImages/${userObj._id}-back.png`, name: `${userObj.lastName},${userObj.firstName}-back.png`} );

      var temporaryDownloadLink = document.createElement("a");
      temporaryDownloadLink.style.display = 'none';
  
      document.body.appendChild( temporaryDownloadLink );
  
      for( var n = 0; n < filesForDownload.length; n++ )
      {
          var download = filesForDownload[n];
          temporaryDownloadLink.setAttribute( 'href', download.path );
          temporaryDownloadLink.setAttribute( 'download', download.name );
  
          temporaryDownloadLink.click();
      }
  
      document.body.removeChild( temporaryDownloadLink );
      $.ajax({
        "url":"/api/getMemberIDCard/"+userObj._id,
        "method":"POST",
        }).done(function(data){

        }).fail(function(data){
            alert("Error couldn't print that ID!");
            location.reload();
        });
      },"2000");
      
    });
    
    let errorMessage = document.getElementById("loginErrorEmployeeMessage");
        $("#editLoginForm").submit(function(e){
            e.preventDefault();
            var data = $(this).serialize();
              $.ajax({
                method: 'POST',
                url: '/api/employeeLoginEdit',
                data: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              })
            .done(function(data) {
                
                window.location.href = "/members/view?id="+userObj.cardID;
            })
              .fail(function(data) {
                errorMessage.classList.remove("hidden");
                document.getElementById("editLoginForm").reset();
              });
        });

    
});
}


function printLogs(logs,pag){
  let displayText = "";
  let index = pag.totalNumber - (pag.pageNumber * pag.pageSize) + 3
  for(var i = 0; i < logs.length;i++){
      
      
      displayText += `
      <tr class="bg-white border-b">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index--}</td>
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
      
      `
  }
  return displayText;
}