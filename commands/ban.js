const discord = require("discord.js");
var firebase = require("firebase");

module.exports.run = async (bot,msg, args, prefix, database) => {
const guild = msg.guilds.get(`${process.env.guild}`);
const log_channel = msg.guild.channels.get(`${process.env.logchannel}`);
  let role = msg.guild.roles.get(process.env.moderator_role);
  var member = msg.mentions.members.first();

  
  if (!role)
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  if (!msg.member.roles.find(r => r.id === process.env.moderator_role))
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  if (msg.guild.id != process.env.guild) return;

  if(!member) {
    if(!args[1]) return msg.reply(`Hey U didn't mention a user,so use his/her id instead!`)
    let id = args[1]
    let user = await bot.fetchUser(id)
    const Reason = args.slice(2).join(' ');
 const embed = new discord.RichEmbed()
.setTitle("User Punished")
.setColor("#ce0005")
 .addField(`User`,`${user}`,true)
 .addField(`By`,`${msg.author}`,true)
.setDescription(`${user.username}#${user.discriminator} have been ***banned*** and can no longer use our services **REASON**: \n ${Reason}`)
.setTimestamp()
.setThumbnail(user.avatarURL)
 log_channel.sendMessage(embed)
    msg.reply(`User ${user} punished`)
    database.ref(`Users/${user.id}`).update({
      ban:true
    })
  }else {
    const Reason = args.slice(2).join(' ');
    let user = await bot.fetchUser(member.id)
 const embed = new discord.RichEmbed()
.setTitle("User Punished")
.setColor("#ce0005")
 .addField(`User`,`${user}`,true)
 .addField(`By`,`${msg.author}`,true)
.setDescription(`${user.username}#${user.discriminator} have been ***banned*** and can no longer use our services **REASON**: \n ${Reason}`)
.setTimestamp()
.setThumbnail(user.avatarURL)
 log_channel.sendMessage(embed) 
  msg.reply(`User ${member} Punished`)
    database.ref(`Users/${member.id}`).update({
      ban:true
    })
  }

};

module.exports.config = {
  name: "ban",
  permission: "Moderator",
  description: "ban someone",
  usage: "c!ban",
  aliases: ["ba"]
}