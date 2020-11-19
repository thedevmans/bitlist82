var express = require("express");
var app = express();
var time = new Date();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true });
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.description = new Discord.Collection();
client.usage = new Discord.Collection();
client.permission = new Discord.Collection();
const guild = client.guilds.get(`${process.env.guild}`);
const log_channel = client.channels.get(`${process.env.logchannel}`);
var url = process.env.url
const download = require('download-file')
const fetch = require("node-fetch");
const router = express.Router();
const btoa = require("btoa");
const { loadImage,registerFont, createCanvas } = require('canvas')


var hash = require("object-hash");
const rateLimit = require("express-rate-limit");
 
 
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  message: "Sorry, the maximum limit of 60 request / minute!",
  max: 10
});
var cookies = require("cookie-parser");
require("dotenv").config();
var bodyParser = require("body-parser");
var firebase = require("firebase");
var hash = require("crypto-random-string");
var prefix = "c!";
const CLIENT_ID = process.env.client_id;
const CLIENT_SECRET = process.env.client_secret;
const redirect = encodeURIComponent(process.env.redirect_url);
var disc_url = `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=guilds.join%20identify%20guilds&response_type=code&redirect_uri=${redirect}`;
const activities_list = [
  "https://rainy-bot-list.glitch.me",
  "https://rainy-bot-list.glitch.me",
  "Rainy List",
  "Start Gaining more users to your server or bot",
  "c!help for help"
];

fs.readdir("./commands/", (err, files) => {
  if (err) {
    console.log(err);
  }
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length === 0) {
    console.log("Couldn't execute files");
  }
  jsfile.forEach((f, i) => {
    console.log(`Command ${f} executed`);
    let pull = require(`./commands/${f}`);
    client.commands.set(pull.config.name, pull);
    pull.config.aliases.forEach(alias => {
      client.aliases.set(alias, pull.config.name);
    });
    client.description.set(pull.config.name);
    client.usage.set(pull.config.name);
    client.permission.set(pull.config.name);
  });
});

var config = {
    apiKey: "AIzaSyC9lpQuxHanr-ahuKRotdOqFBt4ZzA3moI",
    authDomain: "test-202fa.firebaseapp.com",
    databaseURL: "https://test-202fa.firebaseio.com",
    projectId: "test-202fa",
    storageBucket: "test-202fa.appspot.com",
    messagingSenderId: "848657543784",
    appId: "1:848657543784:web:b236069760f6e0ac4b41dd"
};

firebase.initializeApp(config);

const database = firebase.database();

app.set("view engine", "ejs");

// Set the view engine to ejs (Doesn't really matter for the library though.)
app.use(cookies()); // Setup the cookies for storing session variables
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get("/markdown", async (req, res) => {
  let key = req.cookies.token; 
  res.send("maintence")
 // res.render("markdown", { url: disc_url }); // Generate the OAuth Authorize link
}); 

app.post("/remove", async (req, res) => {
  const guild = client.guilds.get(`${process.env.guild}`);
const log_channel = client.channels.get(`${process.env.logchannel}`);
  let key = req.cookies.token; 
  let id = req.body.id
      if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      database.ref(`Bots/${id}`).once("value",function(data) {
        if(data.val() === null) return res.send(`No bot found!`)
        if(data.val().owner != response.id) return res.send(`You can't do that cause you are not the owner!`)
        else {
          database.ref(`Bots/${id}`).remove()
  res.contentType("application/json");
  var data = JSON.stringify("/success?s=removed");
  res.header("Content-Length", data.length);
  res.end(data); 
          
        log_channel.sendMessage(`<@${response.id}> Removed the bot <@${id}> from our website :(`)
    client.guilds
      .get(process.env.guild)
      .fetchMember(req.body.id)
      .then(member => {
          member.kick()
    })
        }
      })
    })
  }else {
    res.send(`You need to be logged !`)
  }
}); 

app.get("/test", async (req, res) => {
  let key = req.cookies.token;
  res.render("test")
 // res.render("markdown", { url: disc_url }); // Generate the OAuth Authorize link
});

app.get("/apidocs", async (req, res) => {
  let key = req.cookies.token;
  res.render("api", { url: disc_url }); // Generate the OAuth Authorize link
});
app.get("/", async (req, res) => {
  var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }

  // Get the user
        var month = time.getMonth();

  database
    .ref("Bots/")
    .orderByChild(`votes`)
    .limitToFirst(12)
    .once("value", function(snapshot) {
      database
        .ref("Bots/")
        .orderByChild("Certfied")
        .equalTo(true)
        .limitToFirst(8)
        .once("value", function(snap) {
          //  var Bot_votes_month = await database.ref(`Bots/${req.body.bot}/${month}`).orderByChild(`votes`).once("value");
          database
            .ref(`Bots/`)
            .orderByChild(`vote_month`)
            .limitToFirst(12)
            .once("value", function(trending) {
              database
                .ref(`Bots/`)
                .orderByChild(`created_at`)
                .equalTo(`${month}`)
                .limitToFirst(12)
                .once("value", function(New) {
               database
                .ref(`Bots/`)
                .orderByChild(`Premium`)
                .equalTo(true)
                .limitToFirst(8)
                .once("value", function(premium) {      


                
                  // we need the user data here!
                  res.render("index", {
                    url: disc_url,
                    top: snapshot,
                    Certified: snap,
                    trending: trending,
                    New: New,
                    status:status,
                    premium:premium,
     
            
                    });
                   })
                });
            });
        });
    });
});



app.get("/bot/:name", async (req, res) => {
  let bot_name = req.params.name;
  var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }
  let b = "#8c8c8c";
  // Since cookies are stored on locally, they will be different for each user
  // Get the user
  let bot = client.users.find(user=> user.username === `${bot_name}`)
  if(!bot) return res.render("404");
  var snapshot = await database.ref(`Bots/${bot.id}`).once("value");

    if (!snapshot.val()) {
      res.render("404");
    } else {
      if(snapshot.val().Certfied != true) {
         res.render("404");
      }
          var month = time.getMonth();
      var year = time.getYear();
       var month_votes_val = 0
            var month_votes = await database.ref(`Bots/${snapshot.val().bot}/${year}/${month}`).once("value")
           if(month_votes.val() != null) {
             month_votes_val = month_votes.val().votes
           }
      client.guilds
        .get(process.env.guild)
        .fetchMember(`${snapshot.val().bot}`)
        .then(bot => {
        if(!bot)  return res.redirect(`/error?e=review`);
        if(key) {
          status = "logged"
           res.render("bots", {
            data: snapshot.val(),
            url: disc_url,
            bot_id: snapshot.val().bot,
            status: bot.presence.status,
            stats: status,
             month_votes:month_votes_val
          });         
        }else {
          
          status = "login"
          res.render("bots", {
            data: snapshot.val(),
            url: disc_url,
            bot_id: snapshot.val().bot,
            status: bot.presence.status,
            stats: status,
          month_votes:month_votes_val
          });          
        }
        });
    }
  
  // Get the user
  // let user = await oauthClient.getAuthorizedUser(key);
});



app.get("/bots/:id", async (req, res) => {

  let bot_id = req.params.id;
  var status = ""
  var isbot= ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }
  let b = "#8c8c8c";
  // Since cookies are stored on locally, they will be different for each user
  // Get the user
        var month = time.getMonth();
      var year = time.getYear();
       var month_votes_val = 0
            var month_votes = await database.ref(`Bots/${req.params.id}/${year}/${month}`).once("value")
           if(month_votes.val() != null) {
             month_votes_val = month_votes.val().votes
           }
  database.ref(`Bots/${req.params.id}`).once("value", async function(snapshot) {
    if(snapshot.val() === null) return res.redirect(`/error?e=nobotfound`);
    if(snapshot.val().status === "Awaiting review") {
        if(key) {
          status = "logged"
           res.render("unverified", {
            data: snapshot.val(), 
            url: disc_url,
            bot_id: bot_id,
            month_votes: month_votes_val,
            isbot:`${snapshot.val().status}`,
            stats: status,
          });         
        }else {
          status = "login"
          res.render("unverified", {
            data: snapshot.val(),
            url: disc_url,
            bot_id: bot_id,
            month_votes: month_votes_val,
            isbot:`${snapshot.val().status}`,
            stats: status,
          });          
        }      
    }else {
      
    
      client.guilds
        .get(process.env.guild)
        .fetchMember(bot_id)
        .then(bot => {
        if(bot === null)  return res.redirect(`/error?e=review`);
        if(key) {
          status = "logged"
           res.render("bots", {
            data: snapshot.val(),
            url: disc_url,
            bot_id: bot_id,
            month_votes: month_votes_val,
            status: bot.presence.status,
            isbot:`${snapshot.val().status}`,
            stats: status,
          });         
        }else {
          status = "login"
          res.render("bots", {
            data: snapshot.val(),
            url: disc_url,
            bot_id: bot_id,
            month_votes: month_votes_val,
            status: bot.presence.status,
            isbot:`${snapshot.val().status}`,
            stats: status,
          });          
        }
        }).catch(function(err) {

        
  if(err === "Unknown User")  return res.send(`Invalid user`)
 if(err === " Invalid or uncached id provided.")  return res.send(` Invalid or uncached id provided.`)
 })
    }
    
  });
  // Get the user
  // let user = await oauthClient.getAuthorizedUser(key);
});

app.get("/admin", async (req, res) => {
  var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }
  if (!key) return res.redirect("/error?e=admin");
  try {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
        const { username, discriminator } = response;
        var Authorization = response;
        if (Authorization.message === "401: Unauthorized")
          return res.redirect("/error?e=user");
        client.guilds
          .get(`603194252872122389`)
          .fetchMember(response.id)
          .then(guildMember => {
            if (guildMember.roles.has("638183849632727040")) {
              database
                .ref("Bots/")
                .orderByChild("status")
                .equalTo("Awaiting review")
                .once("value", function(snapshot) {
                  res.render("admin", { user: response, data: snapshot,status:status });
                });
            } else {
              res.redirect("/error?e=admin");
            }
          });
      })
      .catch(console.error);
  } catch (err) {
    res.redirect("/logout");
  }
});

app.get("/certified", async (req, res) => { 
    var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }
      res.render("certfied", { url: disc_url,status:status});

})

/*/
app.post('/accept', async (req, res) => { 
  let key = req.cookies.token;  
if(!key) {
          res.contentType('application/json');
          var data = JSON.stringify('/error?e=admin')
          res.header('Content-Length', data.length);
          res.end(data);
}
  var log_channel = client.channels.get("638184467227476018");
    				fetch('https://discordapp.com/api/users/@me', {
					headers: {
						Authorization: `Bearer ${key}`
					}
				})
					.then(res => res.json())
					.then(async response => {
						const { username, discriminator } = response;
            var Authorization = response
            if (Authorization.message === "401: Unauthorized") {
                      res.contentType('application/json');
                      var data = JSON.stringify('/error?e=user')
                      res.header('Content-Length', data.length);
                      res.end(data);
            }
if(key) {

    // Get the user
    const bot = await client.fetchUser(`${req.body.bot}`)
    client.guilds.get(`603194252872122389`).fetchMember(req.body.owner).then(guildMember => {
      if(!guildMember) {
          res.contentType('application/json');
          var data = JSON.stringify('/error?e=voted')
          res.header('Content-Length', data.length);
          res.end(data);
      }
if(guildMember.roles.has('638183849632727040')) {
    log_channel.send(`${guildMember} The bot ${req.body.bot} has been approved`)
    guildMember.sendMessage(`Your bot: ${req.body.bot} has been approved`)
     const database = firebase.database();
  //REF TO THE DATABASE ADRESS WHERER IT CONTAINS THE COMMANDS INFOS
  database.ref(`Bots/${req.body.bot}`).update({
    status:"Accepted", 
  })
}
   })
}
					})
					.catch(console.error);
  })

/*/

app.get("/queue", async (req, res) => {
    var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }
  database
    .ref(`Bots/`)
    .orderByChild("status")
    .equalTo("Awaiting review")
    .limitToLast(10)
    .once("value", function(snapshot) {
      res.render("queue", { url: disc_url, data: snapshot,status:status });
    });
});

app.get("/myapikeys", async (req, res) => {
    var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response

    })
  }
  if (!key) return res.redirect(disc_url);
  fetch("https://discordapp.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${key}`
    }
  })
    .then(res => res.json())
    .then(async response => {
       var ban = await database.ref(`Users/${response.id}`).once("value")
       if(ban.val() != null)  {
          if(ban.val().ban === true)  return res.redirect("/error?e=punished");
       }
      database
        .ref(`Bots/`)
        .orderByChild("owner")
        .equalTo(`${response.id}`)
        .once("value", function(snapshot) {
          if (snapshot.val() === null) return res.redirect("/error?e=nobot");
          res.render("myapikeys", { url: disc_url, data: snapshot,status:status });
        });
    });
});

app.get("/guilds", async (req, res) => {
  res.send("Maintence");
});
app.get("/teste/", async (req, res) => {
  let key = req.cookies.token;
  let name = req.query.name;
  // Get the user
  if (name) {
    database
      .ref("Bots/")
      .orderByChild("owner_name")
      .equalTo(name)
      .once("value", function(snapshot) {
        if (snapshot.val() === null) return res.redirect("/error?e=user");
        database
          .ref("Users/")
          .orderByChild("name")
          .equalTo(name)
          .once("value", function(data) {
            res.render("test", { url: disc_url, data: snapshot, user: data });
          });
      });
  } else {
    try {
      fetch("https://discordapp.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${key}`
        }
      })
        .then(res => res.json())
        .then(response => {
          const { username, discriminator } = response;
          var Authorization = response;
          if (Authorization.message === "401: Unauthorized")
            return res.redirect("/error?e=user");
          var user = response;
          database
            .ref("Bots/")
            .orderByChild("owner_name")
            .equalTo(user.username)
            .once("value", function(snapshot) {
              if (snapshot.val() === null) return res.redirect("/error?e=user");
              database
                .ref("Users/")
                .orderByChild("name")
                .equalTo(user.username)
                .once("value", function(data) {
                  res.render("test", {
                    url: disc_url,
                    data: snapshot,
                    user: data
                  });
                });
            });
        })
        .catch();
    } catch (err) {
      res.redirect("/logout");
    }
  }

  // Generate the OAuth Authorize link
});
app.get("/api/keys", async (req, res) => {
    var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response

    })
  }
  if(!key) return res.redirect(disc_url)
  fetch("https://discordapp.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${key}`
    }
  })
    .then(res => res.json())
    .then(async response => {
                 var ban = await database.ref(`Users/${response.id}`).once("value")
       if(ban.val() != null)  {
          if(ban.val().ban === true)  return res.redirect("/error?e=punished");
       }
      database
        .ref(`Bots/`)
        .orderByChild("owner")
        .equalTo(`${response.id}`)
        .once("value", function(snapshot) {
          if (!snapshot.val()) return res.redirect("/error?e=nobot");
          res.render("apikeys", { url: disc_url, data: snapshot,status:status });
        });
    });
});
client.on("guildMemberRemove", async member => { 
const guild = client.guilds.get(`${process.env.guild}`);
const log_channel = client.channels.get(`${process.env.logchannel}`);
  if (!guild) return;
    if (member.user.bot) {
   database.ref(`bots/${member.id}`).remove()
  }
  
})

client.on("guildMemberAdd", async member => {
const guild = client.guilds.get(`${process.env.guild}`);
const log_channel = client.channels.get(`${process.env.logchannel}`);
  if (!guild) return;
  var isBot = member.guild.roles.get(process.env.bot_role);
  var isMember = member.guild.roles.get(process.env.member_role);
  if (!isBot) return;
  if (!isMember) return;
  if (member.user.bot) {
    member.addRole(isBot);
  }
  if (!member.user.bot) {
    member.addRole(isMember);
  }
});

app.post("/isvalid/:token", limiter ,async (req, res) => { 
  if(!req.body.client) return res.status(204).json('No id provided');
  if(!req.params.token ) return res.status(204).json('No token provided');
database.ref(`Bots/${req.body.client}`).once("value",function(data) {
  if(data.val() === null) return res.status(204).json('Invalid user');
  if(!data.val().apiKey) return res.status(204).json("This Client doesn't have a api key yet");
  if(data.val().apiKey === req.params.token) {
    res.json(`Logged in as ${data.val().name}`);
  }else {
    res.status(401).json(`Incorrect authorization token!`);       
  } 
})
})

app.post("/api/bot/:client_id/hasvoted/:user_id", limiter ,async (req, res) => { 
  if(!req.params.client_id) return res.json(`No Bot Id Provided`)
    if(!req.params.user_id) return res.json(`No User Id Provided`)
database.ref(`Bots/${req.params.client_id}/hasvoted/${req.params.user_id}`).once("value",function(data) {
  if(data.val() === null) return res.json(`User hasn't voted yet!`);
    res.json(data.val());        
})
})

app.post("/api/stats/:id", limiter ,async (req, res) => {
  let botId = req.params.id;
  let auth = req.headers.authorization;
  if (!auth)
    return res.json({
      success: "false",
      error: "Authorization header not found."
    });
  let count = req.body.count ? req.body.count : req.body.server_count;
  if (!count)
    return res.json({ success: "false", error: "Count not found in body." });
  count = parseInt(count);
  if (!count)
    return res.json({ success: "false", error: "Count not integer." });
  const bot = await client.fetchUser(`${botId}`);
  if (!bot) return res.json({ success: "false", error: "Bot not found." });
  // if (!bot.auth) return res.json({ "success": "false", "error": "Create a bot authorization token." });
  //if (bot.auth !== auth) return res.json({ "success": "false", "error": "Incorrect authorization token." });
  if (bot) {
    database.ref(`Bots/${botId}`).once("value", async function(snapshot) {
      if (snapshot.val() === null)
        return res.json({ success: "false", error: "Bot not found." });
      if (snapshot.val().apiKey != auth) {
        return res.json({
          success: "false",
          error: "Incorrect authorization token."
        });
      } else {
        database
          .ref(`Bots/${botId}`)
          .update({
            guilds_count: `${count}`
          })      
            res.json("Guild Count Posted!");    
      }
    });
  }
});

//Edit
app.post("/EditBackground", async (req, res) => {
  let id = req.body.id;
  let background = req.body.Background;
  // if (!bot.auth) return res.json({ "success": "false", "error": "Create a bot authorization token." });
  //if (bot.auth !== auth) return res.json({ "success": "false", "error": "Incorrect authorization token." });
  if (background) {
    database.ref(`Users/${id}`).once("value", async function(snapshot) {
      if (snapshot.val().user_id != id) {
        return res.json({
          success: "false",
          error: "Incorrect authorization id"
        });
      } else {
        database.ref(`Users/${id}`).update({
          background: `${background}`
        });
      }
    });
  }
});

// that is the api
app.get("/api/bot/:id",limiter, async (req, res) => {
  let botId = req.params.id;


  const bot = await client.fetchUser(`${botId}`);
  if (!bot) return res.json({ success: "false", error: "Bot not found." });
  // if (!bot.auth) return res.json({ "success": "false", "error": "Create a bot authorization token." });
  //if (bot.auth !== auth) return res.json({ "success": "false", "error": "Incorrect authorization token." });
  if (bot) {
    database.ref(`Bots/${botId}`).once("value", async function(snapshot) {
      if (snapshot.val() === null)
        return res.json({ success: "false", error: "Bot not found." });

        return res.json({
          votes: snapshot.val().votes * -1,
          id: snapshot.val().bot,
          name: snapshot.val().name,
          library: snapshot.val().library,
          prefix: snapshot.val().prefix,
          long_description: snapshot.val().long_description,
          short_description: snapshot.val().short_description,
          month_votes: snapshot.val().vote_month,
          server_invite:snapshot.val().server_invite,
          owner: `${snapshot.val().owner_name}#${snapshot.val().owner_discriminator}`,
          website: snapshot.val().website,
          other_owners: snapshot.val().other_owners
        });
      
    });
  }
});

app.get("/api/bot/vote/:id", limiter ,async (req, res) => {

  let botId = req.params.id;
  let auth = req.headers.authorization;
  const user_vote = [];
  
  if (!auth)
    return res.json({
      success: "false",
      error: "Authorization header not found."
    });


  // if (!bot.auth) return res.json({ "success": "false", "error": "Create a bot authorization token." });
  //if (bot.auth !== auth) return res.json({ "success": "false", "error": "Incorrect authorization token." });
  if (botId) {
    database.ref(`Bots/${botId}`).once("value", async function(snapshot) {
      if (snapshot.val() === null)
        return res.json({ success: "false", error: "Bot not found." });
      if (snapshot.val().apiKey != auth) {
        return res.json({
          success: "false",
          error: "Incorrect authorization token."
        });
      } else {
    var votes = await database.ref(`Bots/${botId}/hasvoted`).once("value")

    if(votes.val() === null) {
          return res.json({
          success: "Error",
          Vote_Users_id: "no votes yet", 
      })    
    }
    votes.forEach(function(data) {
      user_vote.push(data.val())
    })
        return res.json({
           user_vote,
          
      })
      }
    });
  }
});

app.post("/verify", async (req, res) => {
  let botId = req.body.id
 const bot = await client.fetchUser(`${botId}`).catch(function err() {
   if(err === "Unknown User")  return res.json({msg: "Null User", });
 })
 database.ref(`Bots/`).orderByChild("bot").equalTo(`${botId}`).once("value",function(data) {
    if(data.val()) return res.json({msg: "Bot Already in my database", });


if(!bot)  return res.json({msg: "Invalid User Provide", });
if(bot.bot === false) return res.json({msg: "This ID is not from a bot", });
if(bot.bot === true ) return res.json({msg: "Redirecting", });    

   })
});

app.post("/vote", async (req, res) => {
  
  let key = req.cookies.token;
  let id = req.body.id;
  let bot = req.body.bot;
  var month = time.getMonth();
  
  if (key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      
        const { username, discriminator } = response;
      var hasvoted = await database.ref(`Users/${response.id}/votes/${bot}`).once("value")
          if (hasvoted.val() !=null) {
            res.contentType("application/json");
            var data = JSON.stringify("/error?e=voted");
            res.header("Content-Length", data.length);
            res.end(data);
          }else {
            var month = time.getMonth();
            var year = time.getYear()
     var user = await database.ref(`Bots/${bot}/hasvoted/${response.id}`).once("value")
   var vote = await database.ref(`Bots/${bot}`).once("value")
   var month_votes = await database.ref(`Bots/${bot}/${year}/${month}`).once("value")
   if(month_votes.val() === null) {
   database.ref(`Bots/${bot}/${year}/${month}`).update({
     votes:  - 1,
   })     
   }else {
    database.ref(`Bots/${bot}/${year}/${month}`).update({
     votes: month_votes.val().votes - 1,
   })    
   }
   database.ref(`Bots/${bot}`).update({
     votes: vote.val().votes - 1,
     vote_month: vote.val().vote_month- 1,
   })
  if(user.val() === null) {
    database.ref(`Bots/${bot}/hasvoted/${response.id}`).set({
     vote: 1,
      id:response.id,
   })    
  }else {
   database.ref(`Bots/${bot}/hasvoted/${response.id}`).update({
     vote: user.val().vote + 1,
     id:response.id,
   })     
  }
const log_channel = client.channels.get(`${process.env.logchannel}`);
  const bot_ = await client.fetchUser(`${bot}`)
  const user_ = await client.fetchUser(`${response.id}`)
  res.contentType("application/json");
  var data = JSON.stringify("/success?s=voted");
  res.header("Content-Length", data.length);
  res.end(data);  
  log_channel.send( `👍 ***${user_.username}#${user_.discriminator}*** just upvoted ***${bot_.username}#${bot_.discriminator}***` );           
          }
    setTimeout(() => { 
   database.ref(`Users/${response.id}/votes/${bot}`).remove()
  },43200000); // 12 hours 5000 43200000
   database.ref(`Users/${response.id}/votes/${bot}`).update({
     vote:"voted",
   })
      })
      .catch();
  } else {
    return res.redirect("/error?e=logged");
  }
});


app.post("/api/generate/key", async (req, res) => {
const log_channel = client.channels.get(`${process.env.logchannel}`);
  let key = req.cookies.token;
  if (!key) return res.json({ success: "false", error: "Not Authorized." });
  if (key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
        let bot_name = req.body.bot;
        let bot = client.users.find("username", `${bot_name}`).id;
        let hashkey = bot + bot_name;
        var apiKey = hash(hashkey);
        database
          .ref(`Bots/${bot}`)
          .update({
            apiKey: apiKey
          })
          .then(function() {
            log_channel.sendMessage(
              `🔑 ${response.username}#${response.discriminator} Generate an Api Key`
            );
            res.contentType("application/json");
            var data = JSON.stringify("/api/keys");
            res.header("Content-Length", data.length);
            res.end(data);
          });
      });
  }
});

app.post("/report", async (req, res) => {
  let key = req.cookies.token;
  const bot = await client.fetchUser(`${req.body.bot}`);
  if (key) {
    // Get the user
    client.guilds
      .get(process.env.guild)
      .fetchMember(req.body.owner)
      .then(guildMember => {
        const embed = new Discord.RichEmbed()
          .setURL("https://yagami.xyz/post-1/")
          .setAuthor(`Bot Reported`)
          .setColor(0x00ae86)
          .setDescription(
            `${bot} has been Reported by ${guildMember} for ***${req.body.selected_reason}*** \n __Additional information__: ***${req.body.add_reason}***.`
          )
          .setFooter(
            `{url}`,
            `https://cdn.discordapp.com/avatars/531853681423941632/5f931e705d26f2b057f01fd1ca9bfbb0.png?size=2048`
          )
          .setThumbnail(
            `https://cdn.discordapp.com/avatars/${guildMember.id}/${guildMember.avatar}.png?size=2048","https://cdn.discordapp.com/avatars/531853681423941632/5f931e705d26f2b057f01fd1ca9bfbb0.png?size=2048`
          )
          .setTimestamp();
      const log_channel = client.channels.get(`${process.env.logchannel}`);
        log_channel.sendMessage("<@&638183327546998809>", embed);
      });
    res.contentType("application/json");
    var data = JSON.stringify("/success?s=reported");
    res.header("Content-Length", data.length);
    res.end(data);
  }
});

/*/
app.post('/reject', async (req, res) => { 
    let key = req.cookies.token;  
    if(!key) return res.redirect("/error?e=wot")
  var log_channel = client.channels.get("638184467227476018");
  				fetch('https://discordapp.com/api/users/@me', {
					headers: {
						Authorization: `Bearer ${key}`
					}
				})
					.then(res => res.json())
					.then(response => {
						const { username, discriminator } = response;
            var Authorization = response
            if (Authorization.message === "401: Unauthorized") {
            res.contentType('application/json');
            var data = JSON.stringify("/error?e=admin")
            res.header('Content-Length', data.length);
            res.end(data);
            }
if(key) {
    // Get the user
    client.guilds.get(`603194252872122389`).fetchMember(req.body.owner).then(guildMember => {
      if(guildMember.roles.has('638183849632727040')) {
      var rejectbot =  database.ref(`Bots/`);
      rejectbot.child(req.body.bot).remove()
    guildMember.sendMessage(`Your bot: ${req.body.bot} has not been approved \n Reason: \n ${req.body.description}`)
      log_channel.send(`${guildMember} The bot ${req.body.bot} has not been approved`)
      }
  })

}
					})
					.catch(console.error);

})
*/

app.get("/list", async (req, res) => {
  var list = req.query.page
    var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }
  var page = req.query.page * -1;
  var end = page * -16;
  database
    .ref("Bots/")
    .orderByChild("votes")
    .limitToFirst(16)
    .startAt(page)
    .endAt(end)
    .once("value", function(snapshot) {
      res.render("list", { url: disc_url, data: snapshot,status:status,list:list });
    });
  if (page > 1) {
    var start = end - 16;
    database
      .ref("Bots/")
      .orderByChild("name")
      .startAfter(start)

      .endAt(end)
      .limitToFirst(16)
      .once("value", function(snapshot) {
        res.render("list", { url: disc_url, data: snapshot,list:list });
      });
  }
});

app.post("/add", async (req, res) => {
  var month = time.getMonth();
  let key = req.cookies.token;
  if(!req.body.bot) return res.json({msg: "No Id Provided", });
  let botId = req.body.bot
  const bot = await client.fetchUser(`${botId}`).catch(function err() {
  if(err === "Unknown User")  return res.json({msg: "Null User", });
 })
 database.ref(`Bots/${botId}`).once("value",function(data) {
if(data.val()) return res.json({msg: "Bot Already in my database", });
if(!bot)  return res.json({msg: "Invalid User Provide", });
if(bot.bot === false) return res.json({msg: "This ID is not from a bot", });

   })  
  
  for(let i in req.body) {
    if(!req.body[i] && i != "other_owners"  && i != "website" && i != "nsfw") return res.json({msg:`No ${i} Provided!`, });
    if(req.body.long_description.length < 300) return res.json({msg:`long_description has less than 300 chars!!`, });
  }
  
    var tags = req.body.tags.split(",")
    var tag_array = []
    for(let tag in tags) {
      tag_array.push(tags[tag])
    }
  
  if(tag_array.length > 4) return res.json({msg:`No more than 4 tags !`, });

 
  if (!key) return res.redirect("/");
        var month = time.getMonth();
      var year = time.getYear();
  if (key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
        const { username, discriminator } = response;
        const user = client.users.get(`${req.body.owner}`);
      const log_channel = client.channels.get(`${process.env.logchannel}`);
        database.ref(`Bots/${botId}`).once("value", function(data) {
          if (data.val() != null) return;
          database
            .ref(`Bots/${bot.id}`)
            .once("value")
            .then(async function(snap) {
              //CHECK IF IS ALREADY A COMMAND WITH THE SAME NAME
              if (snap.val() === null) {
                
                log_channel.send(
                  `${response} added bot ${bot} \n ${url}/bots/${bot.id} (<@&638183849632727040>)`
                );
                database.ref(`Bots/${bot.id}`).update({
                  bot: req.body.bot,
                  name: bot.username,
                  owner: req.body.owner,
                  prefix: req.body.prefix,
                  library: req.body.library,
                  votes: -1,
                  guilds_count: "NA",
                  nsfw:req.body.nsfw,
                  tags:req.body.tags,
                  vote_month: -1,
                  created_at: `${month}`,
                  other_owners: req.body.other_owners,
                  owner_name: response.username,
                  owner_avatar: response.avatar,
                  owner_discriminator: response.discriminator,
                  short_description: req.body.short_description,
                  server_invite: req.body.server_invite,
                  bot_invite: req.body.bot_invite,
                  website: req.body.website,
                  long_description: req.body.long_description,
                  avatar: bot.avatar,
                  status: "Awaiting review"
                });
                database.ref(`Bots/${bot.id}/${year}/${month}`).update({ 
                votes:-1,
                })

                //IF DOES EXIST A COMMAND WITH THE SAME NAME,IT WILL UPDATE
              }
            })
            .then(function() {
            res.json({msg: "Ooo Yes.You added your bot the review! :)", });
              const embed = new Discord.RichEmbed()
                .setAuthor(
                  `${bot.username}#${bot.discriminator}`,
                  `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=2048","https://cdn.discordapp.com/avatars/531853681423941632/5f931e705d26f2b057f01fd1ca9bfbb0.png?size=2048`
                )
                .setColor(0x00ae86)
                .setDescription(
                  `${bot} has been added and is now waiting for approval. \n Current stats is: ***Awaiting review***. Please,be patient`
                )
                .setFooter(
                  `{url}`,
                  `https://cdn.discordapp.com/avatars/531853681423941632/5f931e705d26f2b057f01fd1ca9bfbb0.png?size=2048`
                )
                .setThumbnail(
                  `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=2048","https://cdn.discordapp.com/avatars/531853681423941632/5f931e705d26f2b057f01fd1ca9bfbb0.png?size=2048`
                )
                .setTimestamp();
              user.sendMessage(embed);
            });
        });
      });
  }
});

app.get("/add", async (req, res) => {
  var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }
  if (key) {
    try {
      fetch("https://discordapp.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${key}`
        }
      })
        .then(res => res.json())
        .then(async response => {
          const { username, discriminator } = response;
          var Authorization = response;
          if (Authorization.message === "401: Unauthorized")
            return res.redirect("/error?e=user");
       var ban = await database.ref(`Users/${response.id}`).once("value")
       if(ban.val() != null)  {
          if(ban.val().ban === true)  return res.redirect("/error?e=punished");
       }
          var user = response;
          // Get the user
const guild = client.guilds.get(`${process.env.guild}`);
const log_channel = client.channels.get(`${process.env.logchannel}`);
      if (guild.fetchMember(response.id)) {
            res.render("addbot", {
              url: disc_url,
              email: user.email,
              id: user.id,
              avatar: user.avatar,
              name: user.username,
              discriminator: user.discriminator,
              status:status,
            });
          } else {
            res.redirect("/error?e=guild");
          }
        })
        .catch();
    } catch (err) {
      res.redirect("/logout");
    } // Generate the OAuth Authorize link
  } else {
    res.redirect(disc_url); // Generate the OAuth Authorize link
  }
});

app.get("/report/:id", async (req, res) => {
  var status = ""

  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
        var ban = await database.ref(`Users/${response.id}`).once("value")
       if(!ban) return;
       if(ban.val().ban === true)  return res.redirect("/error?e=punished");
    })
  }  let report_id = req.params.id;
  if (key) {
    try {
      // Get the user
      res.render("report", { url: disc_url, report_id: report_id,status:status });
    } catch (err) {
      res.redirect("/logout");
    } // Generate the OAuth Authorize link
  } else {
    res.redirect(disc_url);
  }
});

app.get("/error", async (req, res) => {
  let key = req.cookies.key; // Retrieve the user's access key
  res.render("error", { url: disc_url });
  // Generate the OAuth Authorize link
});

app.get("/success", async (req, res) => {
  let key = req.cookies.key; // Retrieve the user's access key
  res.render("success", { url: disc_url });
  // Generate the OAuth Authorize link
});

app.get("/edit/:id", async (req, res) => {
  var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }  let bot = req.params.id;
  if (key) {
      // Get the user
      fetch("https://discordapp.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${key}`
        }
      })
        .then(res => res.json())
        .then(response => {
          var user = response;
          var Authorization = response;
          if (Authorization.message === "401: Unauthorized")
            return res.redirect("/error?e=user"); 
          const { username, discriminator } = response;
          database.ref(`Bots/${req.params.id}`).once("value", function(snapshot) {
            if(snapshot.val() === null) return res.redirect("/error?e=nobotfound"); 
            if(snapshot.val().owner === user.id) return res.render("editbot", {url: disc_url,bot: bot,email: user.email,id: user.id,avatar: user.avatar,name: user.username,discriminator: user.discriminator,data: snapshot.val(),status:status});

          });
        })
        .catch();
  } else {
    res.redirect(disc_url);
  }
});

app.get("/vote/:id", async (req, res) => {
  var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
        var ban = await database.ref(`Users/${response.id}`).once("value")
       if(ban.val() != null)  {
          if(ban.val().ban === true)  return res.redirect("/error?e=punished");
       }
      status = response
            // Get the user
      let bot = req.params.id;
      var month = time.getMonth();
      var year = time.getYear();
       var month_votes_val = 0
            var month_votes = await database.ref(`Bots/${bot}/${year}/${month}`).once("value")
           if(month_votes.val() != null) {
             month_votes_val = month_votes.val().votes
           }
      database
        .ref("Bots/")
        .orderByChild("bot")
        .equalTo(`${bot}`)
        .once("value", function(snapshot) {
          if (snapshot.val() != null)
            return res.render("vote", {
              url: disc_url,
              month_votes:month_votes_val,
              bot: bot,
              data: snapshot,
              status:status
            });
        });
    })
  } else {
    res.redirect(disc_url);
  }
});

app.get("/embed/:id", async(req, res) => {
    let bot = client.users.get(req.params.id)

    database.ref(`/Bots/${req.params.id}`).once("value", async function(data) {   
      if(data.val() === null) return res.json(`no bot found!`)
  client.guilds
            .get(process.env.guild)
            .fetchMember(req.params.id)
            .then(async guildMember => {
    let lg = `https://cdn.discordapp.com/avatars/${data.val().bot}/${data.val().avatar}.png`;
      var logo2 = "https://cdn.glitch.com/a41b7884-47f3-4b54-aba8-dfda5825d37f%2Fcloud.png?v=1583694445421"
const canvas = createCanvas(400, 180);
      registerFont(__dirname +'/assets/anton.ttf', { family: 'Impact' })
      const ctx = canvas.getContext('2d');
      const avatar = await loadImage(lg)
      const logo = await loadImage(logo2)
      ctx.fillStyle = "#252728";
      ctx.fillRect(0, 0, 400, 180);
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, 400, 30);
    var color = ""
      if(guildMember.presence.status === "online") {
      color = "#1ac588"
      }
      if(guildMember.presence.status === "offline") {
      color = "#6b6a6a"
      }
      if(guildMember.presence.status === "idle") {
      color = "#ffaa00"
      }
      if(guildMember.presence.status === "dnd") {
      color = "#c5341a"
      }

      
      ctx.drawImage(avatar, 20, 40, 100, 100)
      ctx.drawImage(logo, 350, -10, 50, 50)
     ctx.fillStyle = color;     
ctx.beginPath()
ctx.arc(115,135,12,0,Math.PI*2, false); // outer (filled)
ctx.fill();
  ctx.font = '30px "Impact"';
	// Select the style that will be used to fill the text in
	ctx.fillStyle = '#ffffff';
	// Actually fill the text with a solid color
	ctx.fillText(`${data.val().name} `,200,70);
      
     ctx.font = '20px "Impact"';
	// Select the style that will be used to fill the text in
	ctx.fillStyle = '#ffffff';   
      ctx.fillText("Cloud Bot List",10,24);
          res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(canvas.toBuffer(), 'binary')
    })
    })
});


app.post("/edit", async (req, res) => {
  const log_channel = client.channels.get(`${process.env.logchannel}`);
  let key = req.cookies.token;
  if (!key) return res.redirect("/error?e=logged");
  if (key) {
    fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
        const { username, discriminator } = response;

          const bot = await client.guilds
        .get(`${process.env.guild}`)
        .fetchMember(req.body.bot)
        .then(guildMember => { 
        return guildMember.user
        })
          var background = req.body.background;
          const user = response;
          if (!bot) {
                        res.contentType("application/json");
    var data = JSON.stringify("/error?s=wot");
    res.header("Content-Length", data.length);
    res.end(data);
          }
          // console.log(req.body.bot,req.body.owner,req.body.library,req.body.short_description,req.body.server_invite,req.body.bot_invite,req.body.website,req.body.long_description)
          const database = firebase.database();
          //REF TO THE DATABASE ADRESS WHERER IT CONTAINS THE COMMANDS INFOS
          database
            .ref(`Bots/${bot.id}`)
            .once("value")
            .then(async function(snap) {
              //CHECK IF IS ALREADY A COMMAND WITH THE SAME NAME
              if (snap.val() === null) {
                database.ref(`Bots/${bot.id}`).set({
                  bot: req.body.bot,
                  name: bot.username,
                  color:req.body.color,
                  owner: req.body.owner,
                  tags: req.body.tags,
                  prefix: req.body.prefix,
                  owner_avatar: user.avatar,
                  other_owners: req.body.other_owners,
                  owner_name: user.username,
                  owner_discriminator: user.discriminator,
                  library: req.body.library,
                  short_description: req.body.short_description,
                  server_invite: req.body.server_invite,
                  bot_invite: req.body.bot_invite,
                  website: req.body.website,
                  long_description: req.body.long_description,
                  status: "Accepted"
                });
                //IF DOES EXIST A COMMAND WITH THE SAME NAME,IT WILL UPDATE
              } else {
                if (snap.val().Certfied === true) {
                  database.ref(`Bots/${bot.id}`).update({
                    bot: req.body.bot,
                    background: background,
                    tags: req.body.tags,
                    prefix: req.body.prefix,
                   
                    name: bot.username,
                    owner_avatar: user.avatar,
                    owner_name: user.username,
                    owner: req.body.owner,
                    other_owners: req.body.other_owners,
                    owner_discriminator: user.discriminator,
                    library: req.body.library,
                    short_description: req.body.short_description,
                    server_invite: req.body.server_invite,
                    bot_invite: req.body.bot_invite,
                    website: req.body.website,
                    long_description: req.body.long_description
                  });
                } 
                if(snap.val().Certfied != true)
                {
                  database.ref(`Bots/${bot.id}`).update({
                    bot: req.body.bot,
                    tags: req.body.tags,
                    prefix: req.body.prefix,
                    name: bot.username,
                    owner_avatar: user.avatar,
                    owner_name: user.username,
                    owner: req.body.owner,
                    other_owners: req.body.other_owners,
                    owner_discriminator: user.discriminator,
                    library: req.body.library,
                    short_description: req.body.short_description,
                    server_invite: req.body.server_invite,
                    bot_invite: req.body.bot_invite,
                    website: req.body.website,
                    long_description: req.body.long_description
                  });
                }
              }
              log_channel.send(
                `${user.username} Edited the bot ${bot} \n ${url}/bots/${bot.id}`
              );
            });
       
      })
      .catch();
    const bot = await client.fetchUser(`${req.body.bot}`).catch;

    res.redirect("/");
  }
});

app.get("/search/:tag", async (req, res) => {
  var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }  
  let tag = req.params.tag;
  var searched = [];
  var sSearch = tag.toLowerCase();
  // Get the user
  database.ref("Bots/").once("value", function(snapshot) {
    snapshot.forEach(function(search) {
      var searchFor = search.val().name.toLowerCase();
      if (searchFor.includes(sSearch)) {
        searched.push(search.val());
      }
    });
    if (snapshot.val() === null) return res.redirect("/error?e=user");
    res.render("search", { url: disc_url, data: searched,status:status,search:tag });
  });

  // Generate the OAuth Authorize link
});

app.get("/mybots", async (req, res) => {
  var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response

    })
  }  
  if (key) {
    try {
      // Get the user
      fetch("https://discordapp.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${key}`
        }
      })
        .then(res => res.json())
        .then(async response => {
         var ban = await database.ref(`Users/${response.id}`).once("value")
       if(ban.val() != null)  {
          if(ban.val().ban === true)  return res.redirect("/error?e=punished");
       }
          const { username, discriminator } = response;
          var Authorization = response;
          if (Authorization.message === "401: Unauthorized")
            return res.redirect("/error?e=user");
          var user = response;
          database
            .ref("Bots/")
            .orderByChild("owner")
            .equalTo(user.id)
            .once("value", function(snapshot) {
              if (snapshot.val() === null)
                return res.redirect("/error?e=nobot");
              if (snapshot.val().status === "Awiting review") return;
            
              res.render("mybots", { url: disc_url, data: snapshot,status:status });
            });
        })
        .catch();
    } catch (err) {
      res.redirect("/logout");
    } // Generate the OAuth Authorize link
  } else {
    res.redirect(disc_url);
  }
});

app.get("/user/", async (req, res) => {
  var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }  
  let name = req.query.name;
  // Get the user
  if (name) {
    database
      .ref("Bots/")
      .orderByChild("owner_name")
      .equalTo(name)
      .once("value", function(snapshot) {
        if (snapshot.val() === null) return res.redirect("/error?e=user");
        database
          .ref("Users/")
          .orderByChild("name")
          .equalTo(name)
          .once("value", function(data) {
            res.render("user", { url: disc_url, data: snapshot, user: data,status:status });
          });
      });
  } else {
    try {
      fetch("https://discordapp.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${key}`
        }
      })
        .then(res => res.json())
        .then(response => {
          const { username, discriminator } = response;
          var Authorization = response;
          if (Authorization.message === "401: Unauthorized")
            return res.redirect("/error?e=user");
          var user = response;
          database
            .ref("Bots/")
            .orderByChild("owner_name")
            .equalTo(user.username)
            .once("value", function(snapshot) {
              if (snapshot.val() === null) return res.redirect("/error?e=user");
              database
                .ref("Users/")
                .orderByChild("name")
                .equalTo(user.username)
                .once("value", function(data) {
                  res.render("user", {
                    url: disc_url,
                    data: snapshot,
                    user: data,
                    status:status,
                  });
                });
            });
        })
        .catch();
    } catch (err) {
      res.redirect("/logout");
    }
  }

  // Generate the OAuth Authorize link
});

app.get("/tag/:tag", async (req, res) => {
    var status = ""
  let key = req.cookies.token;
  let tag = req.params.tag;
  var month = time.getMonth();
  var tags = [];
  if (req.params.tag === "new") {
    database
      .ref("/Bots")
      .orderByChild("month")
      .equalTo(`${month}`)
      .once("value", function(New) {
        New.forEach(function(data) {
          tags.push(data.val());
        });
        res.render("tag", { data: tags, url: disc_url,status:status,tag:tag });
      });
  }else {
   database
    .ref("Bots/")
    .once("value", function(snapshot) {

      snapshot.forEach(function(data) {
        if (data.val().tags.includes(`${req.params.tag}`)) {
          tags.push(data.val());
        }
      });
          res.render("tag", { data: tags, url: disc_url,status:status,tag:tag  });

    })   
  }

});
app.get("/explore",async (req, res) => { 
 res.render("advanced", {  url: disc_url });
})


client.on("message", async msg => {
    // Fazer a react em suggestions
  if(msg.channel.id === "650308828373712977") {
    msg.react('✅');
    msg.react('⛔');
    
  }
  var args = msg.content.substring(prefix.length).split(" ");
    if (!msg.content.startsWith(prefix)) return;
  let messageArray = msg.content.split(" ");
  let msgcontent = msg.content.substring(prefix.length).slice(" ");
  let cmd = messageArray[0];
  let commandFile =
    client.commands.get(cmd.slice(prefix.length)) ||
    client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
  if (commandFile) commandFile.run(client, msg, args, prefix, database);

  switch (args[0]) {
    case "help":
      if (!args[1]) {
        let embed = new Discord.RichEmbed();
        embed.setTitle(`Command Help`);
        embed.setColor("#02f781");
        embed.setDescription(
          `For more information,use : ***${prefix}help*** + "Command name" `
        );
        client.commands.forEach(command => {
          embed.addField(
            `Command: ${command.config.name}`,
            `Permission: ${command.config.permission}`
          );
        });
        msg.channel.send(embed);
      }
      if (args[1]) {
        let command = args[1];
        let embed = new Discord.RichEmbed();
        embed.setColor("#02f781");
        if (client.commands.has(command)) {
          command = client.commands.get(command);
          embed.setTitle(`Command **${command.config.name}**`);
          embed.setDescription(
            `__Description:__ \n **${command.config.description}**`
          );
          embed.addField(`__Usage:__`, `${command.config.usage} | `, true);
          embed.addField(
            `__Permission:__`,
            ` | ${command.config.permission}`,
            true
          );
        }
        msg.channel.send(embed);
      }
      break;
  }

  
});

client.on("ready", () => {
          database.ref(`Users/`).once("value",function(data) {
          data.forEach(function(user) {
            database.ref(`Users/${user.val().user_id}/votes/`).remove()
          })
        })
      setTimeout(() => { 
        database.ref(`Users/`).once("value",function(data) {
          data.forEach(function(user) {
            database.ref(`Users/${user.val().user_id}/votes/`).remove()
          })
        })
   
  },43200000); // 12 hours 5000 43200000

  setInterval(function() {
    database.ref("Bots/").once("value", function(snapshot) {
      snapshot.forEach(function(data) {
        const user = client.users.get(`${data.val().owner}`);
        var bot = client.users.get(`${data.val().bot}`);

        if (!bot) return;

        client.guilds
          .get(process.env.guild)
          .fetchMember(data.val().bot)
          .then(bots => {
            database.ref(`Bots/${data.val().bot}`).update({
              avatar: bots.user.avatar
            });

            if (bots.roles.has("651304358553583628")) {
              database.ref(`Bots/${data.val().bot}`).update({
                Certfied: true
              });
            } else {
              database.ref(`Bots/${data.val().bot}`).update({
                Certfied: false
              });
            }
              if (bots.roles.has("664954112445644810")) {
                database.ref(`Bots/${data.val().bot}`).update({
                  Premium: true
                });
              }else {
                database.ref(`Bots/${data.val().bot}`).update({
                  Premium: false
                });                
              }  
          });
        if (!user) {
          database.ref(`Bots/${bot.id}`).update({
            avatar: bot.avatar,
            owner_avatar:
              "https://assets.b9.com.br/wp-content/uploads/2018/10/discord-b9.jpg",
            owner_name: "User",
            owner_discriminator: "#Nothing"
          });
        } else {
          client.guilds
            .get(process.env.guild)
            .fetchMember(user.id)
            .then(guildMember => {
     database.ref(`Bots/${bot.id}`).update({
            owner_avatar:user.avatar,
            owner_name: user.username,
            owner_discriminator: user.discriminator,
          });
              if (guildMember.roles.has("638183849632727040")) {
                database.ref(`Users/${user.id}`).update({
                  Approver: true
                });
              }
              if (guildMember.roles.has("651283713983905812")) {
                database.ref(`Users/${user.id}`).update({
                  Certfied: true
                });
              }else {
                database.ref(`Users/${user.id}`).update({
                  Certfied: false
                });                
              }
              if (guildMember.roles.has("664954112445644810")) {
                database.ref(`Users/${user.id}`).update({
                  Premium: true
                });
              }else {
                database.ref(`Users/${user.id}`).update({
                  Premium: false
                });                
              }            
            });
          database.ref(`Users/${user.id}`).update({
            user_id: user.id,
            avatar: user.avatar,
            name: user.username,
            discriminator: user.discriminator
          });
        }
      });
    });
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    client.user.setPresence({
      game: { name: `${activities_list[index]}`, type: 0 }
    }); // sets bot's activities to one of the phrases in the arraylist.
  }, 100000);
  console.log(`Logged in as ${client.user.tag}!`);
});

app.get("/invite", async (req, res) => {
  res.redirect(
    "https://discordapp.com/oauth2/authorize?client_id=531853681423941632&scope=bot&permissions=8"
  );
});
app.get("/tos", async (req, res) => {
    var status = ""
  let key = req.cookies.token;
    if(key) {
    fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${key}`
      }
    })
      .then(res => res.json())
      .then(async response => {
      status = response
    })
  }
  res.render("terms", { url: disc_url,status:status });
});

app.get("/server", async (req, res) => {
  res.redirect("https://discord.gg/TuAQ8Ab");
});

app.get("/login", (req, res) => {
  
  res.redirect(disc_url);
});

app.get("/callback", async (req, res) => {

  if (!req.query.code) throw new Error("NoCodeProvided");
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const FormData = require("form-data");

  // ...

  const data = new FormData();

  data.append("client_id", process.env.client_id);
  data.append("client_secret", process.env.client_secret);
  data.append("grant_type", "authorization_code");
  data.append("redirect_uri", process.env.redirect_url);
  data.append("scope", "identify");
  data.append("code", req.query.code);

  var response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: data
  });

  const json = await response.json();

  res.cookie(
    "key",
    `${json.access_token}`,
    { MaxAge: 36000000000 },
    { secure: true },
    { sameSite: "lax" }
  );
    res.cookie(
    "token",
    `${json.access_token}`,
    { MaxAge: 36000000000 },
    { secure: true },
    { sameSite: "lax" }
  );
   res.redirect(`/`);
});

app.get("/logout", (req, res) => {
  let token = req.cookies.token;
  if (!token) return res.redirect(`/login`);
  res.clearCookie("token");
  res.redirect("/");
});

app.get("/invite/:id", (req, res) => {
  let invite = req.params.id;
  res.status(301).redirect(`https://discord.gg/invite/${invite}`);
});
app.get("/redirect/:id", (req, res) => {
  let invite = req.params.id;
  res.status(301).redirect(`https://discord.gg/${invite}`);
});
client.login(process.env.token);
app.listen(3000, () => {
  console.log("Server Ready.");
});
// Prepare the server
