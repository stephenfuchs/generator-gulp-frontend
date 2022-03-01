// Initialize modules
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const htmlmin = require("gulp-htmlmin");
const browsersync = require("browser-sync").create();

// SASS Task
function scssTask() {
  return src("src/scss/main.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist/css/"));
}

// HTML Task
function htmlTask() {
  return src("*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"));
}

// Image Task
function imgTask() {
  return src("src/img/*.{gif,jpg,png,svg,webp}").pipe(dest("dist/img"));
}

// JavaScript Task
function jsTask() {
  return src("src/js/*.js").pipe(dest("dist/js"));
}

// BrowserSync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "dist",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}
function browserSyncReLoad(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("*.html", browserSyncReLoad);
  watch(
    ["src/scss/**/*.scss", "*.html", "src/js/*.js"],
    series(scssTask, htmlTask, imgTask, jsTask, browserSyncReLoad)
  );
}

// Default Gulp Task
exports.default = series(
  scssTask,
  htmlTask,
  imgTask,
  jsTask,
  browserSyncServe,
  watchTask
);
