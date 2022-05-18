import React, { ReactNode } from "react";
import EditorComponent, {
  ComponentsMeta
} from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import defaultValue from "./defaultValue.json";
import {
  ActiveFilters,
  CheckboxFilters,
  CheckrangeFilters,
  RadioFilters,
  SelectFilters
} from "./types/index";
import toolbarConfigFn from "./toolbar";
import Items from "./items";
import { ElementModel } from "visual/component/Elements/Types";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";

type Value = ElementModel & {
  checkLabel: string;
  checkValue: string;
  selectPlaceholder: string;
  checkSelectValue: string;
  selectDataSource: string;
  checkRangeLabel: string;
  checkRangeMin: string;
  checkRangeMax: string;
  bgImageSrc: string;
};

type Props = {
  meta: ComponentsMeta;
  filterType: string;
  showCounter: string;
  checkboxType: "style-1" | "style-2" | "style-3" | "style-4";
  activeStyle: "style-1" | "style-2";
  dataSource: string;
  toolbarIcon: PortalToolbarProps;
  name: string;
  toolbarSelectOption: PortalToolbarProps;
};

export default class FiltersItem extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "FiltersItem";
  }

  static defaultValue = defaultValue;

  handleSelectPlaceholderChange = (selectPlaceholder: string): void => {
    this.patchValue({ selectPlaceholder });
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      checkLabel,
      checkValue,
      selectPlaceholder,
      checkSelectValue,
      selectDataSource,
      checkRangeLabel,
      checkRangeMin,
      checkRangeMax,
      bgImageSrc
    } = v;

    const {
      filterType,
      showCounter,
      checkboxType,
      activeStyle,
      dataSource,
      toolbarIcon,
      name,
      toolbarSelectOption,
      meta
    } = this.props;

    const classNames = classnames(
      `brz-filters__option brz-filters__option--${checkboxType}`,
      css(
        (this.constructor as typeof EditorComponent).componentId,
        this.getId(),
        style(v, vs, vd)
      )
    );

    const toolbars = toolbarConfigFn({
      filterType,
      checkboxType,
      dataSource
    });

    // @ts-expect-error: Property 'toolbar' is missing in type....
    const toolbarExtend = this.makeToolbarPropsFromConfig2(toolbars);

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: { meta },
      toolbarExtend: toolbarSelectOption
    });

    const itemId = this.getId();

    return (
      <>
        {filterType === "active" && (
          <ActiveFilters
            toolbarConfig={toolbarExtend}
            style={activeStyle}
            toolbarConfigIcon={toolbarIcon}
          />
        )}
        {filterType === "checkbox" && (
          <CheckboxFilters
            showCounter={showCounter}
            checkboxType={checkboxType}
            toolbarConfig={toolbarExtend}
            label={checkLabel}
            value={checkValue}
            selectValue={checkSelectValue}
            className={classNames}
            toolbarConfigIcon={toolbarIcon}
            showPlaceholder={bgImageSrc ? false : true}
          />
        )}
        {filterType === "checkrange" && (
          <CheckrangeFilters
            showCounter={showCounter}
            checkboxType={checkboxType}
            toolbarConfig={toolbarExtend}
            label={checkRangeLabel}
            className={classNames}
            toolbarConfigIcon={toolbarIcon}
            min={checkRangeMin}
            max={checkRangeMax}
          />
        )}
        {filterType === "radio" && (
          <RadioFilters
            showCounter={showCounter}
            checkboxType={checkboxType}
            toolbarConfig={toolbarExtend}
            label={checkLabel}
            value={checkValue}
            selectValue={checkSelectValue}
            className={classNames}
            toolbarConfigIcon={toolbarIcon}
            name={name}
            showPlaceholder={!bgImageSrc}
          />
        )}
        {filterType === "select" && (
          <>
            {
              <SelectFilters
                id={itemId}
                toolbar={toolbarExtend}
                toolbarSelectOption={toolbarSelectOption}
                text={selectPlaceholder}
                dataSource={selectDataSource}
                classNames={classNames}
                handleTextChange={this.handleSelectPlaceholderChange}
              >
                {
                  // @ts-expect-error: need review when EditorArrayComponent converted to TS
                  <Items {...itemsProps} />
                }
              </SelectFilters>
            }
          </>
        )}
      </>
    );
  }
}
