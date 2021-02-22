const fs = require('fs')

module.exports = (Discord, client, guildMember) => {
  if (fs.existsSync(`./events/local/${guildMember.guild.id}`)) {
    require(`../events/local/${guildMember.guild.id}/newGuildMember`)(guildMember)
  }
}