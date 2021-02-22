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
  client.user.setActivity(`фильмы для взрослых`, {type: 'WATCHING'})
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

         if (msg.guild.id === '590518933803761675') { // OMYT
          switch (userLevel) {
            case 10: 
              msg.guild.member(msg.author).roles.add('812042084272832563')
              msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня! И получил роль <@&812042084272832563>`)
              break;
            case 25: 
              msg.guild.member(msg.author).roles.remove('812042084272832563')
              msg.guild.member(msg.author).roles.add('812042369737687061')
              msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня! И получил роль <@&812042369737687061>`)
              break;
            default:
              msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня!`)
          } 
        } else if (msg.guild.id === '719616597718990851') { // Suicide
          switch (userLevel) {
            case 10:
              msg.guild.member(msg.author).roles.add('812049276179972157')
              msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня! И получил роль <@&812049276179972157>`)
              break;
            default:
              msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня!`)
          }
        } else {
         msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня!`)
        }
       }

       db.run('UPDATE users SET user_messages=?, user_xp=?, user_level=? WHERE username=?', 
       [userMessages, userXP, userLevel, msg.author.tag])
     }
   })
   db.close()
})

client.on('guildMemberAdd', guildMember => {
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
})

client.login(process.env.TOKEN)