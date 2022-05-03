import React, {
  Fragment,
  FC,
  ReactElement,
  ReactNode,
  MouseEventHandler,
  useMemo
} from "react";
import classnames from "classnames";
import { EditorIcon } from "visual/component/EditorIcon";
import Tooltip, { TooltipItem } from "visual/component/Controls/Tooltip";
import { Roles } from "visual/component/Roles";

interface Item {
  title: string;
  icon?: string;
  roles?: string[];
  loading?: boolean;
  onClick?: VoidFunction;
}

export interface Props {
  loading: boolean;
  children: ReactNode;
  addonAfter?: Item[];
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const Addons = ({ items }: { items: Item[] }): ReactElement => {
  const overlay = useMemo(() => {
    return items.map((item, index) => {
      const { title, icon, roles = [], loading, onClick } = item;
      const content = (
        <TooltipItem
          className="brz-ed-fixed-bottom-panel-popover__item"
          onClick={onClick}
        >
          {loading ? (
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          ) : icon !== undefined ? (
            <EditorIcon icon={icon} />
          ) : null}
          <span className="brz-span">{title}</span>
        </TooltipItem>
      );

      return roles.length > 0 ? (
        <Roles key={index} allow={roles}>
          {content}
        </Roles>
      ) : (
        <Fragment key={index}>{content}</Fragment>
      );
    });
  }, [items]);

  return (
    <Tooltip
      overlayClassName="brz-ed-tooltip__overlay-publish-button"
      placement="top-end"
      offset={20}
      overlay={overlay}
      inPortal={true}
    >
      <button className="brz-button">
        <EditorIcon icon="nc-arrow-up" />
      </button>
    </Tooltip>
  );
};

export const Controls: FC<Props> = props => {
  const { loading, children, addonAfter, onClick } = props;
  const className = classnames("brz-ed-fixed-bottom-panel__btn", {
    "brz-ed-fixed-bottom-panel__btn-popover": addonAfter?.length
  });
  const loadingClassName = classnames("brz-ed-animated--spin", {
    "brz-d-none": !loading
  });
  const labelClassName = classnames("brz-span", {
    "brz-invisible": loading
  });

  return (
    <div className={className}>
      <div
        className="brz-ed-fixed-bottom-panel__btn-loading brz-d-xs-flex brz-align-items-xs-center brz-text-lg-center"
        onClick={onClick}
      >
        <EditorIcon icon="nc-circle-02" className={loadingClassName} />
        <span className={labelClassName}>{children}</span>
      </div>
      {!!addonAfter?.length && addonAfter.length > 0 && (
        <Addons items={addonAfter} />
      )}
    </div>
  );
};
