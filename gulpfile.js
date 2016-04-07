var gulp = require('gulp'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

gulp.task('default', function() {
  gulp.src('js/**/*.js')
    .pipe(concat('free-cell.js'))
    .pipe(gulp.dest('build/js'));
  gulp.src('views/**/*.html')
    .pipe(gulp.dest('build/views'));
  gulp.src('bower_components/angular/angular.js')
    .pipe(gulp.dest('build/vendor'));
});

gulp.task('server', ['default'], function() {
  connect.server({
    root: ['build'],
    port: 8000,
    livereload: true
  });
});