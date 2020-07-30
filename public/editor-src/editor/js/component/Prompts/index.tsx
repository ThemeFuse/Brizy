import React, {
  Component,
  ComponentProps,
  ElementType,
  ReactElement
} from "react";
import produce from "immer";
import UIState from "visual/global/UIState";
import Icon from "./PromptIcon";
import Apps from "./PromptApps";
import Blocks from "./PromptBlocks";
import Form from "./PromptForm";
import KeyHelper from "./PromptKeyHelper";
import Fonts from "./PromptFonts";
import Conditions from "./PromptConditions";
import Authorization from "./PromptAuthorization";
import {
  PromptAppsProps,
  PromptConditionsProps,
  PromptFontsProps,
  PromptFormProps,
  PromptIconProps,
  PromptKeyHelperProps
} from "visual/component/Prompts/types";
import { SignAuthorizationProps } from "visual/component/Prompts/PromptAuthorization/types";
import { PromptBlocksProps } from "visual/component/Prompts/PromptBlocks/types";

const PROMPTS = {
  icon: Icon,
  apps: Apps,
  blocks: Blocks,
  form: Form,
  keyHelper: KeyHelper,
  fonts: Fonts,
  conditions: Conditions,
  authorization: Authorization
};

type PromptTypes = typeof PROMPTS;
type PromptKey = keyof PromptTypes;
type PromptsMode = "single" | "stack";

export type PromptsProps = {
  mode: PromptsMode;
  prompt: PromptKey;
  props:
    | PromptFormProps
    | SignAuthorizationProps
    | PromptBlocksProps
    | PromptConditionsProps
    | PromptAppsProps
    | PromptIconProps
    | PromptFontsProps
    | PromptKeyHelperProps;
};

type PromptsState = {
  prompts: (PromptsProps & { opened: boolean })[];
};

class Prompts extends Component<{}, PromptsState> {
  state: PromptsState = {
    prompts: []
  };

  static open<K extends PromptKey>(data: {
    prompt: K;
    mode: PromptsMode;
    props: ComponentProps<PromptTypes[K]>;
  }): void {
    UIState.set("prompt", data);
  }

  componentDidMount(): void {
    UIState.addChangeListener("prompt", this.onUIStateChange);
  }

  componentWillUnmount(): void {
    UIState.removeChangeListener("prompt", this.onUIStateChange);
  }

  onUIStateChange = (data: unknown): void => {
    this.open(data as PromptsProps);
  };

  close(position: number): void {
    this.setState(
      produce(state => {
        state.prompts[position].opened = false;
      }),
      () => {
        this.setState(
          produce(state => {
            state.prompts.splice(position, 1);
          })
        );
      }
    );
  }

  open(data: PromptsProps): void {
    const { mode = "single" } = data;
    const { prompts } = this.state;
    const promptIndex = prompts.findIndex(
      ({ prompt }) => prompt == data.prompt
    );

    if (promptIndex === -1) {
      this.setState(
        produce(state => {
          state.prompts.push(data);
        }),
        () => {
          this.setState(
            produce(state => {
              const promptLength = state.prompts.length;
              state.prompts[promptLength - 1].opened = true;
            })
          );
        }
      );
    } else {
      if (mode === "stack") {
        this.setState(
          produce(state => {
            state.prompts[promptIndex] = {
              ...data,
              opened: true
            };
          })
        );
      } else {
        this.setState(
          produce(state => {
            state.prompts.forEach((_: PromptsProps, index: number) => {
              state.prompts[index].opened = false;
            });
            state.prompts[promptIndex] = {
              ...data,
              opened: true
            };
          })
        );
      }
    }
  }

  getComponent<K extends PromptKey>(
    type: K,
    props: ComponentProps<PromptTypes[K]>
  ): ReactElement<PromptTypes[K]> {
    const Component: ElementType = PROMPTS[type];

    return <Component {...props} />;
  }

  render(): ReactElement[] | null {
    const { prompts } = this.state;

    if (prompts.length) {
      return prompts.map(({ opened, prompt, props = {} }, index) => {
        return this.getComponent(prompt, {
          ...props,
          opened,
          key: index,
          onClose: (): void => {
            this.close(index);

            if (props.onClose) {
              props.onClose();
            }
          }
        });
      });
    }

    return null;
  }
}

export default Prompts;
