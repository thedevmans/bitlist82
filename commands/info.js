const discord = require("discord.js");
var firebase = require("firebase");
const Canvas  = require('canvas');

module.exports.run = async (bot,msg, args, prefix, database) => {
  if(!args[1]) return msg.reply(`**Hey** __You need to specify the bot's id__ `)
  database.ref(`Bots/${args[1]}`).once("value", function(snapshot) { 
    if(snapshot.val() === null) return msg.reply(`***BOT Not Found***`)
    var bot = snapshot.val()
    console.log(snapshot.val())

    let embed = new discord.RichEmbed()
          .setColor('#7289da')
          .setTimestamp()
          .setTitle(`${snapshot.val().name} Overview`)
    	    .setAuthor(`${snapshot.val().name}`, `https://cdn.discordapp.com/avatars/${snapshot.val().bot}/${snapshot.val().avatar}.png?size=2048`, `https://www.cloudlist.xyz/${snapshot.val().bot}`)
    	    .setThumbnail(`https://cdn.discordapp.com/avatars/${snapshot.val().bot}/${snapshot.val().avatar}.png?size=2048`)
          .setDescription(`Short description: \n \n **${snapshot.val().short_description}** \n \n`)
	        .setURL(`${process.env.url}/bots/${snapshot.val().bot}`)
          .addField(`Total Votes:`,`**${snapshot.val().votes * -1}**`, true)
          .addField(`Monthly votes`,`**${snapshot.val().vote_month * -1}**`, true)
    if(snapshot.val().guilds_count != null) {
      embed.addField(`Guilds Size`,`**${snapshot.val().guilds_count}**`, true)
    }
    msg.channel.send(embed)
  })

};

module.exports.config = {
  name: "info",
  permission: "Everyone",
  description: "See bot info",
  usage: "c!info",
  aliases: ["i"]
}