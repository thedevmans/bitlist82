const discord = require("discord.js");
var firebase = require("firebase");

module.exports.run = async (bot,msg, args, prefix, database) => {
const log_channel = msg.guild.channels.get(`${process.env.logchannel}`);
   let role = msg.guild.roles.get(process.env.approver_role);

  const bot_owner = msg.guild.roles.get(process.env.botowner_role);
  const bot_unverify = msg.guild.roles.get(process.env.unverifiedbot_role)
  const bot_role = msg.guild.roles.get(process.env.bot_role)
  if (!role)
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  console.log(msg.member)
  if (!msg.member.roles.find(r => r.id === process.env.approver_role))
    return msg.channel.send(
      `⛔${msg.author}***,only authorized persons with ${role} can use this command***`
    );
  if (msg.guild.id != process.env.guild) return;
  let embed = new discord.RichEmbed();
  if (!args[1])
    return msg.channel.send(
      `⛔${msg.author}, ***Usage: !bot <approve> <id> || !bot <reject> <id> <reason>***`
    );
  if (args[1] === "approve") {
    if (!args[2])
      return msg.channel.send(`⛔${msg.author}, ***Send bot id!***`);
    const database = firebase.database();
    const bot_object = await bot.fetchUser(args[2]);
    //REF TO THE DATABASE ADRESS WHERER IT CONTAINS THE COMMANDS INFOS
    database.ref(`Bots/${args[2]}`).once("value", function(snapshot) {
      if (snapshot.val() === null)
        return msg.channel.send(
          `⛔${msg.author}, ***This bot is not at my database***`
        );
      if (snapshot.val().status != "Awaiting review")
        return msg.channel.send(`⛔${msg.author}, ***Bot already Accepted***`);
      bot.guilds
        .get(process.env.guild)
        .fetchMember(`${snapshot.val().owner}`)
        .then(guildMember => {
          log_channel.send(
            `${guildMember} The bot <@${args[2]}> has been approved`
          );
          guildMember.addRole(bot_owner)  
         // bot_object.removeRole(bot_unverify.id)
          bot_object.addRole(bot_role)
          msg.reply(`✅,the bot **${args[2]}** has been Approved!`)
          guildMember.sendMessage(`Your bot: <@${args[2]}> has been approved`);
        });

      database.ref(`Bots/${args[2]}`).update({
        status: "Accepted"
      });
    });
  }
  if (args[1] === "reject") {
    if (!args[2])
      return msg.channel.send(`⛔${msg.author}, ***Send bot id!***`);
    const database = firebase.database();
    var reason = msg.content.slice(
      args[0].length + args[1].length + 1 + args[2].length + 3
    );
    console.log(reason)
    if (!reason)return msg.channel.send(`⛔${msg.author}, ***Send the reason!***`);
    //REF TO THE DATABASE ADRESS WHERER IT CONTAINS THE COMMANDS INFOS
    database.ref(`Bots/${args[2]}`).once("value", function(snapshot) {
      if (snapshot.val() === null)
        return msg.channel.send(
          `⛔${msg.author}, ***This bot is not at my database***`
        );
      if (snapshot.val().status != "Awaiting review")
        return msg.channel.send(
          `⛔${msg.author}, ***You cant reject bot that already is accept***`
        );
      bot.guilds
        .get(process.env.guild)
        .fetchMember(`${snapshot.val().owner}`)
        .then(guildMember => {
          guildMember.sendMessage(
            `Your bot: ${args[2]} has not been approved \n Reason: \n ${reason}`
          );
          log_channel.send(
            `${guildMember} The bot ${args[2]} has not been approved`
          );
        });
      msg.channel.send(
        `✅${msg.author},the bot **${args[2]}** has been Rejected!`
      );
      var rejectbot = database.ref(`Bots/`);
      rejectbot.child(`${args[2]}`).remove();
    });
  }
};

module.exports.config = {
  name: "bot",
  permission: "Approver",
  description: "Approve or Reject bot",
  usage: "c!bot",
  aliases: ["b", "bots"]
}