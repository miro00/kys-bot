module.exports = {
  name: "извинись",
  aliases: ["apologize"],
  description: "Извиняется",
  async execute(msg, args) {
    msg.reply("извините :pleading_face:");
  },
};
