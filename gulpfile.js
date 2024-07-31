// const { src, dest, series, parallel, watch } = require("gulp");
const { src, dest, series, parallel, watch } = require("gulp");
const clean = require("gulp-clean");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const avif = require("gulp-avif");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
// const chached = require("gulp-cached");
const newer = require("gulp-newer");

const paths = {
  dest: "./dist",
  destjs: "./dist/src/js",
  destcss: "./dist/src/css",
  src: "./src",
  imgraw: "./src/images/raw",
  imgfinal: "./src/images/final",
};

function html() {
  return src("src/*.html").pipe(dest(paths.dest));
}

async function css() {
  return src("src/css/**/*.css")
    .pipe(postcss([autoprefixer()]))
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

function images() {
  return src([paths.imgraw + "/*.*", "!" + paths.imgraw + "/*.svg"], {
    encoding: false,
  })
    .pipe(newer(paths.imgfinal))
    .pipe(avif({ quality: 50 }))
    .pipe(src(paths.imgraw + "/*.*", { encoding: false }))
    .pipe(newer(paths.imgfinal))
    .pipe(webp())
    .pipe(src(paths.imgraw + "/*.*", { encoding: false }))
    .pipe(newer(paths.imgfinal))
    .pipe(imagemin())
    .pipe(dest(paths.imgfinal));
}

function cleanDist() {
  return src(paths.dest).pipe(clean());
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "./src/",
    },
  });

  watch(["src/*.html", "src/html/**/*.html"], { ignoreInitial: false }).on(
    "change",
    browserSync.reload
  );
  watch(["src/css/**/*.css"], { ignoreInitial: false }, css);
  watch(["src/images/raw"], images);
  watch(
    ["src/js/**/*.js"],
    { ignoreInitial: false },
    series(cleanDist, scripts)
  );
}

function build() {
  return src(
    [
      "src/css/main.css",
      "src/js/app.js",
      "src/images/raw/*.*",
      "src/**/*.html",
    ],
    {
      base: "src",
    }
  ).pipe(dest(paths.dest));
}

exports.html = html;
exports.css = css;
exports.scripts = scripts;
exports.images = images;
exports.cleandist = cleanDist;
exports.watching = watching;

exports.start = series(series(html, css, images, scripts), parallel(watching));
exports.build = series(cleanDist, build);

exports.default = series(
  series(html, css, images, scripts),
  parallel(watching)
);
