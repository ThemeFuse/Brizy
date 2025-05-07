import {
  cssStyleColor,
  cssStyleTextAlign,
  cssStyleTextTransforms,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation
} from "visual/utils/cssStyle";
import {
  styleTypography2FontFamily,
  styleTypography2FontWeight,
  styleTypography2LetterSpacing,
  styleTypography2LineHeight
} from "visual/utils/style2";

export function cssStyleElementWPPostContentH1Color({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "h1Color"
  });
}

export function cssStyleElementWPPostContentH2Color({
  v,
  device,
  getConfig,
  store,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    prefix: "h2Color",
    state
  });
}

export function cssStyleElementWPPostContentH3Color({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    prefix: "h3Color",
    state
  });
}

export function cssStyleElementWPPostContentH4Color({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    prefix: "h4Color",
    state
  });
}

export function cssStyleElementWPPostContentH5Color({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    prefix: "h5Color",
    state
  });
}

export function cssStyleElementWPPostContentH6Color({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    prefix: "h6Color",
    state
  });
}

export function cssStyleElementWPPostContentParagraphColor({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    getConfig,
    prefix: "paragraphColor",
    state
  });
}

// Typography

export function cssStyleElementWPPostContentTypography2ParagraphFontFamily({
  v,
  device,
  getConfig,
  renderContext,
  store
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        store,
        getConfig,
        prefix: "paragraph",
        renderContext
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2ParagraphFontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "paragraph"
  });
}

export function cssStyleElementWPPostContentTypography2ParagraphLineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "paragraph"
  })};`;
}

export function cssStyleElementWPPostContentTypography2ParagraphFontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "paragraph"
  })};`;
}

export function cssStyleElementWPPostContentTypography2ParagraphLetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "paragraph"
  })};`;
}

export function cssStyleElementWPPostContentTypography2ParagraphFontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "paragraph"
  });
}

export function cssStyleElementWPPostContentParagraphTextTransform({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "paragraph"
  });
}

export function cssStyleElementWPPostContentTypography2H1FontFamily({
  v,
  device,
  renderContext,
  getConfig,
  store
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        store,
        getConfig,
        prefix: "h1",
        renderContext
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H1FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h1"
  });
}

export function cssStyleElementWPPostContentTypography2H1LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h1"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H1FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    getConfig,
    store,
    prefix: "h1"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H1LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "h1"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H1FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "h1"
  });
}

export function cssStyleElementWPPostContentH1TextTransform({
  v,
  state,
  getConfig,
  device,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "h1"
  });
}
export function cssStyleElementWPPostContentTypography2H2FontFamily({
  v,
  device,
  getConfig,
  store,
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        store,
        getConfig,
        prefix: "h2",
        renderContext
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H2FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h2"
  });
}

export function cssStyleElementWPPostContentTypography2H2LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    getConfig,
    store,
    prefix: "h2"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H2FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h2"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H2LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "h2"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H2FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "h2"
  });
}

export function cssStyleElementWPPostContentH2TextTransform({
  v,
  state,
  getConfig,
  device,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "h2"
  });
}

export function cssStyleElementWPPostContentTypography2H3FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        store,
        getConfig,
        prefix: "h3",
        renderContext
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H3FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h3"
  });
}

export function cssStyleElementWPPostContentTypography2H3LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    getConfig,
    store,
    prefix: "h3"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H3FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h3"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H3LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "h3"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H3FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "h3"
  });
}

export function cssStyleElementWPPostContentH3TextTransform({
  v,
  state,
  device,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "h3"
  });
}

export function cssStyleElementWPPostContentTypography2H4FontFamily({
  v,
  device,
  getConfig,
  store,
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        getConfig,
        store,
        prefix: "h4",
        renderContext
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H4FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h4"
  });
}

export function cssStyleElementWPPostContentTypography2H4LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h4"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H4FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h4"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H4LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "h4"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H4FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "h4"
  });
}

export function cssStyleElementWPPostContentH4TextTransform({
  v,
  state,
  getConfig,
  device,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "h4"
  });
}

export function cssStyleElementWPPostContentTypography2H5FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        getConfig,
        store,
        prefix: "h5",
        renderContext
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H5FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h5"
  });
}

export function cssStyleElementWPPostContentTypography2H5LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    getConfig,
    store,
    prefix: "h5"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H5FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h5"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H5LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "h5"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H5FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "h5"
  });
}

export function cssStyleElementWPPostContentH5TextTransform({
  v,
  state,
  device,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    getConfig,
    store,
    state,
    prefix: "h5"
  });
}

export function cssStyleElementWPPostContentTypography2H6FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return device === "desktop"
    ? `font-family:${styleTypography2FontFamily({
        v,
        device,
        getConfig,
        store,
        prefix: "h6",
        renderContext
      })};`
    : "";
}

export function cssStyleElementWPPostContentTypography2H6FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h6"
  });
}

export function cssStyleElementWPPostContentTypography2H6LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return `line-height:${styleTypography2LineHeight({
    v,
    device,
    getConfig,
    store,
    prefix: "h6"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H6FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return `font-weight:${styleTypography2FontWeight({
    v,
    device,
    getConfig,
    store,
    prefix: "h6"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H6LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return `letter-spacing:${styleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "h6"
  })};`;
}

export function cssStyleElementWPPostContentTypography2H6FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "h6"
  });
}

export function cssStyleElementWPPostContentH6TextTransform({
  v,
  state,
  device,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    state,
    device,
    getConfig,
    store,
    prefix: "h6"
  });
}

export function cssStyleElementWPPostContentFontWeightInherit() {
  return "font-weight: inherit;";
}

export function cssStyleElementWPPostContentExcerptAlign({
  v,
  device,
  store,
  getConfig,
  state,
  prefix = "excerpt"
}) {
  return cssStyleTextAlign({ v, device, store, state, getConfig, prefix });
}
