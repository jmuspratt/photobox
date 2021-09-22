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
        const name = slug.substring(11).replace('-', ' ');
        
        const files = albumContents.map(name=>{

            const extension = name.split('.')[1];
            let textHeading = null;
            let textContents = null;

            // text files
            if (['txt', 'md'].includes(extension)) {
                textHeading = name.substring(20).replace('-', ' ').replace(`.${extension}`, '');
                textContents = fs.readFileSync(`${albumContentsPath}/${name}`).toString();
            }

            return {
                name,
                extension,
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

    return assetLibrary;
};




module.exports = function() {
    return scanLibrary('src/album-assets/');
};