var gulp = require("gulp"),
  gulpConcat = require("gulp-concat"),
  gulpMinifyCss = require("gulp-minify-css"),
  gulpUglify = require("gulp-uglify");

gulp.task("default", ["js"]);

gulp.task("js", function() {
  var src = ["./js/jquery-parallax.js"];
  var dest = "../";

  gulp
    .src(src)
    .pipe(gulpConcat("jquery-parallax.min.js"))
    .pipe(gulpUglify())
    .pipe(gulp.dest(dest));
});
