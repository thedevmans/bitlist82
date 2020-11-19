$(document).ready(function(){
  $("input").keydown(function (e) {
    if (e.keyCode == 13) {
      window.location= `/search/${$("input").val()}`
        return;          
          }
          })
        })


window.onload = async function() { 
    var key = Cookies.get('key')
    var user_name = Cookies.get('name')
    var user_discriminator = Cookies.get('discriminator')
    var drop = document.getElementById("drop")
    var login = document.getElementById("login")
    var user_drop = document.getElementById("user_drop")
    if(key) {
    drop.style.display = "initial"
    user_drop.innerHTML = `${user_name}#${user_discriminator}`
    login.style.display="none"
    }else {
       drop.style.display = "none"
      
    }
}
  