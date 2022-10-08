
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const gcmq = require('gulp-group-css-media-queries');
const sassGlob = require('gulp-sass-glob');
const pug = require('gulp-pug')
const del = require('del')







gulp.task('pug', function(callback){
    return gulp.src('./src/pug/pages/**/*.pug')
    .pipe(plumber({
        errorHandler: notify.onError(function(err){
            return {
                title: 'Pug',
                sound: false,
                message: err.message
            }
        })
    }))
    .pipe(pug({
        pretty:true
    }))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream())
    callback()

})

gulp.task('scss', function(callback) {
    return gulp.src('./src/scss/main.scss')
    .pipe(plumber({
        errorHandler: notify.onError(function(err){
            return {
                title: 'Styles',
                sound: false,
                message: err.message
            }
        })
    }))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
        indentType: "tab",
        indentWidth: 1,
        outputStyle:
        'expanded'
    }))
    .pipe(gcmq())
    .pipe(autoprefixer({
        overrideBrowserslist :['last 4 version']
    }))
    .pipe(sourcemaps.write())
    .pipe( gulp.dest('./build/css/'))
    .pipe(browserSync.stream())
    callback();
})

gulp.task('copy:js', function(callback){
    return gulp.src('./src/js/**/*.*')
    .pipe(gulp.dest('./build/js'))
    callback()
})
gulp.task('copy:img', function(callback){
    return gulp.src('./src/img/**/*.*')
    .pipe(gulp.dest('./build/img'))
    callback()
})

gulp.task('watch', function(){
    watch(['./build/js**/*.js', './build/img/**/*.'], gulp.parallel(browserSync.reload))
    watch('./src/scss/**/*.scss', function() {
        setTimeout (gulp.parallel('scss'), 1000 )
    })
    watch('./src/pug/**/*.pug',gulp.parallel('pug'))
    watch('./src/img/**/*.*',gulp.parallel('copy:img'))
    watch('./src/js/**/*.js',gulp.parallel('copy:js'))
})


//Задача для старта сервера и из папки src
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

gulp.task('clean:build', function(callback) {
    return del('./build')
    callback()
})

gulp.task('default', gulp.series(gulp.parallel('clean:build'),gulp.parallel( 'scss','pug', 'copy:img','copy:js'), gulp.parallel('server', 'watch')));







