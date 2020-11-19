


//search function
$(document).ready(function(){
  $("input").keydown(function (e) {
    if (e.keyCode == 13) {
      window.location= `/search/${$("input").val()}`
        return;          
          }
          })
        })
//End


//vote function

//End

//Onload function
window.onload = async function() { 
// Get the Long type
let token = Cookies.get('token');
var drop = document.getElementById("drop")
var login = document.getElementById("login")
var user_drop = document.getElementById("user_drop")
if (!token) {
      drop.style.display = "none"
}
    else {
				fetch('https://discordapp.com/api/users/@me', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
					.then(res => res.json())
					.then(response => {
						const { username, discriminator } = response;
              drop.style.display = "initial"
              user_drop.innerHTML = `${username}#${discriminator}`
              login.style.display="none"
					})
					.catch(console.error);
    }
}
  // Top voted bots!
  //
  //
  //
  //


      






