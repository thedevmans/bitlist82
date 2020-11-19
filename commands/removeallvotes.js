const discord = require("discord.js");
var firebase = require("firebase");

module.exports.run = async (bot,msg, args, prefix, database) => {

  let role = msg.guild.roles.find("name", "CEO");
  var member = msg.mentions.members.first();

  
  if (!role)
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  if (!msg.member.roles.find(r => r.name === "KING"))
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  if (msg.guild.id != "603194252872122389") return;

database.ref(`Users`).once("value",function(data){
  data.forEach(function(vote){
    database.ref(`Users/${vote.key}/votes`).remove()
  })
}).then(function(){
  msg.reply(`Removed all cooldown votes from database`)
})

};

module.exports.config = {
  name: "removeVotes",
  permission: "Owner",
  description: "Remove all votes",
  usage: "c!removeVotes",
  aliases: ["rmv"]
};