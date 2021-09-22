const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');
const scanLibrary = require('./scanLibrary.js');
const FFmpeg = require('fluent-ffmpeg');

// Find all videos with scanLibrary
const albumDirs = scanLibrary('src/album-assets/');
let videos = [];
albumDirs.forEach(dir =>{
    const videoFiles = dir.files.filter(file=> file.fileType === 'video');
    videos.push(...videoFiles);
});


function getOutputPath(video) {
    const extension = path.extname(video.name);
    const nameWithoutExtension = path.basename(video.name, extension);
    return `./dist/video/${nameWithoutExtension}.mp4`;
}

// https://gist.github.com/rick4470/0e051cbceae6fd591fd3c02a8ab417cc
function resizeVideo(video, quality) {
    const outputPath = getOutputPath(video)

    const p = new Promise((resolve, reject) => {
        console.log('Converting...', video);
        const ffmpeg = spawn('ffmpeg', ['-i', video.filePath, '-codec:v', 'libx264', '-profile:v', 'main', '-preset', 'slow', '-b:v', '5000k', '-maxrate', '5000k', '-bufsize', '800k', '-vf', `scale=-2:${quality}`, '-threads', '0', '-b:a', '128k', outputPath]);
        ffmpeg.stderr.on('data', (data) => {
            console.log(`${data}`);
        });
        ffmpeg.on('close', (code) => {
            resolve();
        });
    });
    return p;
}

function processVideos() {
    let video = videos.pop();
    const outputPath = getOutputPath(video);

    if (video) {
    if (fs.existsSync(outputPath)) {
        console.log(`Video already exists at ${outputPath}`);
        processVideos();
    } else {
        resizeVideo(video, 720)
        .then(() => {
            console.log(`Completed Video Number - ${video}`);
            processVideos();
        });
    }
}
}

processVideos();
