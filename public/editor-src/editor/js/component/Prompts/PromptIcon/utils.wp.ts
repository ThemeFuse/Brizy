export const loadFonts = (node: Node, templateFonts: string): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  (global.Brizy.applyFilter("iconFontsLoaders") || []).map((f: Function) =>
    f(node, templateFonts)
  );
};
