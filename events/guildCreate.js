const dbConnection = require("../db");

module.exports = (Discord, client, guild) => {
  dbConnection(guild.id);
  let defaultChannel = "";
  guild.channels.cache.forEach((channel) => {
    if (channel.type == "text" && defaultChannel == "") {
      if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  });
  defaultChannel.send("Дарова!");
};
