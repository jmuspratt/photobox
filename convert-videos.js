import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import scanLibrary from "./scanLibrary.js"; // Assuming this is an ESM export

// Find all videos with scanLibrary()
const albumDirs = scanLibrary("src/album-assets/");
let videos = [];
albumDirs.forEach((dir) => {
  const videoFiles = dir.files.filter((file) => file.fileType === "video");
  videos.push(...videoFiles);
});

function getOutputPath(video) {
  return `./dist/video/${video.fileBase}.mp4`;
}

// https://blog.founderatwork.com/how-to-batch-process-video-conversions-using-ffmpeg-with-node-js/
// https://gist.github.com/rick4470/0e051cbceae6fd591fd3c02a8ab417cc
const MAX_CONCURRENT = 3;

function resizeVideo(video, quality) {
  const outputPath = getOutputPath(video);

  return new Promise((resolve, reject) => {
    console.log("Converting...", video.fileName);
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      video.filePath,
      "-c:v",
      "libx265",
      "-crf",
      "24",
      "-vf",
      `scale=-2:${quality}`,
      "-preset",
      "slow",
      "-tag:v",
      "hvc1",
      "-movflags",
      "faststart",
      outputPath,
    ]);

    ffmpeg.stderr.on("data", (data) => {
      console.log(`${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
}

async function processVideos() {
  const pending = videos.filter((v) => !fs.existsSync(getOutputPath(v)));
  const skipped = videos.length - pending.length;

  if (skipped > 0) console.log(`Skipping ${skipped} already-converted videos.`);
  if (pending.length === 0) {
    console.log("All videos processed.");
    return;
  }

  console.log(`Encoding ${pending.length} videos (${MAX_CONCURRENT} at a time)...`);

  for (let i = 0; i < pending.length; i += MAX_CONCURRENT) {
    const batch = pending.slice(i, i + MAX_CONCURRENT);
    await Promise.all(
      batch.map((video) =>
        resizeVideo(video, 720)
          .then(() => console.log(`Done: ${video.fileName}`))
          .catch((err) => console.error(`Error on ${video.fileName}:`, err))
      )
    );
  }

  console.log("All videos processed.");
}

processVideos();
