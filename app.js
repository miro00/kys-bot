const Discord = require('discord.js')
require('dotenv').config()

const client = new Discord.Client()

client.events = new Discord.Collection()
require('./eventHandler')(client, Discord)

client.login(process.env.TOKEN)