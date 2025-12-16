import { Obj, Str } from "@brizy/readers";
import React from "react";
import { CheckGroupItem as CheckboxControlsItem } from "visual/component/Controls/CheckGroup/CheckGroupItem";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { CheckboxIcon } from "./FieldOption/Components/CheckboxIcon";
import TextField from "./common/TextField";
import { UserAgreementCheckboxProps } from "./type";
import { uuid } from "visual/utils/uuid";

export default class UserAgreementCheckbox extends TextField {
  static get componentType() {
    return "UserAgreementCheckbox";
  }

  getClassName(): string {
    return "brz-forms2__field brz-forms2__checkbox brz-forms2__user-agreement-checkbox";
  }

  handleCheckboxClick = () => {
    const { active, userAgreementLabel } = this.props;

    if (Obj.isObject(active)) {
      this.props.onChange?.({
        active: {
          ...active,
          [userAgreementLabel]: !active[userAgreementLabel]
        }
      });
    }
  };

  handleInputChange = (newValue: string) => {
    this.props.onChange?.({ userAgreementLabel: newValue });
  };

  renderForEdit(): React.JSX.Element {
    const { active, userAgreementLabel, enableCustomHtml, customHtml } = this
      .props as UserAgreementCheckboxProps;

    const isActive = Obj.isObject(active) && active[userAgreementLabel];

    const isCustomHtml = enableCustomHtml === "on" && customHtml;

    return (
      <div className={this.getClassName()}>
        <div className="brz-forms2__checkbox-options">
          <CheckboxControlsItem
            className="brz-forms2__checkbox-option"
            value={userAgreementLabel}
            isEditor={true}
            renderIcons={() => <CheckboxIcon type="editor" active={isActive} />}
            active={isActive}
            onClick={this.handleCheckboxClick}
          >
            <div className="brz-forms2__checkbox-option-name">
              {isCustomHtml ? (
                <div
                  style={{ pointerEvents: "none" }}
                  dangerouslySetInnerHTML={{ __html: customHtml }}
                />
              ) : (
                <>
                  <TextEditor
                    className="brz-input"
                    value={userAgreementLabel}
                    onChange={this.handleInputChange}
                  />
                  <span className="brz-span brz-invisible">
                    {userAgreementLabel}
                  </span>
                </>
              )}
            </div>
          </CheckboxControlsItem>
        </div>
      </div>
    );
  }

  renderForView(): React.JSX.Element {
    const { active, userAgreementLabel, label, enableCustomHtml, customHtml } =
      this.props as UserAgreementCheckboxProps;

    const isActive = Obj.isObject(active) && active[userAgreementLabel];

    const isCustomHtml = enableCustomHtml === "on" && customHtml;

    const fieldUniqueId = "terms-" +uuid();

    return (
      <div className={this.getClassName()}>
        <div className="brz-forms2__checkbox-options">
          <CheckboxControlsItem
            value={"true"}
            name={fieldUniqueId}
            className="brz-forms2__checkbox-option"
            renderIcons={() => <CheckboxIcon type="preview" />}
            isEditor={false}
            active={isActive}
            onClick={this.handleCheckboxClick}
            required={true}
            type="UserAgreementCheckbox"
            label={Str.read(label) || ""}
          >
            {isCustomHtml ? (
              <div
                className="brz-forms2__checkbox-option-name"
                dangerouslySetInnerHTML={{ __html: customHtml }}
              />
            ) : (
              <span className="brz-forms2__checkbox-option-name brz-span">
                {userAgreementLabel}
              </span>
            )}
          </CheckboxControlsItem>
        </div>
      </div>
    );
  }
}
