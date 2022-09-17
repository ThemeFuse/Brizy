import {
  cssStyleColor,
  cssStyleTextAlign,
  cssStyleTypography2FontSize
} from "visual/utils/cssStyle";
import {
  styleTypography2FontFamily,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
} from "visual/utils/style2";

export function cssStyleElementWPPostContentH1Color({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "h1Color" });
}

export function cssStyleElementWPPostContentH2Color({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    prefix: "h2Color",
    state
  });
}

export function cssStyleElementWPPostContentH3Color({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    prefix: "h3Color",
    state
  });
}

export function cssStyleElementWPPostContentH4Color({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    prefix: "h4Color",
    state
  });
}

export function cssStyleElementWPPostContentH5Color({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    prefix: "h5Color",
    state
  });
}

export function cssStyleElementWPPostContentH6Color({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    prefix: "h6Color",
    state
  });
}

export function cssStyleElementWPPostContentParagraphColor({
  v,
  device,
  state
}) {
  return cssStyleColor({
    v,
    device,
    prefix: "paragraphColor",
    state
  });
}

// Typography

export function cssStyleElementWPPostContentTypography2ParagraphFontFamily({
  v,
  device
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix: "paragraph"
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2ParagraphFontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "paragraph" });
}

export function cssStyleElementWPPostContentTypography2ParagraphLineHeight({
  v,
  device
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix: "paragraph"
  })};`;
}

export function cssStyleElementWPPostContentTypography2ParagraphFontWeight({
  v,
  device
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix: "paragraph"
  })};`;
}

export function cssStyleElementWPPostContentTypography2ParagraphLetterSpacing({
  v,
  device
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix: "paragraph"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H1FontFamily({
  v,
  device
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix: "h1"
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H1FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "h1" });
}

export function cssStyleElementWPPostContentTypography2H1LineHeight({
  v,
  device
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix: "h1"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H1FontWeight({
  v,
  device
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix: "h1"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H1LetterSpacing({
  v,
  device
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix: "h1"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H2FontFamily({
  v,
  device
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix: "h2"
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H2FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "h2" });
}

export function cssStyleElementWPPostContentTypography2H2LineHeight({
  v,
  device
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix: "h2"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H2FontWeight({
  v,
  device
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix: "h2"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H2LetterSpacing({
  v,
  device
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix: "h2"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H3FontFamily({
  v,
  device
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix: "h3"
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H3FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "h3" });
}

export function cssStyleElementWPPostContentTypography2H3LineHeight({
  v,
  device
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix: "h3"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H3FontWeight({
  v,
  device
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix: "h3"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H3LetterSpacing({
  v,
  device
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix: "h3"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H4FontFamily({
  v,
  device
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix: "h4"
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H4FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "h4" });
}

export function cssStyleElementWPPostContentTypography2H4LineHeight({
  v,
  device
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix: "h4"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H4FontWeight({
  v,
  device
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix: "h4"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H4LetterSpacing({
  v,
  device
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix: "h4"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H5FontFamily({
  v,
  device
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix: "h5"
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H5FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "h5" });
}

export function cssStyleElementWPPostContentTypography2H5LineHeight({
  v,
  device
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix: "h5"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H5FontWeight({
  v,
  device
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix: "h5"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H5LetterSpacing({
  v,
  device
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix: "h5"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H6FontFamily({
  v,
  device
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        prefix: "h6"
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H6FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "h6" });
}

export function cssStyleElementWPPostContentTypography2H6LineHeight({
  v,
  device
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    prefix: "h6"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H6FontWeight({
  v,
  device
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    prefix: "h6"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H6LetterSpacing({
  v,
  device
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    prefix: "h6"
  })};`;
}

export function cssStyleElementWPPostContentFontWeightInherit() {
  return "font-weight: inherit;";
}

export function cssStyleElementWPPostContentExcerptAlign({
  v,
  device,
  state,
  prefix = "excerpt"
}) {
  return cssStyleTextAlign({ v, device, state, prefix });
}
