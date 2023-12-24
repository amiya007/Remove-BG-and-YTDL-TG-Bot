console.log("Hello");
const dotenv = require("dotenv");
const { Telegraf } = require("telegraf");
const { replyPhoto } = require("./src/replyPhoto");
// const removeBg =require("./remove.js");

// dotenv.config();
// console.log(dotEnv.config());
// console.log(dotenv.configDotenv());
// console.log(removeBg);

dotenv.configDotenv();
console.log(process.env.TELEGRAM_API_KEY);
const bot = new Telegraf(process.env.TELEGRAM_API_KEY);

bot.start((ctx) => ctx.reply("Welcome"));

// bot.command("oldschool", (ctx) => ctx.reply("Hello"));
bot.use((ctx, next) => {
  const message = ctx.message;
  if (message.photo) {
    console.log("It is a Photo");
    replyPhoto(ctx);
  } else if (message) {
    const emojiRegex =
      /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    const emojis = message.text.match(emojiRegex);
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11}[^\s&]*)/;
    const ytlink = message.text.match(youtubeRegex);
    if (emojis) {
      console.log(`emojis  ${emojis.join(" ")}`);
      ctx.reply("👍");
    } else if (message.text && !emojis) {
      if (ytlink) {
        console.log(`yt link msg ${ytlink[0]}`);
      } else {
        console.log(`message only ${message.text}`);
      }
    } else {
      console.log("it is mixed");
    }
  } else if (message.sticker) {
    console.log("it is sticker");
  }
  next();
});

bot.launch();
