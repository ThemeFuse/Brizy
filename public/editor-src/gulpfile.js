process.on("unhandledRejection", error => {
  console.log("unhandledRejection", error.message, error);
});

const fs = require("fs");
const path = require("path");
const glob = require("glob-fs")();

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

const { uniq } = require("underscore");

// build utils
const argvVars = require("./build-utils/argvVars");
const {
  wpTranslations: wpTranslationsUtil
} = require("./build-utils/wpTranslations");
const LibsConfig = require("./editor/js/bootstraps/libs.json");

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
  NO_VERIFICATION,
  BUNDLE_ANALYZER,
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
    BUNDLE_ANALYZER,
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
function editorCSS() {
  const icons = WP
    ? [
        paths.editor + "/js/libs/group-all/index.scss",
        paths.editor + "/sass/main.editor.icons.wp.scss"
      ]
    : [
        paths.editor + "/js/libs/group-all/index.scss",
        paths.editor + "/sass/main.editor.icons.scss"
      ];

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
  const config = [webpackConfigExport(options)];

  if (IS_EXPORT) {
    config.push(
      webpackConfigPreview.preview(options),
      webpackConfigPreview.libs(options)
    );
  }

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
function exportLibsCSS() {
  const { free } = LibsConfig;
  const src = free.reduce((acc, { path }) => {
    return [...acc, `${path}/*.scss`];
  }, []);

  const rename = path => {
    if (path.extname) {
      path.extname = ".css";
      path.basename = path.dirname;
      path.dirname = "";
    }
  };

  const dest = `${paths.build}/editor/css`;

  return gulp
    .src(src, {
      base: `${paths.editor}/js/libs`,
      sourcemaps: !IS_PRODUCTION
    })
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
    .pipe(gulpPlugins.rename(rename))
    .pipe(gulp.dest(dest, { sourcemaps: !IS_PRODUCTION }));
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
      webpackConfigPro.preview(options),
      webpackConfigPro.libs(options)
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
  const src = [
    paths.editor + "/js/libs/all-pro/*.scss",
    paths.editor + "/sass/main.editor.pro.scss",
    ...icons
  ];
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
function proExportLibsCSS() {
  const { pro } = LibsConfig;
  const src = pro.reduce((acc, { path }) => {
    return [...acc, `${path}/*.scss`];
  }, []);

  const rename = path => {
    if (path.extname) {
      path.extname = ".css";
      path.basename = path.dirname;
      path.dirname = "";
    }
  };

  const dest = `${paths.buildPro}/css`;

  return gulp
    .src(src, {
      base: `${paths.editor}/js/libs`,
      sourcemaps: !IS_PRODUCTION
    })
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
    .pipe(gulpPlugins.rename(rename))
    .pipe(gulp.dest(dest, { sourcemaps: !IS_PRODUCTION }));
}

function thumbsPreview() {
  const src = [
    paths.kits + "/*/blocks/*/Preview.jpg",
    paths.templates + "/*/**/Preview.jpg",
    paths.stories + "/*/**/Preview.jpg",
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

function storiesData() {
  const src = paths.stories + "/index.js";
  const dest = paths.build + "/stories";
  const stories = require(src);

  let rs = new Readable({
    objectMode: true
  });

  // meta
  rs.push(
    new Vinyl({
      path: "meta.json",
      contents: Buffer.from(
        JSON.stringify(stories, (k, v) => {
          return k === "resolve" ? undefined : v;
        })
      )
    })
  );

  // resolves
  for (let template of stories.stories) {
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

function zipIcons() {
  const src = paths.editor + "/icons/**/*";
  const dest = paths.build + "/editor";

  return gulp
    .src(src)
    .pipe(
      gulpPlugins.archiver("icons.zip", {
        zlib: { level: 9 }
      })
    )
    .pipe(gulp.dest(dest));
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
  ...(NO_VERIFICATION ? [] : [verifications]),
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

  // stories
  storiesData,

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
    editorCSS,
    editorFonts,
    editorIcons,
    editorKitIcons,
    editorImg,
    editorTwig
  ),

  // export
  ...(IS_EXPORT
    ? [gulp.parallel(exportJS, exportCSS, exportLibsCSS, exportTwig)]
    : []),

  // pro
  ...(IS_PRO
    ? [
        gulp.parallel.apply(undefined, [
          proJS,
          proEditorCSS,
          ...(IS_EXPORT ? [proExportCSS, proExportLibsCSS] : [])
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

  zipIcons,

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

function deleteLibs(done) {
  const src = `${paths.editor}/js/libs/group-*_*`;

  del.sync(src, { force: true });

  done();
}

const k_combinations = (set, k) => {
  if (k > set.length || k <= 0) {
    return [];
  }

  if (k === set.length) {
    return [set];
  }

  if (k === 1) {
    return set.reduce((acc, cur) => [...acc, [cur]], []);
  }

  const combs = [];
  let tail_combs = [];

  for (let i = 0; i <= set.length - k + 1; i++) {
    tail_combs = k_combinations(set.slice(i + 1), k - 1);
    for (let j = 0; j < tail_combs.length; j++) {
      combs.push([set[i], ...tail_combs[j]]);
    }
  }

  return combs;
};

const getGroupName = pathToGroup => {
  const [name] = pathToGroup.match(/group-*.+/) || [];

  if (name) {
    return name;
  }
};

const createGroupName = (name1, name2) => {
  const [nameGr1] = name1.match(/\d+/) || [];
  const [nameGr2] = name2.match(/\d+/) || [];

  if (nameGr1 && nameGr2) {
    return `group-${nameGr1}_${nameGr2}`;
  }
};

const relativePath = filePath => path.resolve(__dirname, filePath);

const sortFile = (a, b) => a - b;

const isFree = file => /group-\d+.?\d?$/.test(file);

const isPro = file => /group-\d+(.+)?-pro/.test(file);

// export * from "../name-1";
// export * from "../name-2";
const createGroupFileJS = (rs, { base, name1, name2 }) => {
  const content = `export * from "../${name1}";\nexport * from "../${name2}";\n`;

  rs.push(
    new Vinyl({
      path: `${base}/index.js`,
      contents: Buffer.from(content)
    })
  );
};

// @import "../name-1/index";
// @import "../name-2/index";
const createGroupFileCSS = (rs, { base, name1, name2 }) => {
  const content = `@import "../${name1}/index";\n@import "../${name2}/index";\n`;

  rs.push(
    new Vinyl({
      path: `${base}/index.scss`,
      contents: Buffer.from(content)
    })
  );
};

// selectors [...group1, ...group2]
const createGroupFileSelectors = (rs, { base, name1, name2 }) => {
  const selectors1 = require(`${relativePath(name1)}/selectors.json`);
  const selectors2 = require(`${relativePath(name2)}/selectors.json`);
  const selectors = uniq([...selectors1, ...selectors2]);

  rs.push(
    new Vinyl({
      path: `${base}/selectors.json`,
      contents: Buffer.from(JSON.stringify(selectors))
    })
  );
};

const createGroupAllData = groups => {
  const groupAll = new Map();

  groups.forEach(groupPath => {
    const selectors = require(`${relativePath(groupPath)}/selectors.json`);
    const oldSelectors = groupAll.get("selectors") || [];
    const oldCSS = groupAll.get("css") || "";
    const oldJS = groupAll.get("js") || "";
    const groupName = getGroupName(groupPath);
    const newCSS = `@import "../${groupName}/index";`;
    const newJS = `export * from "../${groupName}";`;
    const newSelectors = uniq([...oldSelectors, ...selectors]);

    groupAll.set("selectors", newSelectors);
    groupAll.set("js", `${oldJS}${newJS}\n`);
    groupAll.set("css", `${oldCSS}${newCSS}\n`);
  });

  const selectors = groupAll.get("selectors") || [];
  const js = groupAll.get("js") || "";
  const css = groupAll.get("css") || "";

  return { css, js, selectors };
};

const createGroupAllFile = (rs, { base, files }) => {
  const { css, js, selectors } = createGroupAllData(files);

  rs.push(
    new Vinyl({
      path: `${base}/index.js`,
      contents: Buffer.from(js)
    })
  );

  rs.push(
    new Vinyl({
      path: `${base}/index.scss`,
      contents: Buffer.from(css)
    })
  );

  rs.push(
    new Vinyl({
      path: `${base}/selectors.json`,
      contents: Buffer.from(JSON.stringify(selectors))
    })
  );
};

function generateLibs() {
  const src = "/editor/js/libs/group-!(*_*|*all)";
  const dest = `${paths.editor}/js/libs`;
  const groupCombinationK = 2;

  const groups = glob.readdirSync(src, {});

  const freeGroups = groups.filter(isFree);
  const proGroups = groups.filter(isPro);

  let rs = new Readable({
    objectMode: true
  });

  const groupFreeCombinations = k_combinations(freeGroups, groupCombinationK);
  const groupProCombinations = k_combinations(proGroups, groupCombinationK);

  // free
  groupFreeCombinations.forEach(([group1, group2]) => {
    const groupName1 = getGroupName(group1);
    const groupName2 = getGroupName(group2);
    let groupName;

    if (groupName1 && groupName2) {
      groupName = createGroupName(groupName1, groupName2);
    }

    if (groupName) {
      const data = {
        base: groupName,
        name1: groupName1,
        name2: groupName2
      };
      createGroupFileJS(rs, data);
      createGroupFileCSS(rs, data);
      createGroupFileSelectors(rs, {
        base: groupName,
        name1: group1,
        name2: group2
      });
    } else {
      console.error("Cloud not create groups", group1, group2);
    }
  });

  // pro
  groupProCombinations.forEach(([group1, group2]) => {
    const groupName1 = getGroupName(group1);
    const groupName2 = getGroupName(group2);
    let groupName;

    if (groupName1 && groupName2) {
      groupName = createGroupName(groupName1, groupName2);
    }

    if (groupName) {
      const data = {
        base: `${groupName}-pro`,
        name1: groupName1,
        name2: groupName2
      };
      createGroupFileJS(rs, data);
      createGroupFileCSS(rs, data);
      createGroupFileSelectors(rs, {
        base: `${groupName}-pro`,
        name1: group1,
        name2: group2
      });
    } else {
      console.error("Cloud not create groups", group1, group2);
    }
  });

  // create group all
  createGroupAllFile(rs, {
    base: "group-all",
    files: freeGroups
  });
  createGroupAllFile(rs, {
    base: "group-all-pro",
    files: proGroups
  });

  // null signifies stream end
  rs.push(null);
  return rs.pipe(gulp.dest(dest));
}

function generateLibsConfig(done) {
  const src = "/editor/js/libs/group-*";
  const dest = `${paths.editor}/js/bootstraps`;

  const files = uniq(glob.readdirSync(src, {}).map(relativePath));
  const groupAll = files.filter(file => file.includes("group-all"));
  const freeFiles = files.filter(isFree).sort(sortFile);
  const proFiles = files.filter(isPro).sort(sortFile);

  const formattedFiles = [...freeFiles, ...proFiles, ...groupAll];

  fs.writeFileSync(dest + "/libs.json", getConfig(formattedFiles), "utf8");

  done();

  function getConfig(files) {
    const config = {
      free: [
        {
          name: "group-jq",
          path: "./editor/js/libs/common/jQuery",
          selectors: [".brz__group__jquery"]
        }
      ],
      pro: []
    };
    const dirname = path.resolve(__dirname);

    files.forEach(file => {
      const isPro = file.includes("-pro");
      const selectors = require(`${file}/selectors.json`);
      const name = getGroupName(file);
      const path = file.replace(dirname, ".");

      if (isPro) {
        config.pro.push({
          name: name.replace("-pro", ""),
          path,
          selectors
        });
      } else {
        config.free.push({
          name,
          path,
          selectors
        });
      }
    });

    return JSON.stringify(config);
  }
}

exports.libs = gulp.series.apply(undefined, [
  deleteLibs,
  generateLibs,
  generateLibsConfig
]);
