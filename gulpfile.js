const { src, dest, watch, series, parallel } = require('gulp');
const sass         = require('gulp-sass')(require('sass'));
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const uglify       = require('gulp-uglify');
const concat       = require('gulp-concat');
const rename       = require('gulp-rename');
const sourcemaps   = require('gulp-sourcemaps');
const browserSync  = require('browser-sync');
const bs           = browserSync.create();
const del          = require('del');

const paths = {
  html:  { src: 'src/*.html',         dest: 'dist/' },
  scss:  { src: 'src/scss/main.scss', dest: 'dist/css/' },
  js:    { src: 'src/js/**/*.js',     dest: 'dist/js/' },
  img:   { src: 'src/img/**/*',       dest: 'dist/img/' },
  fonts: { src: 'src/fonts/**/*',     dest: 'dist/fonts/' },
};

function clean() {
  return del(['dist']);
}

function html() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest))
    .pipe(bs.stream());
}

function styles() {
  return src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest(paths.scss.dest))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scss.dest))
    .pipe(bs.stream());
}

function scripts() {
  return src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(dest(paths.js.dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.js.dest))
    .pipe(bs.stream());
}

function images() {
  return src(paths.img.src, { encoding: false })
    .pipe(dest(paths.img.dest));
}

function fonts() {
  return src(paths.fonts.src, { encoding: false })
    .pipe(dest(paths.fonts.dest));
}

function serve() {
  bs.init({
    server: { baseDir: 'dist' },
    notify: false,
    open: true,
  });
  watch('src/**/*.html',      series(html));
  watch('src/scss/**/*.scss', series(styles));
  watch('src/js/**/*.js',     series(scripts));
  watch('src/img/**/*',       series(images));
}

const build = series(clean, parallel(html, styles, scripts, images, fonts));
const dev   = series(build, serve);

exports.build   = build;
exports.default = dev;
exports.clean   = clean;