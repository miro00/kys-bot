const { MessageAttachment } = require("discord.js");

module.exports = {
  name: "ranime",
  aliases: ["ra"],
  cooldown: 5,
  description: "Random anime pic, generated by AI",
  async execute(msg, args) {
    if (!args.length) {
      let num = Math.floor(Math.random() * 89999) + 10000;
      let attachment = new MessageAttachment(
        `https://thisanimedoesnotexist.ai/results/psi-1.0/seed${num}.png`
      );
      msg.channel.send(attachment);
    } else {
      if (args[0] >= 0.3 && args[0] <= 2.0) {
        if (args[0] ^ 0 === 1 || args[0] ^ 0 === 2) {
          let creativity = args[0].toString() + ".0";
          let num = Math.floor(Math.random() * 89999) + 10000;
          let attachment = new MessageAttachment(
            `https://thisanimedoesnotexist.ai/results/psi-${creativity}/seed${num}.png`
          );
          msg.channel.send(attachment);
        } else {
          let creativity = args[0];
          let num = Math.floor(Math.random() * 89999) + 10000;
          let attachment = new MessageAttachment(
            `https://thisanimedoesnotexist.ai/results/psi-${creativity}/seed${num}.png`
          );
          msg.channel.send(attachment);
        }
      } else {
        msg.channel.send("Select creativity between 0.3 and 2.0");
      }
    }
  },
};
