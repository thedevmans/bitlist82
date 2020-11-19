const discord = require("discord.js");
var firebase = require("firebase");

module.exports.run = async (bot, msg, args, prefix, database) => {
  if (msg.guild.id != process.env.guild) return;
  let embed = new discord.RichEmbed();
  //REF TO THE DATABASE ADRESS WHERER IT CONTAINS THE COMMANDS INFOS
  var index = 0;
  database
    .ref(`Bots/`)
    .orderByChild("status")
    .equalTo("Awaiting review")
    .limitToLast(10)
    .once("value", function(snapshot) {
      if (snapshot.val() === null)
        return msg.channel.send("All bots have been approved!");
      else {
        snapshot.forEach(function(data) {
          index++;
          embed.setColor('#7289da')
          embed.setTimestamp()
          embed.setTitle(`Queue Bots`)
	        embed.setURL(`${process.env.url}/queue`)
          embed.addField(
            `[${index}] ${data.val().name}`,
            `Owner: ${data.val().owner_name}#${data.val().owner_discriminator}`
          );
          embed.setDescription(`You can see more bots at:${process.env.url}/queue`)
        });
        msg.channel.send(embed)
      }
    });
};

module.exports.config = {
  name: "queue",
  permission: "Everyone",
  description: "see queue bots",
  usage: "c!queue",
  aliases: ["q"]
};
