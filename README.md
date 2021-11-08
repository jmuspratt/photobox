# Photobox

A static site script that generates web albums from directories of images and videos. Built with [11ty](https://www.11ty.dev).

![](screenshots/folder.png)
![](screenshots/album1.png)
![](screenshots/album2.png)

## Local setup

1. Open `siteData-example.json`, save as `siteData.json`. Edit the properties with your information. `theme` can be set to `light`, `dark`, or `system`. `robots` is usally set to `all` or `none` ([more options here](https://yoast.com/robots-meta-tags/)).
2. Run `npm install`
3. For video processing, confirm you have [homebrew](https://brew.sh) installed, and use it to install ffmpeg via `brew install ffmpeg`.

## File structure

1. Add folders of images to `src/album-assets/` with a `YYYY-MM-DD-Album-Name` format (there are some examples in the repo).
2. Export your images to these folders as high-resolution JPGs using the same date-based prefix. [Exiftool](https://exiftool.org) and [a shell script](https://gist.github.com/jmuspratt/3680d45b0c12f8b32093) are useful here if your local photo software doesn't give you enough flexibility.
3. Within an album, add text files to serve as headings above a group of photos, using a date-based prefix to position the heading where you want in the alphabetical file sequence. A file named `2020-05-01-Hiking-in-the-alps.txt` will render as a `Hiking in the Alps` heading right above the images/videos that follow it alphabetically. You can also add secondary text in the contents of the text file.

## Viewing locally

4. If you've included `.mov` files in your albums, run `npm run video` to process those videos into 720p files. This may take a while.
5. Run `npm run start` to view your site at `localhost:8080`. Note that the first run with many albums may take a long time to build, since 11ty's image plugin needs to build 3 optimized files for every original.

## Building for production

1. Run `npm run build` to generate the site pages and optimized images.
2. To build the site files _and_ process videos, run `npm run build-all`.
3. Upload the contents of `dist` to your site.

## Development roadmap

### Priority

- [x] Display dates to right of text blocks
- [x] Add OG image for album pages
- [x] Light/Dark themes

### Up Next?

- [ ] RSS / Atom / JSON feeds
- [ ] Remove orphaned optimized videos on build
