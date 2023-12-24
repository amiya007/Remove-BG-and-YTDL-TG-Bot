const fs = require("fs");
const { removeBackground } = require("@imgly/background-removal-node");

let imgLink;
async function replyPhoto(ctx) {
  // bot.on(message("photo"), async (ctx) => {
  ctx.telegram.sendChatAction(ctx.chat.id, "upload_photo");
  let imageId = ctx.message.photo.pop().file_id;

  await ctx.telegram.getFileLink(imageId).then((link) => {
    //Download Image
    // https.get(link, (response) =>
    //     response.pipe(fs.createWriteStream(`${imageId}.jpeg`))
    // );
    console.log(link.href);
    imgLink = link.href;
    try {
      removeBackground(imgLink).then((blob) => {
        blob.arrayBuffer().then((arrBuffer) => {
          console.log(arrBuffer);
          data = Buffer.from(arrBuffer);
          fs.writeFile(`assets/BG-removed.png`, data, async (err) => {
            if (err) {
              console.log(err);
              ctx.reply("Something went wrong.☹️\nPlease Try again later.");
            } else {
              try {
                await ctx.telegram.sendDocument(
                  ctx.chat.id,
                  { source: "assets/BG-removed.png" },
                  {
                    reply_to_message_id: ctx.message.message_id,
                    caption: "Here is your photo.",
                  }
                );
                ctx.sendMessage("Thank You for Using me💕");
                console.log("File created successfully!");
              } catch (error) {
                ctx.reply("Something went wrong.☹️ \nPlease Try again later.");
              }
            }
          });
        });
      });
    } catch (error) {
      console.log(`err :: ${error}`);
      ctx.reply("Something went wrong.☹️ \nPlease Try again later.");
    }
  });
  // });
}
exports.replyPhoto = replyPhoto;
