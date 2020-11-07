const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
const lyrics = fs.readFileSync('lyrics.txt', 'utf-8').replace(/\r/g, '').split('\n');
const config = require ('./config.json');

client.on('ready', () => {
    console.log(`Started Lyrical -> ${client.user.tag}`);
});

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.author.id !== config.yourId) return console.log('Author Check');

    if (message.content === 'hey') return message.reply('\n> Hello');

    if (message.content === 'lyrical') {
        await message.delete();
        const webhook = await message.channel.createWebhook('LyricMc', { reason: 'trolll' });
        const memberCollection = await message.guild.members.fetch();
        const members = memberCollection.array();

        for (const lyric of lyrics) {
            if (lyric === '' || lyric === ' ') { continue; }
            const member = members[Math.floor(Math.random() * members.length)];
            await new Promise(_ => setTimeout(_, 4000));
            await webhook.send(lyric, { username: member.user.username, avatarURL: member.user.avatarURL({ dynamic: true }) })
        }
        await webhook.delete();
    }
});

client.login(config.token);