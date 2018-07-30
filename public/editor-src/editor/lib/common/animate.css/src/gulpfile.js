var gulp = require("gulp"),
  gulpConcat = require("gulp-concat"),
  gulpMinifyCss = require("gulp-minify-css");

gulp.task("default", ["css"]);

gulp.task("css", function() {
  var src = ["./css/animate.css"];
  var dest = "../";

  gulp
    .src(src)
    .pipe(gulpConcat("animate.min.css"))
    .pipe(gulpMinifyCss())
    .pipe(gulp.dest(dest));
});
