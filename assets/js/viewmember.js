$(document).ready(function(){
    $("#notesBtn").click(() => {
        let userObj = JSON.parse(user);
        console.log(userObj);
        let di
        $("#displayUserTable").html(userObj.notes[0].message);
    });
});