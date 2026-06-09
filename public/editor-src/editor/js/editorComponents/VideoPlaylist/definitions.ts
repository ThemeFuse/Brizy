import { z } from "zod";
import type { AddToolConfig, UpdateToolConfig } from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { setIds } from "visual/utils/models";
import { detectVideoType } from "visual/utils/video";

export const videoPlaylistLinkSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  subTitle: z.string().optional()
});

export type VideoPlaylistLink = z.infer<typeof videoPlaylistLinkSchema>;

export const videoPlaylistPropsSchema = z.object({
  positionItem: z.enum(["horizontal", "vertical"]).optional(),
  positionThumbs: z.enum(["above", "under"]).optional(),
  gridColumn: z.number().min(1).max(6).optional(),
  links: z.array(videoPlaylistLinkSchema).min(1).optional()
});

export type VideoPlaylistProps = z.infer<typeof videoPlaylistPropsSchema>;

const videoPlaylistPropertyDefinitions = {
  positionItem: {
    type: "string",
    enum: ["horizontal", "vertical"],
    description:
      "Layout position: 'horizontal' shows sidebar on the side, 'vertical' shows playlist below/above video"
  },
  positionThumbs: {
    type: "string",
    enum: ["above", "under"],
    description:
      "Thumbnail position in vertical mode: 'above' (top) or 'under' (bottom)"
  },
  gridColumn: {
    type: "number",
    description:
      "Number of columns in vertical mode (1-6). Only applies when positionItem is 'vertical'.",
    minimum: 1,
    maximum: 6
  },
  links: {
    type: "array",
    description:
      "List of video URLs to populate the playlist. Each entry creates a VideoPlaylistItem. Accepts YouTube, Vimeo, or direct video URLs (.mp4). Video type is auto-detected from the URL.",
    items: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Video URL (YouTube, Vimeo, or direct .mp4 URL)"
        },
        title: {
          type: "string",
          description: "Title shown in the playlist sidebar"
        },
        subTitle: {
          type: "string",
          description: "Subtitle shown below the title in the playlist sidebar"
        }
      },
      required: ["url"],
      additionalProperties: false
    }
  }
} as const;

export const addVideoPlaylistDefinition: ToolDefinition = {
  name: "addVideoPlaylist",
  strict: true,
  description:
    "Add a Video Playlist to an EXISTING Section. Provide links[] with video URLs to populate items. Video type (YouTube/Vimeo/custom) is auto-detected. For new sections use generateBlock.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Section or Column container"
      },
      insertIndex: {
        type: "number",
        description: "Position in container (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...videoPlaylistPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateVideoPlaylistDefinition: ToolDefinition = {
  name: "updateVideoPlaylist",
  strict: true,
  description:
    "Update a VideoPlaylist element's layout or replace its video items. Use searchElements({type:'VideoPlaylist'}) to find IDs. Pass links[] to replace all playlist items with new videos.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the VideoPlaylist to update"
      },
      ...videoPlaylistPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addVideoPlaylistConfig: AddToolConfig = {
  kind: "add",
  definition: addVideoPlaylistDefinition,
  elementType: ElementTypes.VideoPlaylist,
  schema: videoPlaylistPropsSchema,
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
  definition: updateVideoPlaylistDefinition,
  elementType: ElementTypes.VideoPlaylist,
  schema: videoPlaylistPropsSchema,
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
