window.onload = async function() { 


    let token = Cookies.get('token');
    var drop = document.getElementById("drop")
    var login = document.getElementById("login")
    var user_drop = document.getElementById("user_drop")
    if (!token)  {
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
            console.log(response)
              user_drop.innerHTML = `${username}#${discriminator}`
              login.style.display="none"
					})
					.catch(console.error);
    }



}

  


async function addguild() {
  var guild_id = window.location.href.split("http://www.cloudlist.xyz/server/")
  var tags = document.getElementById("tags").value
  var short_description = document.getElementById("short_description").value
  var server_invite = document.getElementById("server_invite").value
  var website = document.getElementById("website").value
  var tagss = tags.split(",")
  if(tagss.length >= 7) {
     Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text: 'No more than 6 tags!',
  footer: '<a href>Why do I have this issue?</a>'
})  
}
if(!tags ||!short_description || !server_invite) {
    Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text: 'Please,fill all inputs',
  footer: '<a href>Why do I have this issue?</a>'
})
  }else{ 
    if(!website) {
    $.post("/addserver",
    {
    guild_id:guild_id[1],
    short_description:short_description,
    server_invite:server_invite,
    website:"http://www.cloudlist.xyz/",
    tags:tags,      
    },
    function(data,status){
    });    
    }else {
  $.post("/addserver",
    {
    guild_id:guild_id[1],
    short_description:short_description,
    server_invite:server_invite,
    website:website,
    tags:tags,   
    },
  function(data,status){
    });
    }
  Swal.fire({
  icon: 'success',
  title: 'success...',
})
    window.location.reload(true)
  } 
}


