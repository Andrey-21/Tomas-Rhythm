// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const tinypng = require('gulp-tinypng-unlimited');
const svgmin = require('gulp-svgmin');


// File paths
const files = {
  scssPath: 'src/scss/**/*.scss',
  jsPath: 'src/js/**/*.js',
  imgPath: 'src/img/**/*.@(png|jpg|jpeg)',
  svgPath: 'src/img/**/*.svg'
};

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src(files.scssPath)
      .pipe(sass().on('error', sass.logError))
      .pipe(autoPrefixer())
      .pipe(cleanCSS())
      .pipe(dest('dist/css'));
}

// JS task: concatenates and uglifies JS files to script.min.js
function jsTask() {
  return src(files.jsPath)
      .pipe(rename(function (path) {
         path.basename += ".min";
         path.extname = ".js";
      }))
      .pipe(uglify())
      .pipe(dest("dist/js"));
}

function imgTask() {
  return src(files.imgPath)
      .pipe(tinypng())
      .pipe(dest("dist/img"));
}

function svgTask() {
  return src(files.svgPath)
      .pipe(svgmin({
        plugins: [
          { removeComments: true },
          { cleanupIDs: true }
        ]
      }))
      .pipe(dest("dist/img"));
}

// Watch task: watch SCSS, JS and Image files for changes
// If any change, run scss, js and img tasks simultaneously
function watchTask() {
  watch(
    [files.scssPath, files.jsPath, files.imgPath, files.svgPath],
    parallel(scssTask, jsTask, imgTask, svgTask)
  );
}

// Export the default Gulp task so it can be run
// Runs the scss, js and img tasks simultaneously
// then watch task
exports.default = series(
  parallel(scssTask, jsTask, imgTask, svgTask),
  watchTask
);
