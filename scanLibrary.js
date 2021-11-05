const path = require('path')
const fs = require('fs');

const fileNameToDate = (string, includesTime) => {
    // get YYYY-MM-DD
    const part1 = string.substring(0, 10);
    // get HH-MM-SS, convert to HH:MM:SS (fall back to 12 pm if includesTime is false)
    const part2 = includesTime ? string.substring(11, 19).replace(/-/g, ':') : '12:00:00';
    const fullDateString  = `${part1}T${part2}.000-04:00`; // Shift Eastern timestamp to GMT
    const dateObj = new Date(fullDateString); 
    return dateObj;
}

const scanLibrary = (pathString) => {
    const exclusions = ['.DS_Store', '.gitkeep'];
    const assetPath = path.resolve(process.cwd(), pathString);
    const albumDirs = fs.readdirSync(assetPath, 'utf-8');
    const albumSlugs = albumDirs.filter(dir => !exclusions.some(term=> dir.includes(term)));

    const assetLibrary = albumSlugs.map(slug=>{

        const albumContentsPath = path.resolve(process.cwd(), `${pathString}/${slug}` );
        const albumContents = fs.readdirSync(albumContentsPath, 'utf-8');
        const albumName = slug.substring(11).replace(/-/g, ' ');
        const albumDate = fileNameToDate(slug, false).toISOString(); 

        const files = 
        albumContents
        .filter(fileName => !exclusions.some(term=> fileName.includes(term)))
        .map(fileName=>{
            const filePath = `${albumContentsPath}/${fileName}`;
            const extRaw = path.extname(fileName);
            const extension = extRaw.toLowerCase().replace('.', '');
            const fileBase = path.basename(fileName, extRaw); 
            const fileID = fileName.replace(/\./g, '-');
            const fileDate = fileNameToDate(fileBase, true); 
            const fileDateString = fileDate.toLocaleDateString('en-US', { 
                month: 'long',
                day: 'numeric', 
                year: 'numeric',
            });


            let fileType = null;
            switch(extension) {
                case 'txt' :
                    fileType = 'text';
                    break;
                case 'md' :
                    fileType = 'text';
                    break;
                case 'mov' :
                    fileType = 'video';
                    break;
                case 'mp4' :
                    fileType = 'video';
                    break;
                case 'jpeg' :
                    fileType = 'image';
                    break;
                case 'jpg' :
                    fileType = 'image';
                    break;
                default: 
                    fileType = null;
            }
            let textHeading = null;
            let textContents = null;

            // text files
            if (['txt', 'md'].includes(extension)) {
                textHeading = fileName.substring(20).replace(/-/g, ' ').replace(`.${extension}`, '');
                textContents = fs.readFileSync(filePath).toString();
            }


            return {
                fileBase,
                fileName,
                fileID,
                fileDateString,
                extension,
                filePath,
                fileType,
                textHeading,
                textContents
            };
        });
        
        //Extract first image for ogImage tag
        const firstImage = files.find(file=>file.fileType == 'image');

        return {
            albumName,
            albumDate,
            slug,
            files,
            firstImage
        };

    });

    return assetLibrary.reverse();
};

module.exports = scanLibrary;
