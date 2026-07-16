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

  // Native loop=1+playlist prevents ENDED from firing and ignores `start` on
  // subsequent loops. Disable it when we need to seek to a custom start time
  // or for background videos (both handle looping via JS instead).
  if (loop && !background && !start) {
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
      // Native loop ignores #t= and restarts from 0. Disable it whenever we
      // need to seek to a custom start time, and handle looping via JS instead.
      loop: Number(loop && !background && !start),
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
