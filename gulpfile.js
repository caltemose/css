const gulp = require('gulp')
const del = require('del')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const browsersync = require('browser-sync').create()
const sasslint = require('gulp-sass-lint')
const cleancss = require('gulp-clean-css')
const rename = require('gulp-rename')


/* Supporting tasks
---------------------------------------------------------------- */

gulp.task('clean', (done) => {
    return del('dist', done)
})

gulp.task('html', () => {
    return gulp.src(['src/html/**/*.pug', '!src/html/**/_*.pug'])
        .pipe(pug())
        .pipe(gulp.dest('dist'))
})

gulp.task('css', () => {
    return gulp.src('src/styles/main.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browsersync.stream())
})

gulp.task('css:theme', () => {
    return gulp.src('src/styles/theme/theme.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browsersync.stream())
})

gulp.task('serve', () => {
    browsersync.init({
        server: {
            baseDir: './dist'
        },
        port: 3333,
        notify: false,
        open: false
    })
})

gulp.task('reload', (done) => {
    browsersync.reload()
    done()
})


/* Watch tasks
---------------------------------------------------------------- */

gulp.task('watch:html', () => {
    gulp.watch('src/html/**/*', gulp.series('html', 'reload'))
})

gulp.task('watch:styles', () => {
    gulp.watch('src/styles/*', gulp.series('css'))
})

gulp.task('watch:styles:theme', () => {
    gulp.watch('src/styles/theme/**/*', gulp.series('css:theme'))
})

gulp.task('watch', gulp.parallel('watch:html', 'watch:styles', 'watch:styles:theme'))


/* Minify/production tasks
---------------------------------------------------------------- */

gulp.task('minify:css', () => {
    return gulp.src('dist/styles/main.css')
        .pipe(cleancss())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./'))
})


/* Lint tasks
---------------------------------------------------------------- */

gulp.task('lint:sass', () => {
    const opts = {
        configFile: './sass-lint.yml'
    }
    return gulp.src('src/styles/**/*.s+(a|c)ss')
        .pipe(sasslint(opts))
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
})


/* Primary tasks
---------------------------------------------------------------- */

gulp.task('build', gulp.series('clean', gulp.parallel('html', 'css', 'css:theme')))

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')))

gulp.task('minify', gulp.series('css', 'minify:css'))
