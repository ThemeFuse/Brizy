import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ThemeIcon } from "visual/component/ThemeIcon";

interface EditorMode {
  type: "editor";
  active: boolean;
}

interface PreviewMode {
  type: "preview";
}

type Props = EditorMode | PreviewMode;

const Editor = ({ active }: EditorMode): React.JSX.Element => (
  <div className="brz-control__check-group-icon">
    <EditorIcon
      className="brz-d-block"
      icon={active ? "nc-check-square-on" : "nc-check-square-off"}
    />
  </div>
);

const Preview = (): React.JSX.Element => (
  <>
    <div className="brz-control__check-group-icon brz-control__check-group--check">
      <ThemeIcon className="brz-d-block" name="check-square-on" type="editor" />
    </div>
    <div className="brz-control__check-group-icon brz-control__check-group--uncheck">
      <ThemeIcon
        className="brz-d-block"
        name="check-square-off"
        type="editor"
      />
    </div>
  </>
);

export const CheckboxIcon = (props: Props): React.JSX.Element => {
  const { type } = props;

  switch (type) {
    case "editor": {
      const { active }: EditorMode = props;
      return <Editor active={active} type={"editor"} />;
    }
    case "preview": {
      return <Preview />;
    }
  }
};
