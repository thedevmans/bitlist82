const discord = require("discord.js");
var firebase = require("firebase");

module.exports.run = async (bot,msg, args, prefix, database) => {
  var log_channel = msg.guild.channels.get("644556640481181726");
  var log_test = msg.guild.channels.get("653304902252232714")
  let role = msg.guild.roles.find("name", "Moderator");
  var member = msg.mentions.members.first();

  
  if (!role)
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  if (!msg.member.roles.find(r => r.name === "Moderator"))
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  if (msg.guild.id != "603194252872122389") return;

    const Reason = args.slice(2).join(' ');
  if(!Reason) return msg.reply(`Plz,send the reason `)
    let user = await bot.fetchUser(args[1])
        var warn_count = 0
    database.ref(`Users/${user.id}`).once("value",function(data) { 
      if(!data.val().warn) {
        warn_count = 0
      }else {
warn_count = data.val().warn
      }
 const embed = new discord.RichEmbed()
.setTitle("User Warned")
.setColor("#ce0005")
 .addField(`User`,`${user}`,true)
 .addField(`By`,`${msg.author}`,true)
.setDescription(`${user.username}#${user.discriminator} have been ***Warned*** \n You have ${warn_count + 1}/3. Remember if you get 3 warns you will be banned  **REASON**: \n ${Reason} `)
.setTimestamp()
.setThumbnail(user.avatarURL)
 log_channel.sendMessage(embed) 
  msg.reply(`User ${member} Punished`)
      if(!data.val().warn) {
    database.ref(`Users/${user.id}`).update({
      warn:1,
    })        
      }else {
     database.ref(`Users/${user.id}`).update({
      warn:data.val().warn +1,
    })       
      }

    })
  

};

module.exports.config = {
  name: "warn",
  permission: "Moderator",
  description: "warn someone",
  usage: "c!warn",
  aliases: ["w"]
}