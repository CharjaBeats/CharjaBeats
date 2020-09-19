const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');

const queue = new Map();

const client = new Discord.Client();

client.login(token);

client.on('ready', () => {
  console.log('Charjabug is online!');
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
 });

 client.once('disconnect', () => {
  console.log('Disconnect!');
 });
 
 
client.on("message", async message => {

  const command = args.shift().toLowerCase();

    // Easter eggs
    if (command === "charja"){
        message.channel.send("bug")
    }else if (command === "roll"){
        message.channel.send("no")
    }else if (command === "rules"){
        message.channel.send("1. No verbal abuse 2. Please no spamming 3. If you are planning on inviting someone, please notify me first 4. Inappropriate images and photos will result in a kick 5. joining Jolt Skifts without permission will result in two warnings 6. Three warnings will result in a kick 7. Do not make fun of other people's skin in Jolt Plains unless they actually want to be 8. Do not gang up on other users 9. do not spam commands")
    };
    // Easter Eggs [end]

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const serverQueue = queue.get(message.guild.id);
  
    if (message.content.startsWith(`${prefix}play`)) {
      execute(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
      skip(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
      stop(message, serverQueue);
      return;
    } else {
      message.channel.send("You need to enter a valid command!");
    }
  });

  async function execute(message, serverQueue) {
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }


  
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };

    if (!serverQueue) 
    { 
     // don't do anything  
    } 
    else
    {
     serverQueue.songs.push(song);
     console.log(serverQueue.songs);
     return message.channel.send(`${song.title} has been added to the queue!`);
    }
  
    /*if (!serverQueue) { */

    const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
      
      // Setting the queue using our contract
      queue.set(message.guild.id, queueContruct);
      // Pushing the song to our songs array
      queueContruct.songs.push(song);
  
      try {
        // Here we try to join the voicechat and save our connection into our object.
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        // Calling the play function to start a song
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        // Printing the error message if the bot fails to join the voicechat
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } 
  
  
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }
  
  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
  
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }
  




