import classnames from "classnames";
import React, { ReactNode } from "react";
import ContextMenu from "visual/component/ContextMenu";
import CheckboxControls from "visual/component/Controls/CheckGroup";
import RadioControls from "visual/component/Controls/Radio";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  ComponentsMeta
} from "visual/editorComponents/EditorComponent";
import {
  ButtonFilters,
  CheckboxFilters,
  DateFilters,
  RadioFilters,
  RangeFilters,
  RatingFilters,
  SearchFilters
} from "visual/editorComponents/Filters/FiltersItem/types";
import { css } from "visual/utils/cssStyle";
import { WithClassName } from "visual/utils/options/attributes";
import { Wrapper } from "../tools/Wrapper";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as sidebarButtonConfig from "./sidebarButton";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as sidebarIconConfig from "./sidebarIcon";
import * as sidebarSelectOptionConfig from "./sidebarSelectItem";
import { style } from "./styles";
import * as toolbarButtonConfig from "./toolbarButton";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarIconConfig from "./toolbarIcon";
import * as toolbarLabelConfig from "./toolbarLabel";
import * as toolbarSelectOptionConfig from "./toolbarSelectOption";
import * as toolbarTitleConfig from "./toolbarTitle";

type Value = ElementModel & {
  title: string;
  filterType: string;
  iconName: string;
  iconType: string;
  showCounter: string;
  checkboxType: "style-1" | "style-2" | "style-3" | "style-4";
  showApply: string;
  btnText: string;
  activeStyle: string;
  showLabel: string;
  showRangeText: string;
  starCount: number;
  hierarchical: string;
  dataSource: string;
  searchText: string;
  labelDateFrom: string;
  labelDateTo: string;
  rangeLabel: string;
  rangeMin: number;
  rangeMax: number;
  rangeStep: number;
  textDateFrom: string;
  textDateTo: string;
  dateType: string;
};

interface Props extends WithClassName {
  meta: ComponentsMeta;
}

class Filters extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "Filters";
  }

  static defaultValue = defaultValue;

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      // @ts-expect-error: Need transform toolbarExtendParent to ts
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${
          (this.constructor as typeof EditorComponent).componentId
        }_parent`
      }
    );

    this.props.extendParentToolbar(toolbarExtend);
  }

  handleTextChange = (title: string): void => {
    this.patchValue({ title });
  };

  handleBtnTextChange = (btnText: string): void => {
    this.patchValue({ btnText });
  };

  handleSearchTextChange = (searchText: string): void => {
    this.patchValue({ searchText });
  };

  handleLabelFromChange = (labelDateFrom: string): void => {
    this.patchValue({ labelDateFrom });
  };

  handleLabelToChange = (labelDateTo: string): void => {
    this.patchValue({ labelDateTo });
  };

  handleTextToChange = (textDateTo: string): void => {
    this.patchValue({ textDateTo });
  };

  handleTextFromChange = (textDateFrom: string): void => {
    this.patchValue({ textDateFrom });
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      title,
      filterType,
      iconName,
      iconType,
      showCounter,
      checkboxType,
      showApply,
      btnText,
      activeStyle,
      showLabel,
      showRangeText,
      starCount,
      hierarchical,
      dataSource,
      searchText,
      labelDateFrom,
      labelDateTo,
      rangeLabel,
      rangeMin,
      rangeMax,
      rangeStep,
      textDateFrom,
      textDateTo,
      dateType
    } = v;

    const dynamicContent = dataSource !== "manual";
    const checkStyle1 = checkboxType === "style-1";
    const checkStyle2 = checkboxType === "style-2";

    const name = this.getId();

    const className = classnames(
      "brz-filters",
      `brz-filters__${filterType}`,
      hierarchical === "on" && "brz-filters__hierarchical",
      css(
        (this.constructor as typeof EditorComponent).componentId,
        this.getId(),
        style(v, vs, vd)
      )
    );

    const classNameCheckbox = `brz-filters__checkbox brz-filters__checkbox--${checkboxType}`;
    const classNameRadio = `brz-filters__radio brz-filters__radio--${checkboxType}`;

    // @ts-expect-error: Need transform to ts
    const toolbarLabel = this.makeToolbarPropsFromConfig2(toolbarLabelConfig);

    const toolbar = this.makeToolbarPropsFromConfig2(
      // @ts-expect-error: Need transform to ts
      toolbarExtend,
      sidebarExtend
    );

    const toolbarIcon = this.makeToolbarPropsFromConfig2(
      // @ts-expect-error: Need transform to ts
      toolbarIconConfig,
      sidebarIconConfig
    );

    const toolbarSelectOption = this.makeToolbarPropsFromConfig2(
      // @ts-expect-error: Need transform to ts
      toolbarSelectOptionConfig,
      sidebarSelectOptionConfig
    );

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.props.meta,
        filterType,
        showCounter,
        checkboxType,
        activeStyle,
        dataSource,
        toolbarIcon,
        toolbarSelectOption,
        name
      },
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        // @ts-expect-error: Need transform to ts
        toolbarExtend,
        sidebarExtend
      )
    });

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={"brz-filters__main"} data-filter-type={filterType}>
          {
            <Wrapper<Props> {...this.makeWrapperProps({ className })}>
              <ContextMenu
                // @ts-expect-error: Need transform to ts
                {...this.makeContextMenuProps(contextMenuConfig)}
              >
                <div className="brz-filters__wrapper">
                  {showLabel === "on" && (
                    <Toolbar
                      // @ts-expect-error: Need transform to ts
                      {...this.makeToolbarPropsFromConfig2(toolbarTitleConfig)}
                    >
                      <TextEditor
                        className={"brz-filters__title"}
                        value={title}
                        onChange={this.handleTextChange}
                      />
                    </Toolbar>
                  )}
                  {filterType === "checkbox" && (
                    <CheckboxControls className={classNameCheckbox}>
                      {dynamicContent && (checkStyle1 || checkStyle2) ? (
                        <CheckboxFilters
                          showCounter={showCounter}
                          checkboxType={checkboxType}
                          toolbarConfig={toolbar}
                          fake={true}
                          toolbarConfigIcon={toolbarIcon}
                        />
                      ) : (
                        // @ts-expect-error: Need transform EditorArrayComponents to ts
                        <Items {...itemProps} />
                      )}
                    </CheckboxControls>
                  )}
                  {filterType === "checkrange" && (
                    <CheckboxControls className={classNameCheckbox}>
                      {
                        // @ts-expect-error: Need transform EditorArrayComponents to ts
                        <Items {...itemProps} />
                      }
                    </CheckboxControls>
                  )}
                  {filterType === "radio" && (
                    <RadioControls className={classNameRadio}>
                      {dynamicContent && (checkStyle1 || checkStyle2) ? (
                        <RadioFilters
                          showCounter={showCounter}
                          checkboxType={checkboxType}
                          toolbarConfig={toolbar}
                          fake={true}
                          toolbarConfigIcon={toolbarIcon}
                        />
                      ) : (
                        // @ts-expect-error: Need transform EditorArrayComponents to ts
                        <Items {...itemProps} />
                      )}
                    </RadioControls>
                  )}
                  {filterType === "active" && (
                    <div
                      className={
                        "brz-filters__tags brz-filters__active-filters"
                      }
                    >
                      {
                        // @ts-expect-error: Need transform EditorArrayComponents to ts
                        <Items {...itemProps} />
                      }
                    </div>
                  )}
                  {filterType === "range" && (
                    <RangeFilters
                      toolbarConfig={toolbar}
                      toolbarConfigLabel={toolbarLabel}
                      showText={showRangeText}
                      label={rangeLabel}
                      min={rangeMin}
                      max={rangeMax}
                      step={rangeStep}
                    />
                  )}
                  {filterType === "rating" && (
                    <RatingFilters
                      iconName={iconName}
                      iconType={iconType}
                      toolbarConfig={toolbar}
                      starCount={starCount}
                    />
                  )}
                  {filterType === "search" && (
                    <SearchFilters
                      toolbarConfig={toolbar}
                      onChange={this.handleSearchTextChange}
                      value={searchText}
                    />
                  )}
                  {filterType === "date" && (
                    <DateFilters
                      native={dateType}
                      textTo={textDateTo}
                      textFrom={textDateFrom}
                      onChangeTextFrom={this.handleTextFromChange}
                      onChangeTextTo={this.handleTextToChange}
                      labelDateFrom={labelDateFrom}
                      labelDateTo={labelDateTo}
                      onChangeLabelFrom={this.handleLabelFromChange}
                      onChangeLabelTo={this.handleLabelToChange}
                      toolbarConfig={toolbar}
                      toolbarConfigLabel={toolbarLabel}
                    />
                  )}
                  {filterType === "select" && (
                    // @ts-expect-error: Need transform EditorArrayComponents to ts
                    <Items {...itemProps} />
                  )}
                  {showApply === "on" && (
                    <ButtonFilters
                      btnText={btnText}
                      textChange={this.handleBtnTextChange}
                      toolbar={this.makeToolbarPropsFromConfig2(
                        // @ts-expect-error: Need transform to ts
                        toolbarButtonConfig,
                        sidebarButtonConfig,
                        { allowExtend: false }
                      )}
                    />
                  )}
                </div>
              </ContextMenu>
            </Wrapper>
          }
        </div>
      </CustomCSS>
    );
  }
}

export default Filters;
