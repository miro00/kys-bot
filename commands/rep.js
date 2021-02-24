const dbConnection = require("../db");

module.exports = {
  name: "rep",
  aliases: ["reputation", "r"],
  description: "rep down - отнять репутацию, rep up - добавить",
  execute(msg, args) {
    const db = dbConnection(msg.guild.id);
    db.get(
      "SELECT user_ratingDate FROM users WHERE user_id=?",
      [msg.author.id],
      (err, row) => {
        let today = new Date();
        let ratingDate = new Date(row.user_ratingDate);
        if (today < ratingDate) {
          let diff = ratingDate - today;
          let result = new Date(diff),
            hr = String(result.getUTCHours()).padStart(2, "0"),
            min = String(result.getMinutes()).padStart(2, "0"),
            sec = String(result.getSeconds()).padStart(2, "0");
          result = `${hr}:${min}:${sec}`;
          return msg.channel.send(`Попробуй снова через ${result}`);
        } else {
          if (args.length === 0)
            return msg.channel.send(
              "Команда должна быть представлена в виде: \n```>rep up/down @имя_пользователя```"
            );
          if (args[0] !== "up" && args[0] !== "down")
            return msg.channel.send('Необходимо указать "up" либо "down"!');
          if (!/\<\@(|\!)\d{18}\>/g.test(args[1]))
            return msg.channel.send("Укажите пользователя через @");

          let userID = args[1].replace(/[\<\>\@\!]/g, "");

          if (userID === msg.author.id)
            return msg.channel.send("Самый умный да?");

          db.get(
            "SELECT user_rating, username FROM users WHERE user_id=?",
            [userID],
            (err, row) => {
              if (err) throw err;
              if (row === undefined)
                return msg.channel.send("Пользователь не найден в базе :(");

              let ratingUp = args[0] === "up" ? true : false;
              let rating = row.user_rating;
              if (ratingUp) {
                rating++;
                msg.channel.send(
                  `Вы увеличили рейтинг пользователя ${row.username}`
                );
              } else {
                rating--;
                msg.channel.send(
                  `Вы уменьшили рейтинг пользователя ${row.username}`
                );
              }
              db.run("UPDATE users SET user_rating=? WHERE user_id=?", [
                rating,
                userID,
              ]);

              let newDate = new Date();
              newDate.setDate(newDate.getDate() + 1);

              db.run("UPDATE users SET user_ratingDate=? WHERE user_id=?", [
                String(newDate),
                msg.author.id,
              ]);
            }
          );
        }
      }
    );
    db.close();
  },
};
