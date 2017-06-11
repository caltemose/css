const gulp = require('gulp')
const del = require('del')
const pug = require('gulp-pug')
const sass = require('gulp-sass')

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
        // .pipe(autoprefixer())
        .pipe(gulp.dest('dist/styles'))
        // .pipe(browsersync.stream())
})


gulp.task('build', gulp.series('clean', gulp.parallel('html', 'css')))
