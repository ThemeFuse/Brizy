import {
  type VideoPlaylistLink,
  videoPlaylistPropsSchema
} from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { setIds } from "visual/utils/models";
import { detectVideoType } from "visual/utils/video";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withVideoPlaylistDefaults = withAllFontFamilyNormalize;
export const addVideoPlaylistConfig: AddToolConfig = {
  kind: "add",
  alias: "addVideoPlaylist",
  elementType: ElementTypes.VideoPlaylist,
  schema: videoPlaylistPropsSchema,
  defaults: withVideoPlaylistDefaults,
  transformProps: (parsed) => {
    const { links, ...layoutProps } = parsed as {
      links?: { url: string; title?: string; subTitle?: string }[];
      [key: string]: unknown;
    };
    const initialProperties: Record<string, unknown> = { ...layoutProps };

    if (links && links.length > 0) {
      initialProperties.items = buildPlaylistItems(links);
    }

    return initialProperties;
  }
};
export const updateVideoPlaylistConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateVideoPlaylist",
  elementType: ElementTypes.VideoPlaylist,
  schema: videoPlaylistPropsSchema,
  defaults: withVideoPlaylistDefaults,
  transformProps: (parsed) => {
    const { links, ...layoutProps } = parsed as {
      links?: { url: string; title?: string; subTitle?: string }[];
      [key: string]: unknown;
    };
    const changes = { ...layoutProps };

    if (links && links.length > 0) {
      changes.items = buildPlaylistItems(links);
    }

    return changes;
  }
};
export function buildPlaylistItems(
  links: VideoPlaylistLink[]
): Record<string, unknown>[] {
  const items = links.map((link) => {
    const videoType = detectVideoType(link.url);
    const type = videoType === "custom" ? "url" : videoType;

    return {
      type: "VideoPlaylistItem",
      value: {
        _styles: ["videoPlaylistItem"],
        video: link.url,
        type,
        title: link.title ?? "",
        subTitle: link.subTitle ?? ""
      }
    };
  });

  return setIds({ items }).items;
}
