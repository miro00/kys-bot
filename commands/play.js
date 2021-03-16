const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const { MessageEmbed } = require("discord.js");

const queue = new Map();

module.exports = {
  name: "play",
  aliases: ["skip", "stop", "p"],
  cooldown: 0,
  description: "Играет музыку души",
  async execute(msg, args, cmd) {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return msg.channel.send("Нужно быть в голосом канале!");

    const serverQueue = queue.get(msg.guild.id);

    if (cmd === "play" || cmd == "p") {
      if (!args.length)
        return msg.channel.send("Необходимо указать ссылку на трек");
      let song = {};

      if (ytdl.validateURL(args[0])) {
        const songInfo = await ytdl.getInfo(args[0]);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
        };
      } else {
        const videoFinder = async (query) => {
          const videoResult = await ytSearch(query);
          return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
        };
        const video = await videoFinder(args.join(" "));
        if (video) {
          song = {
            title: video.title,
            url: video.url,
          };
        } else {
          return msg.channel.send("Видео не найдено");
        }
      }

      if (!serverQueue) {
        const queueConstructor = {
          voice_channel: voiceChannel,
          text_channel: msg.channel,
          connection: null,
          songs: [],
        };

        queue.set(msg.guild.id, queueConstructor);
        queueConstructor.songs.push(song);

        try {
          const connection = await voiceChannel.join();
          queueConstructor.connection = connection;
          videoPlayer(msg.guild, queueConstructor.songs[0]);
        } catch (err) {
          queue.delete(msg.guild.id);
          msg.channel.send("Ошибка подключения");
          throw err;
        }
      } else {
        serverQueue.songs.push(song);
        const embed = new MessageEmbed()
          .setColor("#6737ED")
          .setTitle(song.title)
          .setURL(song.url)
          .setDescription("Добавлен в очередь");
        return msg.channel.send(embed);
      }
    } else if (cmd === "skip") skipSong(msg, serverQueue);
    else if (cmd === "stop") stopSong(msg, serverQueue);
  },
};

const videoPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id);
  if (!song) {
    songQueue.voice_channel.leave();
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song.url, { filter: "audioonly" });
  songQueue.connection
    .play(stream, { seek: 0, volume: 0.5 })
    .on("finish", () => {
      songQueue.songs.shift();
      videoPlayer(guild, songQueue.songs[0]);
    });
  const embed = new MessageEmbed()
    .setColor("#6737ED")
    .setTitle(song.title)
    .setURL(song.url)
    .setDescription("Сейчас играет");
  await songQueue.text_channel.send(embed);
};

const skipSong = (msg, serverQueue) => {
  if (!msg.member.voice.channel)
    return msg.channel.send("Необходимо находится в голосовом канале");
  if (!serverQueue) return msg.channel.send("В очереди нет треков");

  serverQueue.connection.dispatcher.end();
};

const stopSong = (msg, serverQueue) => {
  if (!msg.member.voice.channel)
    return msg.channel.send("Необходимо находится в голосовом канале");
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
};
