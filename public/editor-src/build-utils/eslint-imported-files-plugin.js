const { ESLint } = require("eslint");

/**
 * Custom Rspack plugin that runs ESLint only on files that are actually
 * imported/included in the bundle (following the dependency tree).
 *
 * This is much more efficient than checking all files in the project,
 * and ensures we only validate code that will actually be in the bundle.
 */
class ESLintImportedFilesPlugin {
  constructor(options = {}) {
    this.options = {
      context: process.cwd(),
      eslintOptions: {},
      configLoader: null, // Optional async function to load config
      failOnError: true,
      failOnWarning: false,
      ...options
    };
    this.eslintConfigCache = null;
  }

  async getEslintConfig() {
    // If we already have a cached config, return it
    if (this.eslintConfigCache) {
      return this.eslintConfigCache;
    }

    // If there's a config loader, use it
    if (this.options.configLoader) {
      const loadedConfig = await this.options.configLoader();
      this.eslintConfigCache = {
        ...this.options.eslintOptions,
        overrideConfig: loadedConfig
      };
    } else {
      // Otherwise use the provided config directly
      this.eslintConfigCache = this.options.eslintOptions;
    }

    return this.eslintConfigCache;
  }

  apply(compiler) {
    const pluginName = "ESLintImportedFilesPlugin";

    compiler.hooks.afterCompile.tapPromise(pluginName, async (compilation) => {
      try {
        // Collect all modules that are part of the compilation
        const filesToLint = new Set();

        for (const module of compilation.modules) {
          // Get the resource path (actual file path)
          const resourcePath = module.resource || module.rootModule?.resource;

          if (!resourcePath) continue;

          // Only include JS/TS files, exclude node_modules, build, libs
          if (
            /\.(ts|tsx|js|jsx)$/.test(resourcePath) &&
            !resourcePath.includes("node_modules") &&
            !resourcePath.includes("/build/") &&
            !resourcePath.includes("/libs/") &&
            !resourcePath.includes(".scss") &&
            !resourcePath.includes(".css")
          ) {
            filesToLint.add(resourcePath);
          }
        }

        if (filesToLint.size === 0) {
          return;
        }

        // Run ESLint on collected files
        const eslintConfig = await this.getEslintConfig();
        const eslintOptions = {
          cwd: this.options.context, // Set working directory to context
          ...eslintConfig
        };
        const eslint = new ESLint(eslintOptions);
        const filePaths = Array.from(filesToLint);

        // eslint-disable-next-line no-console
        console.log(
          `[ESLint] Checking ${filePaths.length} imported files for browser compatibility...`
        );

        const results = await eslint.lintFiles(filePaths);

        // Count errors and warnings
        const errorCount = results.reduce((sum, r) => sum + r.errorCount, 0);
        const warningCount = results.reduce(
          (sum, r) => sum + r.warningCount,
          0
        );

        // Format and display results
        if (errorCount > 0 || warningCount > 0) {
          const formatter = await eslint.loadFormatter("stylish");
          const resultText = formatter.format(results);

          // eslint-disable-next-line no-console
          console.log(resultText);

          // Add errors/warnings to compilation
          for (const result of results) {
            if (result.errorCount > 0 || result.warningCount > 0) {
              for (const message of result.messages) {
                const formattedMessage = `${result.filePath}:${message.line}:${message.column}: ${message.message} (${message.ruleId})`;

                if (message.severity === 2) {
                  // Error
                  if (this.options.failOnError) {
                    compilation.errors.push(
                      new Error(`[ESLint] ${formattedMessage}`)
                    );
                  } else {
                    compilation.warnings.push(
                      new Error(`[ESLint] ${formattedMessage}`)
                    );
                  }
                } else if (message.severity === 1) {
                  // Warning
                  if (this.options.failOnWarning) {
                    compilation.errors.push(
                      new Error(`[ESLint] ${formattedMessage}`)
                    );
                  } else {
                    compilation.warnings.push(
                      new Error(`[ESLint] ${formattedMessage}`)
                    );
                  }
                }
              }
            }
          }
        } else {
          // eslint-disable-next-line no-console
          console.log(
            `[ESLint] ✓ All ${filePaths.length} imported files passed compatibility checks`
          );
        }
      } catch (error) {
        compilation.errors.push(
          new Error(`[ESLint] Plugin error: ${error.message}`)
        );
      }
    });
  }
}

module.exports = ESLintImportedFilesPlugin;
