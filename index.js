console.log("Hello");
const fs = require("fs");
const dotenv = require("dotenv");
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { removeBackground } = require("@imgly/background-removal-node");
// const removeBg =require("./remove.js");

// dotenv.config();
// console.log(dotEnv.config());
// console.log(dotenv.configDotenv());
// console.log(removeBg);

dotenv.configDotenv();
console.log(process.env.TELEGRAM_API_KEY);
let imgLink;

const bot = new Telegraf(process.env.TELEGRAM_API_KEY);
bot.start((ctx) => ctx.reply("Welcome"));
bot.command("oldschool", (ctx) => ctx.reply("Hello"));
// bot.on("message", (ctx) => {
//   const files = ctx.update.message.photo;
//   console.log(files);
//   //pop() to get the last element
//   let fileId = files.pop().file_id;
//   console.log(fileId);
// });
bot.on(message("photo"), async (ctx) => {
  ctx.telegram.sendChatAction(ctx.chat.id, "upload_photo");
  let imageId = ctx.message.photo.pop().file_id;

  await ctx.telegram.getFileLink(imageId).then((link) => {
    //Download Image
    // https.get(link, (response) =>
    //     response.pipe(fs.createWriteStream(`${imageId}.jpeg`))
    // );

    console.log(link.href);
    imgLink = link.href;
    removeBackground(imgLink).then((blob) => {
      // const url = URL.createObjectURL(blob.arrayBuffer);
      blob.arrayBuffer().then((arrBuffer) => {
        console.log(arrBuffer);
        let data = arrBuffer; // you image stored on arrayBuffer variable;
        data = Buffer.from(data);
        fs.writeFile(`BG-removed.png`, data, async (err) => {
          // Assets is a folder present in your root directory
          if (err) {
            console.log(err);
          } else {
            await ctx.telegram.sendDocument(
              ctx.chat.id,

              //for assets
              { source: "BG-removed.png" },
              //for URL
              // { url: imgLink },
              {
                reply_to_message_id: ctx.message.message_id,
                caption: "Here is your photo.",
              }
            );
            ctx.sendMessage("Thank You for Using me💕");
            console.log("File created successfully!");
          }
        });
      });

      // fs.createWriteStream(imageName).write(imageBuffer);
      // console.log(url);
    });
  });

  // await removeBg(imgLink);

  // ctx.telegram.sendPhoto(
  //   ctx.chat.id,

  //   //for assets
  //   //   { source: "assets/dog.jpg" },

  //   { url: imgLink },
  //   {
  //     reply_to_message_id: ctx.message.message_id,
  //     caption: "Here is your photo.",
  //   }
  // );
});

bot.launch();
