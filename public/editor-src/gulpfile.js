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

// webpack
const webpack = require("webpack");
const webpackConfigEditor = require("./webpack.config.editor");
const webpackConfigExport = require("./webpack.config.export");

// rollup
var babel = require("rollup-plugin-babel");

// postcss
const postcssReporter = require("postcss-reporter");
const postcssSCSS = require("postcss-scss");
const stylelint = require("stylelint");
const autoprefixer = require("autoprefixer");

// flags
const argv = require("minimist")(process.argv.slice(2));
const TEMPLATE_NAME = "brizy";
const TARGET = argv.target || argv.t || "none";
const IS_PRODUCTION = Boolean(argv.production);
const IS_EXPORT = Boolean(argv.export || argv.e);
const BUILD_DIR = argv["build-dir"]
  ? argv["build-dir"]
  : TARGET === "WP" && !IS_PRODUCTION
    ? "../../apache/wordpress/wp-content/plugins/brizy/public/editor-build"
    : null;
const NO_WATCH = Boolean(argv["no-watch"]);
let ABORTED = false;

const paths = {
  editor: path.resolve(__dirname, "./editor"),
  template: null, // assigned at run time
  build: null // assigned at run time
};

const supportedBrowsers = ["last 2 versions"];

gulp.task(
  "build",
  [...(IS_PRODUCTION && IS_EXPORT ? ["verifications"] : []), "assignPaths"],
  () => {
    if (ABORTED) {
      return;
    }

    const tasks = [
      "clean",
      "scss-lint",
      "editor",
      "template",
      ...(IS_EXPORT ? ["export"] : []),
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

gulp.task("clean", () => {
  const delOptions = BUILD_DIR ? { force: true } : {};
  del.sync(paths.build + "/*", delOptions);
});

gulp.task("scss-lint", () => {
  const src = [
    paths.editor + "/sass/**/*.scss",
    // paths.editor + '/js/**/*.scss',
    paths.template + "/assets/sass/**/*.scss",

    // Ignore Files
    "!/**/fonts/*.scss", // template
    "!/**/skins/**/*.scss" // template
  ];
  const processors = [
    //stylelint(),
    postcssReporter({
      clearMessages: true,
      throwError: true
    })
  ];

  return gulp
    .src(src)
    .pipe(gulpPlugins.postcss(processors, { syntax: postcssSCSS }));
});

gulp.task(
  "editor",
  [
    "editor.js.lib",
    "editor.js.compile",
    "editor.css",
    "editor.fonts",
    "editor.icons",
    "editor.twig"
  ],
  done => {
    const tasks = ["editor.js.vendor.concat"];

    if (IS_PRODUCTION) {
      tasks.push("editor.js.sourcemap");

      if (IS_EXPORT) {
        tasks.push("editor.js.legacyExport");
      }
    }

    runSequence(tasks, done);
  }
);
gulp.task("editor.js.lib", done => {
  const src = [
    paths.editor + "/lib/editor/*/*.js",
    paths.editor + "/lib/common/*/*.js"
  ];
  const dest = paths.build + "/editor/js";

  gulp
    .src(src)
    .pipe(gulpPlugins.concat("editor.vendor.lib.js"))
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});
gulp.task("editor.js.compile", done => {
  const options = {
    TEMPLATE_NAME,
    TEMPLATE_PATH: paths.template,
    TARGET,
    IS_PRODUCTION,
    IS_EXPORT,
    BUILD_PATH: paths.build,
    NO_WATCH
  };
  const config = [
    webpackConfigEditor(options),
    ...(IS_EXPORT ? [webpackConfigExport(options)] : [])
  ];

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

  const processors = [autoprefixer({ browsers: supportedBrowsers })];
  gulp
    .src(src, { base: paths.editor })
    .pipe(gulpPlugins.if(!IS_PRODUCTION, gulpPlugins.sourcemaps.init()))
    .pipe(
      gulpPlugins
        .sass({
          includePaths: ["node_modules", paths.template],
          errLogToConsole: true
        })
        .on("error", gulpPlugins.sass.logError)
    )
    .pipe(gulpPlugins.postcss(processors))
    .pipe(gulpPlugins.minifyCss({ rebase: false }))
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
gulp.task("editor.js.vendor.concat", done => {
  const src = [
    paths.build + "/editor/js/editor.vendor.lib.js",
    paths.build + "/editor/js/editor.vendor.bundle.js"
  ];
  const dest = paths.build + "/editor/js";
  const delOptions = BUILD_DIR ? { force: true } : {};

  gulp
    .src(src)
    .pipe(gulpPlugins.concat("editor.vendor.js"))
    .pipe(gulp.dest(dest))
    .on("end", () => {
      del.sync(src, delOptions);
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
gulp.task("editor.js.legacyExport", done => {
  const src = paths.build + "/editor/js/export.js";
  const dest = paths.build + "/visual";

  gulp
    .src(src)
    .pipe(gulp.dest(dest))
    .on("end", done);
});

gulp.task("template", ["template.assets", "template.blocksImg"]);
gulp.task("template.assets", done => {
  const src =
    IS_PRODUCTION && IS_EXPORT
      ? paths.template + "/assets/{icons,img}/**/*"
      : paths.template + "/assets/icons/**/*"; // WARNING: "/assets/{fonts}/**/*" does not work
  const dest = paths.build + "/template/";

  gulp
    .src(src, { base: paths.template + "/assets" })
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});
gulp.task("template.assets", done => {
  const src =
    IS_PRODUCTION && IS_EXPORT
      ? paths.template + "/assets/{icons,img}/**/*"
      : paths.template + "/assets/icons/**/*"; // WARNING: "/assets/{fonts}/**/*" does not work
  const dest = paths.build + "/template/";

  gulp
    .src(src, { base: paths.template + "/assets" })
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
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

  const processors = [autoprefixer({ browsers: supportedBrowsers })];
  gulp
    .src(src, { base: paths.editor })
    .pipe(
      gulpPlugins
        .sass({
          includePaths: ["node_modules"],
          errLogToConsole: true
        })
        .on("error", gulpPlugins.sass.logError)
    )
    .pipe(gulpPlugins.postcss(processors))
    .pipe(gulpPlugins.minifyCss({ rebase: false }))
    .pipe(gulpPlugins.concat("preview.css"))
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
    });
});
gulp.task("export.js", done => {
  const src = paths.editor + "/templates/preview.js";
  const dest = paths.build + "/editor/js";

  const libs = [
    paths.editor + "/lib/common/*/*.js",
    paths.editor + "/lib/export/*/*.js"
  ];
  const libsStream = gulp.src(libs);

  // Need review because has problems from export with typeOf and json.stringify
  // const babelConfig = {
  //   presets: [
  //     [
  //       "env",
  //       {
  //         modules: false
  //       }
  //     ]
  //   ],
  //   runtimeHelpers: true
  // };

  const componentsExport = [
    paths.editor + "/js/component-new/*/export.js",
    paths.editor + "/js/component/controls/*/export.js",
    paths.editor + "/js/component/*/export.js"
  ];
  const componentsStream = gulp.src(componentsExport).pipe(
    gulpPlugins.betterRollup(
      // { plugins: [babel(babelConfig)] },
      {
        external: ["jquery", "Brizy"],
        globals: {
          jquery: "jQuery",
          Brizy: "Brizy"
        }
      },
      {
        format: "iife",
        name: "dummy" // without this rollup crashes because the filename is export (reserved name)
      }
    )
  );

  const editorComponentsExport =
    paths.editor + "/js/editorComponents/*/export.js";
  const editorComponentsStream = gulp.src(editorComponentsExport).pipe(
    gulpPlugins.betterRollup(
      // { plugins: [babel(babelConfig)] },
      {
        external: ["jquery", "Brizy"],
        globals: {
          jquery: "jQuery",
          Brizy: "Brizy"
        }
      },
      {
        format: "iife",
        name: "dummy" // without this rollup crashes because the filename is export (reserved name)
      }
    )
  );

  gulp
    .src(src)
    .pipe(
      gulpPlugins.inject(libsStream, {
        starttag: "<!-- inject:libs -->",
        endTag: "<!-- endinject -->",
        removeTags: true,
        transform: (filePath, file) => {
          return file.contents.toString("utf8");
        }
      })
    )
    .pipe(
      gulpPlugins.inject(componentsStream, {
        starttag: "<!-- inject:components -->",
        endTag: "<!-- endinject -->",
        removeTags: true,
        transform: (filePath, file) => {
          return file.contents.toString("utf8");
        }
      })
    )
    .pipe(
      gulpPlugins.inject(editorComponentsStream, {
        starttag: "<!-- inject:editorComponents -->",
        endTag: "<!-- endinject -->",
        removeTags: true,
        transform: (filePath, file) => {
          return file.contents.toString("utf8");
        }
      })
    )
    // if some parts are absent
    // we need to remove the placeholders
    .pipe(gulpPlugins.replace(/<!-- inject:.* -->/g, ""))
    .pipe(gulpPlugins.replace("<!-- endinject -->", ""))
    .pipe(gulpPlugins.if(IS_PRODUCTION, gulpPlugins.uglify()))
    .pipe(gulp.dest(dest))
    .on("end", () => {
      done();
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
    "!templates/*/assets/{icons,img}/**"
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
  //gulp.watch(coreCSSPath, ['scss-lint', 'editor.css']).on('change', handleChange);
  gulp.watch(coreCSSPath, ["editor.css"]).on("change", handleChange);

  // libs (uncomment if needed)
  // const editorLibs = paths.editor + "/lib/*/*/*.js";
  // gulp.watch(editorLibs, ["editor.js.lib"]).on("change", handleChange);

  const templateMiscPath = [
    paths.template + "/assets/**/*",
    "!" + paths.template + "/assets/icons/**"
  ];
  //gulp.watch(templateMiscPath, ['scss-lint', 'template']).on('change', handleChange);
  gulp
    .watch(templateMiscPath, ["template", "editor.css"])
    .on("change", handleChange);

  function handleChange(event) {
    console.log(event.type, event.path);
  }
});
