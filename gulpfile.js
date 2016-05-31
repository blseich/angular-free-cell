var gulp = require('gulp'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    Server = require('karma').Server,
    jscs = require('gulp-jscs'),
    notify = require('gulp-notify');

gulp.task('default', ['lint', 'test'], function() {
  gulp.src([
    'js/modules/*.js',
    'js/ng/app-definition.js',
    'js/ng/*/*-definition.js',
    'js/ng/*/*.js',
    'js/ng/app.js'
  ])
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

gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('lint', function() {
  gulp.src('js/**/*.js')
        .pipe(jscs())
        .pipe(jscs.reporter());
});