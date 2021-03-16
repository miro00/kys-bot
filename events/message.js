const dbConnection = require("../db");
const fs = require("fs");

const cooldowns = new Map()

module.exports = async (Discord, client, msg) => {
  if (msg.author.bot) return;
  const prefix = ">";

  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();
  const commands = require("../commandHandler")(client, Discord);
  const command =
    commands.get(cmd) ||
    commands.find((a) => a.aliases && a.aliases.includes(cmd));
  
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection())
    }
  
    const currentTime = Date.now()
    const timeStamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown) * 1000

    if (timeStamps.has(msg.author.id)) {
      const expirationTime = timeStamps.get(msg.author.id) + cooldownAmount

      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000

        return msg.reply(`Падажи, попробуй через ${timeLeft.toFixed(1)} секунд`)
      }
    }

    timeStamps.set(msg.author.id, currentTime)

    if (command) command.execute(msg, args, cmd) 
    


  const db = dbConnection(msg.guild.id);
  db.get(
    "SELECT * FROM users WHERE username=?",
    [msg.author.tag],
    (err, row) => {
      //Add new user to DB
      if (err) throw err;
      if (row == undefined) {
        let today = new Date();
        db.run(
          "INSERT INTO users(user_id, username, user_avatarURL, user_joinedTimestamp, user_ratingDate) VALUES (?, ?, ?, ?, ?)",
          [
            msg.guild.member(msg.author.id).user.id,
            msg.author.tag,
            msg.author.displayAvatarURL(),
            msg.guild.member(msg.author.id).joinedTimestamp,
            String(today),
          ]
        );
      } else {
        let userMessages = row.user_messages,
          userLevel = row.user_level,
          userXP = row.user_xp,
          xpAdd = Math.floor(Math.random() * 10) + 50,
          nextLevel = 500 * (Math.pow(2, userLevel) - 1);

        userMessages++;
        userXP = userXP + xpAdd;

        if (nextLevel <= userXP) {
          userLevel++;
          if (fs.existsSync(`./events/local/${msg.guild.id}`)) {
            require(`../events/local/${msg.guild.id}/leveling`)(msg, userLevel);
          } else {
            msg.channel.send(`<@${msg.author.id}> достиг ${userLevel} уровня!`);
          }
        }

        db.run(
          "UPDATE users SET user_avatarURL=?, user_messages=?, user_xp=?, user_level=? WHERE username=?",
          [
            msg.author.displayAvatarURL(),
            userMessages,
            userXP,
            userLevel,
            msg.author.tag,
          ]
        );
      }
    }
  );
  db.close();
};
