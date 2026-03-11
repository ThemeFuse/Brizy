/**
 * Component Manifest for Lazy Loading
 *
 * Combines framework components and editor components with webpack chunk names
 */
import type { ComponentExport } from "visual/types";
import { componentsManifest } from "../../component/index.export";
import { editorComponentsManifest } from "../../editorComponents/index.export";

interface ComponentConfig {
  selector: string;
  path: () => Promise<{ default: ($node: JQuery<HTMLElement>) => void }>;
}

type ComponentManifest = Record<string, ComponentConfig>;

// Convert manifest entries to add webpack chunk names
function createChunkedManifest(
  manifest: Record<string, ComponentExport>
): ComponentManifest {
  const result: ComponentManifest = {};

  for (const [name, config] of Object.entries(manifest)) {
    result[name] = {
      selector: config.selector,
      path: config.export
    };
  }

  return result;
}

// Merge both manifests
export const componentManifest: ComponentManifest = {
  ...createChunkedManifest(editorComponentsManifest),
  ...createChunkedManifest(componentsManifest)
};
