const moment = require('moment');
const rolesMap = require('./roles');

/**
 * Fetches and caches main objects used in the bot
 * @param {Client} client
 * @param {Object} config
 * @returns {Object}
 */
const cacheStartingValues = async (client, config) => {
  const guild = client.guilds.resolve(config.GUILD_ID);
  await guild.members.fetch();
  await guild.roles.fetch();
  const guildRolesObj = guild.roles.cache.map(gr => {
    return { id: gr.id, name: gr.name };
  });

  return {
    guild,
    guildRolesObj,
  };
};

/**
 * Loops through every member of the server and assigns the new role
 * @param {GuildManager} guild
 * @param {Client} client
 * @param {GuildChannelManager} channel
 * @param {Object} guildRolesObj
 * @param {Collection<Snowflake, GuildMember>} guildMembersCache
 */
const assignRoles = async (
  guild,
  client,
  channel,
  guildRolesObj,
  guildMembersCache
) => {
  let noAssignedRoles = true;
  guildMembersCache.forEach(async member => {
    if (member.user.bot) return;

    const now = moment();
    const duration = moment.duration(now.diff(moment(member.joinedAt)));
    const days = duration.asDays().toFixed(0);

    // Grab role that meets the time constrains
    const eligibleRole = rolesMap.find(
      rm => rm.from <= days && (!rm.to || rm.to >= days)
    );

    // Grab full Role class that meets the time constrains
    const { name } = eligibleRole;
    const serverEligibleRole = guildRolesObj.find(rl => rl.name === name);

    if (serverEligibleRole) {
      const roleToAssign = guild.roles.cache.find(
        grc => grc.id === serverEligibleRole.id
      );

      // If member already does not have the role - assign it
      if (!member._roles.includes(serverEligibleRole.id)) {
        member.roles.add(roleToAssign);
        noAssignedRoles = false;
        client.channels.cache
          .get(channel.id)
          .send(
            `${member.user} stayed here for ${days} days and deserved new role ${roleToAssign.name}`
          );
      }
    }
  });

  if (noAssignedRoles) {
    client.channels.cache.get(channel.id).send('No roles assigned');
  }
};

module.exports = {
  cacheStartingValues,
  assignRoles,
};
