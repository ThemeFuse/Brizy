const fs = require("fs");
const projectPkgJSON = require("../package.json");

function omitInternalPkg(deps) {
  return Object.entries(deps).reduce((deps, [dep, version]) => {
    return version === "*" ? deps : { ...deps, [dep]: version };
  }, {});
}

const initPackageJSON = (path) => {
  // eslint-disable-next-line no-unused-vars
  const { prepare, ...scripts } = projectPkgJSON.scripts;
  const pkgData = {
    ...projectPkgJSON,
    scripts,
    main: "editor/js/module.min.js",
    files: ["editor"],
    dependencies: omitInternalPkg(projectPkgJSON.dependencies),
    devDependencies: omitInternalPkg(projectPkgJSON.devDependencies)
  };
  // Convert JSON object to string with indentation
  const pkgJson = JSON.stringify(pkgData, null, 2);
  fs.writeFileSync(path + "/package.json", pkgJson, "utf8");
};

exports.initPackageJSON = initPackageJSON;
