import type { SCSSImports, SCSSRegistry, SCSSSheetAPI, Sheet } from "./types";

// Global registry for SCSS imports (used during SSR/static rendering)
const globalRegistry: SCSSRegistry = {
  free: new Set<Sheet>(),
  pro: new Set<Sheet>()
};

/**
 * SCSSSheet - Tracks SCSS file imports during static rendering
 *
 * Similar to ServerStyleSheet for tujur, this class collects
 * SCSS module imports that occur during ReactDOMServer.renderToStaticMarkup.
 *
 * Usage:
 * ```typescript
 * const scssSheet = new SCSSSheet();
 * const html = ReactDOMServer.renderToStaticMarkup(<App />);
 * const imports = scssSheet.getImports();
 * scssSheet.purge();
 * ```
 */
export class SCSSSheet implements SCSSSheetAPI {
  static register(sheet: Sheet, isPro: boolean): void {
    if (isPro) {
      globalRegistry.pro.add(sheet);
    } else {
      globalRegistry.free.add(sheet);
    }
  }

  getImports(): SCSSImports {
    return {
      free: Array.from(globalRegistry.free),
      pro: Array.from(globalRegistry.pro)
    };
  }

  purge(): void {
    globalRegistry.free.clear();
    globalRegistry.pro.clear();
  }
}
