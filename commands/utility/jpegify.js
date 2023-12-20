const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jpegify')
        .setDescription('Turns an image into a jpeg... for whatever reason'),
    async execute(interaction) {
        // sets up all necessary constants for the embed
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        let embed = new EmbedBuilder
            .setTitle('Commencing!')
            .setDescription('Now, send in the image you want to jpegify.')
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());

        const msg = await interaction.reply({ embeds: [embed] });

        const collectorFilter = m => m.content.includes('discord');
        const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 15000, maxProcessed: 1 });

        collector.on('collect', m => {
            embed.setDescription(`${m.content}`);
        });
        collector.on('end', c => {
            console.log(`${c.size}`);
        });

        await wait(120);
        embed = embed.setDescription('Altered');

        msg.edit({ embeds: [embed] });
    },
};