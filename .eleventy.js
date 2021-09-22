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
      widths: [900, 1200, 1600],
      formats: ["jpeg"],
      outputDir: "./dist/img/"

    });
    console.log(metadata);
  
    // https://www.11ty.dev/docs/plugins/image/#url-path
    const imgSrc = metadata.jpeg[0].url;
    const imgSrcSet = metadata.jpeg.map(item=> item.srcset).join(', ');

    return `
    <img 
      src="${imgSrc}"
      srcset="${imgSrcSet}"
      alt="${alt}"
      loading="lazy"
      decoding="async"
      >`;
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
  eleventyConfig.addPassthroughCopy("src/css");
  


  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);


  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist"
    }
  };
};