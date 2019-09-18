import { capitalize, capByPrefix } from "visual/utils/string";
import * as onChanges from "visual/utils/onChange";
import { defaultValueKey, defaultValueValue } from "./device";

// Pornim toate onchanges care e nevoie la un anumit toolbar
export function saveOnChanges(values) {
  return values.onChange.reduce((acc, currentOnChange) => {
    const result = onChanges[currentOnChange](values);

    return Object.assign(acc, result);
  }, {});
}

// Slider DragEndEnd are sens doar daca este valoarea TEMP // Margin, Padding nu au nevoie // BorderWidth si BorderCorner are nevoie
// Temp value are sens pentru cazul cind exista interactiune intre 2 valori gen Brder Width si Border Radius chiar daca Border Radius poate sa fie si 0
// Temp Poate sa fie 0 pentru Border Radius din motiv ca el interactioneaza cu Border Width

/**
 * ### OUTPUT EXAMPLE
 *
 * margin,
 * marginTop: margin,
 * marginRight: margin,
 * marginBottom: margin,
 * marginLeft: margin
 */
/**
 * ### OUTPUT EXAMPLE
 *
 * borderRadius,
 * borderTopLeftRadius: borderRadius,
 * borderTopRightRadius: borderRadius,
 * borderBottomLeftRadius: borderRadius,
 * borderBottomRightRadius: borderRadius,
 *
 * // Nu e nevoie de sliderDragEnd pentry ca Radius accepta valoarea 0
 * // SliderDragEnd e folositor doar pentru cazul cind temp ii mai mare de > 0 ca la Border Width
 *
 * tempBorderRadius: borderRadius
 * tempBorderTopLeftRadius: borderTopLeftRadius,
 * tempBorderTopRightRadius: borderTopRightRadius,
 * tempBorderBottomRightRadius: borderBottomRightRadius,
 * tempBorderBottomLeftRadius: borderBottomLeftRadius,
 */
/**
 * ### OUTPUT EXAMPLE
 *
 * borderWidth: borderWidth,
 * borderTopWidth: borderWidth,
 * borderRightWidth: borderWidth,
 * borderBottomWidth: borderWidth,
 * borderLeftWidth: borderWidth,
 *
 * tempBorderWidth: sliderDragEnd
 *  borderWidth > 0 && sliderDragEnd
 *    ? borderWidth
 *    : v.tempBorderWidth,
 *
 * tempBorderTopWidth:
 *  borderWidth > 0 && sliderDragEnd
 *    ? borderWidth
 *    : v.tempBorderTopWidth,
 *
 * tempBorderRightWidth:
 *  borderWidth > 0 && sliderDragEnd
 *    ? borderWidth
 *    : v.tempBorderRightWidth,
 *
 * tempBorderBottomWidth:
 *  borderWidth > 0 && sliderDragEnd
 *    ? borderWidth
 *      : v.tempBorderBottomWidth,
 *
 * tempBorderLeftWidth:
 *  borderWidth > 0 && sliderDragEnd
 *    ? borderWidth
 *    : v.tempBorderLeftWidth,
 */
export function onChangeGroupedAndUngroupedByGrouped({
  v,
  device,
  state,
  parent,
  childs,
  value,
  sliderDragEnd = true,
  temp = false,
  tempZero = false
}) {
  const r = {
    /**
     * ### OUTPUT EXAMPLE
     *
     * margin,
     * marginTop: margin,
     * marginRight: margin,
     * marginBottom: margin,
     * marginLeft: margin
     */
    [defaultValueKey({ key: parent, device, state })]: value,
    ...childs.reduce((acc, p) => {
      acc[defaultValueKey({ key: p, device, state })] = value;
      return acc;
    }, {})
  };

  const tempr =
    temp && !tempZero
      ? {
          /**
           * ### OUTPUT EXAMPLE
           *
           * tempBorderWidth: sliderDragEnd
           *  borderWidth > 0 && sliderDragEnd
           *    ? borderWidth
           *    : v.tempBorderWidth,
           *
           * tempBorderTopWidth:
           *  borderWidth > 0 && sliderDragEnd
           *    ? borderWidth
           *    : v.tempBorderTopWidth,
           *
           * tempBorderRightWidth:
           *  borderWidth > 0 && sliderDragEnd
           *    ? borderWidth
           *    : v.tempBorderRightWidth,
           *
           * tempBorderBottomWidth:
           *  borderWidth > 0 && sliderDragEnd
           *    ? borderWidth
           *      : v.tempBorderBottomWidth,
           *
           * tempBorderLeftWidth:
           *  borderWidth > 0 && sliderDragEnd
           *    ? borderWidth
           *    : v.tempBorderLeftWidth,
           */
          [defaultValueKey({
            key: `temp${capitalize(parent)}`,
            device,
            state
          })]:
            value > 0 && sliderDragEnd
              ? value
              : defaultValueValue({
                  v,
                  key: `temp${capitalize(parent)}`,
                  device,
                  state
                }),
          ...childs.reduce((acc, p) => {
            acc[
              defaultValueKey({
                key: `temp${capitalize(p)}`,
                device,
                state
              })
            ] =
              value > 0 && sliderDragEnd
                ? value
                : defaultValueValue({
                    v,
                    key: `temp${capitalize(p)}`,
                    device,
                    state
                  });
            return acc;
          }, {})
        }
      : temp
      ? {
          /**
           * ### OUTPUT EXAMPLE
           *
           * tempBorderRadius: borderRadius
           * tempBorderTopLeftRadius: borderTopLeftRadius,
           * tempBorderTopRightRadius: borderTopRightRadius,
           * tempBorderBottomRightRadius: borderBottomRightRadius,
           * tempBorderBottomLeftRadius: borderBottomLeftRadius,
           */
          [defaultValueKey({
            key: `temp${capitalize(parent)}`,
            device,
            state
          })]: value,
          ...childs.reduce((acc, p) => {
            acc[
              defaultValueKey({
                key: `temp${capitalize(p)}`,
                device,
                state
              })
            ] = value;
            return acc;
          }, {})
        }
      : {};

  return Object.assign(r, tempr);
}

/**
 * ### OUTPUT EXAMPLE
 *
 * borderRadius:
 *  borderTopLeftRadius === v.borderTopRightRadius &&
 *  borderTopLeftRadius === v.borderBottomRightRadius &&
 *  borderTopLeftRadius === v.borderBottomLeftRadius
 *    ? borderTopLeftRadius
 *    : borderTopLeftRadius > 0
 *      ? v.tempBorderRadius
 *      : v.borderRadius,
 *
 * tempBorderRadius:
 *  borderTopLeftRadius === v.borderTopRightRadius &&
 *  borderTopLeftRadius === v.borderBottomRightRadius &&
 *  borderTopLeftRadius === v.borderBottomLeftRadius
 *    ? borderTopLeftRadius
 *    : v.borderRadius,
 */
export function onChangeGroupedByUngrouped({
  v,
  device,
  state,
  parent,
  childs,
  current,
  value,
  temp = false,
  tempZero = false
}) {
  const p = childs.filter(p => p !== current).every(z => v[z] === value)
    ? value
    : defaultValueValue({
        v,
        key: parent,
        device,
        state
      });

  const t = childs.filter(p => p !== current).every(z => v[z] === value)
    ? value
    : value > 0
    ? defaultValueValue({
        v,
        key: `temp${capitalize(parent)}`,
        device,
        state
      })
    : defaultValueValue({
        v,
        key: parent,
        device,
        state
      });

  return temp && tempZero
    ? {
        [defaultValueKey({ key: parent, device, state })]: p,
        [defaultValueKey({
          key: `temp${capitalize(parent)}`,
          device,
          state
        })]: t
      }
    : { [defaultValueKey({ key: parent, device, state })]: p };
}

/**
 * ### OUTPUT EXAMPLE
 *
 * borderTopLeftRadius: borderTopLeftRadius,
 *
 * tempBorderTopLeftRadius: borderTopLeftRadius,
 */
export function onChangeUngroupedByUngrouped({
  v,
  device,
  state,
  childs,
  current,
  value,
  temp = false
}) {
  return temp
    ? /**
       * ### OUTPUT EXAMPLE
       *
       * borderTopLeftRadius: borderTopLeftRadius,
       *
       * tempBorderTopLeftRadius: borderTopLeftRadius,
       */
      {
        [defaultValueKey({ key: current, device, state })]: value,
        [defaultValueKey({
          key: `temp${capitalize(current)}`,
          device,
          state
        })]: value,
        ...childs
          .filter(p => p !== current)
          .reduce((acc, p) => {
            acc[
              defaultValueKey({ key: `temp${capitalize(p)}`, device, state })
            ] =
              v[p] === 0
                ? 0
                : defaultValueValue({
                    v,
                    key: `temp${capitalize(p)}`,
                    device,
                    state
                  });
            return acc;
          }, {})
      }
    : /**
       * ### OUTPUT EXAMPLE
       *
       * marginTop
       * */
      { [defaultValueKey({ key: current, device, state })]: value };
}

export function onChangeDependeciesGrouped({
  v,
  device = "desktop",
  state = "normal",
  value,
  dependencies
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const r = Object.entries(dependencies).reduce((arr, [key, params]) => {
    const paramsNullValue =
      (value === 0 || value === "") &&
      typeof params.nullValue !== "undefined" &&
      ((params.nullValue.length > 0 &&
        params.nullValue.every(p => v[p] === "" || v[p] === 0)) ||
        params.nullValue.length === 0)
        ? true
        : false;

    const paramsTempValue =
      value !== 0 &&
      value !== "" &&
      (dvv(key) === 0 || // Asta e corect din cauza nu trebuie onchange sa schimbe valorile care lea pus userul manual. Ele pot fi gresite dar nu conteaza ele sunt puse manual. Daca temp e gresit aici apar multe probleme.
        dvv(key) === "" ||
        dvv("boxShadow") === "off") &&
      ((params.tempValue.length > 0 &&
        params.tempValue.every(p => v[p] === "" || v[p] === 0)) ||
        params.tempValue.length === 0)
        ? true
        : false;

    // Asta e corect pentru ca el filtreze sa nu ajunge null si undefined in model dar trebuei de ce ele ajug in general
    const bool = dvv(key) === null || dvv(key) === undefined;

    if (bool) {
      console.log("onChange " + key + " " + dvv(key));
    }

    bool
      ? arr
      : (arr[dvk(key)] = paramsNullValue
          ? params.type === "string"
            ? ""
            : 0
          : paramsTempValue
          ? dvv(`temp${capitalize(key)}`)
          : dvv(key));

    Object.assign(
      arr,
      params.childs.reduce((arr, child) => {
        v[defaultValueKey({ key: child, device, state })] === null ||
        v[defaultValueKey({ key: child, device, state })] === undefined
          ? arr
          : (arr[defaultValueKey({ key: child, device, state })] =
              (value === 0 || value === "") &&
              typeof params.nullValue !== "undefined" &&
              ((params.nullValue.length > 0 &&
                params.nullValue.every(p => v[p] === "" || v[p] === 0)) ||
                params.nullValue.length === 0)
                ? params.type === "string"
                  ? ""
                  : 0
                : /**
                 * Daca Border Color > 0 && tempBorderWidthChils === 0 => BorderWidthChils = TempBorderWidth
                 */
                (value > 0 || value !== "") &&
                  params.childs.every(
                    p =>
                      defaultValueValue({
                        v,
                        key: `temp${capitalize(p)}`,
                        device,
                        state
                      }) === 0
                  )
                ? defaultValueValue({
                    v,
                    key: `temp${capitalize(key)}`,
                    device,
                    state
                  })
                : (value > 0 || value !== "") &&
                  ((params.tempValue.length > 0 &&
                    params.tempValue.every(p => v[p] === "" || v[p] === 0)) ||
                    params.tempValue.length === 0)
                ? defaultValueValue({
                    v,
                    key: `temp${capitalize(child)}`,
                    device,
                    state
                  })
                : defaultValueValue({ v, key: child, device, state }));

        return arr;
      }, {}),
      params.childs.reduce((arr, child) => {
        v[
          defaultValueKey({ key: `temp${capitalize(child)}`, device, state })
        ] === null ||
        v[
          defaultValueKey({ key: `temp${capitalize(child)}`, device, state })
        ] === undefined
          ? arr
          : (arr[
              defaultValueKey({
                key: `temp${capitalize(child)}`,
                device,
                state
              })
            ] =
              /**
               * Daca Border Color > 0 && BorderWidthChils === 0 => BorderWidthChils = TempBorderWidth
               */
              (value > 0 || value !== "") &&
              params.childs.every(
                p =>
                  defaultValueValue({
                    v,
                    key: `temp${capitalize(p)}`,
                    device,
                    state
                  }) === 0
              )
                ? defaultValueValue({
                    v,
                    key,
                    device,
                    state
                  })
                : defaultValueValue({
                    v,
                    key: `temp${capitalize(child)}`,
                    device,
                    state
                  }));

        return arr;
      }, {})
    );

    return arr;
  }, {});

  return r;
}

export function onChangeDependeciesGrouped2({
  v,
  device = "desktop",
  state = "normal",
  value,
  dependencies
}) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });

  const r = dependencies.reduce((arr, item) => {
    arr[dvk(item)] =
      value === 0 || value === ""
        ? isNaN(dvv(item))
          ? ""
          : 0
        : dvv(capByPrefix("temp", capitalize(item)));

    return arr;
  }, {});

  return r;
}

/**
 * ### OUTPUT EXAMPLE
 *
 * borderColorOpacity:
 *   value === 0
 *     ? 0
 *     : value > 0
 *       ? v.tempBorderColorOpacity
 *       : v.borderColorOpacity,
 */
export function onChangeDependeciesUngrouped({
  v,
  device,
  state,
  childs,
  current,
  value,
  dependencies
}) {
  return Object.entries(dependencies).reduce((arr, [key, params]) => {
    v[key] === null
      ? arr
      : (arr[defaultValueKey({ key, device, state })] =
          /**
           * ### OUTPUT EXAMPLE
           *
           * dependencies: {
           *  borderColorOpacity: {
           *    childs: [],
           *    nullValue: [],
           *    tempValue: []
           *  }
           * },
           *
           * value === 0 && typeof params.nullValue !== "undefined" && params.nullValue === ""
           *
           * borderColorOpacity:
           *   value === 0
           *     ? 0
           *     : value > 0
           *       ? v.tempBorderColorOpacity
           *       : v.borderColorOpacity,
           */
          (value === 0 || value === "") &&
          ((childs.length > 0 &&
            childs.filter(p => p !== current).every(z => v[z] === 0)) ||
            childs.length === 0) &&
          typeof params.nullValue !== "undefined" &&
          ((params.nullValue.length > 0 &&
            params.nullValue.every(p => v[p] === "" || v[p] === 0)) ||
            params.nullValue.length === 0)
            ? params.type === "string"
              ? ""
              : 0
            : /**
             * ### OUTPUT EXAMPLE
             *
             * dependencies: {
             *  borderRadius: {
             *    childs: [
             *      "borderTopLeftRadius",
             *      "borderTopRightRadius",
             *      "borderBottomLeftRadius",
             *      "borderBottomRightRadius"
             *    ],
             *    nullValue: "bgColorOpacity",
             *    tempValue: ""
             *  },
             *
             * borderRadius:
             *  [...]
             *    ? [...]
             *    : value > 0
             *      ? v.tempBorderRadius
             *      : v.borderRadius,
             */
            (value > 0 || value !== "") &&
              ((params.tempValue.length > 0 &&
                params.tempValue.every(p => v[p] === "" || v[p] === 0)) ||
                params.tempValue.length === 0)
            ? defaultValueValue({
                v,
                key: `temp${capitalize(key)}`,
                device,
                state
              })
            : defaultValueValue({
                v,
                key,
                device,
                state
              }));

    Object.assign(
      arr,
      params.childs.reduce((arr, child) => {
        v[child] === null
          ? arr
          : (arr[defaultValueKey({ key: child, device, state })] =
              (value === 0 || value === "") &&
              ((childs.length > 0 &&
                childs.filter(p => p !== current).every(z => v[z] === 0)) ||
                childs.length === 0) &&
              ((params.nullValue.length > 0 &&
                params.nullValue.every(p => v[p] === "" || v[p] === 0)) ||
                params.nullValue.length === 0)
                ? params.type === "string"
                  ? ""
                  : 0
                : /**
                 * Daca Border Top Width > 0 => BorderRadiusChils = TempBorderRadiusChilds
                 */
                (value > 0 || value !== "") && params.tempValue.length === 0
                ? defaultValueValue({
                    v,
                    key: `temp${capitalize(child)}`,
                    device,
                    state
                  })
                : defaultValueValue({
                    v,
                    key: child,
                    device,
                    state
                  }));

        return arr;
      }, {})
    );

    return arr;
  }, {});
}
