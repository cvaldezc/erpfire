var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    watch = require('gulp-watch');
var coffee = require('gulp-coffee');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

gulp.task('stylus', function() {
  gulp.src('CMSGuias/media/css/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({
        use: nib(),
        import: ['nib']
      }))
    .pipe(gulp.dest('CMSGuias/media/css/'));
    console.log('Stylus Compiled! with Nib');
});

gulp.task('coffee', function() {
  gulp.src('CMSGuias/media/js/**/*.coffee')
  .pipe(plumber())
  .pipe(coffee({
      bare: true,
    }))
  .pipe(gulp.dest('CMSGuias/media/js/'));
  console.log('CoffeeScript Compiled!');
});

gulp.task('minjs', function() {
    gulp.src('CMSGuias/media/**/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('CMSGuias/media/'));
    console.log('JS minify Compiled!');
});

gulp.task('watch', function() {
  gulp.watch('CMSGuias/media/css/**/*.styl', ['stylus']);
  gulp.watch('CMSGuias/media/js/**/*.coffee', ['coffee']);
});

gulp.task('default', ['watch']);