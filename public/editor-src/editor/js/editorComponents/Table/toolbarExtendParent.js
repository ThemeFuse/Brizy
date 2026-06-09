import { addLast, getIn, setIn } from "timm";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, NORMAL } from "visual/utils/stateMode";
import { appendColumns, createBodyRows } from "./utils";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ key, v, device });

  // Color
  const bgColorOpacity = dvv("bgColorOpacity");
  const bgColor = getColorToolbar(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    bgColorOpacity
  );

  const color = getColorToolbar(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-table-element"
      },
      title: t("Table"),
      position: 60,
      options: [
        {
          id: "tableHead",
          label: t("Head"),
          type: "switch",
          devices: "desktop"
        },
        {
          id: "tableAside",
          label: t("Sidebar"),
          type: "switch",
          devices: "desktop"
        },
        {
          id: "rows",
          label: t("Rows"),
          type: "slider",
          devices: "desktop",
          config: {
            min: 1,
            max: 10
          },
          dependencies: ({ rows }) => {
            const [tableHead, tableBody] = v.items;
            const rowBody = getIn(tableBody, ["value", "items"]);

            if (rowBody && rowBody.length < rows) {
              const newRows = createBodyRows(rows - rowBody.length, v.columns);
              const newTableRows = addLast(rowBody, newRows);
              const newTable = setIn(
                tableBody,
                ["value", "items"],
                newTableRows
              );
              return {
                items: [tableHead, newTable],
                rows
              };
            }
            return {
              rows
            };
          }
        },
        {
          id: "columns",
          label: t("Columns"),
          type: "slider",
          devices: "desktop",
          config: {
            min: 1,
            max: 10
          },
          dependencies: ({ columns }) => {
            const [tableHead, tableBody] = v.items;
            const rowBody = getIn(tableBody, ["value", "items"]);
            const rowHead = getIn(tableHead, ["value", "items"]);
            const currentColItems = getIn(rowBody, [0, "value", "items"]);

            if (currentColItems && currentColItems.length - 1 < columns) {
              const colsToAdd = columns - (currentColItems.length - 1);
              const { headRow, bodyRows } = appendColumns(
                rowHead[0],
                rowBody,
                colsToAdd
              );
              const nTableHead = setIn(
                tableHead,
                ["value", "items"],
                [headRow]
              );
              const nTableBody = setIn(tableBody, ["value", "items"], bodyRows);

              return {
                items: [nTableHead, nTableBody],
                columns
              };
            }

            return {
              columns
            };
          }
        },
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        icon: {
          style: {
            backgroundColor: bgColorOpacity > 0 ? bgColor : color
          }
        }
      },
      title: t("Colors"),
      roles: ["admin"],
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
                  states: [NORMAL, ACTIVE]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border"
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true
    }
  ];
}
