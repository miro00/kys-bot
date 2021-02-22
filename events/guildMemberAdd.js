module.exports = (Discord, client, guildMember) => {
  if (guildMember.guild.id === '719616597718990851') {
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === '👧👦Lil boys and girls')
    guildMember.roles.add(welcomeRole)
    guildMember.guild.channels.cache.get('719616597718990854').send(`✨ Welcome <@${guildMember.user.id}>!! ✨`)
  } 
  if (guildMember.guild.id === '590518933803761675') {
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'unicorn')
    guildMember.roles.add(welcomeRole)
    guildMember.guild.channels.cache.get('812033942072983593').send(`✨ Welcome <@${guildMember.user.id}>!! ✨`)
    console.log(guildMember);
  }
}