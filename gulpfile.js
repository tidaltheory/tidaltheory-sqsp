/* jshint node: true */
/* jshint es5: true */
'use strict';

// DEPENDENCIES =======================================================
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;


// FILE PATHS =========================================================
var theme = 'squarespace';
var source = {

  styles: 'source/styles/**/*.scss',
  scripts: 'source/scripts/*.js',
  images: 'source/images/*.{png,jpg,gif}',
  svgs: 'source/images/*.svg',
  plugins: 'source/vendor'

};
var assets = {

  styles: theme + '/styles',
  scripts: theme + '/scripts',
  images: theme + '/assets/images',
  vendor: theme + '/assets/vendor'

};
var plugins = [

  source.plugins + '/fastclick/lib/fastclick.js'

];
var vendor = [

  // source.plugins + '/idangerous-swiper/dist/js/swiper.jquery.min.js',
  // source.plugins + '/idangerous-swiper/dist/css/swiper.min.css',

];


// AUTOPREFIXER CONFIG ================================================
var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];


// DEPLOY TO SQUARESPACE ==============================================
gulp.task( 'deploy', $.shell.task(
  [
    'git init',
    'git checkout --orphan ' + theme,
    'git add --all',
    'git commit --quiet --message "Deploying to Squarespace"',
    'git push --prune --force https://stormwarning-beta.squarespace.com/template.git ' + theme + ':master',
    'rm -rf .git'
  ],
  {
    cwd: './squarespace'
  }
));


// COMPILE STYLESHEETS ================================================
gulp.task('styles', function () {

  return gulp.src('source/styles/*.scss')
    .pipe($.changed('styles', {
      extension: '.scss'
    }))
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'SASS error:')
    }))
    .pipe($.autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe($.csso())
    .pipe(gulp.dest(assets.styles))
    .pipe($.size({title: 'styles'}));

});


// LINT & CONCATENATE JS ==============================================
gulp.task('scripts', function () {

  return gulp.src(source.scripts)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(assets.scripts));

});

gulp.task('plugins', function () {

  return gulp.src(plugins)
    .pipe($.concat('plugins.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(assets.scripts))
    .pipe($.size({title: 'plugins'}));

});

gulp.task('modernizr', function () {

  return gulp.src(source.scripts)
    .pipe($.modernizr({
      options: [
        'setClasses'
      ],
      tests: [
        'flexbox',
        'flexboxlegacy',
        'flexboxtweener'
      ],
      crawl: false
    }))
    .pipe($.uglify())
    .pipe(gulp.dest(assets.scripts));

});


// COPY ONE-OFF VENDOR SCRIPTS ========================================
gulp.task('vendor', function () {

  return gulp.src(vendor)
    .pipe(gulp.dest(assets.vendor))
    .pipe($.size({title: 'vendor'}));

});


// OPTIMISE IMAGES ====================================================
gulp.task('images', function () {

  return gulp.src(source.images)
    .pipe($.changed(assets.images))
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(assets.images));

});


// CREATE SVG SPRITE ==================================================
gulp.task('sprite', function () {

  return gulp.src(source.svgs)
  .pipe($.svgSprite({
    mode: {
      symbol: {
        dest: './',
        sprite: 'sprite.symbol.svg'
      }
    }
  }))
  .pipe(gulp.dest(assets.images));

});


// WATCH FOR CHANGES AND RELOAD =======================================
gulp.task('serve', ['styles'], function () {
  browserSync({
    notify: false,
    logPrefix: '☸',
    server: './'
  });

  gulp.watch([theme + '/**/*.{block,conf,region,list,preset}'], reload);
  gulp.watch([source.styles], ['styles', reload]);
  gulp.watch([source.scripts], ['scripts']);
  gulp.watch([source.images], ['images', reload]);
});
