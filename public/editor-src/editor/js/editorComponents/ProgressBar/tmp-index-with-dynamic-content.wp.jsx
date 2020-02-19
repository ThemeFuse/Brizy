import React from "react";
import { useDynamicContent } from "visual/component/DynamicContent";
import { get } from "visual/utils/object/get";
import { String } from "visual/utils/string/specs";
import ProgressBar from "./index.jsx";

export default class WPProgressBar extends ProgressBar {
  renderText(v) {
    const population = String.read(get("textPopulation", v));

    if (population) {
      return <WPProgressBarDC placeholder={population} />;
    }

    return super.renderText(v);
  }
}

function WPProgressBarDC({ placeholder }) {
  const { status, data } = useDynamicContent(placeholder);

  if (status === "waiting" || status === "rejected") {
    return <span className="brz-span brz-text__editor">{placeholder}</span>;
  }

  if (status === "resolved") {
    return <span className="brz-span brz-text__editor">{data}</span>;
  }
}
