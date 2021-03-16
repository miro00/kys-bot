const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {
  name: "role",
  aliases: ["roles", "getrole"],
  cooldown: 5,
  description: "Choose role by reacting on message",
  async execute(msg, args) {
    const user = msg.guild.members.cache.find(
      (member) => member.id === msg.author.id
    );
    if (!user.hasPermission("ADMINISTRATOR"))
      return msg.channel.send("You can't use that command :(");
    if (msg.guild.channels.cache.find((channel) => channel.name === "roles") === undefined) {
      msg.guild.channels.create("roles", { type: "text" });
    } else {
      return msg.channel.send("Channel 'roles' already exists")
    }
    
    // const channel = '590518933803761677'
    // const fRole = msg.guild.roles.cache.find(role => role.name === 'bibi')
    // const sRole = msg.guild.roles.cache.find(role => role.name === 'bubu')

    // const fRoleEmoji = '🎃'
    // const sRoleEmoji = '⚽'

    // let embed = new Discord.MessageEmbed()
    //   .setColor('#e42643')
    //   .setTitle('Choose a role')

    // let msgEmbed = await msg.channel.send(embed)
    // msgEmbed.react(fRoleEmoji)
    // msgEmbed.react(sRoleEmoji)

    // client.on('messageReactionAdd', async (reaction, user) => {
    //   if (reaction.message.partial) await reaction.message.fetch()
    //   if (reaction.partial) await reaction.fetch()
    //   if (user.bot) return
    //   if (!reaction.message.guild) return
    //   if (reaction.message.channel.id === channel) {
    //     if (reaction.emoji.name === fRole) {
    //       await reaction.message.guild.members.cache.get(user.id).roles.add(fRole)
    //     }
    //   }
    // })
  },
};
