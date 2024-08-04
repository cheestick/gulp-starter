const { series, parallel, src, dest, task } = gulp;
import * as gulp from "gulp";
import fileinclude from "gulp-file-include";

const distFolder = "./dist";
const srcFolder = "./src";

const path = {
  srcFolder,
  output: distFolder,
  build: {},
  src: {
    html: `${srcFolder}/*.html`,
  },
  watch: {},
};

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

const includeFiles = () => {
  return src(path.src.html)
    .pipe(fileinclude(fileIncludeSettings))
    .pipe(dest(path.output));
};

const dev = (done) => {
  done();
};

task("default", dev);

export { includeFiles };
