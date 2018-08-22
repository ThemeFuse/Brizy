var gulp = require("gulp"),
  gulpConcat = require("gulp-concat"),
  gulpUglify = require("gulp-uglify"),
  gulpMinifyCss = require("gulp-minify-css");

gulp.task("default", ["js", "css"]);

gulp.task("js", function() {
  var src = ["./js/jquery.magnific-popup.js"];
  var dest = "../";

  gulp
    .src(src)
    .pipe(gulpConcat("jquery.magnific-popup.min.js"))
    .pipe(gulpUglify())
    .pipe(gulp.dest(dest));
});

gulp.task("css", function() {
  var src = ["./css/jquery.magnific-popup.css"];
  var dest = "../";

  gulp
    .src(src)
    .pipe(gulpConcat("jquery.magnific-popup.min.css"))
    .pipe(gulpMinifyCss())
    .pipe(gulp.dest(dest));
});
