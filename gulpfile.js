const {src, dest, series} = require('gulp');
const htmlReplace = require('gulp-html-replace');
const concat = require('gulp-concat');
const {init, write} = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');

const htmlTask = function() {
  return src('src/*.html')
    .pipe(htmlReplace({css: 'all-styles.css'}))
    .pipe(dest('dist/'));
};

const styleTask = function() {
  return src('src/*.css')
    .pipe(init())
      .pipe(concat('all-styles.css'))
      .pipe(cleanCSS())
    .pipe(write())
    .pipe(dest('dist/'));
};

const jsTask = function() {
  return src('src/*.js')
    .pipe(init())
      .pipe(uglify())
    .pipe(write())
    .pipe(dest('dist/'));
};

exports.default = series(htmlTask, styleTask, jsTask);
