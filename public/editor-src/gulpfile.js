process.on("unhandledRejection", error => {
  console.log("unhandledRejection", error.message, error);
});

const fs = require("fs");
const path = require("path");
const util = require("util");
const readline = require("readline");
const exec = util.promisify(require("child_process").exec);

const chalk = require("chalk");
const del = require("del");

// gulp
const gulp = require("gulp");
const gulpPlugins = require("gulp-load-plugins")();
const runSequence = require("run-sequence");
const cleanCSS = require("gulp-clean-css");

// webpack
const webpack = require("webpack");
const webpackConfigEditor = require("./webpack.config.editor");
const webpackConfigExport = require("./webpack.config.export");
const webpackConfigPreview = require("./webpack.config.preview");
const webpackConfigPro = require("./webpack.config.pro");

// postcss
const sass = require("@csstools/postcss-sass");
const postcssSCSS = require("postcss-scss");
const autoprefixer = require("autoprefixer");

const { argvVars } = require("./build-utils");

// flags
const {
  TEMPLATE_NAME,
  TARGET,
  IS_PRODUCTION,
  IS_EXPORT,
  IS_PRO,
  BUILD_DIR,
  BUILD_DIR_PRO,
  NO_WATCH,
  paths
} = argvVars(process.argv);
let ABORTED = false;

const postsCssProcessors = [
  sass({
    includePaths: [paths.template, "node_modules"],
    errLogToConsole: true
  }),
  autoprefixer({
    browsers: ["last 2 versions"]
  })
];

gulp.task(
  "build",
  [
    ...(IS_PRODUCTION && IS_EXPORT ? ["verifications"] : []) /* "assignPaths" */
  ],
  () => {
    if (ABORTED) {
      return;
    }

    const tasks = [
      "clean",
      "editor",
      "template",
      ...(IS_EXPORT ? ["export"] : []),
      ...(IS_PRO ? ["pro"] : []),
      ...(IS_PRODUCTION || NO_WATCH ? [] : ["watch"]),
      ...(IS_PRODUCTION && IS_EXPORT && TARGET === "WP" ? ["open-source"] : []),
      ...(IS_PRODUCTION && IS_EXPORT ? ["stats"] : [])
    ];

    runSequence.apply(null, tasks);
  }
);
gulp.task("verifications", async () => {
  const currentBranchCmd = "git rev-parse --abbrev-ref HEAD";
  const { stdout: currentBranchName } = await exec(currentBranchCmd);
  if (
    currentBranchName.trim() !== "master" &&
    (await shouldContinue(
      "You are not on master and compiling for production"
    )) !== true
  ) {
    ABORTED = true;
    return;
  }

  const latestCommitCmd = `git log -n 1 --pretty=format:"%H"`;
  const latestTagCommitCmd = "git rev-list --tags --max-count=1";
  const [
    { stdout: latestCommit },
    { stdout: latestTagCommit }
  ] = await Promise.all([exec(latestCommitCmd), exec(latestTagCommitCmd)]);
  if (
    latestCommit.trim() !== latestTagCommit.trim() &&
    (await shouldContinue(
      "It seems that you have not tagged your latest commit"
    )) !== true
  ) {
    ABORTED = true;
    return;
  }

  function shouldContinue(message) {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question(chalk.red.bold(`${message}. Continue ? y/n: `), answer => {
        rl.close();
        resolve(answer === "y");
      });
    });
  }
});
gulp.task("assignPaths", () => {
  const templatesPath = path.resolve(__dirname, "./templates");

  if (!TEMPLATE_NAME) {
    throw new Error(
      chalk.red.bold(
        "No template argument (-t TEMPLATE) specified for gulp build"
      )
    );
  }
  if (!templateExists(TEMPLATE_NAME)) {
    throw new Error(
      chalk.red.bold("Template " + TEMPLATE_NAME + ", not found:")
    );
  }
  paths.template = path.resolve(templatesPath, `./${TEMPLATE_NAME}`);
  paths.build = BUILD_DIR
    ? path.resolve(__dirname, BUILD_DIR)
    : path.resolve(__dirname, `./build/${TEMPLATE_NAME}`);

  function templateExists(template) {
    const templates = fs.readdirSync(templatesPath);
    return templates.indexOf(template) !== -1;
  }
});

gulp.task("clean", ["clean.free", ...(IS_PRO ? ["clean.pro"] : [])]);
gulp.task("clean.free", () => {
  del.sync(paths.build + "/*", { force: true });
});
gulp.task("clean.pro", () => {
  del.sync(paths.buildPro + "/*", { force: true });
});

gulp.task(
  "editor",
  [
    "editor.js.compile",
    "editor.css",
    "editor.fonts",
    "editor.icons",
    "editor.img",
    "editor.twig"
  ],
  done => {
    if (IS_PRODUCTION) {
      const tasks = ["editor.js.sourcemap"];

      runSequence(tasks, done);
    } else {
      done();
    }
  }
);
gulp.task("editor.js.compile", done => {
  const options = {
    TEMPLATE_NAME,
    TEMPLATE_PATH: paths.template,
    TARGET,
    IS_PRODUCTION,
    IS_EXPORT,
    BUILD_PATH: paths.build,
    BUILD_DIR_PRO: paths.buildPro,
    NO_WATCH
  };
  const config = webpackConfigEditor(options);

  let doneCalled = false;
  webpack(config, (err, stats) => {
    if (stats.hasErrors()) {
      gulpPlugins.util.log("[webpack] error", stats.toString("errors-only"));
    } else {
      gulpPlugins.util.log("[webpack] success");
    }

    if (!doneCalled) {
      doneCalled = true;
      done();
    }
  });
});
gulp.task("editor.css", () => {
  const src = [
    paths.editor + "/lib/common/*/*.css",
    paths.editor + "/lib/editor/*/*.css",
    paths.editor + "/sass/main.editor.scss"
  ];
  const dest = paths.build + "/editor/css";

  gulp
    .src(src, { base: paths.editor })
    .pipe(gulpPlugins.if(!IS_PRODUCTION, gulpPlugins.sourcemaps.init()))
    .pipe(
      gulpPlugins
        .postcss(postsCssProcessors, {
          syntax: postcssSCSS
        })
        .on("error", err => {
          console.log("Sass Syntax Error", err);
        })
    )
    .pipe(
      cleanCSS({
        format: {
          breaks: {
            afterRuleEnds: true
          }
        }
      })
    )
    .pipe(gulpPlugins.concat("editor.css"))
    .pipe(gulpPlugins.if(!IS_PRODUCTION, gulpPlugins.sourcemaps.write()))
    .pipe(gulp.dest(dest));
});
gulp.task("editor.fonts", () => {
  const src = [
    paths.editor + "/sass/editor/fonts/*",
    paths.template + "/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}"
  ];
  const dest = paths.build + "/editor/fonts";

  gulp.src(src).pipe(gulp.dest(dest));
});
gulp.task("editor.icons", () => {
  const src = paths.editor + "/sass/editor/icons/*";
  const dest = paths.build + "/editor/icons";

  gulp.src(src).pipe(gulp.dest(dest));
});
gulp.task("editor.img", () => {
  const src = paths.editor + "/img/*";
  const dest = paths.build + "/editor/img";

  gulp.src(src).pipe(gulp.dest(dest));
});
gulp.task("editor.twig", done => {
  const src = paths.editor + "/templates/editor.html.twig";
  const dest = paths.build + "/editor/views";

  gulp
    .src(src)
    // provide a way for template developers to inject
    // something in the header or footer of the template
    // minify the template file
    .pipe(
      gulpPlugins.if(
        IS_PRODUCTION,
        gulpPlugins.htmlmin({
          collapseWhitespace: true,
          minifyJS: true
        })
      )
    )
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});
gulp.task("editor.js.sourcemap", done => {
  const src = paths.build + "/editor/js/editor.js";
  const dest = paths.build + "/editor/js";
  const sourceMapRegex = /(\/\/# sourceMappingURL=.+)$/;

  gulp
    .src(src)
    .pipe(gulpPlugins.rename("editor.dev.js"))
    .pipe(gulp.dest(dest))
    .pipe(gulpPlugins.replace(sourceMapRegex, ""))
    .pipe(gulpPlugins.rename("editor.js"))
    .pipe(gulp.dest(dest))
    .on("end", done);
});

gulp.task("template", [
  ...(IS_PRODUCTION && IS_EXPORT
    ? ["template.icons", "template.media"]
    : ["template.icons"]),
  "template.blocksImg"
]);
gulp.task("template.media", done => {
  const src = paths.template + "/assets/img/*";
  const dest = paths.build + "/media";

  gulp
    .src(src)
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});
gulp.task("template.icons", done => {
  const src = paths.template + "/assets/icons/**/*";
  const dest = paths.build + "/template/";
  const { encrypt } = require(paths.editor +
    "/js/component/ThemeIcon/utils.js");

  const svgEncrypt = content => {
    const base64 = Buffer.from(content).toString("base64");

    return encrypt(base64);
  };

  gulp
    .src(src, { base: paths.template + "/assets" })
    .pipe(gulpPlugins.change(svgEncrypt))
    .pipe(gulp.dest(dest))
    .on("end", done);
});
gulp.task("template.blocksImg", done => {
  const src = paths.template + "/blocks/**/Preview.jpg";
  const dest = paths.build + "/template/img-block-thumbs";

  gulp
    // .src(src, { base: paths.template + "/assets" })
    .src(src)
    .pipe(
      gulpPlugins.rename(path => {
        path.basename = path.dirname;
        path.dirname = "";
      })
    )
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});

gulp.task("export", ["export.css", "export.js", "export.twig"]);
gulp.task("export.css", done => {
  const src = [
    paths.editor + "/lib/common/*/*.css",
    paths.editor + "/lib/export/*/*.css",
    paths.editor + "/sass/main.export.scss"
  ];
  const dest = paths.build + "/editor/css";

  gulp
    .src(src, { base: paths.editor })
    .pipe(
      gulpPlugins
        .postcss(postsCssProcessors, {
          syntax: postcssSCSS,
          failOnError: false
        })
        .on("error", err => {
          console.log("Sass Syntax Error", err);
        })
    )
    .pipe(gulpPlugins.concat("preview.css"))
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});
gulp.task("export.js", done => {
  const options = {
    TEMPLATE_NAME,
    TEMPLATE_PATH: paths.template,
    TARGET,
    IS_PRODUCTION,
    IS_EXPORT,
    BUILD_PATH: paths.build,
    BUILD_DIR_PRO: paths.buildPro,
    NO_WATCH
  };
  const config = [webpackConfigPreview(options), webpackConfigExport(options)];

  let doneCalled = false;
  webpack(config, (err, stats) => {
    if (stats.hasErrors()) {
      gulpPlugins.util.log("[webpack] error", stats.toString("errors-only"));
    } else {
      gulpPlugins.util.log("[webpack] success");
    }

    if (!doneCalled) {
      doneCalled = true;
      done();
    }
  });
});
gulp.task("export.twig", done => {
  const src =
    TARGET === "WP"
      ? paths.editor + "/templates/static.wp.html.twig"
      : paths.editor + "/templates/static.html.twig";
  const dest = paths.build + "/editor/views";

  gulp
    .src(src)
    // minify the template file
    .pipe(
      gulpPlugins.if(
        IS_PRODUCTION,
        gulpPlugins.htmlmin({
          collapseWhitespace: true,
          minifyJS: true
        })
      )
    )
    .pipe(gulpPlugins.rename("static.html.twig"))
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});

gulp.task("stats", () => {
  const src = [
    // editor
    paths.build + "/editor/js/editor.js",
    paths.build + "/editor/js/editor.vendor.js",
    paths.build + "/editor/css/editor.css",

    // export
    paths.build + "/editor/js/preview.js",
    paths.build + "/editor/css/preview.css",

    // static
    paths.build + "/editor/js/export.js"
  ];

  gulp.src(src).pipe(
    gulpPlugins.size({
      showFiles: true
    })
  );
});

gulp.task("pro", [
  "pro.js",
  "pro.block-thumbs",
  "pro.template-thumbs",
  ...(IS_PRODUCTION && IS_EXPORT ? ["pro.media"] : [])
]);
gulp.task("pro.js", done => {
  const options = {
    TEMPLATE_NAME,
    TEMPLATE_PATH: paths.template,
    TARGET,
    IS_PRODUCTION,
    IS_EXPORT,
    BUILD_PATH: paths.build,
    BUILD_PATH_PRO: paths.buildPro,
    NO_WATCH
  };
  const config = webpackConfigPro(options);

  let doneCalled = false;
  webpack(config, (err, stats) => {
    if (stats.hasErrors()) {
      gulpPlugins.util.log(
        "[webpack pro] error",
        stats.toString("errors-only")
      );
    } else {
      gulpPlugins.util.log("[webpack pro] success");
    }
    if (!doneCalled) {
      doneCalled = true;
      done();
    }
  });
});
gulp.task("pro.block-thumbs", done => {
  const src = paths.template + "/pro/blocks/**/Preview.jpg";
  const dest = paths.buildPro + "/img-block-thumbs";
  gulp
    .src(src)
    .pipe(
      gulpPlugins.rename(path => {
        path.basename = path.dirname;
        path.dirname = "";
      })
    )
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});
gulp.task("pro.template-thumbs", done => {
  const src = paths.template + "/pro/templates/**/Preview.jpg";
  const dest = paths.buildPro + "/img-template-thumbs";

  gulp
    .src(src)
    .pipe(
      gulpPlugins.rename(path => {
        path.basename = path.dirname;
        path.dirname = "";
      })
    )
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});
gulp.task("pro.media", done => {
  const src = paths.template + "/pro/media/*";
  const dest = paths.buildPro + "/media";

  gulp
    .src(src)
    .pipe(gulp.dest(dest))
    .on("end", done);
});

gulp.task("open-source", done => {
  const src = [
    "./**/*",
    "!node_modules/",
    "!node_modules/**",
    "!backend/",
    "!backend/**/*",
    "!build/",
    "!build/**/*",
    "!templates/*/assets/{icons,img}/",
    "!templates/*/assets/{icons,img}/**",
    "!**/pro/",
    "!**/pro/**/*",
    "!**/*.pro.*"
  ];
  const dest = paths.build + "/editor-src";

  gulp
    .src(src, { dot: true })
    .pipe(
      gulpPlugins.rename(path => {
        if (path.basename === "README.GITHUB") {
          path.basename = "README";
        }
      })
    )
    .pipe(gulp.dest(dest))
    .on("end", done);
});

gulp.task("watch", () => {
  // edit.html.twig (for some reason doesn't work )
  // const editorTwigPath = paths.editor + "/templates/editor.html.twig";
  // gulp.watch(editorTwigPath, ["editor.twig"]).on("change", handleChange);

  // editor js.init
  const jsInitPath = paths.editor + "/js/bootstraps/init/*.js";
  gulp.watch(jsInitPath, ["editor.js.init"]).on("change", handleChange);

  // editor css
  const coreCSSPath = paths.editor + "/**/*.scss";
  gulp
    .watch(coreCSSPath, ["editor.css", ...(IS_EXPORT ? ["export.css"] : [])])
    .on("change", handleChange);

  // libs (uncomment if needed)
  // const editorLibs = paths.editor + "/lib/*/*/*.js";
  // gulp.watch(editorLibs, ["editor.js.lib"]).on("change", handleChange);

  const templateMiscPath = [
    paths.template + "/assets/**/*",
    "!" + paths.template + "/assets/icons/**"
  ];
  gulp
    .watch(templateMiscPath, ["template", "editor.css"])
    .on("change", handleChange);

  function handleChange(event) {
    console.log(event.type, event.path);
  }
});
