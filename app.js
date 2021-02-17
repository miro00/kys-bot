const Discord = require('discord.js')
const fs = require('fs')
require('dotenv').config()

const client = new Discord.Client()

const prefix = '>'

const dbConnection = require('./db')

function commandHandler() {
  client.commands = new Discord.Collection()
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
  }  
  return client.commands
}

client.once('ready', () => {
  client.user.setActivity(`${prefix}help`, {type: 'WATCHING'})
  console.log('kys-bot is ready!')
})

client.on('guildCreate', guild => {
  dbConnection(guild.id)
  let defaultChannel = ''
  guild.channels.cache.forEach(channel => {
    if (channel.type == 'text' && defaultChannel == '') {
      if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel
      }
    }
  })
  defaultChannel.send('Дарова!')
})

client.on('message', async msg => {
  if (msg.author.bot) return

  const args = msg.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()
  const commands = commandHandler()

  const db = dbConnection(msg.guild.id)

 db.get('SELECT * FROM users WHERE username=?', [msg.author.tag], (err, row) => { //Add new user to DB
    if (err) throw err
    if (row == undefined) {
      db.run('INSERT INTO users(user_id, username, user_avatarURL, user_joinedTimestamp) VALUES (?, ?, ?, ?)', 
        [
          msg.guild.member(msg.author.id).user.id, 
          msg.author.tag, 
          msg.author.displayAvatarURL(),
          msg.guild.member(msg.author.id).joinedTimestamp
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
        msg.channel.send(`<@${msg.author.id}> advanced to level ${userLevel}`)
      }

      db.run('UPDATE users SET user_messages=?, user_xp=?, user_level=? WHERE username=?', 
      [userMessages, userXP, userLevel, msg.author.tag])
    }
  })
  db.close()

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
})

client.login(process.env.TOKEN)