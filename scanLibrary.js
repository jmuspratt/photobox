const path = require('path')
const fs = require('fs');

const scanLibrary = (pathString) => {
    const exclusions = ['.DS_Store', '.gitkeep'];
    const assetPath = path.resolve(process.cwd(), pathString);
    const albumDirs = fs.readdirSync(assetPath, 'utf-8');
    const albumSlugs = albumDirs.filter(dir => !exclusions.some(term=> dir.includes(term)));

    const assetLibrary = albumSlugs.map(slug=>{

        const albumContentsPath = path.resolve(process.cwd(), `${pathString}/${slug}` );
        const albumContents = fs.readdirSync(albumContentsPath, 'utf-8');
        const albumName = slug.substring(11).replace(/-/g, ' ');
        
        const files = albumContents.map(fileName=>{
            const filePath = `${albumContentsPath}/${fileName}`;
            const extRaw = path.extname(fileName);
            const extension = extRaw.toLowerCase().replace('.', '');
            const fileBase = path.basename(fileName, extRaw); 

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
                extension,
                filePath,
                fileType,
                textHeading,
                textContents
            };
        })

        return {
            albumName,
            slug,
            files,
        };

    });

    return assetLibrary.reverse();
};

module.exports = scanLibrary;
