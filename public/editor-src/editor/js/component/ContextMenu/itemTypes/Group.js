import {
  Label,
  Separator,
  Sub,
  SubContent,
  SubTrigger
} from "@radix-ui/react-context-menu";
import { ChevronRight } from "lucide-react";
import React, { useMemo } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Items from "../Items";

const Group = ({ title = "", icon = "", items = [], meta }) => {
  const isTopLevel = meta.depth === 0 && meta.index === 0;

  const subMeta = useMemo(() => {
    return {
      ...meta,
      depth: meta.depth + 1,
      isInSubMenu: !isTopLevel
    };
  }, [meta]);

  if (isTopLevel) {
    return (
      <React.Fragment>
        <Label className="brz-ed-context-menu__item brz-ed-context-menu__item--title">
          {icon && <EditorIcon icon={icon} />}
          {title}
        </Label>
        <Separator className="brz-ed-context-menu__separator" />
        <Items data={items} meta={subMeta} />
      </React.Fragment>
    );
  }

  return (
    <>
      <Separator className="brz-ed-context-menu__separator" />
      <Sub>
        <SubTrigger className="brz-ed-context-menu__item brz-ed-context-menu__submenu-trigger">
          <span className="brz-ed-context-menu__item-label">{title}</span>
          <ChevronRight size={18} />
        </SubTrigger>
        <SubContent
          className="brz-ed-context-menu brz-ed-context-menu--nested"
          sideOffset={5}
        >
          <Items data={items} meta={subMeta} />
        </SubContent>
      </Sub>
    </>
  );
};

export default Group;
