import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import Config from "visual/global/Config";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { updateUI } from "visual/redux/actions2";
import { currentRoleSelector } from "visual/redux/selectors";

export interface Props {
  label: string;
  className?: string;
}

export const Roles = (props: Props): ReactElement => {
  const { label, className: _className } = props;
  const className = classnames(
    "brz-ed-sidebar-bottom__option brz-ed-sidebar__wp-template",
    _className
  );
  const currentRole = useSelector(currentRoleSelector) ?? "default";
  const dispatch = useDispatch();
  const renderOptions = useMemo(() => {
    const membershipRoles = [
      { role: "default", name: "Default" },
      { role: "not_logged", name: "Not logged" },
      ...(Config.get("wp")?.availableRoles || [])
    ];

    return membershipRoles.map((item, index) => (
      <SelectItem key={index} value={item.role}>
        {item.name}
      </SelectItem>
    ));
  }, []);

  const handleChangeRole = useCallback(
    (role: string) => {
      dispatch(updateUI("currentRole", role));
    },
    [dispatch]
  );

  return (
    <div className={className}>
      <div className="brz-ed-option__label">{label}</div>
      <Select
        defaultValue={currentRole}
        className="brz-control__select--dark"
        maxItems="6"
        itemHeight="30"
        onChange={handleChangeRole}
      >
        {renderOptions}
      </Select>
    </div>
  );
};
