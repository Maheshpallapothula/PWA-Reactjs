import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).send("No video URL provided");
  }

  try {
    if (ytdl.validateURL(videoUrl)) {
      // Handle YouTube video download
      const info = await ytdl.getInfo(videoUrl);
      const format = ytdl.chooseFormat(info.formats, {
        quality: "highest",
        filter: "audioandvideo",
      });

      const title = info.videoDetails.title || "video";
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${title}.mp4"`
      );

      ytdl(videoUrl, { format }).pipe(res);
    } else {
      // Handle non-YouTube URLs as direct downloads
      const fileName = "video.mp4"; // You can enhance this to extract the file name dynamically
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      const fetch = await import("node-fetch"); // Dynamically import node-fetch
      const response = await fetch.default(videoUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch video from the given URL");
      }

      response.body.pipe(res);
    }
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).send("Failed to fetch video");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
