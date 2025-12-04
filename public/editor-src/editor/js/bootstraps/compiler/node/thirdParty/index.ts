import fs from "fs";
import path from "path";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

const SECURITY_CONFIG = {
  allowedExtensions: [".js"]
};

const importFn = new Function("path", "return import(path)");

function validateDynamicPath(scriptUrl: string): string {
  if (typeof scriptUrl !== "string" || !scriptUrl) {
    throw new Error("Invalid script URL: must be a non-empty string");
  }

  if (!path.isAbsolute(scriptUrl)) {
    throw new Error(`Security: Only absolute paths allowed. Got: ${scriptUrl}`);
  }

  const ext = path.extname(scriptUrl);
  if (!SECURITY_CONFIG.allowedExtensions.includes(ext)) {
    throw new Error(
      `Security: Invalid extension '${ext}'. Allowed: ${SECURITY_CONFIG.allowedExtensions.join(", ")}`
    );
  }

  const normalized = path.normalize(scriptUrl);
  if (normalized !== scriptUrl) {
    throw new Error(
      `Security: Path normalization changed path. Original: ${scriptUrl}, Normalized: ${normalized}`
    );
  }

  return normalized;
}

async function loadModule(modulePath: string) {
  try {
    // Validate path
    const filePath = validateDynamicPath(modulePath);

    // Check file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Module file does not exist: ${filePath}`);
    }

    // Get file stats
    const stats = fs.statSync(filePath);

    // Must be a regular file
    if (!stats.isFile()) {
      throw new Error(`Path is not a regular file: ${filePath}`);
    }

    // Check file permissions (optional, Unix-only)
    if (process.platform !== "win32") {
      // Warn if world-writable
      const mode = stats.mode & 0o777;
      if (mode & 0o002) {
        // eslint-disable-next-line no-console
        console.warn(
          `⚠ Warning: File is world-writable: ${filePath} (mode: ${mode.toString(8)})`
        );
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Loading module: ${filePath}`);

    // Load using Function workaround
    const module = await importFn(filePath);

    return module;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load module '${modulePath}': ${errorMessage}`);
  }
}

export async function registerThirdParty(config: ConfigCommon) {
  const scripts = config.thirdPartyUrls || [];

  if (scripts.length === 0) {
    // eslint-disable-next-line no-console
    console.log("No third-party modules to load");
    return { loaded: 0, failed: 0, results: [] };
  }

  // eslint-disable-next-line no-console
  console.log(`Starting to load ${scripts.length} third-party module(s)...`);

  const results = await Promise.allSettled(
    scripts.map(async ({ scriptUrl }, index) => {
      const startTime = Date.now();

      try {
        const module = await loadModule(scriptUrl);
        const loadTime = Date.now() - startTime;
        // eslint-disable-next-line no-console
        console.log(
          `✓ [${index + 1}/${scripts.length}] Loaded in ${loadTime}ms: ${scriptUrl}`
        );

        return {
          scriptUrl,
          success: true,
          module,
          loadTime
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        console.error(
          `✗ [${index + 1}/${scripts.length}] Failed: ${scriptUrl}\n` +
            `  Error: ${errorMessage}`
        );

        return {
          scriptUrl,
          success: false,
          error: errorMessage
        };
      }
    })
  );

  // Calculate summary
  const successful = results.filter(
    (r) => r.status === "fulfilled" && r.value.success
  );
  const failed = results.length - successful.length;

  // Log summary
  if (failed > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `⚠ Module loading completed: ${successful.length} succeeded, ${failed} failed`
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(`✓ All ${successful.length} module(s) loaded successfully`);
  }

  return {
    loaded: successful.length,
    failed,
    results: results.map((r) => (r.status === "fulfilled" ? r.value : null))
  };
}
