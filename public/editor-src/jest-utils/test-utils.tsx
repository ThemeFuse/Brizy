import { RenderOptions, queries, render, within } from "@testing-library/react";
import React, { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "visual/providers/ConfigProvider";
import { RenderProvider, RenderType } from "visual/providers/RenderProvider";
import * as customQueries from "./custom-queries";
import { config, store } from "./mocks";

const allQueries = {
  ...queries,
  ...customQueries
};

const customScreen = within(document.body, allQueries);
const customWithin = (element: HTMLElement) => within(element, allQueries);
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">
) => render(ui, { queries: allQueries, ...options });

interface Options extends Omit<RenderOptions, "wrapper"> {
  renderContext?: RenderType;
}

function renderWithProviders(ui: ReactElement, options?: Options) {
  const { renderContext = "editor", ...rest } = options ?? {};

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ConfigProvider config={config}>
      <Provider store={store}>
        <RenderProvider renderType={renderContext}>{children}</RenderProvider>
      </Provider>
    </ConfigProvider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...rest }) };
}

export * from "@testing-library/react";

export {
  customScreen as screen,
  customWithin as within,
  customRender as render,
  renderWithProviders
};
