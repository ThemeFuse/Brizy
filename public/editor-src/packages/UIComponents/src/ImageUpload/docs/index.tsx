import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { EditorIcon } from "../../EditorIcon";
import { IconsName } from "../../EditorIcon/types";
import { ImageUpload } from "../index";
import "../style/index.scss";

export default {
  title: "Images and icons/ImageUpload",
  component: ImageUpload,
  args: {
    children: (
      <EditorIcon
        icon={IconsName.PlusCircle}
        className="brz-ed-control__imageUpload__icon"
      />
    )
  }
} as ComponentMeta<typeof ImageUpload>;

const Template: ComponentStory<typeof ImageUpload> = (args) => {
  const onChange = () => {
    const input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.addEventListener("change", (e) => {
      const files = (e.target as HTMLInputElement).files;
      const currentFiles: File[] | null = files ? Array.from(files) : null;

      if (currentFiles?.length) {
        const names = currentFiles?.map((file) => file.name);
        alert(`Files added : ${names.join(",")}`);
      }
    });
    input.click();
  };

  return (
    <div style={{ height: "300px", width: "300px" }}>
      <ImageUpload {...args} onChange={onChange} />
    </div>
  );
};

export const Default: ComponentStory<typeof ImageUpload> = Template.bind({});
Default.args = {
  className: ""
};
