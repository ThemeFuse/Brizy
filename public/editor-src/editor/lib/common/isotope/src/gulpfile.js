var gulp = require("gulp"),
  gulpConcat = require("gulp-concat"),
  gulpUglify = require("gulp-uglify");

gulp.task("default", ["js"]);

gulp.task("js", function() {
  var src = ["./js/isotope.pkgd.js"];
  var dest = "../";

  gulp
    .src(src)
    .pipe(gulpConcat("isotope.pkgd.min.js"))
    .pipe(gulpUglify())
    .pipe(gulp.dest(dest));
});
