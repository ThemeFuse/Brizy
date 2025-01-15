import { isEditor, isView } from "visual/providers/RenderProvider";
import {
  styleShowOnEditorFilter,
  styleShowOnEditorOpacity,
  styleShowOnPreview
} from "visual/utils/style2";

export function cssStyleVisible({ v, device, state, renderContext }) {
  let r = "";

  if (isEditor(renderContext)) {
    const filter = styleShowOnEditorFilter({
      v,
      device,
      state,
      renderContext
    });

    const opacity = styleShowOnEditorOpacity({
      v,
      device,
      state,
      renderContext
    });

    r = filter !== "" ? `filter:${filter};opacity:${opacity};` : "";
  } else {
    const display = styleShowOnPreview({
      v,
      device,
      state,
      renderContext
    });

    r = display === "none" ? `display:${display};` : "";
  }

  return r;
}

export function cssStyleVisibleEditorDisplayNoneOrFlex({
  v,
  device,
  state,
  renderContext,
  mode = "editor"
}) {
  const filter = styleShowOnEditorFilter({
    v,
    device,
    state,
    renderContext
  });

  return isEditor(renderContext) && mode === "editor" && filter !== ""
    ? "display:var(--elements-visibility, flex);"
    : "";
}

export function cssStyleVisibleEditorDisplayNoneOrBlock({
  v,
  device,
  state,
  mode = "editor",
  renderContext
}) {
  const filter = styleShowOnEditorFilter({
    v,
    device,
    state,
    renderContext
  });

  return isEditor(renderContext) && mode === "editor" && filter !== ""
    ? "display:var(--elements-visibility, block);"
    : "";
}

export function cssStyleVisibleMode({
  v,
  device,
  state,
  renderContext,
  mode = "editor"
}) {
  const visible = cssStyleVisible({ v, device, state, renderContext });

  return (isEditor(renderContext) && mode === "editor") ||
    (isView(renderContext) && mode === "preview")
    ? visible
    : "";
}
