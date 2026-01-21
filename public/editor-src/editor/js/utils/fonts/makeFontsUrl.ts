import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GoogleFont, UploadedFont } from "visual/types/Fonts";

export const makeSubsetGoogleFontsUrl = (
  fonts: GoogleFont[],
  baseUrl = "https://fonts.bunny.net/css"
): string => {
  const family = fonts.reduce((acc, curr) => {
    const family = curr.family.replace(/\s/g, "+");
    const weights = curr.variants.join();

    return acc === "" ? `${family}:${weights}` : `${acc}|${family}:${weights}`;
  }, "");

  // was https://fonts.googleapis.com/css
  return `${baseUrl}?family=${family}&subset=arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,khmer,korean,latin-ext,tamil,telugu,thai,vietnamese&display=swap`;
};

// {editorFonts}fontId:400|fontId:400,700
export const makeUploadFontsUrl = (
  fonts: UploadedFont[],
  config: ConfigCommon
): string => {
  const baseUrl = config.urls?.editorFonts;
  const fontsStr = fonts.reduce((acc, { id, weights }) => {
    const _weights = weights.join();

    return acc === "" ? `${id}:${_weights}` : `${acc}|${id}:${_weights}`;
  }, "");

  return `${baseUrl}${fontsStr}`;
};

// prefetch assets
export const makePrefetchFonts = (config: ConfigCommon): string[] => {
  const prefetchFonts = config.urls?.prefetchFonts;
  const googleFontsUrl = config.urls?.googleFonts ?? "https://fonts.bunny.net";

  const links = [
    `<link class="brz-link brz-link-bunny-fonts-prefetch" rel="dns-prefetch" href="${googleFontsUrl}">`,
    `<link class="brz-link brz-link-bunny-fonts-preconnect" rel="preconnect" href="${googleFontsUrl}" crossorigin>`
  ];

  if (prefetchFonts) {
    links.push(
      `<link class="brz-link brz-link-cdn-preconnect" rel="preconnect" href="${prefetchFonts}" crossorigin>`
    );
  }

  return links;
};
