const path = require('path')
const fs = require('fs');
// const scanLibrary = require('../../scanLibrary.js');


const scanLibrary = (pathString) => {
    const exclusions = ['.DS_Store', '.gitkeep'];
    const assetPath = path.resolve(process.cwd(), pathString);
    const albumDirs = fs.readdirSync(assetPath, 'utf-8');
    const albumSlugs = albumDirs.filter(dir => !exclusions.some(term=> dir.includes(term)));

    const assetLibrary = albumSlugs.map(slug=>{

        const albumContentsPath = path.resolve(process.cwd(), `${pathString}/${slug}` );
        const albumContents = fs.readdirSync(albumContentsPath, 'utf-8');
        const albumName = slug.substring(11).replace(/-/g, ' ') ;
        
        const files = albumContents
        .filter(file=>!exclusions.some(term=> file.includes(term)))
        .map(fileName=>{

            const filePath = `${albumContentsPath}/${fileName}`;
            const extensionString = path.extname(fileName);
            const extension = extensionString.split('.')[1].toLowerCase().trim(); 
            const base = path.basename(fileName, extensionString); 


            // console.log('filepath', filePath);
            // console.log('extension', extension);
            // console.log('base--', base, '--');

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
                    fileType = 'unknown';
            }
            // console.log('fileType is', fileType);
            let textHeading = null;
            let textContents = null;

            // text files
            if (['txt', 'md'].includes(extension)) {
                textHeading = fileName.substring(20).replace(/-/g, ' ').replace(`.${extension}`, '');
                textContents = fs.readFileSync(`${albumContentsPath}/${fileName}`).toString();
            }

            return {
                fileName,
                base,
                extension,
                filePath,
                fileType,
                textHeading,
                textContents
            };
        })

        return {
            slug,
            albumName,
            files,
        };

    });

    return assetLibrary.reverse();
};




module.exports = function() {
    const library = scanLibrary('src/album-assets/');
    // console.log('library from albums.js:', library);
    return library;
};