process.on("unhandledRejection", error => {
  console.log("unhandledRejection", error.message, error);
});

const fs = require("fs");
const path = require("path");

// gulp
const gulp = require("gulp");
const gulpPlugins = require("gulp-load-plugins")();
const cleanCSS = require("gulp-clean-css"); // for some reason doesn't work with gulpPlugins
const { Readable } = require("stream");
const Vinyl = require("vinyl");

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
const postsCssProcessors = [
  sass({
    includePaths: ["node_modules"],
    errLogToConsole: true
  }),
  autoprefixer({
    browsers: ["last 2 versions"]
  })
];

const chalk = require("chalk");
const del = require("del");

// build utils
const argvVars = require("./build-utils/argvVars");
const {
  wpTranslations: wpTranslationsUtil
} = require("./build-utils/wpTranslations");

// flags
const {
  KIT_NAME,
  TARGET,
  IS_PRODUCTION,
  IS_EXPORT,
  IS_PRO,
  VERSION,
  VERSION_PRO,
  NO_WATCH,
  paths
} = argvVars(process.argv);
const WP = TARGET === "WP";

function verifications(done) {
  let aborted = false;
  const messages = [];

  if (TARGET === "WP" && !IS_PRODUCTION) {
    const filePath = path.resolve(paths.build, "../../../brizy.php");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const r = /define\s*\(\s*("|')BRIZY_DEVELOPMENT\1,\s*false\s*\)/gm;

    if (r.test(fileContents)) {
      aborted = true;
      messages.push("set BRIZY_DEVELOPMENT to true in " + filePath);
    }
  }

  if (TARGET === "WP" && !IS_PRODUCTION && IS_PRO) {
    const filePath = path.resolve(paths.buildPro, "../../../brizy-pro.php");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const r = /define\s*\(\s*("|')BRIZY_PRO_DEVELOPMENT\1,\s*false\s*\)/gm;

    if (r.test(fileContents)) {
      aborted = true;
      messages.push("set BRIZY_PRO_DEVELOPMENT to true in " + filePath);
    }
  }

  if (aborted) {
    console.log("");
    console.error(messages.map(m => chalk.red.bold("* " + m)).join("\n\n"));
    console.log("");

    throw new Error("aborting...");
  }

  done();
}

function clean(done) {
  del.sync(paths.buildLocal + "/*", { force: true });
  del.sync(paths.build + "/*", { force: true });

  if (IS_PRO) {
    del.sync(paths.buildPro + "/*", { force: true });
  }

  done();
}

function editorJS(done) {
  const options = {
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
}
function editorPolyfill() {
  const src = paths.editor + "/polyfill/**/*.js";
  const dest = paths.build + "/editor/js";

  return gulp
    .src(src)
    .pipe(gulpPlugins.if(IS_PRODUCTION, gulpPlugins.terser()))
    .pipe(gulpPlugins.concat("polyfill.js"))
    .pipe(gulp.dest(dest));
}
function editorCSS() {
  const icons = WP
    ? [paths.editor + "/sass/main.editor.icons.wp.scss"]
    : [paths.editor + "/sass/main.editor.icons.scss"];

  const src = [
    paths.editor + "/lib/common/*/*.css",
    paths.editor + "/lib/editor/*/*.css",
    paths.editor + "/sass/main.editor.scss",
    ...icons
  ];
  const dest = paths.build + "/editor/css";

  return gulp
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
}
function editorFonts() {
  const src = paths.editor + "/sass/editor/fonts/*";
  const dest = paths.build + "/editor/fonts";

  return gulp.src(src).pipe(gulp.dest(dest));
}
function editorIcons() {
  const src = paths.editor + "/sass/editor/icons/**/*.{eot,svg,ttf,woff,woff2}";
  const dest = paths.build + "/editor/icons";

  return gulp.src(src).pipe(gulp.dest(dest));
}
function editorKitIcons() {
  const src = paths.editor + "/icons/**/*";
  const dest = paths.build + "/editor/icons";
  const { encrypt } = require(paths.editor +
    "/js/component/ThemeIcon/utils.js");

  const svgEncrypt = content => {
    const base64 = Buffer.from(content).toString("base64");

    return encrypt(base64);
  };
  const svgRename = path => {
    if (path.extname) {
      path.extname = ".txt";
    }
  };

  return gulp
    .src(src)
    .pipe(gulpPlugins.change(svgEncrypt))
    .pipe(gulpPlugins.rename(svgRename))
    .pipe(gulp.dest(dest));
}
function editorImg() {
  const src = paths.editor + "/img/*";
  const dest = paths.build + "/editor/img";

  return gulp.src(src).pipe(gulp.dest(dest));
}
function editorTwig() {
  const src = paths.editor + "/templates/editor.html.twig";
  const dest = paths.build + "/editor/views";

  return (
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
      .pipe(gulp.dest(dest))
  );
}

function exportJS(done) {
  const options = {
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
}
function exportCSS() {
  const src = [
    paths.editor + "/lib/common/*/*.css",
    paths.editor + "/lib/export/*/*.css",
    paths.editor + "/sass/main.export.scss"
  ];
  const dest = paths.build + "/editor/css";

  return gulp
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
    .pipe(gulp.dest(dest));
}
function exportTwig() {
  const src =
    TARGET === "WP"
      ? paths.editor + "/templates/static.wp.html.twig"
      : paths.editor + "/templates/static.html.twig";
  const dest = paths.build + "/editor/views";

  return (
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
  );
}

function proJS(done) {
  const options = {
    TARGET,
    IS_PRODUCTION,
    IS_EXPORT,
    BUILD_PATH: paths.build,
    BUILD_PATH_PRO: paths.buildPro,
    NO_WATCH
  };
  const config = [webpackConfigPro.editor(options)];

  if (IS_EXPORT) {
    config.push(
      webpackConfigPro.export(options),
      webpackConfigPro.preview(options)
    );
  }

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
}
function proEditorCSS() {
  const icons = WP ? [paths.editor + "/sass/main.editor.icons.scss"] : [];
  const src = [paths.editor + "/sass/main.editor.pro.scss", ...icons];
  const dest = paths.buildPro + "/css";

  return gulp
    .src(src, { base: paths.editor })
    .pipe(gulpPlugins.if(!IS_PRODUCTION, gulpPlugins.sourcemaps.init()))
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
    .pipe(
      cleanCSS({
        format: { breaks: { afterRuleEnds: true } }
      })
    )
    .pipe(gulpPlugins.concat("editor.pro.css"))
    .pipe(gulpPlugins.if(!IS_PRODUCTION, gulpPlugins.sourcemaps.write()))
    .pipe(gulp.dest(dest));
}
function proExportCSS() {
  const src = paths.editor + "/sass/main.export.pro.scss";
  const dest = paths.buildPro + "/css";

  return gulp
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
    .pipe(gulpPlugins.concat("preview.pro.css"))
    .pipe(gulp.dest(dest));
}

function thumbsPreview() {
  const src = [
    paths.kits + "/*/blocks/*/Preview.jpg",
    paths.templates + "/*/**/Preview.jpg",
    paths.popups + "/blocks/*/Preview.jpg"
  ];
  const dest = paths.build + "/thumbs";

  return gulp
    .src(src)
    .pipe(
      gulpPlugins.rename(path_ => {
        const r = new RegExp(
          `.+\\${path.sep}blocks\\${path.sep}|\\${path.sep}pages\\${path.sep}`
        );

        path_.basename = path_.dirname.replace(r, "");
        path_.dirname = "";
      })
    )
    .pipe(gulp.dest(dest));
}
function thumbsSizes() {
  const kits = require(paths.kits + "/index.js");
  const popups = require(paths.popups + "/index.js");
  const dest = paths.build + "/thumbs";
  const thumbsSizes = {};

  for (let kit of kits) {
    for (let block of kit.blocks) {
      const { id, thumbnailWidth, thumbnailHeight } = block;

      thumbsSizes[id] = [thumbnailWidth, thumbnailHeight];
    }
  }

  for (let block of popups.blocks) {
    const { id, thumbnailWidth, thumbnailHeight } = block;

    thumbsSizes[id] = [thumbnailWidth, thumbnailHeight];
  }

  let rs = new Readable({
    objectMode: true
  });

  rs.push(
    new Vinyl({
      path: "blocksThumbnailSizes.json",
      contents: Buffer.from(JSON.stringify(thumbsSizes))
    })
  );
  rs.push(null); // null signifies stream end

  return rs.pipe(gulp.dest(dest));
}

function kitsData() {
  const src = paths.kits + "/index.js";
  const dest = paths.build + "/kits";
  const kits = require(src);

  let rs = new Readable({
    objectMode: true
  });

  // meta
  rs.push(
    new Vinyl({
      path: "meta.json",
      contents: Buffer.from(
        JSON.stringify(kits, (k, v) => {
          return k === "resolve" ? undefined : v;
        })
      )
    })
  );

  // resolves
  for (let kit of kits) {
    for (let block of kit.blocks) {
      const { id, resolve } = block;

      rs.push(
        new Vinyl({
          path: `resolves/${id}.json`,
          contents: Buffer.from(JSON.stringify(resolve))
        })
      );
    }
  }

  // null signifies stream end
  rs.push(null);

  return rs.pipe(gulp.dest(dest));
}
function kitsMedia() {
  const src = paths.kits + "/*/img/*";
  const dest = paths.build + "/media";

  return gulp
    .src(src)
    .pipe(
      gulpPlugins.rename(path_ => {
        // {KIT_NAME}/img/{IMG} -> {IMG}
        path_.dirname = "";
      })
    )
    .pipe(gulp.dest(dest));
}

function templatesData() {
  const src = paths.templates + "/index.js";
  const dest = paths.build + "/templates";
  const templates = require(src);

  let rs = new Readable({
    objectMode: true
  });

  // meta
  rs.push(
    new Vinyl({
      path: "meta.json",
      contents: Buffer.from(
        JSON.stringify(templates, (k, v) => {
          return k === "resolve" ? undefined : v;
        })
      )
    })
  );

  // resolves
  for (let template of templates.templates) {
    for (let page of template.pages) {
      const { id, resolve } = page;

      rs.push(
        new Vinyl({
          path: `resolves/${id}.json`,
          contents: Buffer.from(JSON.stringify(resolve))
        })
      );
    }
  }

  // null signifies stream end
  rs.push(null);

  return rs.pipe(gulp.dest(dest));
}

function popupsData() {
  const src = paths.popups + "/index.js";
  const dest = paths.build + "/popups";
  const popups = require(src);

  let rs = new Readable({
    objectMode: true
  });

  // meta
  rs.push(
    new Vinyl({
      path: "meta.json",
      contents: Buffer.from(
        JSON.stringify(popups, (k, v) => {
          return k === "resolve" ? undefined : v;
        })
      )
    })
  );

  // resolves
  for (let block of popups.blocks) {
    const { id, resolve } = block;

    rs.push(
      new Vinyl({
        path: `resolves/${id}.json`,
        contents: Buffer.from(JSON.stringify(resolve))
      })
    );
  }

  // null signifies stream end
  rs.push(null);

  return rs.pipe(gulp.dest(dest));
}
function popupsMedia() {
  const src = paths.popups + "/img/*";
  const dest = paths.build + "/media";

  return gulp
    .src(src)
    .pipe(
      gulpPlugins.rename(path_ => {
        // {POPUP}/img/{IMG} -> {IMG}
        path_.dirname = "";
      })
    )
    .pipe(gulp.dest(dest));
}

function config() {
  const src = [
    paths.editor + "/js/config/googleFonts.json",
    paths.editor + "/js/config/integrations.json",
    path.resolve(__dirname, "./backend/config/defaults.json")
  ];
  const dest = paths.build;

  return gulp.src(src).pipe(gulp.dest(dest));
}

async function wpTranslations() {
  let dest = path.resolve(paths.build, "texts.php");
  let phpSourceCode = await wpTranslationsUtil({
    paths,
    IS_PRODUCTION,
    VERSION
  });

  fs.writeFileSync(dest, phpSourceCode, "utf8");
}
function wpOpenSource() {
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
    "!**/*.pro.*",
    "!editor/icons/{glyph,outline}/",
    "!editor/icons/{glyph,outline}/**",
    "!**/sass/editor/icons/nucleo-*",
    "!**/editor/js/libs/mmenu/",
    "!**/editor/js/libs/mmenu/**"
  ];
  const dest = paths.buildLocal + "/editor-src";

  return gulp
    .src(src, { dot: true })
    .pipe(
      gulpPlugins.rename(path => {
        if (path.basename === "README.GITHUB") {
          path.basename = "README";
        }
      })
    )
    .pipe(gulp.dest(dest));
}

function buildVersions(done) {
  const versionsJSON = JSON.stringify(
    {
      slug: KIT_NAME,
      version: VERSION
    },
    null,
    2
  );
  fs.writeFileSync(paths.build + "/versions.json", versionsJSON, "utf8");

  if (IS_PRO) {
    const versionsJSON = JSON.stringify(
      {
        version: VERSION_PRO
      },
      null,
      2
    );
    fs.writeFileSync(paths.buildPro + "/versions.json", versionsJSON, "utf8");
  }

  done();
}
function buildStats(done) {
  const files = [
    // editor
    ["editor.js", paths.build + "/editor/js/editor.js"],
    ["editor.vendor.js", paths.build + "/editor/js/editor.vendor.js"],
    ["editor.css", paths.build + "/editor/css/editor.css"],

    // export
    ["preview.js", paths.build + "/editor/js/preview.js"],
    ["preview.css", paths.build + "/editor/css/preview.css"],

    // polyfill
    ["polyfill.js", paths.build + "/editor/js/polyfill.js"],

    // static
    ["export.js", paths.build + "/editor/js/export.js"]
  ];
  fs.writeFileSync(
    paths.build + "/stats.json",
    getFileSizesJSON(files),
    "utf8"
  );

  if (IS_PRO) {
    const files = [
      // editor
      ["editor.pro.js", paths.buildPro + "/js/editor.pro.js"]
    ];
    fs.writeFileSync(
      paths.buildPro + "/stats.json",
      getFileSizesJSON(files),
      "utf8"
    );
  }

  done();

  function getFileSizesJSON(files) {
    const fileSizes = files.reduce((acc, [name, path]) => {
      const stats = fs.statSync(path);
      acc[name] = stats["size"] / 1000000.0;
      return acc;
    }, {});

    return JSON.stringify(fileSizes, null, 2);
  }
}

function watch() {
  const cssPath = paths.editor + "/**/*.scss";

  gulp.watch(
    cssPath,
    gulp.series.apply(undefined, [
      editorCSS,
      proExportCSS,
      ...(IS_EXPORT ? [exportCSS, proExportCSS] : [])
    ])
  );
}

exports.build = gulp.series.apply(undefined, [
  verifications,
  clean,

  // thumbs
  gulp.parallel(thumbsPreview, thumbsSizes),

  // kits
  gulp.parallel.apply(undefined, [
    kitsData,
    ...(IS_PRODUCTION && IS_EXPORT ? [kitsMedia] : [])
  ]),

  // templates
  templatesData,

  // popups
  gulp.parallel.apply(undefined, [
    popupsData,
    ...(IS_PRODUCTION && IS_EXPORT ? [popupsMedia] : [])
  ]),

  // config
  config,

  // editor
  gulp.parallel(
    editorJS,
    editorPolyfill,
    editorCSS,
    editorFonts,
    editorIcons,
    editorKitIcons,
    editorImg,
    editorTwig
  ),

  // export
  ...(IS_EXPORT ? [gulp.parallel(exportJS, exportCSS, exportTwig)] : []),

  // pro
  ...(IS_PRO
    ? [
        gulp.parallel.apply(undefined, [
          proJS,
          proEditorCSS,
          ...(IS_EXPORT ? [proExportCSS] : [])
        ])
      ]
    : []),

  // wp
  ...(WP
    ? [
        gulp.parallel.apply(undefined, [
          wpTranslations,
          ...(IS_PRODUCTION && IS_EXPORT ? [wpOpenSource] : [])
        ])
      ]
    : []),

  // build
  ...(IS_PRODUCTION && IS_EXPORT
    ? [gulp.parallel(buildVersions, buildStats)]
    : []),

  // watch
  ...(IS_PRODUCTION || NO_WATCH ? [] : [watch])
]);

function externalPopupsPopup() {
  const src = paths.editor + "/js/bootstraps/popups/popup.js";
  const dest = paths.build + "/editor/js/";

  return gulp
    .src(src)
    .pipe(gulpPlugins.terser())
    .pipe(gulp.dest(dest));
}
function externalPopupsCodeInjection() {
  const src = paths.editor + "/js/bootstraps/popups/popup_injection.js";
  const dest = paths.build + "/editor/js";

  return gulp
    .src(src)
    .pipe(gulpPlugins.terser())
    .pipe(gulp.dest(dest));
}

exports.external_popups = gulp.series(
  externalPopupsPopup,
  externalPopupsCodeInjection
);
