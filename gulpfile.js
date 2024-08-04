const { series, parallel, src, dest, task } = gulp;
import * as gulp from "gulp";
import fileinclude from "gulp-file-include";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";

const sass = gulpSass(dartSass);

const distFolder = "./dist";
const srcFolder = "./src";

const path = {
  srcFolder,
  output: distFolder,
  build: {
    css: `${distFolder}/css/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    scss: `${srcFolder}/scss/*.scss`,
  },
  watch: {
    html: ``,
    scss: `${srcFolder}/scss/**/*.scss`,
  },
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

const scss = () => {
  return src(path.src.scss).pipe(sass()).pipe(dest(path.build.css));
};

const dev = parallel(includeFiles, scss);

task("default", dev);

export { includeFiles, scss };
