const Discord = require("discord.js");

const config = require("./config.json");

const client = new Discord.Client();

const prefix = "-";

//adding class to include calls
const CallsCBeats = require("./CharjaBeats")

client.login(config.BOT_TOKEN);
client.on('ready', () => {
    console.log('Charjabug is online!');
  });

client.on("message", message =>{
if(!message.content.startsWith(prefix) || message.author.bot) return;

const args = message.content.slice(prefix.length).split(/ +/);
const command = args.shift().toLowerCase();

if(command === "charja"){
    message.channel.send("bug")
    
}else if(command === "roll"){
    message.channel.send("no")
}else if(command === "rules"){
    message.channel.send("1. No verbal abuse 2. Please no spamming 3. If you are planning on inviting someone, please notify me first 4. Inappropriate images and photos will result in a kick 5. joining Jolt Skifts without permission will result in two warnings 6. Three warnings will result in a kick 7. Do not make fun of other people's skin in Jolt Plains unless they actually want to be 8. Do not gang up on other users 9. do not spam commands")
}else if(command === "play"){
 
    message.channel.send("test")

}

});
  