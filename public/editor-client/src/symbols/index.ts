// import { createSymbol, deleteSymbol, getSymbols, updateSymbol } from "src/api";
// import { Symbols } from "src/types/Symbols";
// import { t } from "src/utils/i18n";

// export const symbols: Symbols = {
//   async get(res, rej) {
//     try {
//       const data = await getSymbols();

//       if (!data) {
//         return rej(t("Could not get symbols"));
//       }

//       res(data);
//     } catch (e) {
//       rej(t("Failed to get symbols"));
//     }
//   },
//   async create(res, rej, extra) {
//     try {
//       const data = await createSymbol(extra);

//       if (!data.data) {
//         return rej(t("Could not create symbols"));
//       }

//       res(data.data);
//     } catch (error) {
//       rej(t("Failed to create symbol"));
//     }
//   },
//   async update(res, rej, extra) {
//     try {
//       const data = await updateSymbol(extra);

//       if (!data.data) {
//         return rej(t("Could not update symbols"));
//       }

//       console.log("data: ", data);

//       res(data.data);
//     } catch (error) {
//       rej(t("Failed to update symbol"));
//     }
//   },
//   async delete(res, rej, extra) {
//     try {
//       const data = await deleteSymbol(extra);

//       if (!data.success) {
//         return rej(t("Could not delete symbols"));
//       }

//       res(data.success);
//     } catch (error) {
//       rej(t("Failed to delete symbol"));
//     }
//   }
// };

export {};
