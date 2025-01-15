import React, { forwardRef, Ref } from "react";
import Fixed from "visual/component/Prompts/Fixed";
import { RenderIcons } from "./RenderIcons";
import { Tabs } from "./Tabs";
import { Props } from "./types";

const PromptIcon = (
  {
    name,
    type,
    opened,
    onClose,
    search,
    categoryId,
    onTabClick,
    onIconClick,
    categories,
    onSelectChange,
    onInputChange,
    typeId,
    config
  }: Props,
  ref: Ref<HTMLDivElement>
): JSX.Element => (
  <Fixed opened={opened} onClose={onClose}>
    <div ref={ref} className="brz-ed-popup-wrapper">
      <Tabs
        currentTypeId={typeId}
        onClose={onClose}
        onClick={onTabClick}
        config={config}
      />
      <div className="brz-ed-popup-content brz-ed-popup-pane brz-ed-popup-icons">
        <RenderIcons
          name={name}
          type={type}
          typeId={typeId}
          onIconClick={onIconClick}
          search={search}
          categoryId={categoryId}
          categories={categories}
          onSelectChange={onSelectChange}
          onInputChange={onInputChange}
          config={config}
        />
      </div>
    </div>
  </Fixed>
);

export default forwardRef(PromptIcon);
