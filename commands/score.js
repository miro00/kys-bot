const dbConnection = require("../db")
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'score',
  description: 'Leaderboard',
  async execute(msg, args) {
    const db = dbConnection(msg.guild.id)
    db.serialize(() => {
      db.all('SELECT username, user_level, user_xp, user_messages FROM users ORDER BY user_xp DESC', (err, rows) => {
        let count = rows.length <= 25 ? rows.length : 25
        const embed = new MessageEmbed()
          .setColor('#6737ED')
          .setTitle('Leaderboard')
        for (let i = 0; i < count; i++) {
          embed.addField(`#${i + 1} ${rows[i].username}`, `LVL: ${rows[i].user_level} XP: ${rows[i].user_xp} MSGS: ${rows[i].user_messages}`)
        }
        msg.channel.send(embed)
      })
    })
    db.close()
  }
}
