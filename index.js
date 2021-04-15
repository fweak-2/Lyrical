const Discord = require('discord.js');
const fs = require('fs');
const GeniusFetcher = require('genius-lyrics-fetcher');

const ACCESS_TOKEN = '7PPBgn5n4hkgph58yQQNa-3GNgTLI3mzIV8x6IRIME4wFOn-flZ97zt6VroVIjdd'; // haha whatever
const gfetch = new GeniusFetcher.Client(ACCESS_TOKEN);

const client = new Discord.Client();
const config = require ('./config.json');
const TOKEN = process.env['TOKEN']

client.on('ready', () => {
    console.log(`Started Lyrical -> ${client.user.tag}`);
});

client.on('message', async(message) => {
    if (message.author.bot) return;
    if (message.author.id !== config.yourId) return console.log('Author Check');

    if (message.content === 'hey') return message.reply('\n> Hello');

    if (message.content.startsWith('getlyrics')) {
        function writeToFile(newLyrics) {
            fs.writeFile('lyrics.txt', newLyrics.toString(), function (err) {
                if (err) return console.log(err);
                console.log('lyrics saved');
            });
        }
        let discordLyrics = message.content.replace('getlyrics ', '');
        if (message.content.replace('getlyrics', '') === '') {
          message.channel.send('Correct format: `getlyrics Song Name / Artist Name`');
            return;
        } else if (message.content.includes('/') === false) {
          message.channel.send('Correct format: `getlyrics ' + discordLyrics + ' / Artist Name`');
          return;
        }
        discordLyrics = discordLyrics.split('/');
        gfetch.fetch(discordLyrics[0], discordLyrics[1])
            .then(result => writeToFile(result.lyrics));
    }

    if (message.content.startsWith('sendlyrics')) {
        fs.readFile('lyrics.txt', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            if (data.length > 2000) {
                return message.channel.send('I cannot send the lyrics as it\'s more than 2000 characters!');
            }
            return message.channel.send(data);
        });
    }

    if (message.content === 'lyrical') {
        let lyrics = fs.readFileSync('lyrics.txt', 'utf-8').replace(/\r/g, '').split('\n');
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

client.login(TOKEN);
