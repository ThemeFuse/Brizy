import {
  styleColor,
  styleTypography2FontFamily,
  styleTypography2FontSize,
  styleTypography2LineHeight,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing
} from "visual/utils/style2";

export function cssStyleElementWPPostContentH1Color({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    prefix: "h1Color",
    state
  });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementWPPostContentH2Color({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    prefix: "h2Color",
    state
  });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementWPPostContentH3Color({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    prefix: "h3Color",
    state
  });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementWPPostContentH4Color({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    prefix: "h4Color",
    state
  });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementWPPostContentH5Color({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    prefix: "h5Color",
    state
  });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementWPPostContentH6Color({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    prefix: "h6Color",
    state
  });
  return color === undefined ? "" : `color:${color};`;
}

export function cssStyleElementWPPostContentParagraphColor({
  v,
  device,
  state
}) {
  const color = styleColor({
    v,
    device,
    prefix: "paragraphColor",
    state
  });
  return color === undefined ? "" : `color:${color};`;
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
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix: "paragraph"
  })}px;`;
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
  })}px;`;
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
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix: "h1"
  })}px;`;
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
  })}px;`;
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
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix: "h2"
  })}px;`;
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
  })}px;`;
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
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix: "h3"
  })}px;`;
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
  })}px;`;
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
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix: "h4"
  })}px;`;
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
  })}px;`;
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
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix: "h5"
  })}px;`;
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
  })}px;`;
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
  return `font-size:${styleTypography2FontSize({
    v,
    device,
    prefix: "h6"
  })}px;`;
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
  })}px;`;
}

export function cssStyleElementWPPostContentFontWeightInherit() {
  return "font-weight: inherit;";
}
