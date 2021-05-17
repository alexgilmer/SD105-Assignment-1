const {src, dest, series} = require('gulp');

const htmlTask = function() {
  return src('src/*.html')
    .pipe(dest('dist/'));
};

const styleTask = function() {
  return src('src/*.css')
    .pipe(dest('dist/'));
};

const jsTask = function() {
  return src('src/*.js')
    .pipe(dest('dist/'));
};

exports.default = series(htmlTask, styleTask, jsTask);
