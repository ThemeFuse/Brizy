import { noop } from "es-toolkit";
import React from "react";
import { fireEvent, renderWithProviders, screen, within } from "test-utils";
import { updateSmtpIntegration } from "visual/utils/api";
import { config } from "../../../../../../../jest-utils/mocks";
import { Context } from "../../../common/GlobalApps/Context";
import type { AppData } from "../../../common/GlobalApps/type";
import SmtpFields from "../SmtpFields";

// The SMTP step of a form integration: the Encryption option it shows is the one it saves

jest.mock("visual/utils/api", () => ({
  ...jest.requireActual<typeof import("visual/utils/api")>("visual/utils/api"),
  updateSmtpIntegration: jest.fn()
}));

const integration = {
  id: "smtp",
  formId: "form",
  type: "smtp",
  confirmationNeeded: false,
  usedList: "",
  usedFolder: "",
  fieldsMap: "",
  accounts: []
};

const mount = (stored: { port: string; encryption: string | null }) => {
  const data = {
    ...integration,
    emailTo: "me@site.com",
    host: "smtp.site.com",
    username: "user",
    password: "secret",
    ...stored
  };
  const app: AppData = {
    id: "smtp",
    img: "",
    title: "SMTP",
    shortTitle: "SMTP",
    stages: [{ type: "fields" }],
    data
  };
  // the form's integration also hands its steps the form id and fields
  const value = {
    app,
    connectedApps: [],
    stages: app.stages,
    stage: "fields",
    oldStage: "",
    onChange: noop,
    onChangeNext: noop,
    onChangePrev: noop,
    onConnectApp: noop,
    onDisconnectApp: noop,
    onChangeProgress: noop,
    onError: noop,
    config,
    formId: "form",
    formFields: []
  };

  return renderWithProviders(
    <Context.Provider value={value}>
      <SmtpFields isPro={false} onClose={noop} />
    </Context.Provider>
  );
};

const field = (title: string): HTMLElement => {
  const found = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".brz-ed-popup-integrations-step__fields-option"
    )
  ).find(
    (node) => node.querySelector(".brz-p")?.firstChild?.textContent === title
  );

  if (!found) throw new Error(`no field ${title}`);
  return found;
};

const current = (): HTMLElement => {
  const found = field("Encryption").querySelector<HTMLElement>(
    ".brz-control__select-current"
  );

  if (!found) throw new Error("no Encryption label");
  return found;
};

const option = (text: string): HTMLElement => {
  const found = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".brz-control__select-options .brz-control__select-option"
    )
  ).find((node) => node.textContent === text);

  if (!found) throw new Error(`no option ${text}`);
  return found;
};

describe("SmtpFields", () => {
  beforeEach(() => {
    jest
      .mocked(updateSmtpIntegration)
      .mockResolvedValue({ subject: "", emailTo: "me@site.com" });
  });

  afterEach(() => {
    jest.mocked(updateSmtpIntegration).mockReset();
  });

  it.each([
    {
      case: "an integration saved without encryption on port 587",
      stored: { port: "587", encryption: null },
      typedPort: undefined,
      picked: undefined,
      shown: "TLS",
      sent: "tls"
    },
    {
      case: "a new integration on port 465",
      stored: { port: "465", encryption: "" },
      typedPort: undefined,
      picked: undefined,
      shown: "SSL",
      sent: "ssl"
    },
    {
      case: "a stored choice the port does not imply",
      stored: { port: "587", encryption: "ssl" },
      typedPort: undefined,
      picked: undefined,
      shown: "SSL",
      sent: "ssl"
    },
    {
      case: "a port typed after the step opened",
      stored: { port: "", encryption: "" },
      typedPort: "465",
      picked: undefined,
      shown: "SSL",
      sent: "ssl"
    },
    {
      case: "a choice the user picked",
      stored: { port: "587", encryption: "" },
      typedPort: undefined,
      picked: "SSL",
      shown: "SSL",
      sent: "ssl"
    }
  ])(
    "saves the shown encryption for $case",
    ({ stored, typedPort, picked, shown, sent }) => {
      mount(stored);

      if (typedPort !== undefined) {
        fireEvent.change(within(field("Port")).getByRole("textbox"), {
          target: { value: typedPort }
        });
      }
      if (picked !== undefined) {
        fireEvent.click(current());
        fireEvent.click(option(picked));
      }

      expect(current().textContent).toBe(shown);

      fireEvent.click(screen.getByText("Continue"));

      expect(updateSmtpIntegration).toHaveBeenCalledWith(
        expect.objectContaining({ encryption: sent }),
        config,
        "smtp"
      );
    }
  );
});
