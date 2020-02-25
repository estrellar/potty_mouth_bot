const Discord = require('discord.js');
const auth = require('./auth.json');
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('ready event');
});

bot.on('message', (msg)=>{
    if(msg.content.includes('💩')){
        //make sure invoker is in voice channel,
        //get @user#1234
        //join voic channel and listen to user speaking event
        var member = msg.member;
        
        if(member.voiceChannelID == null|| member.voiceChannelID == undefined)
            msg.reply('sorry, you have to be in a voice channel to run this command');
        else{
            console.log('vcid', member.voiceChannelID);
            var channel = bot.channels.get(member.voiceChannelID);
            if(!channel){
                msg.reply('toilet not found');
            }else{
                channel.join().then((connection) => {
                    var dispatcher = connection.playFile('./fart1.mp3');
                    dispatcher.on("end", end => {
                        console.log('done playing', end);
                    });
                }).catch((e) =>{
                    console.error(e);
                });
                
            }
        }
        
        
    }
        
});

bot.login(auth.disctoken);
