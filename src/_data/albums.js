const path = require('path')
const fs = require('fs');

const scanLibrary = (pathString) => {
    const assetPath = path.resolve(process.cwd(), pathString);
    const albumDirs = fs.readdirSync(assetPath, 'utf-8');
    const exclusions = ['.DS_Store', '.gitkeep'];
    const albumSlugs = albumDirs.filter(dir => !exclusions.some(term=> dir.includes(term)));

    const assetLibrary = albumSlugs.map(slug=>{

        const contentsPath = path.resolve(process.cwd(), `${pathString}/${slug}` );
        const contents = fs.readdirSync(contentsPath, 'utf-8');
        
        const files = contents.map(name=>{

            const extension = name.split('.')[1];
            let textHeading = null;
            let textContents = null;

            // text files
            if (['txt', 'md'].includes(extension)) {
                textHeading = name.substring(20).replace('-', ' ').replace(`.${extension}`, '');
                textContents = fs.readFileSync(`${contentsPath}/${name}`).toString();
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
            files,
        };

    });

    return assetLibrary;
};




module.exports = function() {
    return scanLibrary('src/album-assets/');
};