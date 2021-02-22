const dbConnection = require('../db')
const fs = require('fs')

module.exports = async (Discord, client, msg) => {
  if (msg.author.bot) return

  const prefix = '>'
  const args = msg.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()
  const commands = require('../commandHandler')(client, Discord)
  if (msg.content.startsWith(prefix)) {
    if (commands.find(cmd => cmd.name === command)) {
      commands.get(command).execute(msg, args)
    } else if (command === 'help') {
      const embed = new Discord.MessageEmbed()
        .setColor('#E20023')
        .setThumbnail('https://i.imgur.com/8ySqBJS.png')
        .setTitle('Help');
      commands.forEach(cmd => {
        embed.addField(`${prefix}${cmd.name}`, `${cmd.description}`, true)
      })  
      msg.channel.send(embed)
    } else if (command === 's') {
      console.log(msg.author)
      
    } 
    else {
      msg.channel.send('Такой команды не существует 😔')
    }
  }
  const db = dbConnection(msg.guild.id)
  db.get('SELECT * FROM users WHERE username=?', [msg.author.tag], (err, row) => { //Add new user to DB
     if (err) throw err
     if (row == undefined) {
       let today = new Date()
       db.run('INSERT INTO users(user_id, username, user_avatarURL, user_joinedTimestamp, user_ratingDate) VALUES (?, ?, ?, ?, ?)', 
         [
          msg.guild.member(msg.author.id).user.id, 
          msg.author.tag, 
          msg.author.displayAvatarURL(),
          msg.guild.member(msg.author.id).joinedTimestamp,
          String(today)
         ])
     } else {
       let userMessages = row.user_messages
       let userLevel = row.user_level
       let userXP = row.user_xp
 
       let xpAdd = Math.floor(Math.random() * 10) + 50
       let nextLevel = 500 * (Math.pow(2, userLevel) - 1)
 
       userMessages++
       userXP = userXP + xpAdd
      
       if (nextLevel <= userXP) {
         userLevel++

        if (fs.existsSync(`./events/local/${msg.guild.id}`)) {
          require(`../events/local/${msg.guild.id}/leveling`)(msg, userLevel)
        } else {
          msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня!`)
        }
       }
       

       db.run('UPDATE users SET user_avatarURL=?, user_messages=?, user_xp=?, user_level=? WHERE username=?', 
       [msg.author.displayAvatarURL(), userMessages, userXP, userLevel, msg.author.tag])

     }
   })
   db.close()
}