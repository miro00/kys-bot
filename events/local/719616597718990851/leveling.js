module.exports = (msg, userLevel) => {
  switch (userLevel) {
    case 10:
      msg.guild.member(msg.author).roles.add('812049276179972157')
      msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня! И получил роль <@&812049276179972157>`)
      break;
    default:
      msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня!`)
  }
}