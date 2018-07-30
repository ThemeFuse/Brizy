var gulp = require('gulp'),
    gulpConcat = require('gulp-concat'),
    gulpUglify = require('gulp-uglify');

gulp.task('default', ['js']);

gulp.task('js', function() {
    var src = [
        './js/jquery.countdown.js',
    ];
    var dest = '../';

    gulp.src(src)
        .pipe(gulpConcat('jquery.countdown.min.js'))
        .pipe(gulpUglify())
        .pipe(gulp.dest(dest));
});
