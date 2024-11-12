import React from "react";
import { getRenderType } from "visual/component/Editor/utils";
import Loadable from "@loadable/component";
import Config from "visual/global/Config";

const LoadablePopup = Loadable(async () => {
  const { Popup } = await import("./View/Popup");
  return Popup;
});

const LoadableStory = Loadable(async () => {
  const { Story } = await import("./View/Story");
  return Story;
});

const LoadablePage = Loadable(async () => {
  const { Page } = await import("./View/Page");
  return Page;
});

const View = () => {
  const type = getRenderType(Config.getAll());

  switch (type) {
    case "popup": {
      return <LoadablePopup />;
    }
    case "story": {
      return <LoadableStory />;
    }
    case "basic": {
      return <LoadablePage />;
    }
  }
};

export default View;
