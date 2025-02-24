import { intersection, uniq } from "es-toolkit";
import { toHashCode } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import {
  Asset,
  AssetCode,
  AssetFile,
  AssetFonts,
  AssetInline,
  AssetLibsMap
} from "../transforms/assets";

const objToAttr = (r: Record<string, string>): string => {
  return Object.entries(r).reduce((str, [key, value]) => {
    const kv = `${key}="${value}"`;
    return str ? `${str} ${kv}` : kv;
  }, "");
};

export function makeInlineStyle(asset: AssetInline): string {
  const { content, attr } = asset;
  const strAttr = attr ? objToAttr(attr) : "";
  return `<style ${strAttr}>${content}</style>`;
}

export function makeInlineScript(asset: AssetInline): string {
  const { content, attr } = asset;
  const strAttr = attr ? objToAttr(attr) : "";
  return `<script ${strAttr}>${content}</script>`;
}

export function makeCode(asset: AssetCode): string {
  return asset.content;
}

export function makeLink(asset: AssetFile): string {
  const { url, attr } = asset;
  const strAttr = attr ? objToAttr(attr) : "";
  return `<link href="${url}" ${strAttr}>`;
}

export function makeScript(asset: AssetFile): string {
  const { url, attr } = asset;
  const strAttr = attr ? objToAttr(attr) : "";
  return `<script ${strAttr} src="${url}"></script>`;
}

export const makeStyles = ({
  content
}: Asset | AssetFonts | AssetLibsMap): string => {
  switch (content.type) {
    case "inline": {
      return makeInlineStyle(content);
    }
    case "code": {
      return makeCode(content);
    }
    case "file": {
      return makeLink(content);
    }
  }
};

export const makeScripts = ({ content }: Asset | AssetLibsMap): string => {
  switch (content.type) {
    case "inline": {
      return makeInlineScript(content);
    }
    case "code": {
      return makeCode(content);
    }
    case "file": {
      return makeScript(content);
    }
  }
};

export const getLibAsset = (
  assets: Array<AssetLibsMap>,
  selectors: Array<string>
): MValue<Asset> => {
  const totalSelectors = uniq(selectors).length;

  if (totalSelectors > 0) {
    return assets.find(
      (asset) =>
        intersection(asset.selectors, selectors).length === totalSelectors
    );
  }

  return undefined;
};

export const sortLibs = (a: Asset, b: Asset): number => a.score - b.score;

export function combineStyles(assets: Array<Asset>): Array<Asset> {
  const inlined: {
    base: MValue<Asset>;
    dynamic: Record<string, Asset>;
  } = {
    base: undefined,
    dynamic: {}
  };
  const others: Array<Asset> = [];

  assets.forEach((asset) => {
    if (asset.content.type === "inline") {
      const { content } = asset;
      const { attr, content: css } = content;

      if (attr) {
        const attrToHash = toHashCode(JSON.stringify(attr));
        const dynamicAsset = inlined.dynamic[attrToHash];

        if (dynamicAsset && dynamicAsset.content.type === "inline") {
          dynamicAsset.content.content += css;
        } else {
          inlined.dynamic[attrToHash] = asset;
        }
      } else {
        const base = inlined.base;
        if (base && base.content.type === "inline") {
          base.content.content += css;
        } else {
          inlined.base = asset;
        }
      }
    } else {
      others.push(asset);
    }
  });

  const results = [...others, ...Object.values(inlined.dynamic)];

  if (inlined.base) {
    results.push(inlined.base);
  }

  return results;
}
