const { src, dest, series, parallel, watch } = require("gulp");
const cleanDir = require("gulp-clean-dir");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();

let paths = {
  dest: "./dist",
  destjs: "./dist/src/js",
  destcss: "./dist/src/css",
  src: "./src",
};

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "./src/",
    },
  });
}

function html() {
  return src("src/*.html").pipe(dest(paths.dest));
}

function css() {
  return src("src/css/**/*.css")
    .pipe(concat("styles.min.css"))
    .pipe(dest(paths.destcss))
    .pipe(browserSync.stream());
}

function scripts() {
  return src("src/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(paths.destjs))
    .pipe(browserSync.stream());
}

async function clean() {
  return await cleanDir(paths.dest);
}

function watching() {
  watch(["src/*.html", "src/html/**/*.html"]).on("change", browserSync.reload);
  watch(["src/css/**/*.css"], { ignoreInitial: false }, css);
  watch(["src/js/**/*.js"], { ignoreInitial: false }, series(clean, scripts));
}

exports.browsersync = browsersync;
exports.html = html;
exports.css = css;
exports.scripts = scripts;
exports.clean = clean;
exports.watching = watching;

exports.start = series(
  series(html, css, scripts),
  parallel(browsersync, watching)
);
exports.build = series(clean, html, css, scripts);

exports.default = series(
  series(html, css, scripts),
  parallel(browsersync, watching)
);
