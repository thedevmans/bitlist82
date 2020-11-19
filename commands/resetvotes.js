const discord = require("discord.js");
var firebase = require("firebase");

module.exports.run = async (bot,msg, args, prefix, database) => {

  let role = msg.guild.roles.find("name", "Administrator");
  var member = msg.mentions.members.first();
  var log_channel = msg.guild.channels.get("638184467227476018")
  
  if (!role)
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  if (!msg.member.roles.find(r => r.name === "Administrator"))
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  if (msg.guild.id != "603194252872122389") return;

database.ref(`Bots`).once("value",function(data){
  data.forEach(function(data){
    database.ref(`Bots/${data.val().bot}`).update({
      vote_month:0
    })
  })
}).then(function(){
  log_channel.sendMessage(`👌**All Month votes removed**  \n *** You should Share your vote link to your users and receive rewards***`)
})

};

module.exports.config = {
  name: "ResetVotes",
  permission: "Owner",
  description: "Reset all votes",
  usage: "c!resetVotes",
  aliases: ["rv"]
}