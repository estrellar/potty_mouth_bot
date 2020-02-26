const Discord = require('discord.js');
const auth = require('./auth.json');

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log('ready event');
});

//var mentioned = null;
bot.on('message', (msg)=> {
  if(msg.content.includes('💩')){
    var member = msg.member;

    if(member.voiceChannelID == null|| member.voiceChannelID == undefined)
    msg.reply('sorry, you have to be in a voice channel to run this command');
    else{
      console.log('vcid', member.voiceChannelID);
      var channel = bot.channels.get(member.voiceChannelID);
      var mentioned = getUserFromMention(msg.content.split(" ")[1]);
      //console.log(mentioned)
      if(!mentioned) {
        msg.reply('potty mouth not found');
      }
      if(!channel){
        msg.reply('toilet not found');
      }else{
        channel.join().then(connection => {
          var another = false;
          var dispatcher = null;
          connection.on('speaking', (userOrMember, speaking) => {
            if(mentioned == userOrMember && (speaking || another)){
              var file = './farts/fart'+(Math.floor(Math.random() * 6)+ 1)+'.mp3';
              dispatcher = connection.playFile(file);
              
              dispatcher.on('end', end => {
                another = true;
              })
            }else if(!speaking && dispatcher != null){
              dispatcher.end();
              another = false;
            }
          })
        }).catch((e) => {
          console.error(e);
        });
      }
    }
  }
});

function getUserFromMention(mention){
  if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

    return bot.users.get(mention);
  }
}

bot.login(auth.disctoken);
