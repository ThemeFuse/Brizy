import { isIOS } from "visual/utils/devices";
import { Num } from "@brizy/readers";

interface DocumentWithFullscreen extends Document {
  mozFullscreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: VoidFunction;
  mozCancelFullScreen?: VoidFunction;
  webkitExitFullscreen?: VoidFunction;
}

interface OwnerDocument extends Document {
  onwebkitfullscreenchange?: VoidFunction;
  onmozfullscreenchange?: VoidFunction;
}

interface HTMLElementFullscreen extends HTMLElement {
  webkitRequestFullscreen?: VoidFunction;
  msRequestFullscreen?: VoidFunction;
  mozRequestFullScreen?: VoidFunction;
  webkitEnterFullscreen?: VoidFunction;
}

let fullscreenVideoNode: null | Element = null;
const doc = document as DocumentWithFullscreen;

export const initCustomVideoActions = (
  root: Element,
  className: string,
  shortcodeClassName: string = className
): void => {
  // Function init click Play & Pause Button
  root.querySelectorAll(className).forEach((videoNode) => {
    const video = videoNode.querySelector("video");
    const autoplay = video?.getAttribute("data-autoplay");
    const muted = video?.hasAttribute("muted");

    if (autoplay === "on") {
      changePlayerState(videoNode);
    }
    if (muted) {
      changePlayerMute(videoNode, true);
    }
  });

  const clickSelector = `${className} .brz-video-custom-play-pause-btn, ${className} .brz-shortcode__placeholder:not(.brz-video-playlist-placeholder), ${className} .brz-video__cover, ${className} video`;

  root.querySelectorAll(clickSelector).forEach((clickNode) => {
    clickNode.addEventListener("click", (evt) => {
      const shortcodeVideo = (evt.target as HTMLElement).closest(
        shortcodeClassName
      );
      if (shortcodeVideo) {
        changePlayerState(shortcodeVideo);
      }
    });
  });

  // Function init click Volume Button
  const volumeSelector = `${className} .brz-video-custom-volume-btn`;

  root.querySelectorAll(volumeSelector).forEach((volumeNode) => {
    volumeNode.addEventListener("click", (evt) => {
      const shortcodeVideo = (evt.target as HTMLElement).closest(
        shortcodeClassName
      );
      const muted = shortcodeVideo?.querySelector("video")?.muted;

      if (shortcodeVideo) {
        changePlayerMute(shortcodeVideo, !muted);
      }
    });
  });

  const handleFullscreenChange = (): void => {
    if (!fullscreenVideoNode) return;

    const fullScreenElement =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.msFullscreenElement ||
      doc.mozFullscreenElement;

    if (fullScreenElement) {
      fullscreenVideoNode.classList.add(
        "brz-video-custom-fullScreen-window-show"
      );
    } else {
      fullscreenVideoNode.classList.remove(
        "brz-video-custom-fullScreen-window-show"
      );
    }
  };

  const ownerDocument = root.ownerDocument as OwnerDocument;

  ownerDocument.onfullscreenchange = handleFullscreenChange;
  ownerDocument.onwebkitfullscreenchange = handleFullscreenChange;
  ownerDocument.onmozfullscreenchange = handleFullscreenChange;

  // Function init click FullScreen Video
  const fullscreenSelector = `${className} .brz-video-custom-fullscreen-btn`;

  root.querySelectorAll(fullscreenSelector).forEach((fullscreenNode) => {
    fullscreenNode.addEventListener("click", (evt) => {
      const shortcodeVideo = (evt.target as HTMLElement)?.closest(
        shortcodeClassName
      );
      const videoElem = shortcodeVideo?.querySelector(".brz-video-elem");
      const video = videoElem?.querySelector("video");

      if (!videoElem || !video?.src || !video?.duration) return;

      const fullScreenElement =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement ||
        doc.mozFullscreenElement;

      if (fullScreenElement) {
        closeFullscreen();
      } else {
        fullscreenVideoNode = videoElem;
        openFullscreen(videoElem as HTMLElementFullscreen, isIOS());
      }
    });
  });
};

const formatTime = (time: number): string => {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? `0${sec}` : sec}`;
};

const roundTo = (num: number, places = 2): string => {
  return num.toFixed(places);
};

const changeIconVisibility = (
  iconsWrapper: Element,
  firstIsActive: boolean
): void => {
  const firstIcon = iconsWrapper.children[0];
  const secondIcon = iconsWrapper.children[1];

  if (firstIsActive) {
    firstIcon.classList.add("brz-hidden");
    secondIcon.classList.remove("brz-hidden");
  } else {
    firstIcon.classList.remove("brz-hidden");
    secondIcon.classList.add("brz-hidden");
  }
};

const getSliderOffset = (slider: HTMLElement, pageX: number): number => {
  const sliderWidth = slider.offsetWidth;
  const offsetLeft = pageX - slider.getBoundingClientRect().left;

  return (offsetLeft * 100) / sliderWidth;
};

export const changePlayerState = (shortcodeVideo: Element): void => {
  if (!shortcodeVideo) {
    return;
  }

  const video = shortcodeVideo.querySelector("video");
  if (!video?.src) {
    return;
  }

  const slider = shortcodeVideo.querySelector<HTMLElement>(
    ".brz-video-custom-controls .brz-video-custom-slider"
  );
  const coverImage =
    shortcodeVideo.querySelector<HTMLElement>(".brz-video__cover");
  const coverPlaceholder = shortcodeVideo.querySelector<HTMLElement>(
    ".brz-shortcode__placeholder"
  );
  const volumeSlider = shortcodeVideo.querySelector<HTMLElement>(
    ".brz-video-custom-volume-controls"
  );
  const progress = shortcodeVideo.querySelector<HTMLElement>(
    ".brz-video-custom-controls .brz-video-custom-progress"
  );
  const volumeProgress = shortcodeVideo.querySelector<HTMLElement>(
    ".brz-video-custom-volume-controls .brz-video-custom-progress"
  );
  const playPauseBtn = shortcodeVideo.querySelector(
    ".brz-video-custom-play-pause-btn"
  );
  const currentTimeNode = shortcodeVideo.querySelector(
    ".brz-video-custom-current-time"
  );

  const timeStart = Num.read(video.getAttribute("data-time-start")) || 0;
  let timeEnd = Num.read(video.getAttribute("data-time-end")) || Infinity;

  if (playPauseBtn) {
    changeIconVisibility(playPauseBtn, video.paused);
  }

  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }

  const isVideoComponent =
    !!shortcodeVideo.querySelector(".brz-custom-video") ||
    shortcodeVideo.classList.contains("brz-custom-video");

  if (isVideoComponent) {
    coverImage?.classList.add("brz-hidden");
    coverPlaceholder?.classList.add("brz-hidden");
  }
  video.removeAttribute("class");

  if (!video.duration) {
    video.addEventListener("loadedmetadata", (evt) => {
      const videoTarget = evt.target as HTMLVideoElement;
      const duration = formatTime(videoTarget.duration);
      const currentTime = formatTime(timeStart);
      video.currentTime = timeStart;

      const totalTimeNode = shortcodeVideo.querySelector(
        ".brz-video-custom-total-time"
      );

      if (totalTimeNode) {
        totalTimeNode.innerHTML = duration;
      }
      if (currentTimeNode) {
        currentTimeNode.innerHTML = currentTime;
      }
    });

    video.addEventListener("timeupdate", (evt) => {
      const videoTarget = evt.target as HTMLVideoElement;

      const currentTime = videoTarget.currentTime;
      const duration = videoTarget.duration;
      const progressPercent = (currentTime / duration) * 100;

      if (progress) {
        progress.style.width = `${roundTo(progressPercent)}%`;
      }

      if (currentTimeNode) {
        currentTimeNode.innerHTML = formatTime(currentTime);
      }

      if (currentTime < timeEnd) return;

      if (video.hasAttribute("loop")) {
        video.currentTime = timeStart;
      } else {
        video.pause();
        timeEnd = Infinity;
      }
    });

    if (playPauseBtn) {
      video.addEventListener("ended", () => {
        changeIconVisibility(playPauseBtn, false);
      });

      video.addEventListener("play", () => {
        changeIconVisibility(playPauseBtn, true);
      });

      video.addEventListener("pause", () => {
        changeIconVisibility(playPauseBtn, false);
      });
    }

    window.addEventListener("mousedown", (evt) => {
      const target = evt.target as HTMLElement;

      if (!slider || !volumeSlider) return;

      const isSliderClick = !!target.closest(
        ".brz-video-custom-controls .brz-video-custom-slider"
      );
      const isSliderVolumeClick = !!target.closest(
        ".brz-video-custom-volume-controls"
      );

      let offsetPercent;
      if (isSliderClick) {
        offsetPercent = getSliderOffset(slider, evt.pageX);
        video.currentTime = (offsetPercent * video.duration) / 100;
      }

      if (isSliderVolumeClick && volumeProgress) {
        offsetPercent = getSliderOffset(volumeSlider, evt.pageX);
        volumeProgress.style.width = `${roundTo(offsetPercent)}%`;
        video.volume = offsetPercent / 100;
      }
    });
  }
};

const changePlayerMute = (shortcodeVideo: Element, muted: boolean): void => {
  const volumeProgress = shortcodeVideo.querySelector<HTMLElement>(
    ".brz-video-custom-volume-controls .brz-video-custom-progress"
  );
  const video = shortcodeVideo.querySelector("video");
  const mutedBtn = shortcodeVideo.querySelector(".brz-video-custom-volume-btn");

  if (!video?.src) return;

  if (mutedBtn) {
    changeIconVisibility(mutedBtn, muted);
    video.muted = muted;
  }

  if (volumeProgress) {
    const volumeValue = !muted ? video.volume * 100 : 0;
    volumeProgress.style.width = `${roundTo(volumeValue)}%`;
  }
};

const openFullscreen = (elem: HTMLElementFullscreen, isIos: boolean): void => {
  if (isIos) {
    /* IOS Mobile supports fullscreen mode only for video tag */
    const video = elem.querySelector("video") as HTMLElementFullscreen;
    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  } else if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
};

/* Close fullscreen */
const closeFullscreen = (): void => {
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    /* Firefox */
    doc.mozCancelFullScreen();
  } else if (doc.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    doc.webkitExitFullscreen();
  } else if (doc.msExitFullscreen) {
    /* IE/Edge */
    doc.msExitFullscreen();
  }
};
