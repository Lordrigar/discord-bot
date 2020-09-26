const Discord = require('discord.js');
const { cacheStartingValues, assignRoles } = require('./utils');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = process.env;

const client = new Discord.Client();

const startBot = async () => {
  client.on('ready', async () => {
    // Cache all the values
    const { guild, guildRolesObj } = await cacheStartingValues(client, config);
    const channel = guild.channels.cache.find(
      cc => cc.name === config.BOT_CHANNEL_NAME
    );

    // Iterate over members
    await assignRoles(
      guild,
      client,
      channel,
      guildRolesObj,
      guild.members.cache
    );

    setTimeout(() => process.exit(0), 2000);
  });
};

client.login(config.TOKEN);

startBot();
