const fs = require('fs');
const path = require('path');
const scanLibrary = require('./scanLibrary.js');

const FFmpeg = require('fluent-ffmpeg');

const convertVideo = (src, output) => {
    new FFmpeg({ source: src })
    .withVideoCodec('libx264')
    .withVideoBitrate('1000k', true)
    .withAudioCodec('libmp3lame')
    .withSize('?x720')
    .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
        console.log('Processing finished !');
    })
    .saveToFile(output);
}

// find all videos
const albumDirs = scanLibrary('src/album-assets/');

let videos = [];
albumDirs.forEach(dir =>{
    const videoFiles = dir.files.filter(file=>file.fileType === 'video');
    videos.push(...videoFiles);
});

console.log('video files', videos);

videos.forEach(video=>{
    const extension = path.extname(video.name);
    const nameWithoutExtension = path.basename(video.name, extension);
    const outputPath = `./dist/video/${nameWithoutExtension}.mp4`;

if (!fs.existsSync(outputPath)) {
    convertVideo(video.filePath, outputPath);
    }
    else {
        console.log(`Video already exists: ${outputPath}`);
    }
});