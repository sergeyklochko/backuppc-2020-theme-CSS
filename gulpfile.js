'use strict'

const gulp = require('gulp')
const pug = require('gulp-pug')
const concat = require('gulp-concat')
const del = require('del')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const flatten = require('gulp-flatten')
const sass = require('gulp-sass')
const gcmq = require('gulp-group-css-media-queries')
// const browserSync = require('browser-sync').create()
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const gulpif = require('gulp-if')
const smartgrid = require('smart-grid')
const rename = require('gulp-rename')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const normalize = require('node-normalize-scss')
const print = require('gulp-print').default
// const postcss = require('gulp-postcss')

sass.compiler = require('node-sass')

let isDev = true

const projectname = 'backuppc'

let builddir = '/Users/sergeyklochko/OneDrive/seventeendots/sites/' + projectname
let destdir = '/Users/sergeyklochko/OneDrive/seventeendots/sites/' + projectname
let publicdir = './public'


function buildHTML () {
  console.log(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' html target directory: ' + destdir)
  return gulp.src('./src/*.pug')
    .pipe(gulpif(isDev, pug({ pretty: true }), pug({})))
    .pipe(gulp.dest(destdir))
}

const imgFiles = [
  './src/**/*.ico',
  './src/**/*.jpg',
  './src/**/*.jpeg',
  './src/**/*.svg',
  './src/**/*.png',
  './src/**/*.gif'
]

function buildImages () {
  var imgfolder = destdir + '/img'
  console.log(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' images target directory: ' + imgfolder)
  return gulp.src(imgFiles)
    .pipe(flatten())
    .pipe(gulp.dest(imgfolder))
}

const publicFiles = [
  './src/public/**/*',
]

function copyPublic() {
  var publicfolder = destdir + '/public'
  console.log(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' public files target directory: ' + publicfolder)
  return gulp.src(publicFiles)
    .pipe(gulp.dest(publicfolder))
  }

/*
const jsFiles = [
  './src/es6/scripts.js'
]

function buildJS () {
  return gulp.src(jsFiles)
    .pipe(gulpif(isDev, sourcemaps.init({ loadMaps: true })))
    .pipe(webpackStream({
      output: {
        filename: 'scripts.js'
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['env']
            }
          }
        ]
      },
      externals: {
        jquery: 'jQuery'
      }
    }))
    .pipe(uglify())
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(destdir + '/js'))
}
*/

const jsFiles = [
  // './src/es6/wow.js',
  './src/es6/scripts.js'
]

function buildJS () {
  var jsfolder = destdir + '/js'
  console.log(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' js target directory: ' + jsfolder)
  return gulp.src(jsFiles)
    .pipe(gulpif(isDev, sourcemaps.init({ loadMaps: true })))
    .pipe(concat('scripts.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(jsfolder))
}

const cssFiles = [
  './src/**/*.css'
]

const sassFiles = [
  // normalize.includePaths,
  './src/**/*.scss',
  './src/**/*.sass',
  './src/**/*.css'
]

const cssFileName = 'BackupPC_2020_mod.css'

function buildCSS () {
  var cssfolder = destdir + '/css'
  console.log(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' css target directory: ' + cssfolder)
  return gulp.src(sassFiles)
    .pipe(gulpif(isDev, sourcemaps.init({ loadMaps: true })))
    .pipe(sass.sync({
      includePaths: require('node-normalize-scss').includePaths
    }).on('error', sass.logError))
    .pipe(concat(cssFileName))
    .pipe(gcmq())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    // .pipe(postcss())
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(cssfolder))
}

function build () {
  clean()
  buildCSS()
  buildHTML()
  buildImages()
  //buildJS()
  copyPublic()
}

function buildProject (done) {
  destdir = builddir
  isDev = false
  build()
  isDev = true
  done()
}

function publish (done) {
  isDev = false
  destdir = publicdir
  build()
  isDev = true
  done()
}

function clean () {
  return del([destdir + '/*'], {
    force: true
  })
}

function watch () {
/* browserSync.init({
        server: {
            baseDir: "./build"
        },
        // tunnel: true
    })
*/
  gulp.watch(sassFiles, buildCSS)
  gulp.watch('./**/*.pug', buildHTML)
  gulp.watch(imgFiles, buildImages)
  gulp.watch('./src/**/*.js', buildJS)
  gulp.watch(publicFiles, copyPublic)
}

function autocompile () {
  gulp.watch(sassFiles, buildCSS)
  gulp.watch('./**/*.pug', buildHTML)
  gulp.watch(imgFiles, buildImages)
  gulp.watch('./src/**/*.js', buildJS)
  gulp.watch(publicFiles, copyPublic)
}

let gridOptions = {
  outputStyle: 'sass', /* less || scss || sass || styl */
  columns: 3, /* number of grid columns */
  offset: '20px', /* gutter width px || % || rem */
  mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
  container: {
    maxWidth: '980px', /* max-width оn very large screen */
    fields: '0px' /* side fields */
  },
  breakPoints: {
    lg: {
      width: '960px' /* -> @media (max-width: 1100px) */
    },
    md: {
      width: '960px'
    },
    sm: {
      width: '780px'
      /* set fields only if you want to change container.fields */
    },
    xs: {
      width: '560px'
    }
    /*
    We can create any quantity of break points.

    some_name: {
        width: 'Npx',
        fields: 'N(px|%|rem)',
        offset: 'N(px|%|rem)'
    }
    */
  }
}

function grid (done) {
  smartgrid('./src/sass', gridOptions)
  done()
}

// gulp.task('watch', watch)
gulp.task('autcompile', autocompile)
gulp.task('build', buildProject) // build for local test
gulp.task('styles', buildCSS) // process CSS
gulp.task('pug', buildHTML) // process HTML
gulp.task('public', copyPublic) // process HTML
gulp.task('img', buildImages) // process images
gulp.task('publish', publish) // publish it to GitPages
gulp.task('grid', grid)

// gulp.task('sass:watch', function () {
//   gulp.watch('./src/**/*.sass', gulp.series('sass'))
// })
