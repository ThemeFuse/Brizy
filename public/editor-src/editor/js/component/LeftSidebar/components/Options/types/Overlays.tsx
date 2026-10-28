import classnames from "classnames";
import React, { type ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { useConfig } from "visual/providers/ConfigProvider";
import { updateUI } from "visual/redux/actions2";
import {
  currentOverlaySelector,
  overlayGlobalBlocksSelector
} from "visual/redux/selectors";
import type { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";

export interface Props {
  label: string;
  className?: string;
}

const NONE = "none";

const getWidgetTitles = (): Record<string, string> => ({
  [ElementTypes.CookieBanner]: t("Cookie Banner")
});

export const Overlays = (props: Props): ReactElement | null => {
  const currentOverlay = useSelector(currentOverlaySelector) ?? NONE;
  const dispatch = useDispatch();
  const config = useConfig();

  const { label, className: _className } = props;
  const className = classnames(
    "brz-ed-sidebar-bottom__option brz-ed-sidebar__wp-template",
    _className
  );

  // Condition-aware: only the overlay global blocks whose rules allow them on
  // the current page, i.e. exactly what GlobalBlocksOverlays can render.
  const overlays = useSelector((state: ReduxState) =>
    overlayGlobalBlocksSelector(state, config)
  );

  const renderOptions = useMemo(() => {
    const widgetTitles = getWidgetTitles();
    const overlayOptions = [
      { value: NONE, title: t("None") },
      ...overlays.map(({ uid, data }) => ({
        value: uid,
        title: widgetTitles[data.type] ?? data.type
      }))
    ];

    return overlayOptions.map((item) => (
      <SelectItem key={item.value} value={item.value}>
        {item.title}
      </SelectItem>
    ));
  }, [overlays]);

  const handleChangeOverlay = useCallback(
    (overlay: string) => {
      dispatch(updateUI("currentOverlay", overlay));
    },
    [dispatch]
  );

  // The option is only listed while an overlay qualifies (see
  // getPageSettings); this covers the last one vanishing while the popover
  // is open.
  if (overlays.length === 0) {
    return null;
  }

  // A previously selected overlay can stop qualifying (rules, deletion), in
  // which case nothing is rendered on canvas — show "None" instead of a value
  // missing from the list.
  const value = overlays.some(({ uid }) => uid === currentOverlay)
    ? currentOverlay
    : NONE;

  return (
    <div className={className}>
      <div className="brz-ed-option__label">{label}</div>
      <Select
        defaultValue={value}
        className="brz-control__select--dark"
        maxItems="6"
        itemHeight="30"
        onChange={handleChangeOverlay}
      >
        {renderOptions}
      </Select>
    </div>
  );
};
