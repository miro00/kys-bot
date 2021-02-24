module.exports = {
  name: "извинись",
  aliases: ["apologize"],
  cooldown: 0,
  description: "Извиняется",
  async execute(msg, args) {
    msg.reply("извините :pleading_face:");
  },
};
