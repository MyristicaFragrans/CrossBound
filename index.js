const config = require('./config.json');
let sb;
let usingChannel;

var Starbound = require('starbound.js');
const Discord = require('discord.js');
Tail = require('tail').Tail;

const discord = new Discord.Client({intents: [Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent]});

var processLock = false;

tail = new Tail(config.serverLogPath);

tail.on('line', function(data) {
  std=data.toString().replace(/(\r\n|\n|\r)/gm,""); //remove breaklines
  try {
    processSTD(std);
  } catch(e) {
    console.error("Error: ", e);
  }
});
function processSTD(data) {
  let a = data.split(' ');
  a.shift()
  if (safeGet(a,1) != 'RCON' || !data.endsWith('echo ping'))
    console.log(data);
  if(safeGet(a, 0)=="[Info]") {
    if(safeGet(a, 1)=="UniverseServer:") {
      if(safeGet(a, 2)=="Client") {
        if(a.indexOf("connected")!=-1) {
          usingChannel.send("**"+a[3]+" joined**");
          //client connected
        } else
        if(a.indexOf('disconnected')!=-1) {
          usingChannel.send(`**${a[3]} left**`)
          //client disconnected
        }
      }
    } else
    if(safeGet(a, 1)=="Chat:") {
      //chat client
      var chat = a.slice(2,a.length).join(' ');
      
      if(!chat.match(/<(\w|\s)*> \//)) //do not send commands
        usingChannel.send(chat);
    }
  }
}
tail.watch();

discord.on('ready', () => {
  console.log(`[Discord] Logged in as ${discord.user.tag}!`);
  discord.channels.fetch(config.discordChannelID).then(channel => {
    usingChannel = channel;
    console.log(`[Discord] Using channel ${channel.name}`);
  }).catch(err=>{
    console.error("[Discord] Error fetching channel:", err);
    process.exit(1);
  });
});
discord.on('messageCreate', msg => {
  if(processLock && discord.user.id!=msg.author.id && msg.channel.id == config.discordChannelID) {
    sb.broadcast("<" + msg.author.displayName + "> " + msg.content);
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
      processLock = true;
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
startListeners()
//safe getter
function safeGet(array, index) {
  if(array.length<=index) return null;
  return array[index];
}
