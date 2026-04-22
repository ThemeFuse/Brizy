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
    background = false,
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

  // For background videos we handle loop in JS (onStateChange ENDED) so that
  // ENDED actually fires; native loop=1+playlist prevents ENDED from firing.
  if (loop && !background) {
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
    background = false,
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
      // For background videos we handle loop after the `finish` event, so the
      // player must not use native loop or Vimeo will skip `finish`.
      loop: Number(loop && !background),
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
