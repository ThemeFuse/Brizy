import { sendHeartBeat, sendHeartBeatTakeOver } from "../api";
import { SendHeartBeat } from "../api/types";
import { resetNonce } from "./utils";

export function heartBeat(): SendHeartBeat {
  return {
    async sendHandler(res, rej) {
      try {
        const data = await sendHeartBeat();

        resetNonce(data);
        res(data);
      } catch (e) {
        rej(`API Client: Failed to heartBeat, error: \n\t ${e}`);
      }
    },
    async takeOverHandler(res, rej) {
      try {
        res(await sendHeartBeatTakeOver());
      } catch (e) {
        rej(`API Client: Failed to takeOver, error: \n\t ${e}`);
      }
    }
  };
}
