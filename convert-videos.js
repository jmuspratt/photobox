const spawn = require("child_process").spawn;
const fs = require("fs");
const path = require("path");
const scanLibrary = require("./scanLibrary.js");

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
function resizeVideo(video, quality) {
  const outputPath = getOutputPath(video);

  const p = new Promise((resolve, reject) => {
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
      "veryslow",
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
      resolve();
    });
  });
  return p;
}

function processVideos() {
  let video = videos.pop();

  if (video) {
    const outputPath = getOutputPath(video);
    if (fs.existsSync(outputPath)) {
      console.log(`Video already exists at ${outputPath}`);
      processVideos();
    } else {
      resizeVideo(video, 720).then(() => {
        console.log(`Video processed and saved to ${outputPath}`);
        processVideos();
      });
    }
  }
}

processVideos();
