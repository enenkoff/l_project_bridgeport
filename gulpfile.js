var gulp = require('gulp'),
    notify = require('gulp-notify'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    concat = require('gulp-concat'),
    font2css = require('gulp-font2css').default,
    cssUrlQuotes  = require('gulp-css-url-quotes'),
    imagemin = require('gulp-imagemin'),
    include = require('gulp-html-tag-include'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    rename = require("gulp-rename"),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    ext_replace = require('gulp-ext-replace'),
    browserSync = require('browser-sync');

var postcss = require('gulp-postcss'),
    autoprefix = require('autoprefixer'),
    stylelint = require('stylelint'),
    stylefmt = require('stylefmt'),
    configLint = require('./stylelint.config'),
    configFmt = require('./stylefmt.config'),
    messages = require('postcss-browser-reporter'),
    newer = require('gulp-newer'),
    mqpacker = require('css-mqpacker');

/* all graph optimize */

gulp.task('optimize:img', function () {
    gulp.src('src/images/**/*.+(jpg|jpeg|png)')
        .pipe(newer('dev/assets/images'))
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('dev/assets/images'));

    gulp.src('src/svg/**/*.svg')
        .pipe(newer('dev/assets/svg'))
        .pipe(svgmin())
        .pipe(gulp.dest('dev/assets/svg'))
        .on('finish',function () {
            gulp.src('dev/assets/svg/sprite/*.svg')
                .pipe(svgstore())
                .pipe(gulp.dest('dev/assets/svg'));
        });
});

gulp.task('optimize:fonts', function() {
    return gulp.src('src/fonts/**/*.{ttf,woff,eot}')
        .pipe(gulp.dest('dev/assets/fonts'))
        .pipe(font2css())
        .pipe(concat('fonts.css'))
        .pipe(cssUrlQuotes())
        .pipe(gulp.dest('dev/fonts'))
})

/* all styles optimize */

gulp.task('optimize:styles', function () {
    gulp.src('src/sass/**/*.+(sass|scss)')
        .pipe( sass({
                outputStyle:'expanded'
            }).on( 'error', notify.onError(
            {
                message: "<%= error.message %>",
                title  : "Sass ошибка!"
            } ) )
        )
        .pipe(
            postcss([
                autoprefix({
                    browsers:['>2%']
                })
            ])
        )
        .pipe( gulp.dest( 'src/css' ) )
        .pipe( notify( 'Готово!' ) )
        .on('finish',function () {
            gulp.src('src/css/styles.css')
                .pipe(
                    postcss([
                        mqpacker(),
                        stylefmt(configFmt),
                        stylelint(configLint),
                        messages()
                    ])
                )
                .pipe(gulp.dest('dev/assets/css'))
                .pipe(cssmin())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest('dev/assets/css'))
                .pipe(browserSync.reload({stream: true}));
        });
});

/* linters */

gulp.task('lint:styles', function () {
    gulp.src('dev/assets/css/styles.css')
        .pipe(
            postcss([
                // stylefmt(configFmt),
                stylelint(configLint),
                messages()
            ])
        )
        .pipe(browserSync.reload({stream: true}));
});

/* all js optimize */

gulp.task('optimize:js', function () {
    gulp.src('src/js/libs/main.js')
        .pipe(rigger())
        .pipe(gulp.dest('src/js'))
        .on('finish',function () {
            gulp.src('src/js/main.js')
                .pipe(gulp.dest('dev/assets/js'))
                .pipe(uglify())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest('dev/assets/js'))
                .pipe(browserSync.reload({stream: true}));
        })
});

/* builders */

gulp.task('includer:html', function () {
    gulp.src('src/pages/*.html')
        .pipe(include())
        .pipe(gulp.dest('dev'))
        .pipe(browserSync.reload({stream: true}));
});

/* browser sync */

gulp.task('browser-sync',function () {
    browserSync({
        server: {baseDir: 'dev'},
        host: 'localhost',
        port: 4000,
        notify: false
    })
});

/* build php and replace */

gulp.task('build:php',function () {
    gulp.src('dev/*.html')
        .pipe(replace('assets', 'dev/assets'))
        .pipe(ext_replace('.php'))
        .pipe(gulp.dest(''))
});

/* watch changes */

gulp.task('watch', ['optimize:styles', 'includer:html', 'optimize:js', 'browser-sync'], function () {
    gulp.watch('src/sass/**/*.+(sass|scss)',['optimize:styles']);
    gulp.watch('src/**/*.html', ['includer:html']);
    gulp.watch('src/js/**/*.js', ['optimize:js']);
});








