const discord = require("discord.js");
const ms = require("ms");
const botConfig = require("./botconfig.json");

const bot = new discord.Client();
bot.commands = new discord.Collection();

bot.on("ready", async () => {

    bot.user.setActivity('infinitely high in the sky', { type: 'WATCHING' });
    console.log(`${bot.user.username} is online!`);

});

bot.on("guildMemberAdd", member => {

    const channel = member.guild.channels.find("name", "join-leave");

    if (!channel) return;

    var joinicon = member.user.displayAvatarURL;

    var joinembed = new discord.RichEmbed()
        .setColor("#36d238")
        .setDescription(`**${member.user.username}** heeft zojuist **MoreMC** betreden.`)
        .setFooter(`User joined the server`, joinicon)
        .setTimestamp();

    channel.send(joinembed);

});

bot.on("guildMemberAdd", guildMember => {

    guildMember.addRole(guildMember.guild.roles.find('name', "Member"));

});

bot.on("guildMemberRemove", member => {

    const channel = member.guild.channels.find("name", "join-leave");

    if (!channel) return;

    var leaveicon = member.user.displayAvatarURL;

    var leaveembed = new discord.RichEmbed()
        .setColor("#ec4040")
        .setDescription(`**${member.user.username}** heeft zojuist **MoreMC** verlaten.`)
        .setFooter(`User leaved the server`, leaveicon)
        .setTimestamp();

    channel.send(leaveembed);

});

var noreclame = ["https://", "http://"];

bot.on("message", async message => {

    // Als bot bericht stuurt stuur dan return
    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    var arguments = messageArray.slice(1);

    var Moderator = botConfig.Moderator;

    var msg = message.content.toLowerCase();

    for (var i = 0; i < noreclame.length; i++) {

        if (msg.includes(noreclame[i])) {

            message.delete();

            return message.reply("Je mag geen reclame maken in deze Discord Server").then(msg => msg.delete(5000));
        }
    }

    if (command === `${prefix}kick`) {

        if (!message.member.roles.some(r => [`${Moderator}`].includes(r.name))) return message.channel.send("Je kunt dit niet").then(msg => { msg.delete(3000) }).then(message.delete());
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(arguments[0]));
        if (!kUser) return message.channel.send("Kan gebruiker niet vinden.");
        if (kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Je kunt die gebruiker niet kicken");
        message.guild.member(kUser).ban(bReason);

        return;
    }

    if (command === `${prefix}ban`) {

        if (!message.member.roles.some(r => [`${Moderator}`].includes(r.name))) return message.channel.send("Je kunt dit niet").then(msg => { msg.delete(3000) }).then(message.delete());
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(arguments[0]));
        if (!bUser) return message.channel.send("Kan gebruiker niet vinden.");
        if (bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Je kunt die gebruiker niet bannen");
        message.guild.member(bUser).ban(bReason);

        return;
    }

    if (command === `${prefix}mute`) {
        if (!message.member.roles.some(r => [`${Moderator}`].includes(r.name))) return message.channel.send("Je kunt dit niet").then(msg => { msg.delete(3000) }).then(message.delete());
        let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(arguments[0]));
        if (!mUser) return message.channel.send("Kan gebruiker niet vinden").then(msg => { msg.delete(3000) }).then(message.delete());
        if (mUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Je kunt die gebruiker niet mute");
        var muteRole = message.guild.roles.find("name", "Muted");
        await (mUser.addRole(muteRole.id));

        return;
    }

    if (command === `${prefix}say`) {
        if (!message.member.roles.some(r => [`${Moderator}`].includes(r.name)))
            return message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `Je kunt dit niet`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        if (arguments.length == 0) return message.channel.send(({
            embed: {
                color: 0xec4040,
                description: `Gebruik **!say <message>**`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        message.delete();
        const sayMessage = arguments.join(" ");
        message.channel.send(sayMessage);
        message.delete("!say");
    }

    if (command === `${prefix}message`) {
        if (!message.member.roles.some(r => [`${Moderator}`].includes(r.name)))
            return message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `Je kunt dit niet`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        if (arguments.length == 0) return message.channel.send(({
            embed: {
                color: 0xec4040,
                description: `Gebruik **!message <message>**`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        message.delete();
        const messageMessage = arguments.join(" ");

        let messageembed = new discord.RichEmbed()
            .setDescription(messageMessage)
            .setColor("#ff8100");

        message.channel.send(messageembed);
        message.delete("!message");
    }

    if (command === `${prefix}help`) {
        if (message.channel.name == "botchat") {
            let helpembed = new discord.RichEmbed()
                .setDescription("Je hebt me zojuist wakker gemaakt! 💤")
                .setColor("#ff8100")
                .addField("**Beschikbare Commands**", "!help **»** deze pagina.\n!serverinfo **»** zie de informatie van deze server. (**Onderhoud**)\n!botinfo **»** zie de informatie van de bot.");

            let helpcheckembed = new discord.RichEmbed()
                .setDescription(`**${message.member.user.username}**, er is een helppagina verstuurd naar je **DM**!`)
                .setColor("#ff8100");

            message.author.send(helpembed);
            message.channel.send(helpcheckembed).then(msg => { msg.delete(5000) }).then(message.delete(5000));
        }
    }

    if (command === `${prefix}botinfo`) {
        if (message.channel.name == "botchat") {
            let boticon = bot.user.displayAvatarURL;
            let botinfoembed = new discord.RichEmbed()
                .setTitle("Botinfo")
                .setDescription("*Hier word de informatie van de bot weergegeven*")
                .setColor("#ff8100")
                .addField("_ _", `**Bot Name** MoreMC\n**Geboren op** Vrijdag, 28 September 2018\n**Bot gemaakt voor** MoreMC\n*Bot has made by HotsieKnotsie#4983*`)
                .setTimestamp()
                .setFooter("Botinfo", boticon);

            message.channel.send(botinfoembed).then(message.delete("!botinfo"));

        }
    }
});

bot.login(process.env.BOT_TOKEN);
