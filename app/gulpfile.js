const gulp = require('gulp'),
    gulpConnect = require('gulp-connect'),
    gulpMinifyCss = require('gulp-minify-css'),
    gulpConcat = require('gulp-concat'),
    gulpUglify = require('gulp-uglify'),
    gulpHtmlmin = require('gulp-htmlmin');

gulp.task('sayHello', async function () {
    console.log("Hello, selamat datang di Gulp!");
});

gulp.task('server', async function () {
    gulpConnect.server({
        root: "test",
        livereload: true
    });
});

gulp.task('minify-css', async function () {
    gulp.src('./build/css/*.css')
        .pipe(gulpMinifyCss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('./test/css/'))
        .pipe(gulpConnect.reload());
});

gulp.task('minify-js', async function () {
    gulp
        .src([
            './build/js/*.js'
        ])
        //.pipe(gulpConcat('bundle.js'))
        //.pipe(gulpUglify())
        .pipe(gulp.dest('test/js'))
        .pipe(gulpConnect.reload());
});

gulp.task('minify-html', async function () {
    gulp.src('build/*.html')
        .pipe(gulpHtmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('test'))
        .pipe(gulpConnect.reload());
});

gulp.task('watch', async function () {
    gulp.watch('./build/js/*.js', gulp.series('minify-js'));
    gulp.watch('./build/css/*.css', gulp.series('minify-css'));
    gulp.watch('./build/*.html', gulp.series('minify-html'));
});

gulp.task('default', gulp.series('watch', 'server'));