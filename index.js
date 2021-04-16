const Discord = require('discord.js');
const fs = require('fs');
const GeniusFetcher = require('genius-lyrics-fetcher');

const ACCESS_TOKEN = '7PPBgn5n4hkgph58yQQNa-3GNgTLI3mzIV8x6IRIME4wFOn-flZ97zt6VroVIjdd'; // haha whatever
const gfetch = new GeniusFetcher.Client(ACCESS_TOKEN);

const client = new Discord.Client();
const config = require ('./config.json');

client.on('ready', () => {
    console.log(`Started Lyrical -> ${client.user.tag}`);
});

client.on('message', async(message) => {
    if (message.author.bot) return;
    if (config.yourId.includes(message.author.id) === false) return console.log('Author Check');

    if (message.content.toLowerCase() === 'hey') return message.reply('\n> Hello');

    if (message.content.startsWith('getlyrics')) {
        let oldLyrics;
        fs.readFile('lyrics.txt', 'utf8', function (err,data) {
            if (err) return message.channel.send(err.toString());
            oldLyrics = data;
        });
        function writeToFile(newLyrics) {
            fs.writeFile('lyrics.txt', newLyrics.toString(), function (err) {
                if (err) return message.channel.send(err.toString());
                if (fs.readFileSync('lyrics.txt', 'utf-8') != oldLyrics) return message.channel.send(`Lyrics set to \`${discordLyrics}\`.`);
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
        await message.delete();
    }

    if (message.content.toLowerCase().startsWith('sendlyrics')) {
        fs.readFile('lyrics.txt', 'utf8', function (err,data) {
            if (err) data = err.toString();
            if (data.length > 2000) {
              data = 'I cannot send the lyrics as it\'s more than 2000 characters! You can view the lyrics in the attachment.';
              message.channel.send({
                files: ['lyrics.txt']
              });
            }
            const lyricEmbed = new Discord.MessageEmbed()
            .setColor('#A228FF')
            .setTitle('Current Stored Lyrics')
            .setDescription(data)
            .setThumbnail('https://cdn.discordapp.com/attachments/788198099067076638/832490860486066206/lyrical.gif')
            .setTimestamp()
            return message.channel.send(lyricEmbed);
        });
    }

    if (message.content.toLowerCase() === 'lyrical') {
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

client.login(config.token);
