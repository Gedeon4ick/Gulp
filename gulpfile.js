const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin')
const dest = 'docs/'
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');

gulp.task('compress', function() {
  return gulp.src('src/js/*.js')
    .pipe(minify({
      noSource: true
    }))
    .pipe(gulp.dest(dest + 'js'))
});

gulp.task('imgmin', function(){
    return gulp.src('src/assets/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest(dest +'img'))
  }
)

gulp.task('html', function() {
  return gulp.src('src/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest(dest))
})

gulp.task('sass', function() {
  return gulp.src('src/sass/*.scss')
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(gulp.dest(dest))
  .pipe(browserSync.stream())
})

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "docs",
            port: 3000
        }
    });
    gulp.watch('src/*.html').on('change', browserSync.reload)
}); 

gulp.task('watch', () => {
  gulp.watch('src/*.html').on('change', gulp.parallel('html'))
  gulp.watch('src/sass/**/*').on('change', gulp.parallel('sass'))
  gulp.watch('src/assets/**/*').on('change', gulp.parallel('imgmin'))
  gulp.watch('src/js/*').on('change', gulp.parallel('compress'))
})

// вызов и запуск default задач
gulp.task('default', gulp.parallel(
  'html',
  'sass',
  'imgmin',
  'compress',
  'browser-sync',
  'watch'
))

// нужен минификация js, автопрефиксер, сжатие изображений