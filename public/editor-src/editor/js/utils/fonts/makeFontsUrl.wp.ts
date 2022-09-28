import Config from "visual/global/Config";
import { GoogleFont, UploadedFont } from "visual/types";
import { objectToQueryString, urlContainsQueryString } from "visual/utils/url";

export const makeSubsetGoogleFontsUrl = (fonts: GoogleFont[]): string => {
  const family = fonts.reduce((acc, curr) => {
    const family = curr.family.replace(/\s/g, "+");
    const weights = curr.variants.join();

    return acc === "" ? `${family}:${weights}` : `${acc}|${family}:${weights}`;
  }, "");

  // was https://fonts.googleapis.com/css
  return `https://fonts.bunny.net/css?family=${family}&subset=arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,khmer,korean,latin-ext,tamil,telugu,thai,vietnamese&display=swap`;
};

// {siteUrl}?brizy-font=fontId:400|fontId:400,700
export const makeUploadFontsUrl = (fonts: UploadedFont[]): string => {
  const fontsUrl = Config.get("urls").editorFonts;
  const prefix = Config.get("prefix") ?? "brizy";
  const qs = objectToQueryString({
    [`${prefix}-font`]: fonts.reduce((acc, { id, weights }) => {
      const _weights = weights.join();

      return acc === "" ? `${id}:${_weights}` : `${acc}|${id}:${_weights}`;
    }, "")
  });

  return urlContainsQueryString(fontsUrl)
    ? `${fontsUrl}&${qs}`
    : `${fontsUrl}?${qs}`;
};

// prefetch assets
export const makePrefetchFonts = (): string[] => {
  return [
    /* eslint-disable quotes */
    '<link class="brz-link brz-link-google-prefetch" rel="dns-prefetch" href="//ajax.googleapis.com">',
    '<link class="brz-link brz-link-google-prefetch" rel="dns-prefetch" href="//fonts.googleapis.com">',
    '<link class="brz-link brz-link-google-preconnect" rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>'
    /* eslint-enabled quotes */
  ];
};
