import objectToQueryString from "visual/utils/url/objectToQueryString";

const DEFAULT_SETTINGS = {
  autoplay: false,
  controls: true,
  loop: false
};

const getYouTubeOptions = (
  key,
  { autoplay, controls, branding = 1, loop, suggestedVideo, start = 0, end = 0 }
) => {
  let options = {
    autoplay: Number(autoplay),
    controls: Number(controls),
    start: Number(start),
    end: Number(end),
    modestbranding: branding,
    wmode: "transparent",
    enablejsapi: 1,
    loop: 0,
    rel: Number(suggestedVideo)
  };

  if (loop) {
    options.loop = 1;
    options.playlist = key;
  }

  return {
    url: `https://www.youtube.com/embed/${key}`,
    options
  };
};

const getVimeoOptions = (
  key,
  { intro = 1, autoplay, loop, start = 0, controls = true }
) => {
  return {
    url: `https://player.vimeo.com/video/${key}`,
    options: {
      autoplay: Number(autoplay),
      background: 0,
      title: intro,
      byline: intro,
      badge: false,
      autopause: false,
      portrait: intro,
      controls,
      loop: Number(loop)
    },
    anchor: `#t=${Number(start)}s`
  };
};

export default function videoUrl({ type, key }, settings) {
  const newSettings = { ...DEFAULT_SETTINGS, ...settings };
  const { url, options, anchor = "" } =
    type === "youtube"
      ? getYouTubeOptions(key, newSettings)
      : getVimeoOptions(key, newSettings);

  return `${url}?${objectToQueryString(options)}${anchor}`;
}
