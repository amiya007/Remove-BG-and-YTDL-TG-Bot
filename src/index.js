const express = require("express");
const dotenv = require("dotenv");
const { Telegraf } = require("telegraf");
const { replyPhoto } = require("./reply_photo");
const { downloadVideo } = require("./download_video");

const app = express();

// const removeBg =require("./remove.js");
// dotenv.config();
// console.log(dotEnv.config());
// console.log(dotenv.configDotenv());
// console.log(removeBg);

dotenv.configDotenv();
console.log(process.env.TELEGRAM_API_KEY);
const bot = new Telegraf(process.env.TELEGRAM_API_KEY, { polling: true });

bot.start(async (ctx) => {
  await ctx.sendDocument({ source: "assets/hello.gif" }),
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `<b>Welcome </b><i>${ctx.message.from.username} <b> !!</b> </i>\n<i>Click on /features to use me.</i>`,
      { parse_mode: "HTML", reply_to_message_id: ctx.message.message_id }
    );
});
bot.command("features", (ctx) =>
  ctx.telegram.sendMessage(
    ctx.chat.id,
    "*Download YouTube Videos:*\n_Send a YouTube video link, and the bot will download the video for you\\._\n\n*Background Removal:*\n_Apply background removal to a Image upon request_\\.\n\n*Note:*\n_Only \\.JPG, \\.JPEG, \\.PNG will be available for BG Removal\\.\nBoth YT Shorts and Videos are available for *Downloading*\\._",
    { parse_mode: "MarkdownV2", reply_to_message_id: ctx.message.message_id }
  )
);

// bot.command("oldschool", (ctx) => ctx.reply("Hello"));
bot.use(async (ctx, next) => {
  const message = ctx.message;
  if (message.photo) {
    console.log("It is a Photo");
    replyPhoto(ctx);
  } else if (message.text) {
    const emojiRegex =
      /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    const emojis = message.text.match(emojiRegex);

    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11}[^\s&]*)/;
    const ytlink = message.text.match(youtubeRegex);

    const youtubeShortsRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/;
    const ytShort = message.text.match(youtubeShortsRegex);

    const youtubePlaylistRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:playlist|embed)\/|\S*?[?&]list=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const ytPlaylist = message.text.match(youtubePlaylistRegex);
    if (emojis) {
      console.log(`emojis  ${emojis.join(" ")}`);
      ctx.reply("👍");
    } else if (message.text && !emojis) {
      if (ytlink) {
        console.log(`yt link msg ${ytlink[0]}`);
        downloadVideo(ctx, ytlink[0]);
      } else if (ytShort) {
        downloadVideo(ctx, ytShort[0]);
      } else if (ytPlaylist) {
        await ctx.sendDocument({ source: "assets/no.gif" }),
          ctx.sendMessage("I can not handle Playlist 🫥😶");
      } else {
        await ctx.sendDocument({ source: "assets/error.gif" }),
          console.log(`message only ${message.text}`);
      }
    } else {
      await ctx.sendDocument({ source: "assets/error.gif" }),
        console.log("it is mixed");
    }
  } else if (message.document) {
    await ctx.sendDocument({ source: "assets/no.gif" }),
      ctx.sendMessage("I can not handle Documents 🫥😶"),
      console.log("it is doc");
  } else if (message.sticker) {
    console.log("it is sticker");
    ctx.reply("👍");
  }
  next();
});

if (process.env.NODE_ENV === "production") {
  app.use(express.json());
  const PORT = process.env.PORT || 3000;

  app.use(bot.webhookCallback("/secret-path"));
  bot.telegram.setWebhook("https://cool-kheer-e7d471.netlify.app/secret-path");

  app.get("/", (req, res) => {
    // res.redirect("https://www.google.com");
    res.send('<h1>Hello, World!</h1><a href="/launch">Launch Link</a>');
  });

  app.listen(PORT, () => {

    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.launch();
}
