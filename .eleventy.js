// docs: https://www.11ty.io/docs/config/
const fs = require("fs");
const path = require('path');


  // Image processing
  // https://www.11ty.dev/docs/plugins/image/#installation

  const Image = require("@11ty/eleventy-img");
  async function imageShortcode(src, alt) {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }
  
    let metadata = await Image(src, {
      widths: [900, 1200, 2400],
      formats: ["jpeg"],
      outputDir: "./dist/img/",
      filenameFormat:  (id, src, width, format, options) => {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}__${width}.${format}`;
      }

    });

    // Use metadata to determine several responsive image attributes
    // https://www.11ty.dev/docs/plugins/image/#url-path
    const lowResImgSrc = metadata.jpeg[0].url;
    const isPortrait = metadata.jpeg[0].height > metadata.jpeg[0].width;

    // Srcset
    const srcSet = metadata.jpeg.map(item=> item.srcset).join(', ');

    // Sizes
    let sizes="(min-width: 800px) 75vw, 100vw";  // Landscape images
    if (isPortrait) {
        sizes="(min-width: 800px) 38vw, 100vw";  // Portrait images are half wide
    }

    return `
    <div class="album__block album__block--image album__block--image-${isPortrait ? 'portrait': 'landscape'}">
      <img 
        alt="${alt}"
        decoding="async"
        loading="lazy"
        sizes="${sizes}" 
        src="${lowResImgSrc}"
        srcset="${srcSet}"
        >
    </div>`;
  }

module.exports = function(eleventyConfig) {
   
  eleventyConfig.setBrowserSyncConfig({
    
   callbacks: {
     // add a 404 page
    /*   ready: function(err, bs) {
         const content_404 = fs.readFileSync('_site/404.html');
         bs.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
       }, */
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
    }
  });


  // Pass throug certain assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy({ "src/album-assets/**/*.mov": "video" });

  // Add shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);


  return {
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist"
    }
  };
};