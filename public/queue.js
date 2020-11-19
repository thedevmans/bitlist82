

window.onload = async function() { 
    var key = Cookies.get('key')

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database=firebase.database();
      database.ref("Bots/").once("value", function(snapshot) {
        snapshot.forEach(function(data) { 
          if(data.val().status != "Awaiting review") return;
          var tbodyqueue = document.getElementById("tbody2")
          var bodyqueue = document.createElement("tr")
          var owner = document.createElement("th")
          var prefix = document.createElement("th")
          var status = document.createElement("th")
          var bot = document.createElement("th")
          var accept = document.createElement("th")
          var reject = document.createElement("th")
          
          var owner_input = document.createElement("input")
          owner_input.setAttribute("class","form-control")
          owner_input.setAttribute("id","inputName")
          owner_input.setAttribute("type","text")
          owner_input.setAttribute("readOnly","true")
          owner_input.setAttribute("placeholder",`${data.val().owner}`)
          owner_input.setAttribute("value",`${data.val().owner}`)
          owner_input.setAttribute("name","owner")
          owner.appendChild(owner_input)
          
          
          var button_reject = document.createElement("button")
          button_reject.setAttribute("class","btn btn-outline-danger")
          button_reject.setAttribute("onclick","Reject()")
          reject.appendChild(button_reject)
          
          var button_accept = document.createElement("button")
          button_accept.setAttribute("class","btn btn-outline-success")
          button_accept.setAttribute("onclick","Accept()")
          accept.appendChild(button_accept)
          
          var Prefix_input = document.createElement("input")
          Prefix_input.setAttribute("class","form-control")
          Prefix_input.setAttribute("id","inputPrefix")
          Prefix_input.setAttribute("type","text")
          Prefix_input.setAttribute("readOnly","true")
          Prefix_input.setAttribute("placeholder",`${data.val().prefix}`)
          Prefix_input.setAttribute("value",`${data.val().prefix}`)
          Prefix_input.setAttribute("name","prefix")
          prefix.appendChild(Prefix_input)
          
          
          
          var bot_input = document.createElement("input")
          bot_input.setAttribute("class","form-control")
          bot_input.setAttribute("id","inputBot")
          bot_input.setAttribute("type","text")
          bot_input.setAttribute("readOnly","true")
          bot_input.setAttribute("placeholder",`${data.val().name}`)
          bot_input.setAttribute("value",`${data.val().bot}`)
          bot_input.setAttribute("name","bot")
          bot.appendChild(bot_input)
          
          var status_input = document.createElement("input")
          status_input.setAttribute("class","form-control")
          status_input.setAttribute("type","text")
          status_input.setAttribute("readOnly","true")
          status_input.setAttribute("placeholder",`${data.val().status}`)
          status_input.setAttribute("value",`${data.val().status}`)
          status.appendChild(status_input)

          
          bodyqueue.appendChild(owner)
          bodyqueue.appendChild(bot)
          bodyqueue.appendChild(prefix)
          bodyqueue.appendChild(status)
          
          tbodyqueue.appendChild(bodyqueue)

                  })
      })
}

async function Reject() {
  var owner = document.getElementById("inputName").value
  var bot = document.getElementById("inputBot").value
const { value: text } = await Swal.fire({
  input: 'textarea',
  inputPlaceholder: 'Type your message here...',
  inputValidator: (value) => {
    if (!value) {
      return 'You need to write something!'
    }
  },
  inputAttributes: {
    'aria-label': 'Type your message here'
  },
  showCancelButton: true
})
if (text) {
      $.post("/reject",
    {
      owner: owner,
      bot: bot,
      description: text
    },
    function(data,status){
    });
}
}

async function Accept() {
  var owner = document.getElementById("inputName").value
  var bot = document.getElementById("inputBot").value
  $.post("/accept",
    {
      owner: owner,
      bot: bot,
    },
    function(data,status){
    });

}