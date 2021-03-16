const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = ">";

module.exports = {
  name: "help",
  aliases: ["help"],
  cooldown: 0,
  description: "Show command list",
  async execute(msg, args) {
    const commands = require("../commandHandler")(client, Discord);
    const embed = new Discord.MessageEmbed()
      .setColor("#E20023")
      .setThumbnail("https://i.imgur.com/8ySqBJS.png")
      .setTitle("Help");
    commands.forEach((cmd) => {
      embed.addField(`${prefix}${cmd.name}`, `${cmd.description}`, true);
    });
    msg.channel.send(embed)
  },
};
