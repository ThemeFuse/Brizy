const iconFontsInDocument = new WeakMap();

export const loadNucleoFonts = (node, templateFonts) => {
  if (
    !node.ownerDocument ||
    iconFontsInDocument.get(node.ownerDocument) !== undefined
  ) {
    return;
  }

  const style = node.ownerDocument.createElement("style");

  style.innerHTML = `@font-face{font-family:'Nucleo Outline';src:url('${templateFonts}/a');src:url('${templateFonts}/a') format('embedded-opentype'),url('${templateFonts}/b') format('woff2'),url('${templateFonts}/c') format('woff'),url('${templateFonts}/d') format('truetype');font-weight:400;font-style:normal}@font-face{font-family:'Nucleo Glyph';src:url('${templateFonts}/a1');src:url('${templateFonts}/a1') format('embedded-opentype'),url('${templateFonts}/b1') format('woff2'),url('${templateFonts}/c1') format('woff'),url('${templateFonts}/d1') format('truetype');font-weight:400;font-style:normal}`;
  node.ownerDocument.head.appendChild(style);

  iconFontsInDocument.set(node.ownerDocument, true);
};
