async function Report() {
  var token = Cookies.get('token')
  var bot = window.location.href.split("/report/")[1]
  var selected_reason = document.getElementById("Select_reason").value
  var add_reason = document.getElementById("add_reason").value
  				fetch('https://discordapp.com/api/users/@me', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
					.then(res => res.json())
					.then(response => {
						const { username, discriminator } = response;
          var owner = response.id
  $.post("/report",
    {
      owner: owner,
      bot: bot,
      selected_reason:selected_reason,
      add_reason: add_reason,
    },
    function(data,status){
    window.location.reload(true)
    });              
					})
					.catch(console.error);
}