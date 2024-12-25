import scanLibrary from "../../scanLibrary.js";

export default function () {
  const lib = scanLibrary("src/album-assets/");
  return lib;
}
