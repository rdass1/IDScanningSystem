let nav = document.getElementById("main-nav");
let open = document.getElementById("nav-toggle-open");
let close = document.getElementById("nav-toggle-close")
let main = document.getElementById("main");
let mainGrid = document.getElementById("main-grid-dashboard");
let wrapper = document.getElementById("nav-wrapper");
let modal = document.getElementById("add-modal-background");
let modal2 = document.getElementById("add-modal-background-location");
let memberEditModal = document.getElementById("edit-modal-background");
let memberAddClassModal = document.getElementById("add-class-modal-background");
let memberLoginModal = document.getElementById("edit-login-modal-background");
let memberIDModal = document.getElementById("id-modal-background");
const showNav = (flag) => {
    if (flag) {
        nav.classList.toggle("-translate-x-full");
        nav.classList.toggle("translate-x-0");
        open.classList.toggle("hidden");
        close.classList.toggle("hidden");
        main.classList.toggle("-translate-x-80");
        main.classList.toggle("w-full");
        if(modal)
            modal.classList.toggle("xl:ml-80")
        if(modal2 != null)
            modal2.classList.toggle("xl:ml-80")
        if(memberEditModal)
            memberEditModal.classList.toggle("xl:ml-80");
        if(memberAddClassModal)
            memberAddClassModal.classList.toggle("xl:ml-80");
        if(memberLoginModal)
            memberLoginModal.classList.toggle("xl:ml-80");  
        if(memberIDModal)
            memberIDModal.classList.toggle("xl:ml-80");
        if(mainGrid)
            mainGrid.classList.toggle("xl:grid-cols-8")
    }
}

let open2 = document.getElementById('nav-toggle-open2');
let close2 = document.getElementById('nav-toggle-close2');

const showNav2 = (flag) => {
    if(flag){
        nav.classList.toggle("translate-x-0")
        nav.classList.toggle("translate-y-20");
        open2.classList.toggle("hidden");
        close2.classList.toggle("hidden");
    }
}

let editLogin = document.getElementById("edit-own-login-modal-background");
let errorMessage = document.getElementById("loginErrorMessage");
$('#editOwnLoginBtn').click(()=>{
    editLogin.classList.remove("hidden");
});

$("#edit-own-login-modal-close").click(()=>{
    editLogin.classList.add('hidden');
    errorMessage.classList.add('hidden');
});

$("#editOwnLoginForm").submit(function(e){
    e.preventDefault();
    var data = $(this).serialize();
      $.ajax({
        method: 'POST',
        url: '/api/editLoginCredentials',
        data: data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
    .done(function(data) {
          window.location.href = "/logout"
    })
      .fail(function(data) {
        
        errorMessage.classList.remove("hidden");
        document.getElementById("editOwnLoginForm").reset();
      });
})