import { addLast, getIn, setIn } from "timm";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { setIds } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, NORMAL } from "visual/utils/stateMode";

const TableRow = {
  type: "TableRow",
  value: {
    items: []
  }
};

const TableCol = {
  type: "TableCol",
  value: {
    items: []
  }
};

const TableColHead = {
  type: "TableAside",
  value: {
    labelText: "H 1",
    items: []
  }
};

const TableAside = {
  type: "TableAside",
  value: {
    labelText: "A 1",
    items: []
  }
};

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ key, v, device });

  // Color
  const bgColorOpacity = dvv("bgColorOpacity");
  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    bgColorOpacity
  );

  const color = getColor(
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
              const _colBody = Array(v.columns).fill(TableCol);
              const newRow = setIn(
                TableRow,
                ["value", "items"],
                [TableAside, ..._colBody]
              );
              const _rowBody = setIds(
                Array(rows - rowBody.length).fill(newRow)
              );
              const newTableRows = addLast(
                getIn(tableBody, ["value", "items"]),
                _rowBody
              );
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
            const needAddNewCol = getIn(rowBody, [0, "value", "items"]);
            const needAddNewColHead = getIn(rowHead, [0, "value", "items"]);

            if (needAddNewCol && needAddNewCol.length - 1 < columns) {
              const nRowBody = rowBody.reduce((acc, curr) => {
                const colBody = setIds(
                  Array(columns - (needAddNewCol.length - 1)).fill(TableCol)
                );
                const tableRow = setIn(
                  curr,
                  ["value", "items"],
                  addLast(curr.value.items, colBody)
                );

                acc.push(tableRow);

                return acc;
              }, []);
              const nHeadCols = setIds(
                Array(columns - (needAddNewColHead.length - 1)).fill(
                  TableColHead
                )
              );
              const nRowHead = setIn(
                rowHead,
                [0, "value", "items"],
                addLast(rowHead[0].value.items, nHeadCols)
              );
              const nTableBody = setIn(tableBody, ["value", "items"], nRowBody);
              const nTableHead = setIn(tableHead, ["value", "items"], nRowHead);

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
      devices: "desktop",
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
