module.exports = (msg, userLevel) => {
  switch (userLevel) {
    case 10:
      msg.guild.member(msg.author).roles.add("812042084272832563");
      msg.channel.send(
        `<@${msg.author.id}> достиг ${userLevel} уровня! И получил роль <@&812042084272832563>`
      );
      break;
    case 25:
      msg.guild.member(msg.author).roles.remove("812042084272832563");
      msg.guild.member(msg.author).roles.add("812042369737687061");
      msg.channel.send(
        `<@${msg.author.id}> достиг ${userLevel} уровня! И получил роль <@&812042369737687061>`
      );
      break;
    default:
      msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня!`);
  }
};
