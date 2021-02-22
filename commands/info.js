const dbConnection = require("../db")
const Discord = require('discord.js')
const { Canvas } = require('canvas-constructor')
const { loadImage, registerFont } = require('canvas')
const fetch = require('node-fetch')
const getUserFromMention = require('../functions/getUserFromMention')

module.exports = {
  name: 'info',
  description: 'User info',
  async execute(msg, args) {
    if (args.length === 0) {
      args = msg.guild.member(msg.author.id).user.id
    } else {
      if (/\<\@(|\!)\d{18}\>/g.test(args[0])) {
        args = getUserFromMention(args[0])
      } else {
        msg.channel.send('Укажите пользователя через @')
      }
    }

    const db = dbConnection(msg.guild.id)
    db.serialize(() => {
       db.get('SELECT * FROM users WHERE user_id=?', [args], async (err, row) => {
        if (err) throw err
        if (row !== undefined) {
          let today = new Date()
          let daysOnServer = Math.ceil(Math.abs(today.getTime() - new Date(row.user_joinedTimestamp).getTime()) / (1000 * 3600 * 24))

          let response = await fetch(row.user_avatarURL.replace('.webp', '.png'))
          let avatar = await response.buffer()
          avatar = await loadImage(avatar)

          let iconHouse = await loadImage('./icons/mdi_home.png'),
            iconTrophy = await loadImage('./icons/mdi_trophy-variant.png'),
            iconMessage = await loadImage('./icons/mdi_message-text.png'),
            iconSmile = await loadImage('./icons/mdi_emoticon-neutral.png')

          if (row.user_rating === 0) iconSmile = await loadImage('./icons/mdi_emoticon-neutral.png')
          else if (row.user_rating > 0 && row.user_rating < 25) iconSmile = await loadImage('./icons/mdi_emoticon-happy.png')
          else if (row.user_rating >= 25) iconSmile = await loadImage('./icons/mdi_emoticon-excited.png')
          else if (row.user_rating < 0 && row.user_rating > -25) iconSmile = await loadImage('./icons/mdi_emoticon-sad.png')
          else if (row.user_rating <= -25) iconSmile = await loadImage('./icons/mdi_emoticon-devil.png')

          let nextLevel = 500 * (Math.pow(2, row.user_level) - 1)
          let progress = Math.round(100 / (nextLevel / row.user_xp) * 280 / 100)

          registerFont('./fonts/Montserrat-Bold.ttf', {family: 'Montserrat-Bold'})
          registerFont('./fonts/Montserrat-Regular.ttf', { family: "Montserrat-Regular"})

          let userInfoX = 155,
            progressBarW = 280,
            progressBarH = 16,
            progressBarY = 123,
            progressTextSize = 12

          let result = new Canvas(450, 150)
            // Background
            .setColor('#202020')
            .printRoundedRectangle(0, 0, 450, 150, 20) 
            // Avatar
            .printCircularImage(avatar, 75, 75, 64)
            // Username
            .setTextFont('18px Montserrat-Bold')  
            .setColor('#fff') 
            .printText(row.username, userInfoX, 30) 
            // Messages
            .printImage(iconMessage, userInfoX, 56)
            .setTextFont('14px Montserrat-Bold')
            .printText(`MSGS ${row.user_messages}`, userInfoX + 25, 71)
            // LVL
            .printImage(iconTrophy, userInfoX, 80)
            .printText(`LVL ${row.user_level}`, userInfoX + 25, 95)
            // Rating
            .printImage(iconSmile, 295, 56)
            .printText(`REP ${row.user_rating}`, 295 + 25, 71)
            // Days on server
            .printImage(iconHouse, 295, 80)
            .printText(`DAYS ${daysOnServer}`, 295 + 25, 95)
            // Progress bar 
            .setColor('#fff')
            .printRoundedRectangle(userInfoX, progressBarY, progressBarW, progressBarH, 10)
            .setColor('#6737ED')
            .printRoundedRectangle(userInfoX, progressBarY, progress, progressBarH, 10)
            // XP
            .setColor('#202020')
            .setTextAlign('center')
            .setTextFont(`${progressTextSize}px Montserrat-Bold`)
            .setTextSize(progressTextSize)
            .printText(`${row.user_xp} / ${nextLevel}`, userInfoX + (progressBarW / 2), progressTextSize + progressBarY + 1)
            .toBuffer();
          
          const attachment = new Discord.MessageAttachment(result)
          msg.channel.send(attachment)
        } else {
          msg.channel.send('Нет информации об этом пользователе ☹')
        }
      })
      db.close()
    })
  }
}