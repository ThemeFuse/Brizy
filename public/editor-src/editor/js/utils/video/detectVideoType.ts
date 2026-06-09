import getVideoData from "./videoData";

export type VideoType = "youtube" | "vimeo" | "custom";

export function detectVideoType(url: string): VideoType | undefined {
  if (!url || !/^https?:\/\//.test(url)) {
    return undefined;
  }

  const data = getVideoData(url);
  return (data?.type as "youtube" | "vimeo") ?? "custom";
}
