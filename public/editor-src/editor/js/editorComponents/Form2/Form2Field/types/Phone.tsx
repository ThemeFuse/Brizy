import classNames from "classnames";
import React, { RefObject, createRef } from "react";
import SlimSelectLib, { Option } from "slim-select";
import { SlimSelect } from "visual/component/SlimSelect";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import { attachRefs } from "visual/utils/react";
import { MValue } from "visual/utils/value";
import {
  flagsToSelectPhoneOptions,
  getFlagIconClass,
  getFlags
} from "../../utils";
import TextField from "./common/TextField";
import type { PhoneOption } from "./type";

interface Value {
  labelType: string;
  attr: {
    placeholder: string;
    type: string;
    value: string;
    defaultValue?: string;
  };
  showPlaceholder: boolean;
}

interface State {
  countryCode: string;
  flags: PhoneOption[];
}

class Phone extends TextField {
  static get componentType(): "Phone" {
    return "Phone";
  }

  state: State = {
    countryCode: "US",
    flags: []
  };

  selectRef: RefObject<SlimSelectLib> = createRef<SlimSelectLib>();
  contentRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

  allFlags: MValue<PhoneOption[]>;

  componentDidMount(): void {
    (async () => {
      const { getFlagsForEditor } = await import("../../utils");
      this.setState({ flags: getFlagsForEditor() });
    })();
  }

  handleChangeSingleValue = (value: string) => {
    this.setState({ countryCode: value });
  };

  handleSelectedClick = () => {
    const refObj = this.selectRef.current;

    if (refObj) {
      refObj.open();
    }
  };

  getSelectedFlag(isPreview?: boolean): PhoneOption | undefined {
    return (isPreview && this.allFlags ? this.allFlags : this.state.flags).find(
      (flag) => flag.code === this.state.countryCode
    );
  }

  getSelectData(isPreview?: boolean): Array<Option["data"]> {
    return flagsToSelectPhoneOptions(
      isPreview && this.allFlags ? this.allFlags : this.state.flags
    );
  }

  renderForEdit(v: Value, isPreview?: boolean) {
    const { labelType, attr, showPlaceholder } = v;
    const { toolbarExtendPhoneSelect, phoneSelectClassName } = this.props;
    const inputClassName = classNames("brz-input", {
      "brz-p-events--none": !showPlaceholder
    });

    const selectedFlag = this.getSelectedFlag(isPreview);

    const className = classNames(
      "brz-forms2__field brz-forms2__field-phone",
      phoneSelectClassName
    );

    return (
      <div className={className}>
        <Toolbar {...toolbarExtendPhoneSelect} selector=".ss-list .ss-option">
          {({ ref }) => (
            <div
              className="brz-forms2__phone--country"
              ref={(el) => attachRefs(el, [ref, this.contentRef])}
            >
              <div
                className="brz-forms2__phone--country-selected"
                onClick={this.handleSelectedClick}
              >
                <span
                  className={getFlagIconClass(
                    selectedFlag?.code ?? this.state.countryCode
                  )}
                />
                <ThemeIcon
                  name="arrow-down"
                  type="editor"
                  className="brz-forms2__phone--country-arrow"
                />
              </div>

              <SlimSelect
                ref={this.selectRef}
                data={this.getSelectData(isPreview)}
                settings={{
                  contentLocation: this.contentRef.current
                }}
                events={{
                  afterChange: (data) => {
                    this.handleChangeSingleValue(data[0].value);
                  }
                }}
              />
            </div>
          )}
        </Toolbar>
        <div className="brz-forms2__phone--number">
          {labelType === "outside" ? (
            <input
              {...attr}
              ref={this.input}
              className={inputClassName}
              value={attr?.placeholder}
              onChange={(e) => {
                this.hanleInputChange(v, e);
              }}
            />
          ) : (
            <input
              {...attr}
              ref={this.input}
              className={inputClassName}
              onChange={(e) => {
                this.hanleInputChange(v, e);
              }}
            />
          )}
        </div>
        {isPreview && this.allFlags && (
          <div className="brz-forms2__field-phone--translated-data">
            <select>
              {this.allFlags.map(({ code, name, dialCode }) => (
                <option
                  key={code}
                  value={code}
                  data-dial-code={dialCode}
                >
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }

  renderForView(v: Value) {
    this.allFlags = getFlags();

    return this.renderForEdit(v, true);
  }
}

export default Phone;
