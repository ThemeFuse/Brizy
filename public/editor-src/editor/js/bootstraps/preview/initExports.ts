import { componentManifest } from "./componentManifest";

interface LoadedComponent {
  name: string;
  exportFn: ($node: JQuery<HTMLElement>) => void;
}

/**
 * Detect which components are present in the DOM
 */
function detectComponents($elem: JQuery<HTMLElement>): string[] {
  const detected: string[] = [];
  const root = $elem.get(0);

  if (!root) {
    return detected;
  }

  for (const [name, config] of Object.entries(componentManifest)) {
    try {
      // Check if selector exists in DOM
      if (root.querySelector(config.selector)) {
        detected.push(name);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`[Brz] Invalid selector for ${name}:`, config.selector, e);
    }
  }

  return detected;
}

/**
 * Load component exports dynamically
 */
async function loadComponentExports(
  componentNames: string[]
): Promise<LoadedComponent[]> {
  const loadPromises = componentNames.map(async (name) => {
    try {
      const config = componentManifest[name];
      if (!config) {
        // eslint-disable-next-line no-console
        console.warn(`[Brz] Component not found in manifest: ${name}`);
        return null;
      }

      // Dynamic import returns module with default export
      const module = await config.path();
      return { name, exportFn: module.default };
    } catch (err) {
      console.error(`[Brz] Failed to load component: ${name}`, err);
      return null;
    }
  });

  const results = await Promise.all(loadPromises);
  return results.filter((r): r is LoadedComponent => r !== null);
}

/**
 * Main export function (now async with dynamic component loading)
 */
export default async function initExports(
  $elem: JQuery<HTMLElement>
): Promise<void> {
  // 1. Detect which components are on the page
  const detectedComponents = detectComponents($elem);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[Brz] Detected components:", detectedComponents);
  }

  // 2. Load component exports dynamically
  const components = await loadComponentExports(detectedComponents);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[Brz] Loaded", components.length, "component exports");
  }

  // 3. Execute component export functions
  for (const { name, exportFn } of components) {
    try {
      exportFn($elem);
    } catch (err) {
      console.error(`[Brz] Component initialization failed: ${name}`, err);
    }
  }
}
