const config = require('./config.json');
let sb;
let usingChannel;

const path = require('path');
var Starbound = require('starbound.js');
const spawn = require("child_process").spawn;
const Discord = require('discord.js');

process.chdir(path.dirname(config.serverPath));
const server = spawn(config.serverPath);
const discord = new Discord.Client();

var processLock = false;
server.stdout.on('data', function(data) {
  console.log(data.toString());
  processSTD(data.toString());
  if(!processLock && data.toString().includes('[Info] UniverseServer: listening for incoming TCP connections on')) {
    processLock = true;
    startListeners();
    console.log("[Wrapper] Started Listeners");
  }
});

function processSTD(data) {
  a = data.split(' ');
  //console.log(a);
  if(safeGet(a, 0)=="[Info]") {
    if(safeGet(a, 1)=="UniverseServer:") {
      if(safeGet(a, 2)=="Client") {
        if(a.indexOf("connected")!=-1) {
          //client connected
          console.log("Client Connected");
        } else
        if(a.indexOf('disconnected')!=-1) {
          //client disconnected
          console.log("Client Disconnected");
        }
      }
    } else
    if(safeGet(a, 1)=="Chat:") {
      //chat client
      console.log("Client Chatted");
      var chat = a.slice(2,a.length).join(' ');
      usingChannel.send(chat);
    }
  }
}

discord.on('ready', () => {
  console.log(`[Discord] Logged in as ${discord.user.tag}!`);
  discord.channels.fetch(config.discordChannelID)
  .then(channel => {
    usingChannel = channel;
    console.log("[Discord] Found channel " + channel.name)
  }).catch(console.error);
});
discord.on('message', msg => {
  if(processLock && discord.user.id!=msg.author.id && msg.channel.id === config.discordChannelID) {
    sb.broadcast("<" + msg.author.username + "> " + msg.content);
  }
});

discord.login(config.discordToken);

function startListeners() {
  sb = new Starbound(config.host, config.port);
  sb.timeout = 30000;
  
  sb.on('close', function(dueToError) {
    console.log('[Listener] Connection to Starbound has been closed.');
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  });
  
  sb.on('timeout', function() {
    console.log('[Listener] Connection timed out.');
  });
  
  sb.on('error', function(err) {
    console.log("[Listener] There's been an error:", err.message);
  });
  
  var interval = null;
  function ping() {
    if (sb.connected) {
      sb.echo('ping');
    }
  }
  
  sb.connect(config.rconPass, function(successful) {
    if (successful) {
  
      console.log('[Listener] Successfully connected to Starbound');
      // "ping" the server every 15 seconds
      interval = setInterval(ping, 15000);
  
      sb.listUsers(function(message) {
        message.users.forEach(function(info) {
          console.log(info.clientId, info.username, info.uuid);
        });
      });
    }
  });
}

//safe getter
function safeGet(array, index) {
  if(array.length<=index) return null;
  return array[index];
}