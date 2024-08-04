const { series, parallel, src, dest, task } = gulp;
import * as gulp from "gulp";
import fileinclude from "gulp-file-include";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import server from "gulp-server-livereload";

const sass = gulpSass(dartSass);

const distFolder = "./dist";
const srcFolder = "./src";

const path = {
  srcFolder,
  distFolder,
  build: {
    html: `${distFolder}/`,
    css: `${distFolder}/css/`,
    img: `${distFolder}/img/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    scss: `${srcFolder}/scss/*.scss`,
    img: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,ico,svg,webp,avif}`,
  },
  watch: {
    html: ``,
    scss: `${srcFolder}/scss/**/*.scss`,
    img: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,ico,svg,webp,avif}`,
  },
};

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

const includeFiles = () => {
  return src(path.src.html)
    .pipe(fileinclude(fileIncludeSettings))
    .pipe(dest(path.build.html));
};

const scss = () => {
  return src(path.src.scss).pipe(sass()).pipe(dest(path.build.css));
};

const copyImages = () => {
  return src(path.src.img, { encoding: false }).pipe(dest(path.build.img));
};

const serverOptions = {
  livereload: true,
  open: true,
};

const startServer = () => {
  return src(distFolder).pipe(server(serverOptions));
};

const dev = parallel(includeFiles, scss, copyImages);

task("default", dev);

export { includeFiles, scss, copyImages, startServer };
