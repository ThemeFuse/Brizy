import { ComponentMeta, ComponentStory } from "@storybook/react";
import React, { RefObject, useState } from "react";
import { ClickOutside } from "..";

export default {
  title: "Components/ClickOutside",
  component: ClickOutside,
  parameters: {
    backgrounds: { default: "dark" }
  }
} as ComponentMeta<typeof ClickOutside>;

const Template: ComponentStory<typeof ClickOutside> = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClickOutside {...args} onClickOutside={() => setIsOpen(false)}>
      {(ref: RefObject<HTMLDivElement>) => (
        <div style={{ width: 120 }} ref={ref}>
          <button onClick={() => setIsOpen(!isOpen)}>Open dropwdown</button>
          {isOpen && (
            <div style={{ backgroundColor: "white", padding: 20 }}>
              Dropdown
            </div>
          )}
        </div>
      )}
    </ClickOutside>
  );
};

const ExceptionTemplate: ComponentStory<typeof ClickOutside> = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ClickOutside {...args} onClickOutside={() => setIsOpen(false)}>
        {(ref: RefObject<HTMLDivElement>) => (
          <div style={{ width: 120 }} ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)}>Open dropwdown</button>
            {isOpen && (
              <div style={{ backgroundColor: "white", padding: 20 }}>
                Dropdown
              </div>
            )}
          </div>
        )}
      </ClickOutside>
      <div
        className="exception"
        style={{ width: 120, backgroundColor: "white", marginTop: 10 }}
      >
        Exception
      </div>
    </>
  );
};

export const NoException: ComponentStory<typeof ClickOutside> = Template.bind(
  {}
);
NoException.args = {
  exceptions: []
};

export const WithException: ComponentStory<typeof ClickOutside> =
  ExceptionTemplate.bind({});
WithException.args = {
  exceptions: [".exception"]
};
