// docs: https://www.11ty.io/docs/config/
const fs = require("fs");
const path = require("path");

// Image processing
// https://www.11ty.dev/docs/plugins/image/#installation

const Image = require("@11ty/eleventy-img");
async function imageShortcode(src, alt, htmlID, context) {
  if (alt === undefined) {
    // Throw error on missing alt attribute (alt="" works okay)
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }

  let metadata = await Image(src, {
    widths: [800, 2400],
    formats: ["jpeg"],
    outputDir: "./dist/img/",
    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}__${width}.${format}`;
    },
  });

  // Use metadata to determine several responsive image attributes
  const lowResImg = metadata.jpeg[0];
  const aspectRatio = (lowResImg.width / lowResImg.height).toFixed(4);
  const isPortrait = aspectRatio < 1;

  // Srcset
  const srcSet = metadata.jpeg.map((item) => item.srcset).join(", ");

  // Sizes

  // Layout constants for calculating image sizes
  const gutterMobile = 8;
  const gutterDesktop = 18; // (at 600px)
  const contentArea = 0.8;

  let sizes;
  // Thumbnails (grid view)
  if (context == "thumb") {
    sizes = `
        (min-width: 1200px) calc(1/6 * ${contentArea} * (100vw - ${
      gutterDesktop * 7
    }px)), 
        (min-width: 900px)  calc(1/4 * ${contentArea} * (100vw - ${
      gutterDesktop * 5
    }px)), 
        (min-width: 600px)  calc(1/2 * ${contentArea} * (100vw - ${
      gutterDesktop * 3
    }px)), 
                            calc(100vw - ${gutterMobile * 3}px)
      `;
  } else {
    // Album view: Layout goes 80% width (and vert images are 50 of that%)
    // Landscape images
    sizes = `
        (min-width: 800px) calc(${contentArea} * (100vw - ${
      gutterMobile * 2
    })), 
                           calc(100vw - ${gutterMobile * 2})
      `;
    if (isPortrait) {
      // Portrait images are half width
      sizes = `
          (min-width: 800px) calc(1/2 * ${contentArea} * (100vw - ${
        gutterDesktop * 3
      })), 
          (min-width: 600px) calc(1/2 * (100vw - ${gutterDesktop * 3})), 
                             calc(1/2 * (100vw - ${gutterMobile * 3}))
        `;
    }
  }

  return `
    <div class="album__block album__block--image album__block--image-${
      isPortrait ? "portrait" : "landscape"
    }" id="${htmlID}">
      <img
        alt="${alt}"
        loading="lazy"
        sizes="${sizes}"
        src="${lowResImg.url}"
        srcset="${srcSet}"
        style="aspect-ratio: ${aspectRatio};"
        >
    </div>`;
}

// Feed shortcode (see feed.njk)
async function feedImageShortcode(src, urlBase) {
  let metadata = await Image(src, {
    widths: [1600],
    formats: ["jpeg"],
    outputDir: "./dist/img/",
    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}__${width}.${format}`;
    },
  });
  const medResImg = metadata.jpeg[0];
  return `${urlBase}${medResImg.url}`;
}

// Og image shortcode returns og:image markup
async function ogImageShortcode(src, urlBase) {
  let metadata = await Image(src, {
    widths: [800],
    formats: ["jpeg"],
    outputDir: "./dist/img/",
    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}__${width}.${format}`;
    },
  });
  const lowResImg = metadata.jpeg[0];
  return `
      <meta property="og:image" content="${urlBase}${lowResImg.url}" />
      <meta property="og:image:width" content="${lowResImg.width}" />
      <meta property="og:image:height" content="${lowResImg.height}" />
    `;
}

function getBuildDateShortcode() {
  return new Date().toISOString();
}

module.exports = function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    liveReload: true,
    domDiff: true,
    port: 3000,
    watch: [],
    showAllHosts: false,
  });

  // Pass through certain assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Add shortcodes
  eleventyConfig.addNunjucksShortcode("getBuildDate", getBuildDateShortcode);

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("ogImage", ogImageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("feedImageSrc", feedImageShortcode);

  return {
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
