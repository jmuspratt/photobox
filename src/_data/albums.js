const path = require('path')
const fs = require('fs');

const scanLibrary = (pathString) => {
    const assetPath = path.resolve(process.cwd(), pathString);
    const albumDirs = fs.readdirSync(assetPath, 'utf-8');
    const exclusions = ['.DS_Store', '.gitkeep'];
    const albumSlugs = albumDirs.filter(dir => !exclusions.some(term=> dir.includes(term)));

    const assetLibrary = albumSlugs.map(slug=>{

        const albumContentsPath = path.resolve(process.cwd(), `${pathString}/${slug}` );
        const albumContents = fs.readdirSync(albumContentsPath, 'utf-8');
        const name = slug.substring(11).replace(/-/g, ' ');
        
        const files = albumContents.map(name=>{

            const extension = name.split('.')[1];
            
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
                textHeading = name.substring(20).replace(/-/g, ' ').replace(`.${extension}`, '');
                textContents = fs.readFileSync(`${albumContentsPath}/${name}`).toString();
            }

            return {
                name,
                extension,
                fileType,
                textHeading,
                textContents
            };
        })

        return {
            slug,
            name,
            files,
        };

    });

    return assetLibrary.reverse();
};




module.exports = function() {
    return scanLibrary('src/album-assets/');
};