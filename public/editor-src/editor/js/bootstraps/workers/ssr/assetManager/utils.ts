import { intersection, uniq } from "underscore";
import {
  Asset,
  AssetFonts,
  AssetLibsMap
} from "visual/bootstraps/export/transforms/assets";
import { MValue } from "visual/utils/value";

const objToAttr = (r: Record<string, string>): string => {
  return Object.entries(r).reduce((str, [key, value]) => {
    const kv = `${key}="${value}"`;
    return str ? `${str} ${kv}` : kv;
  }, "");
};

export const makeStyles = ({
  content
}: Asset | AssetFonts | AssetLibsMap): string => {
  switch (content.type) {
    case "inline": {
      const attr = content.attr ? objToAttr(content.attr) : "";
      return `<style ${attr}>${content.content}</style>`;
    }
    case "code": {
      return content.content;
    }
    case "file": {
      const attr = content.attr ? objToAttr(content.attr) : "";
      return `<link href="${content.url}" ${attr}>`;
    }
  }
};

export const makeScripts = ({ content }: Asset | AssetLibsMap): string => {
  switch (content.type) {
    case "inline": {
      const attr = content.attr ? objToAttr(content.attr) : "";
      return `<script ${attr}>${content.content}</script>`;
    }
    case "code": {
      return content.content;
    }
    case "file": {
      const attr = content.attr ? objToAttr(content.attr) : "";
      return `<script ${attr} src="${content.url}"></script>`;
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
