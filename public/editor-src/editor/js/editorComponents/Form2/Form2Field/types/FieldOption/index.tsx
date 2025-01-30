import { Obj } from "@brizy/readers";
import classnames from "classnames";
import { isEmpty } from "es-toolkit/compat";
import React from "react";
import { omit } from "timm";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { blocksDataSelector } from "visual/redux/selectors";
import { Block } from "visual/types/Block";
import { t } from "visual/utils/i18n";
import { getLinkData } from "visual/utils/models/link";
import { handleLinkChange } from "visual/utils/patch/Link";
import { PatchValue } from "visual/utils/patch/Link/types";
import { DESKTOP } from "visual/utils/responsiveMode";
import { FormInput } from "../../type";
import { CheckboxIcon } from "./Components/CheckboxIcon";
import CheckboxItem from "./Components/CheckboxItem";
import RadioItem from "./Components/RadioItem";
import SelectItem from "./Components/SelectItem";
import defaultValue from "./defaultValue.json";
import * as toolbar from "./toolbar";
import { Props, Value } from "./type";
import { Form2OptionConnector, convertLinkData } from "./utils";

class Form2FieldOption extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.Form2FieldOption {
    return ElementTypes.Form2FieldOption;
  }

  static get componentType(): ElementTypes.Form2FieldOption {
    return ElementTypes.Form2FieldOption;
  }

  static get componentTitle(): string {
    return t("Form2FieldOption");
  }

  handleSelectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.patchValue({ value: e.target.value });
  };

  handleInputChange = (e: string) => {
    this.patchValue({ value: e });
  };

  renderCheckboxIconEditor = (active: boolean) => {
    return <CheckboxIcon type="editor" active={active} />;
  };

  renderCheckboxIconPreview = () => {
    return <CheckboxIcon type="preview" />;
  };

  renderSelectItem(v: Value, isEditor: boolean): React.JSX.Element {
    const { value } = v;
    const { deviceMode, onRemove } = this.props;

    const isDesktop = deviceMode === DESKTOP;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar)}>
        {({ ref }) => (
          <SelectItem
            value={value}
            isEditor={isEditor}
            renderIconTrash={isDesktop}
            onRemove={onRemove}
            handleSelectInputChange={this.handleSelectInputChange}
            ref={ref}
          />
        )}
      </Toolbar>
    );
  }

  renderRadioItem(v: Value, isEditor: boolean): React.JSX.Element {
    const {
      onRemove,
      activeRadioItem,
      onClickRadioIcon,
      placeholder,
      label,
      name
    } = this.props;
    const { value } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar)}>
        {({ ref }) => (
          <RadioItem
            value={value}
            label={label}
            name={name ?? label}
            active={activeRadioItem}
            placeholder={placeholder}
            onRemove={onRemove}
            handleInputChange={this.handleInputChange}
            handleRadioIconClick={onClickRadioIcon}
            isEditor={isEditor}
            ref={ref}
          />
        )}
      </Toolbar>
    );
  }

  renderPopups(): React.JSX.Element {
    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "linkPopupPopups",
      itemProps: (itemData: Block) => {
        let {
          value: { popupId }
        } = itemData;

        const { blockId } = itemData;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(this.getReduxState());
          const globalBlockId = itemData.value._id;
          const blockData = globalBlocks[globalBlockId];

          popupId = blockData.value.popupId;
          newMeta = {
            ...newMeta,
            globalBlockId
          };
        }

        return {
          blockId,
          meta: newMeta,
          instanceKey: `${this.getId()}_${popupId}`
        };
      }
    });

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...popupsProps} />;
  }

  patchValue(patch: PatchValue, meta = {}) {
    const link = handleLinkChange(patch);
    super.patchValue({ ...patch, ...link }, meta);
  }

  renderCheckboxItem(v: Value, isEditor: boolean): React.JSX.Element {
    const {
      onRemove,
      active,
      handleChangeActive,
      label,
      required,
      type,
      name
    } = this.props;

    const { value } = v;
    const isActive = Obj.isObject(active) ? active[value] : false;
    const config = this.getGlobalConfig();

    const linkData = getLinkData(v, config);
    const checkboxLinkData = convertLinkData(linkData);

    const checkboxUnderlineClassname = classnames({
      "brz-underline-on": !isEmpty(checkboxLinkData)
    });
    return (
      <>
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar)}>
          {({ ref }) => (
            <CheckboxItem
              className={checkboxUnderlineClassname}
              type={type}
              label={label}
              value={value}
              active={active}
              name={name}
              required={required}
              isEditor={isEditor}
              onRemove={onRemove}
              handleChangeActive={handleChangeActive}
              handleInputChange={this.handleInputChange}
              renderCheckboxIconEditor={() =>
                this.renderCheckboxIconEditor(isActive)
              }
              renderCheckboxIconPreview={this.renderCheckboxIconPreview}
              {...checkboxLinkData}
              ref={ref}
            />
          )}
        </Toolbar>

        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
      </>
    );
  }

  renderForEdit(v: Value): React.JSX.Element | null {
    const { type } = this.props;
    const _isEditor = isEditor(this.props.renderContext);

    switch (type) {
      case FormInput.Select: {
        return this.renderSelectItem(v, _isEditor);
      }
      case FormInput.Checkbox: {
        return this.renderCheckboxItem(v, _isEditor);
      }
      case FormInput.Radio: {
        return this.renderRadioItem(v, _isEditor);
      }

      default: {
        return null;
      }
    }
  }
}

export default Form2OptionConnector(Form2FieldOption);
