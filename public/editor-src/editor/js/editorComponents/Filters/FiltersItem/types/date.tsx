import React, { ReactElement } from "react";
import Toolbar from "visual/component/Toolbar";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";

type Props = {
  native: string;
  textTo: string;
  textFrom: string;
  onChangeTextFrom: (v: string) => void;
  onChangeTextTo: (v: string) => void;
  labelDateFrom: string;
  labelDateTo: string;
  toolbarConfig: PortalToolbarProps;
  toolbarConfigLabel: PortalToolbarProps;
  onChangeLabelTo: (v: string) => void;
  onChangeLabelFrom: (v: string) => void;
};

export const DateFilters = ({
  native,
  textTo,
  textFrom,
  onChangeTextFrom,
  onChangeTextTo,
  labelDateFrom,
  labelDateTo,
  toolbarConfig,
  toolbarConfigLabel,
  onChangeLabelTo,
  onChangeLabelFrom
}: Props): ReactElement => {
  return (
    <div className={"brz-filters__date--wrapper"}>
      <div className={"brz-filters__date"}>
        {IS_EDITOR ? (
          <>
            <Toolbar {...toolbarConfigLabel}>
              <TextEditor
                className={"brz-filters__date--label"}
                value={labelDateFrom}
                onChange={onChangeLabelFrom}
              />
            </Toolbar>
            <Toolbar {...toolbarConfig}>
              <div className="brz-filters__option brz-filters__date-option">
                <TextEditor value={textFrom} onChange={onChangeTextFrom} />
              </div>
            </Toolbar>
          </>
        ) : (
          <>
            <TextEditor
              className={"brz-filters__date--label"}
              value={labelDateFrom}
              onChange={onChangeLabelFrom}
            />
            <input
              type="date"
              data-native={native}
              className="brz-filters__option brz-filters__date-option brz-filters__date-option--from"
              placeholder={textFrom}
            />
          </>
        )}
      </div>
      <div className={"brz-filters__date"}>
        {IS_EDITOR ? (
          <>
            <Toolbar {...toolbarConfigLabel}>
              <TextEditor
                className={"brz-filters__date--label"}
                value={labelDateTo}
                onChange={onChangeLabelTo}
              />
            </Toolbar>
            <Toolbar {...toolbarConfig}>
              <div className="brz-filters__option brz-filters__date-option">
                <TextEditor value={textTo} onChange={onChangeTextTo} />
              </div>
            </Toolbar>
          </>
        ) : (
          <>
            <TextEditor
              className={"brz-filters__date--label"}
              value={labelDateTo}
              onChange={onChangeLabelTo}
            />
            <input
              type="date"
              data-native={native}
              className="brz-filters__option brz-filters__date-option brz-filters__date-option--to"
              placeholder={textTo}
            />
          </>
        )}
      </div>
    </div>
  );
};
