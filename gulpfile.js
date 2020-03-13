const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const browserSync = require('browser-sync').create();
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssvariables = require('postcss-css-variables'); 
const calc = require('postcss-calc');  
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const uglify = require('gulp-uglify');

// js file paths
const utilJsPath = 'node_modules/codyhouse-framework/main/assets/js'; // util.js path
const codyhouseJsPath = 'public/js/codyhouse/components/*.js'; // component js files
const componentsJsPath = 'public/js/components/*.js'; // component js files
const chartJsPath = 'node_modules/chart.js/dist/Chart.bundle.min.js'; // chart.js files
const momentPath = 'node_modules/moment/min/moment.min.js'; // moment js files
const momentLocalesPath = 'node_modules/moment/min/moment-with-locales.min.js'; // moment js files
const scriptsJsPath = 'public/js'; //folder for final scripts.js/scripts.min.js files

// css file paths
const cssFolder = 'public/style'; // folder for final style.css/style-custom-prop-fallback.css files
const scssFilesPath = 'public/style/**/*.scss'; // scss files to watch

function reload(done) {
  browserSync.reload();
  done();
}

gulp.task('sass', function() {
  return gulp.src([scssFilesPath])
  .pipe(sassGlob())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest(cssFolder))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(rename('style-fallback.css'))
  .pipe(postcss([cssvariables(), calc()]))
  .pipe(gulp.dest(cssFolder));
});

gulp.task('scripts', function() {
  return gulp.src([utilJsPath+'/util.js', codyhouseJsPath, momentLocalesPath, chartJsPath, componentsJsPath])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest(scriptsJsPath))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(rename('scripts.min.js'))
  .pipe(terser())
  .pipe(gulp.dest(scriptsJsPath))
  .pipe(browserSync.reload({
    stream: true
  }));
});
