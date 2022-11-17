import objectToQueryString from "visual/utils/url/objectToQueryString";

const DEFAULT_SETTINGS = {
  autoplay: false,
  controls: true,
  loop: false,
  privacyMode: "off"
};

const getYouTubeOptions = (
  key,
  {
    autoplay,
    controls,
    branding = 1,
    loop,
    suggestedVideo,
    start = 0,
    end = 0,
    hasCover = false,
    privacyMode,
    videoMuted
  }
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
    rel: Number(suggestedVideo),
    mute: Number(videoMuted),
    ...(autoplay && !hasCover ? { mute: 1 } : {})
  };

  if (loop) {
    options.loop = 1;
    options.playlist = key;
  }

  const urlPrivacyMode = privacyMode === "on" ? "-nocookie" : "";

  return {
    url: `https://www.youtube${urlPrivacyMode}.com/embed/${key}`,
    options
  };
};

const getVimeoOptions = (
  key,
  {
    intro = 1,
    autoplay,
    loop = false,
    start = 0,
    controls,
    hasCover = false,
    videoMuted
  }
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
      controls: Number(controls),
      loop: Number(loop),
      muted: Number(videoMuted),
      ...(autoplay === true && !hasCover ? { muted: 1 } : {})
    },
    anchor: `#t=${Number(start)}s`
  };
};

export default function videoUrl({ type, key }, settings) {
  const newSettings = { ...DEFAULT_SETTINGS, ...settings };
  const {
    url,
    options,
    anchor = ""
  } = type === "youtube"
    ? getYouTubeOptions(key, newSettings)
    : getVimeoOptions(key, newSettings);

  return `${url}?${objectToQueryString(options)}${anchor}`;
}
