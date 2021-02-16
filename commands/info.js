const dbConnection = require("../db")
const Discord = require('discord.js')

module.exports = {
  name: 'info',
  description: 'User info',
  async execute(msg, args) {
    if (args.length === 0) {
      args = msg.guild.member(msg.author.id).user.id
    } else {
      if (/\<\@\!\d{18}\>/g.test(args[0])) {
        args = args[0].replace(/[\<\>\@\!]/g, '')
      } else {
        msg.channel.send('Укажите пользователя через @')
        return
      }
    }

    const db = dbConnection()
    db.serialize(() => {
      let user = db.get('SELECT * FROM users WHERE user_id=?', [args], (err, row) => {
        if (err) throw err
        if (row !== undefined) {
        let today = new Date()
        let daysOnServer = Math.ceil(Math.abs(today.getTime() - new Date(row.user_joinedTimestamp).getTime()) / (1000 * 3600 * 24))

        const embed = new Discord.MessageEmbed()
          .addField('Username', row.username)
          .addField('Дней на сервере', daysOnServer)
          .addField('Сообщений отправленно', row.user_messages, true)
          .addField('XP', row.user_xp, true)
          .addField('Уровень', row.user_level, true)
        msg.channel.send(embed)
        } else {
          msg.channel.send('Нет информации об этом пользователе ☹')
        }
      })
      db.close()
    })
  }
}