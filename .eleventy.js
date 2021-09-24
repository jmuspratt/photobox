// docs: https://www.11ty.io/docs/config/
const fs = require("fs");
const path = require('path');


  // Image processing
  // https://www.11ty.dev/docs/plugins/image/#installation

  const Image = require("@11ty/eleventy-img");
  async function imageShortcode(src, alt) {
    if(alt === undefined) {
      // Throw error on missing alt attribute (alt="" works okay)
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
    const lowResImg = metadata.jpeg[0];
    const aspectRatio = (lowResImg.width / lowResImg.height).toFixed(4);
    const isPortrait = aspectRatio < 1;

    // Srcset
    const srcSet = metadata.jpeg.map(item=> item.srcset).join(', ');

    // Sizes
    // Layout goes to 75% width when viewport reeaches 800px
    let sizes="(min-width: 800px) 75vw, 100vw";  // Landscape images
    if (isPortrait) {
      sizes="(min-width: 800px) 38vw, 100vw";  // Portrait images are half width
    }

    return `
    <div class="album__block album__block--image album__block--image-${isPortrait ? 'portrait': 'landscape'}">
      <img 
        alt="${alt}"
        decoding="async"
        loading="lazy"
        sizes="${sizes}" 
        src="${lowResImg.url}"
        srcset="${srcSet}"
        style="aspect-ratio: ${aspectRatio};"
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


  // Pass through certain assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

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