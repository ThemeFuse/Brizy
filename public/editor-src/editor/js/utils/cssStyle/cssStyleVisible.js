import {
  styleShowOnEditorFilter,
  styleShowOnEditorOpacity,
  styleShowOnPreview
} from "visual/utils/style2";

export function cssStyleVisible({ v, device, state }) {
  let r = "";

  if (IS_EDITOR) {
    const filter = styleShowOnEditorFilter({
      v,
      device,
      state
    });

    const opacity = styleShowOnEditorOpacity({
      v,
      device,
      state
    });

    r = filter !== "" ? `filter:${filter};opacity:${opacity};` : "";
  } else {
    const display = styleShowOnPreview({
      v,
      device,
      state
    });

    r = display === "none" ? `display:${display};` : "";
  }

  return r;
}

export function cssStyleVisibleEditorDisplayNoneOrFlex({
  v,
  device,
  state,
  mode = "editor"
}) {
  const filter = styleShowOnEditorFilter({
    v,
    device,
    state
  });

  return IS_EDITOR && mode === "editor" && filter !== ""
    ? "display:var(--elements-visibility, flex);"
    : "";
}

export function cssStyleVisibleEditorDisplayNoneOrInlineFlex({
  v,
  device,
  state,
  mode = "editor"
}) {
  const filter = styleShowOnEditorFilter({
    v,
    device,
    state
  });

  return IS_EDITOR && mode === "editor" && filter !== ""
    ? "display:var(--elements-visibility, inline-flex);"
    : "";
}

export function cssStyleVisibleEditorDisplayNoneOrBlock({
  v,
  device,
  state,
  mode = "editor"
}) {
  const filter = styleShowOnEditorFilter({
    v,
    device,
    state
  });

  return IS_EDITOR && mode === "editor" && filter !== ""
    ? "display:var(--elements-visibility, block);"
    : "";
}

export function cssStyleVisibleMode({ v, device, state, mode = "editor" }) {
  const visible = cssStyleVisible({ v, device, state });

  return (IS_EDITOR && mode === "editor") || (IS_PREVIEW && mode === "preview")
    ? visible
    : "";
}
function cssStyleShowMembership(v, display) {
  const { membership, membershipRoles } = v;
  const roles = JSON.parse(membershipRoles || "[]");

  if (membership === "off" || roles.length === 0) {
    return "";
  }

  const displayCss = `--role-default-${display}`;

  const cssRoles = roles
    .map(item => `, var(--role-${item}-${display}`)
    .join("");
  const closeParentheses = ")".repeat(roles.length + 1);

  return `display: var(${displayCss} ${cssRoles}, none${closeParentheses};`;
}

export function cssStyleShowMembershipBlock({ v }) {
  return cssStyleShowMembership(v, "block");
}

export function cssStyleShowMembershipFlex({ v }) {
  return cssStyleShowMembership(v, "flex");
}
