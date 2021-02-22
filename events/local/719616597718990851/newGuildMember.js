module.exports = (guildMember) => {
  let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === '👧👦Lil boys and girls')
  guildMember.roles.add(welcomeRole)
  guildMember.guild.channels.cache.get('719616597718990854').send(`✨ Welcome <@${guildMember.user.id}>!! ✨`)
}