const Discord = require('discord.js');
const auth = require('./auth.json');

//setup bot
const bot = new Discord.Client();
bot.login(auth.disctoken);

//listen to ready event
bot.on('ready', () => {
    console.log('ready event');
});

//listen to messages
bot.on('message', (msg)=> {
    //message is command to start
    //TODO: edge case where poop emoji is not a command
    if(msg.content.includes('💩')){
        var member = msg.member;
        //make sure invoker is in a voice channel
        if(member.voiceChannelID == null|| member.voiceChannelID == undefined)
            msg.reply('sorry, you have to be in a voice channel to run this command');
        else{
            
            //get voice channel and mentioned user
            var channel = bot.channels.get(member.voiceChannelID);
            var mentioned = getUserFromMention(msg.content.split(" ")[1]);
            
            if(!mentioned) {
                msg.reply('potty mouth not found');
            }
            if(!channel){
                msg.reply('toilet not found');
            }else{
                channel.join().then(connection => {
                    var another = false;
                    var dispatcher = null;
                    //speaking is true when a user starts speaking
                    //speaking is false when a user stops speaking
                    //the event below listens to all users, so specifically look for the mentioned user
                    //TODO: fix so that the fart pauses when mentioned stops talking and
                    // plays another file if the current file finishes
                    connection.on('speaking', (userOrMember, speaking) => {
                        if(mentioned == userOrMember && (speaking || another)){
                            //get a random fart(1-7).mp3 file
                            var file = './farts/fart'+(Math.floor(Math.random() * 6)+ 1)+'.mp3';

                            //play the file
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

//helper function to parse user from mentioned string like: <@!user>
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
