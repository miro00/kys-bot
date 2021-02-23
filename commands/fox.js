const { MessageAttachment } = require("discord.js");
const axios = require("axios").default;

module.exports = {
  name: "fox",
  description: "Send random fox pic 🦊",
  async execute(msg, args) {
    await axios
      .get("https://randomfox.ca/floof/")
      .then((res) => {
        return res;
      })
      .then((data) => {
        let attachment = new MessageAttachment(data.data.image);
        msg.channel.send(attachment);
      })
      .catch((err) => console.error(err));
  },
};
