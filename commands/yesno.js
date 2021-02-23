module.exports = {
  name: "yesno",
  description: "Да? Нет?",
  async execute(msg, args) {
    if (!args.length) return msg.channel.send("Че хотел спросить?");
    let answers = [
      "я думаю... Да!",
      "я думаю... Нет...",
      "я думаю...",
      "я думаю... я не думаю.",
      "ну да.",
      "однозначно нет.",
      "тебя волнует?",
      "однозначно да.",
      "ну нет.",
      "возможно...",
      "всякое может быть.",
      "звезды говорят - да.",
      "звезды говорят - нет.",
      "откуда я знаю?",
    ];
    let answer = answers[Math.floor(Math.random() * answers.length)];
    msg.reply(answer);
  },
};
