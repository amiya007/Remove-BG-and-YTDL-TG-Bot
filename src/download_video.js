const ytdl = require("ytdl-core");

async function downloadVideo(ctx, videoUrl) {
  ctx.reply("Please hold TIGHT....\nIt may take some time");

  if (ytdl.validateURL(videoUrl)) {
    try {
      ctx.telegram.sendChatAction(ctx.chat.id, "upload_video");
      // Download the video using ytdl-core
      const videoReadableStream = ytdl(videoUrl, {
        filter: "audioandvideo",
      });

      // Send the video stream to Telegram
      ctx.telegram
        .sendVideo(ctx.chat.id, { source: videoReadableStream })
        .then(() => {
          console.log("Video sent successfully!");
          ctx.reply("Thanks For Your Patience.💕\nThank you for using me.");
        })
        .catch((error) => {
          console.log("Error sending video:", error);
          ctx.reply("Something went wrong.☹️\nPlease Try again later.");
        });
    } catch (error) {
      console.log("Error downloading video:", error);
      ctx.reply("Something went wrong.☹️\nPlease Try again later.");
    }
  } else {
    ctx.reply("Please provide a Valid URL of a Youtube.");
  }
}

module.exports = { downloadVideo };
