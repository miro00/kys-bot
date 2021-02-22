module.exports = (guildMember) => {
  let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'unicorn')
  guildMember.roles.add(welcomeRole)
  guildMember.guild.channels.cache.get('812033942072983593').send(`✨ Welcome <@${guildMember.user.id}>!! ✨`)
}