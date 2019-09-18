import classnames from "classnames";
import { css } from "glamor";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import {
  styleBgGradient,
  styleBorderColor,
  styleColor,
  styleBgColor,
  styleBoxShadow,
  styleHoverTransition,
  styleHoverTransitionProperty
} from "visual/utils/style";

const getIconStrokeWidth = (v, iconSize) => {
  const { type } = v;

  return type === "outline" && iconSize <= 24
    ? 1
    : type === "outline" && iconSize > 24 && iconSize <= 32
    ? 1.1
    : type === "outline" && iconSize > 32 && iconSize <= 48
    ? 1.4
    : type === "outline" && iconSize > 48 && iconSize <= 64
    ? 2.3
    : type === "outline" && iconSize > 64
    ? 3
    : 0;
};

export function styleClassName(v) {
  const { className } = v;
  let glamorObj;

  if (IS_EDITOR) {
    glamorObj = {
      ".brz &": {
        color: "var(--color)",
        borderColor: "var(--borderColor)",
        backgroundColor: "var(--backgroundColor)",
        backgroundImage: "var(--backgroundGradient)",
        borderWidth: "var(--borderWidth)",
        borderStyle: "var(--borderStyle)",
        boxShadow: "var(--boxShadow)",

        transition: "var(--hoverTransition)",
        transitionProperty: "var(--hoverTransitionProperty)"
      },
      ".brz &:hover": {
        color: "var(--hoverColor)",
        borderColor: "var(--hoverBorderColor)",
        backgroundColor: "var(--hoverBgColor)",
        backgroundImage: "var(--hoverBackgroundGradient)"
      },
      ".brz-ed--desktop &": {
        width: "var(--width)",
        height: "var(--height)",
        fontSize: "var(--fontSize)",
        padding: "var(--padding)",
        borderRadius: "var(--borderRadius)",
        strokeWidth: "var(--strokeWidth)",

        transition: "var(--hoverTransition)",
        transitionProperty: "var(--hoverTransitionProperty)",

        ":hover": {
          boxShadow: "var(--hoverBoxShadow)"
        }
      },
      ".brz-ed--tablet &": {
        width: "var(--tabletWidth)",
        height: "var(--tabletHeight)",
        fontSize: "var(--tabletFontSize)",
        padding: "var(--tabletPadding)",
        borderRadius: "var(--tabletBorderRadius)",
        strokeWidth: "var(--tabletStrokeWidth)"
      },
      ".brz-ed--mobile &": {
        width: "var(--mobileWidth)",
        height: "var(--mobileHeight)",
        fontSize: "var(--mobileFontSize)",
        padding: "var(--mobilePadding)",
        borderRadius: "var(--mobileBorderRadius)",
        strokeWidth: "var(--mobileStrokeWidth)"
      }
    };
  } else {
    const { borderWidth, borderStyle, customSize, padding, borderRadius } = v;

    // Tablet
    const tabletCustomSize = tabletSyncOnChange(v, "customSize");
    const tabletPadding =
      v.fillType !== "default" ? tabletSyncOnChange(v, "padding") : 0;

    const maxTabletBorderRadius = Math.round(
      (tabletCustomSize + tabletPadding * 2 + v.tempBorderWidth * 2) / 2
    );

    const tabletBorderRadius =
      v.fillType === "default"
        ? 0
        : v.fillType !== "default" && v.tempBorderRadiusType === "rounded"
        ? maxTabletBorderRadius
        : Math.round(
            (v.borderRadius /
              Math.round(v.customSize + v.padding * 2 + v.borderWidth * 2)) *
              Math.round(
                tabletCustomSize + tabletPadding * 2 + v.borderWidth * 2
              )
          );

    // Mobile
    const mobileCustomSize = mobileSyncOnChange(v, "customSize");
    const mobilePadding =
      v.fillType !== "default" ? mobileSyncOnChange(v, "padding") : 0;

    const maxMobileBorderRadius = Math.round(
      (mobileCustomSize + mobilePadding * 2 + v.tempBorderWidth * 2) / 2
    );

    const mobileBorderRadius =
      v.fillType === "default"
        ? 0
        : v.fillType !== "default" && v.tempBorderRadiusType === "rounded"
        ? maxMobileBorderRadius
        : Math.round(
            (v.borderRadius /
              Math.round(v.customSize + v.padding * 2 + v.borderWidth * 2)) *
              Math.round(
                mobileCustomSize + mobilePadding * 2 + v.borderWidth * 2
              )
          );

    const iconSize = Math.round(customSize + padding * 2 + borderWidth * 2);
    const tabletIconSize = Math.round(
      tabletCustomSize + tabletPadding * 2 + borderWidth * 2
    );
    const mobileIconSize = Math.round(
      mobileCustomSize + mobilePadding * 2 + borderWidth * 2
    );
    const strokeWidth = getIconStrokeWidth(v, customSize);
    const tabletStrokeWidth = getIconStrokeWidth(v, tabletCustomSize);
    const mobileStrokeWidth = getIconStrokeWidth(v, mobileCustomSize);

    glamorObj = {
      ".brz &": {
        color: styleColor({ v, device: "desktop", state: "normal" }),
        borderColor: styleBorderColor({
          v,
          device: "desktop",
          state: "normal"
        }),
        backgroundColor: styleBgColor({
          v,
          device: "desktop",
          state: "normal"
        }),
        backgroundImage: styleBgGradient({
          v,
          device: "desktop",
          state: "normal"
        }),
        borderWidth,
        borderStyle,
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        fontSize: `${customSize}px`,
        padding: `${padding}px`,
        borderRadius,
        strokeWidth,
        boxShadow: styleBoxShadow({ v, device: "desktop", state: "normal" }),

        transition: styleHoverTransition({ v }),
        transitionProperty: styleHoverTransitionProperty()
      },

      "@media (min-width: 991px)": {
        ".brz &:hover": {
          color: styleColor({ v, device: "desktop", state: "hover" }),
          borderColor: styleBorderColor({
            v,
            device: "desktop",
            state: "hover"
          }),
          backgroundColor: styleBgColor({
            v,
            device: "desktop",
            state: "hover"
          }),
          backgroundImage: styleBgGradient({
            v,
            device: "desktop",
            state: "hover"
          }),
          boxShadow: styleBoxShadow({ v, device: "desktop", state: "hover" })
        }
      },

      "@media (max-width: 991px)": {
        ".brz &": {
          width: `${tabletIconSize}px`,
          height: `${tabletIconSize}px`,
          fontSize: `${tabletCustomSize}px`,
          padding: `${tabletPadding}px`,
          borderRadius: `${tabletBorderRadius}px`,
          strokeWidth: tabletStrokeWidth
        }
      },

      "@media (max-width: 767px)": {
        ".brz &": {
          width: `${mobileIconSize}px`,
          height: `${mobileIconSize}px`,
          fontSize: `${mobileCustomSize}px`,
          padding: `${mobilePadding}px`,
          borderRadius: `${mobileBorderRadius}px`,
          strokeWidth: mobileStrokeWidth
        }
      }
    };
  }

  const glamorClassName = String(css(glamorObj));

  return classnames("brz-span brz-icon", glamorClassName, className);
}

export function styleCSSVars(v) {
  if (IS_PREVIEW) return;

  const { borderWidth, borderStyle, customSize, padding, borderRadius } = v;

  // Tablet
  const tabletCustomSize = tabletSyncOnChange(v, "customSize");
  const tabletPadding =
    v.fillType !== "default" ? tabletSyncOnChange(v, "padding") : 0;

  const maxTabletBorderRadius = Math.round(
    (tabletCustomSize + tabletPadding * 2 + v.tempBorderWidth * 2) / 2
  );

  const tabletBorderRadius =
    v.fillType === "default"
      ? 0
      : v.fillType !== "default" && v.tempBorderRadiusType === "rounded"
      ? maxTabletBorderRadius
      : Math.round(
          (v.borderRadius /
            Math.round(v.customSize + v.padding * 2 + v.borderWidth * 2)) *
            Math.round(tabletCustomSize + tabletPadding * 2 + v.borderWidth * 2)
        );

  // Mobile
  const mobileCustomSize = mobileSyncOnChange(v, "customSize");
  const mobilePadding =
    v.fillType !== "default" ? mobileSyncOnChange(v, "padding") : 0;

  const maxMobileBorderRadius = Math.round(
    (mobileCustomSize + mobilePadding * 2 + v.tempBorderWidth * 2) / 2
  );

  const mobileBorderRadius =
    v.fillType === "default"
      ? 0
      : v.fillType !== "default" && v.tempBorderRadiusType === "rounded"
      ? maxMobileBorderRadius
      : Math.round(
          (v.borderRadius /
            Math.round(v.customSize + v.padding * 2 + v.borderWidth * 2)) *
            Math.round(mobileCustomSize + mobilePadding * 2 + v.borderWidth * 2)
        );

  const iconSize = Math.round(customSize + padding * 2 + borderWidth * 2);
  const tabletIconSize = Math.round(
    tabletCustomSize + tabletPadding * 2 + borderWidth * 2
  );
  const mobileIconSize = Math.round(
    mobileCustomSize + mobilePadding * 2 + borderWidth * 2
  );

  const strokeWidth = getIconStrokeWidth(v, customSize);
  const tabletStrokeWidth = getIconStrokeWidth(v, tabletCustomSize);
  const mobileStrokeWidth = getIconStrokeWidth(v, mobileCustomSize);

  return {
    "--color": styleColor({ v, device: "desktop", state: "normal" }),
    "--borderColor": styleBorderColor({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--backgroundColor": styleBgColor({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--backgroundGradient": styleBgGradient({
      v,
      device: "desktop",
      state: "normal"
    }),
    "--borderWidth": `${borderWidth}px`,
    "--borderStyle": borderStyle,
    "--hoverColor": styleColor({ v, device: "desktop", state: "hover" }),
    "--hoverBorderColor": styleBorderColor({
      v,
      device: "desktop",
      state: "hover"
    }),
    "--hoverBgColor": styleBgColor({
      v,
      device: "desktop",
      state: "hover"
    }),
    "--hoverBackgroundGradient": styleBgGradient({
      v,
      device: "desktop",
      state: "hover"
    }),

    // Hover Transition
    "--hoverTransition": styleHoverTransition({ v }),
    "--hoverTransitionProperty": styleHoverTransitionProperty({ v }),

    "--width": `${iconSize}px`,
    "--height": `${iconSize}px`,
    "--fontSize": `${customSize}px`,
    "--padding": `${padding}px`,
    "--borderRadius": `${borderRadius}px`,
    "--strokeWidth": strokeWidth,
    "--boxShadow": styleBoxShadow({ v, device: "desktop", state: "normal" }),

    "--hoverBoxShadow": styleBoxShadow({
      v,
      device: "desktop",
      state: "hover"
    }),

    // Hover Transition
    "--hoverTransition": styleHoverTransition({ v }),
    "--hoverTransitionProperty": styleHoverTransitionProperty({ v }),

    //Tablet
    "--tabletWidth": `${tabletIconSize}px`,
    "--tabletHeight": `${tabletIconSize}px`,
    "--tabletFontSize": `${tabletCustomSize}px`,
    "--tabletPadding": `${tabletPadding}px`,
    "--tabletBorderRadius": `${tabletBorderRadius}px`,
    "--tabletStrokeWidth": tabletStrokeWidth,

    // Mobile
    "--mobileWidth": `${mobileIconSize}px`,
    "--mobileHeight": `${mobileIconSize}px`,
    "--mobileFontSize": `${mobileCustomSize}px`,
    "--mobilePadding": `${mobilePadding}px`,
    "--mobileBorderRadius": `${mobileBorderRadius}px`,
    "--mobileStrokeWidth": mobileStrokeWidth
  };
}
