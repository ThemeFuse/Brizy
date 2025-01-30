import React from "react";
import { Manager, Popper, Reference } from "react-popper";
import { PopperChildrenProps } from "react-popper";
import ClickOutside from "visual/component/ClickOutside";
import { InternalLinkValue } from "visual/component/Controls/InternalLink/Components/InternalLinkValue";
import { SelectDropdown } from "visual/component/Controls/InternalLink/Components/SelectDropdown";
import { StatusRule } from "visual/component/Prompts/PromptConditions/Rules/types";
import { FCC } from "visual/utils/react/types";

interface ControlTypeOptionsProps {
  onClickOutside: () => void;
  onClick: () => void;
  onRemove?: VoidFunction;
  value: string;
  status?: StatusRule;
  isOpen: boolean;
  loading: boolean;
  onSearchChange: (searchTerm: string) => void;
  typeOptionItems: JSX.Element;
}

export const ControlTypeOptions: FCC<ControlTypeOptionsProps> = ({
  onClickOutside,
  onClick,
  onRemove,
  status,
  isOpen,
  loading,
  onSearchChange,
  typeOptionItems,
  value
}) => (
  <div className="brz-ed-control__internalLink-wrapper">
    <ClickOutside onClickOutside={onClickOutside}>
      {({ ref }) => (
        <div className="brz-ed-control__internalLink" ref={ref}>
          <Manager>
            <Reference>
              {({ ref }): JSX.Element => (
                <InternalLinkValue
                  ref={ref}
                  value={value}
                  onClick={onClick}
                  onRemove={onRemove}
                  arrow={true}
                  itemStatus={status}
                />
              )}
            </Reference>

            {isOpen && (
              <Popper placement="bottom-start">
                {({ ref, style, placement }: PopperChildrenProps) => (
                  <SelectDropdown
                    ref={ref}
                    style={{
                      ...style,
                      position: "fixed"
                    }}
                    attr={{ "data-placement": placement }}
                    searchIsLoading={loading}
                    onSearchChange={onSearchChange}
                    maxHeight={210}
                  >
                    {typeOptionItems}
                  </SelectDropdown>
                )}
              </Popper>
            )}
          </Manager>
        </div>
      )}
    </ClickOutside>
  </div>
);
