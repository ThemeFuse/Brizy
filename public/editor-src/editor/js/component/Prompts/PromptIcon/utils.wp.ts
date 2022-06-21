export const loadFonts = (node: Node, templateFonts: string): void => {
  (
    global.Brizy.applyFilter("iconFontsLoaders") || []
  ).map((f: (n: unknown, t: unknown) => void) => f(node, templateFonts));
};
