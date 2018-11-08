var gulp = require("gulp"),
  gulpConcat = require("gulp-concat"),
  gulpMinifyCss = require("gulp-minify-css"),
  gulpUglify = require("gulp-uglify");

gulp.task("default", ["css", "js"]);

gulp.task("css", function() {
  var src = ["./css/jquery.mmenu.css"];
  var dest = "../";

  gulp
    .src(src)
    .pipe(gulpConcat("jquery.mmenu.min.css"))
    .pipe(gulpMinifyCss())
    .pipe(gulp.dest(dest));
});

gulp.task("js", function() {
  var src = ["./js/jquery.mmenu.js"];
  var dest = "../";

  gulp
    .src(src)
    .pipe(gulpConcat("jquery.mmenu.min.js"))
    .pipe(gulpUglify())
    .pipe(gulp.dest(dest));
});
