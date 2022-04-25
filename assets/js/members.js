
$(document).ready(function(){
    let modalBackground = document.getElementById('add-modal-background');
    $("#add-modal").click(() => {
        modalBackground.classList.toggle('hidden'); 
    });
    $("#add-modal-close").click(() => {
        modalBackground.classList.toggle('hidden');
    });
});