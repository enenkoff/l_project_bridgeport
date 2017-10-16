var gulp = require('gulp'),
    notify = require('gulp-notify'),
    svgstore = require('gulp-svgstore'),
    imagemin = require('gulp-imagemin'),
    include = require('gulp-html-tag-include'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require("gulp-rename"),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync');


/* create svg sprite */

gulp.task('svgstore', function(){
    gulp.src(['src/svg/sprite/*.svg','!app/src/**/logo.svg'])
        .pipe(svgstore())
        .pipe(gulp.dest('dev/assets/svg'))
});

/* minimize images */

gulp.task('imagemin', function () {
    gulp.src('src/images/**/*.+(jpg|jpeg|png)')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('dev/assets/images'))
});

/* builders */

gulp.task('includer:html', function () {
    gulp.src('src/pages/*.html')
        .pipe(include())
        .pipe(gulp.dest('dev'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('rigger:js', function () {
    gulp.src('src/js/libs/main.js')
        .pipe(rigger())
        .pipe(gulp.dest('src/js'));
        // .pipe(browserSync.reload({stream: true}));
});

gulp.task('optimize:js', ['rigger:js'], function () {
    setTimeout(function () {
        gulp.src('src/js/main.js')
            .pipe(gulp.dest('dev/assets/js'))
            // .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('dev/assets/js'))
            .pipe(browserSync.reload({stream: true}));
    },1000)

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


/* compile sass with notify errors */

gulp.task( 'sass', function() {
    gulp.src('src/sass/**/*.+(sass|scss)')
        .pipe( sass().on( 'error', notify.onError(
            {
                message: "<%= error.message %>",
                title  : "Sass ошибка!"
            } ) )
        )
        .pipe( gulp.dest( 'src/css' ) )
        .pipe( notify( 'Готово!' ) )
    // .pipe(browserSync.reload({stream: true}));
});

gulp.task('optimize:css', ['sass'], function () {
    setTimeout(function () {
        gulp.src('src/css/styles.css')
            .pipe(autoprefixer())
            .pipe(gulp.dest('dev/assets/css'))
            .pipe(cssmin())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('dev/assets/css'))
            .pipe(browserSync.reload({stream: true}));
    },1000)

});


/* watch changes */

gulp.task('watch', ['optimize:css', 'includer:html', 'rigger:js', 'browser-sync'], function () {
    gulp.watch('src/sass/**/*.+(sass|scss)',['optimize:css']);
    gulp.watch('src/**/*.html', ['includer:html']);
    gulp.watch('src/js/**/*.js', ['optimize:js']);
});








