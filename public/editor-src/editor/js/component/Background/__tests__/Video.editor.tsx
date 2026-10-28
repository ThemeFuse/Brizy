import { render } from "@testing-library/react";
import classnames from "classnames";
import React, { type ReactElement, type RefObject } from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "visual/providers/ConfigProvider";
import { createStore } from "visual/redux/store";
import { config } from "../../../../../jest-utils/mocks";
import {
  type BackgroundEnv,
  installBackgroundEnv,
  restoreBackgroundEnv
} from "../__fixtures__/env";
import {
  type FakeYoutube,
  installYoutubeApi,
  restoreYoutubeApi
} from "../__fixtures__/players";
import Video from "../types/Video";

// Characterization suite for the editor half of the background-video plugin. The editor reaches
// API the published page never touches — setLoop, seekTo, reinit, typeChange — and passes the
// start second as the raw string it holds in its model.

interface VideoProps {
  video: { type: string; key: string } | undefined;
  customVideo: string | undefined;
  videoType: string;
  videoLoop: boolean;
  videoStart: string;
}

let env: BackgroundEnv;
let youtube: FakeYoutube;

function renderVideo(props: VideoProps): {
  container: HTMLElement;
  rerender: (next: VideoProps) => void;
  unmount: () => void;
} {
  // `ConfigProvider` itself reads the redux store, so the editor tree needs one even though this
  // component does not.
  const store = createStore();

  const ui = (p: VideoProps): ReactElement => (
    <Provider store={store}>
      <ConfigProvider config={config}>
        <Video
          video={p.video}
          customVideo={p.customVideo}
          videoType={p.videoType}
          videoLoop={p.videoLoop}
          videoStart={p.videoStart}
        >
          {({ innerRef, attr, children }): ReactElement => (
            <div
              ref={innerRef as RefObject<HTMLDivElement>}
              {...attr}
              className={classnames("brz-bg-video", attr.className)}
              style={{ width: "320px", height: "180px" }}
            >
              {children}
            </div>
          )}
        </Video>
      </ConfigProvider>
    </Provider>
  );

  const result = render(ui(props));

  return {
    container: result.container,
    rerender: (next): void => result.rerender(ui(next)),
    unmount: result.unmount
  };
}

const youtubeProps: VideoProps = {
  video: { type: "youtube", key: "abc" },
  customVideo: undefined,
  videoType: "youtube",
  videoLoop: true,
  videoStart: "10"
};

const customProps: VideoProps = {
  video: undefined,
  customVideo: "https://example.com/clip.mp4",
  videoType: "url",
  videoLoop: true,
  videoStart: "10"
};

const videoElement = (container: HTMLElement): HTMLVideoElement => {
  const node = container.querySelector("video");

  if (!(node instanceof HTMLVideoElement)) {
    throw new Error("the custom video was not rendered");
  }

  return node;
};

beforeEach(() => {
  env = installBackgroundEnv();
  youtube = installYoutubeApi();
});

afterEach(() => {
  document.body.innerHTML = "";
  restoreYoutubeApi();
  restoreBackgroundEnv();
  jest.restoreAllMocks();
});

// The editor never creates `window.Brz`, so the loader takes its "no Brz" branch: it installs a
// handler that flushes the queued players itself. Flushing it once here leaves the module in the
// "API already mounted" state every case below starts from.
beforeAll(() => {
  const api = installYoutubeApi();
  const { unmount } = renderVideo(youtubeProps);

  api.ready();
  unmount();
  restoreYoutubeApi();
  document.body.innerHTML = "";
});

describe("a youtube background", () => {
  it("passes the start second on as the string the editor holds", () => {
    renderVideo(youtubeProps);

    const player = youtube.players[0];

    player.config.events.onReady({ target: player });

    expect(youtube.calls).toEqual([
      ["mute"],
      ["seekTo", "10"],
      ["playVideo"],
      ["playVideo"]
    ]);
  });

  it("seeks without rebuilding the player when only the start changes", () => {
    const { rerender } = renderVideo(youtubeProps);

    youtube.calls.length = 0;
    rerender({ ...youtubeProps, videoStart: "20" });

    expect(youtube.calls).toEqual([["seekTo", "20"]]);
    expect(youtube.players).toHaveLength(1);
  });

  it("builds a second player on the same iframe when the video changes", () => {
    const { rerender } = renderVideo(youtubeProps);

    rerender({
      ...youtubeProps,
      video: { type: "youtube", key: "other" }
    });

    expect(youtube.players).toHaveLength(2);
    expect(youtube.players[1].element).toBe(youtube.players[0].element);
  });
});

describe("a custom background", () => {
  it("plays muted from the configured second", () => {
    const { container } = renderVideo(customProps);

    const video = videoElement(container);

    expect(video.getAttribute("muted")).toBe("true");
    expect(video.currentTime).toBe(10);
    expect(env.play).toHaveBeenCalledTimes(1);
  });

  it("rebuilds the player when the loop is toggled", () => {
    const { rerender } = renderVideo(customProps);

    env.play.mockClear();
    rerender({ ...customProps, videoLoop: false });

    expect(env.play).toHaveBeenCalledTimes(1);
  });

  it("rebuilds twice on the way over from youtube", () => {
    const { rerender } = renderVideo(youtubeProps);

    env.play.mockClear();
    rerender(customProps);

    // The re-init effect and the type-change effect both run in the same commit, each building a
    // player of its own.
    expect(env.play).toHaveBeenCalledTimes(2);
  });

  it("leaves the video alone when the component goes away", () => {
    const { container, unmount } = renderVideo(customProps);
    const video = videoElement(container);

    env.pause.mockClear();
    unmount();

    // The "destroy" effect runs on mount, not on unmount, so nothing tears the player down.
    expect(env.pause).not.toHaveBeenCalled();
    expect(video.currentTime).toBe(10);
  });
});
