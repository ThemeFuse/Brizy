export default function ($node: JQuery): void {
  const node = $node.get(0);
  if (!node) return;

  const formatTime = (time: number): string => {
    const min: number = Math.floor(time / 60);
    const sec: number = Math.floor(time % 60);

    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  const clickedElement = (event: Event, item: Element | null): boolean => {
    return Boolean(item && event.composedPath().find((el) => el === item));
  };

  const changeIconVisibility = (
    iconsWrapper: Element,
    needToPlay: boolean
  ): void => {
    const firstItem = iconsWrapper.children[0];
    const secondItem = iconsWrapper.children[1];

    if (firstItem && secondItem) {
      if (needToPlay) {
        firstItem.classList.add("brz-hidden");
        secondItem.classList.remove("brz-hidden");
      } else {
        firstItem.classList.remove("brz-hidden");
        secondItem.classList.add("brz-hidden");
      }
    }
  };
  const getSliderOffset = (slider: Element, pageX: number): number => {
    const sliderWidth: number = slider.getBoundingClientRect().width;
    const offsetLeft: number = pageX - slider.getBoundingClientRect().left;

    return (offsetLeft * 100) / sliderWidth;
  };

  node.querySelectorAll(".brz-audio").forEach((item) => {
    const audio = item.querySelector("audio");

    if (audio) {
      const sliderNode: HTMLElement | null = item.querySelector(
        ".brz-audio-controls .brz-audio-progress"
      );
      const sliderProgressNode = item.querySelector(
        ".brz-audio-controls .brz-audio-slider"
      );
      const volumeSliderNode = item.querySelector(
        ".brz-audio-volume-controls .brz-audio-slider"
      );
      const volumeProgressNode: HTMLElement | null = item.querySelector(
        ".brz-audio-volume-controls .brz-audio-progress"
      );
      const muteBtnNode = item.querySelector(".brz-audio-volume-btn");
      const currentTimeNode = item.querySelector(".brz-audio-current-time");
      const totalTimeNode = item.querySelector(".brz-audio-total-time");
      const playPauseBtnNode = item.querySelector(".brz-audio-play-pause-btn");

      const stopPreviousTrack = (item: Element): void => {
        const elementsToStop: Element[] = Array.from(
          node.querySelectorAll(".brz-audio")
        ).filter((_item) => _item !== item);

        elementsToStop.forEach((item) => {
          const audio: HTMLAudioElement | null = item.querySelector(
            ".brz-custom-audio audio"
          );

          const currentPlayPauseIcons = item.querySelector(
            ".brz-audio-play-pause-btn"
          );

          if (audio && currentPlayPauseIcons) {
            changeIconVisibility(currentPlayPauseIcons, false);
            audio.pause();
          }
        });
      };

      audio.addEventListener("loadedmetadata", (event: Event) => {
        const audioTarget = event.target as HTMLAudioElement;

        const duration: string = formatTime(audioTarget.duration);

        if (totalTimeNode) {
          totalTimeNode.innerHTML = duration;
        }
      });

      audio.addEventListener("timeupdate", (event: Event) => {
        const audioTarget = event.target as HTMLAudioElement;

        const currentTime = audioTarget.currentTime;
        const duration = audioTarget.duration;
        const progressPercent = (currentTime / duration) * 100;

        if (sliderNode && currentTimeNode) {
          sliderNode.style.width = `${progressPercent.toFixed(2)}%`;
          currentTimeNode.innerHTML = formatTime(currentTime);
        }
      });

      audio.addEventListener("ended", () => {
        playPauseBtnNode && changeIconVisibility(playPauseBtnNode, false);
      });

      item.addEventListener("click", (event) => {
        const isPlayPauseClick = clickedElement(event, playPauseBtnNode);
        const isSliderClick = clickedElement(event, sliderProgressNode);
        const isMuteClick = clickedElement(event, muteBtnNode);
        const isSliderVolumeClick = clickedElement(event, volumeSliderNode);

        if (isPlayPauseClick) {
          if (audio.paused) {
            stopPreviousTrack(item);
            audio.play();
          } else {
            audio.pause();
          }
          playPauseBtnNode &&
            changeIconVisibility(playPauseBtnNode, !audio.paused);
        } else if (isSliderClick && sliderProgressNode) {
          const offsetProgressPercent = getSliderOffset(
            sliderProgressNode,
            (event as MouseEvent).pageX
          );
          audio.currentTime = (offsetProgressPercent * audio.duration) / 100;
        } else if (isMuteClick && muteBtnNode && volumeProgressNode) {
          changeIconVisibility(muteBtnNode, !audio.muted);
          audio.muted = !audio.muted;

          if (audio.muted) {
            volumeProgressNode.style.width = "0%";
          } else {
            audio.volume;
            volumeProgressNode.style.width = `${(audio.volume * 100).toFixed(
              2
            )}%`;
          }
        } else if (
          isSliderVolumeClick &&
          volumeProgressNode &&
          volumeSliderNode
        ) {
          const offsetVolumePercent = getSliderOffset(
            volumeSliderNode,
            (event as MouseEvent).pageX
          );
          volumeProgressNode.style.width = `${offsetVolumePercent.toFixed(2)}%`;
          audio.volume = offsetVolumePercent / 100;

          if (audio.muted && muteBtnNode && isSliderVolumeClick) {
            changeIconVisibility(muteBtnNode, !audio.muted);

            volumeProgressNode.style.width = `${offsetVolumePercent.toFixed(
              2
            )}%`;
            audio.muted = !audio.muted;
            audio.volume = offsetVolumePercent / 100;
          }
        }
      });
    }
  });
}
