import { onChangeDependeciesGrouped } from "./onChange";
import { defaultValueValue, defaultValueKey } from "./device";

export function onChangeBgImage({
  device,
  state,
  width,
  height,
  src,
  x,
  y,
  population,
  isChanged
}) {
  return isChanged === "image"
    ? {
        [defaultValueKey({ key: "bgImageWidth", device, state })]: width,
        [defaultValueKey({ key: "bgImageHeight", device, state })]: height,
        [defaultValueKey({ key: "bgImageSrc", device, state })]: src
      }
    : isChanged === "population"
    ? { [defaultValueKey({ key: "bgPopulation", device, state })]: population }
    : {
        [defaultValueKey({ key: "bgPositionX", device, state })]: x,
        [defaultValueKey({ key: "bgPositionY", device, state })]: y
      };
}

export function onChangeBgImageBgOpacity({ v, device, state, src, isChanged }) {
  const bgColorOpacity =
    src !== "" &&
    defaultValueValue({ v, key: "bgColorOpacity", device, state }) === 1
      ? 0.9
      : defaultValueValue({ v, key: "bgColorOpacity", device, state });

  const tempBgColorOpacity =
    src !== "" &&
    defaultValueValue({ v, key: "bgColorOpacity", device, state }) === 1
      ? 0.9
      : defaultValueValue({ v, key: "tempBgColorOpacity", device, state });

  return isChanged === "image"
    ? {
        [defaultValueKey({
          key: "bgColorOpacity",
          device,
          state
        })]: bgColorOpacity,
        [defaultValueKey({
          key: "tempBgColorOpacity",
          device,
          state
        })]: tempBgColorOpacity
      }
    : {};
}

export function onChangeBgImageDependencies({ v, device, state, src }) {
  /**
   * borderRadius:
   *   bgImageSrc === 0 && v.borderColorOpacity === 0 && v.bgColorOpacity === ""
   *     ? 0
   *     : bgImageSrc > 0
   *       ? v.tempBorderRadius
   *       : v.borderRadius,
   *
   * borderTopLeftRadius:
   *   bgImageSrc === 0 && v.borderColorOpacity === 0 && v.bgColorOpacity === ""
   *     ? 0
   *     : bgImageSrc > 0
   *       ? v.tempBorderTopLeftRadius
   *       : v.borderTopLeftRadius,
   *
   * borderTopRightRadius:
   *   bgImageSrc === 0 && v.borderColorOpacity === 0 && v.bgColorOpacity === ""
   *     ? 0
   *     : bgImageSrc > 0
   *       ? v.tempBorderTopRightRadius
   *       : v.borderTopRightRadius,
   *
   * borderBottomRightRadius:
   *   bgImageSrc === 0 && v.borderColorOpacity === 0 && v.bgColorOpacity === ""
   *     ? 0
   *     : bgImageSrc > 0
   *       ? v.tempBorderBottomRightRadius
   *       : v.borderBottomRightRadius,
   *
   * borderBottomLeftRadius:
   *   bgImageSrc === 0 && v.borderColorOpacity === 0 && v.bgColorOpacity === ""
   *     ? 0
   *     : bgImageSrc > 0
   *       ? v.tempBorderBottomLeftRadius
   *       : v.borderBottomLeftRadius,
   */
  const dependencies = {
    borderRadius: {
      childs: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ],
      nullValue: ["bgColorOpacity", "borderColorOpacity"],
      tempValue: []
    }
  };

  return onChangeDependeciesGrouped({
    v,
    device,
    state,
    value: src,
    dependencies
  });
}

// ToDo.. Padding de aici nu lucreaza corect (lucreaza corect daca iai in calcul doar BG color, Border Color sau BG Image sar daca unesti citeva nu merge )
// Trebuei de facut ceva similar cu dependencies doar ca intre devices
// Codul asta trebuei de adaugat la bg color, border color, width, radius, bg image peste tot. Acum el e adaugat doar la BG image, color si Border color
export function onChangeBgImageColumnAndRowSyncMobile({
  v,
  device,
  state,
  src
}) {
  if (device === "desktop" || device === "mobile") {
    return {
      // Mobile
      // this 2 values are used for view the result of the bg color or image when you have a image in a column for example
      mobilePaddingRight: !src ? 0 : v.tempMobilePaddingRight,
      mobilePaddingLeft: !src ? 0 : v.tempMobilePaddingLeft
    };
  } else {
    return {};
  }
}
