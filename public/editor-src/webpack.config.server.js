const path = require("path");

module.exports = (env = {}) => {
  const BUILD_PATH = env.BUILD_PATH || path.resolve(__dirname, "build");

  return {
    entry: path.resolve(__dirname, "backend/server.js"),
    target: "node",
    output: {
      path: path.resolve(BUILD_PATH, "backend"),
      filename: "server.min.js"
    },
    resolve: {
      extensions: [".js", ".json"],
      mainFields: ["main", "module"]
    }
  };
};
