async function Reject() {
  var owner = document.getElementById("inputName").value;
  var bot = document.getElementById("inputBot").value;
  const { value: text } = await Swal.fire({
    input: "textarea",
    inputPlaceholder: "Type your message here...",
    inputValidator: value => {
      if (!value) {
        return "You need to write something!";
      }
    },
    inputAttributes: {
      "aria-label": "Type your message here"
    },
    showCancelButton: true
  });

  if (text) {
    $.post(
      "/reject",
      {
        owner: owner,
        bot: bot,
        description: text
      },
      function(data, status) {}
    );
  }
}

async function Accept() {
  var owner = document.getElementById("inputName").value;
  var bot = document.getElementById("inputBot").value;
  window.location.reload(true);
  $.post(
    "/accept",
    {
      owner: owner,
      bot: bot
    },
    function(data, status) {}
  );
}
