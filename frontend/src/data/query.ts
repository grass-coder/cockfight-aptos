import { InputViewFunctionData, MoveValue } from "@aptos-labs/ts-sdk";
import { aptos } from "../lib/aptosClient";
import { COCKFIGHT_MODULE_ADDRESS } from "../lib/consts";

export interface GetCockieOwnerInfoResponse {
  eggs: MoveValue;
  last_game_id: MoveValue;
  cockie_addresses: MoveValue;
}


// 0x1::aptos_coin::AptosCoin
export const getBalance = async (address: string, coinType: string): Promise<number | undefined> => {
  const payload: InputViewFunctionData = {
    function: "0x1::coin::balance",
    typeArguments: [coinType],
    functionArguments: [address]
  };
    
  const balance = await aptos.view({ payload });
  console.log("balance:", balance)
  return balance.length > 0 ? Number(balance[0]) : undefined;
}

export const getGameResult = async (gameId: number): Promise<boolean | undefined> => {
  const payload: InputViewFunctionData = {
    function: `${COCKFIGHT_MODULE_ADDRESS}::game::get_game_result`,
    typeArguments: [],
    functionArguments: [gameId]
  };
  const gameResult = await aptos.view({ payload });
  console.log("gameResult:", gameResult)
  return gameResult.length > 0 ? Boolean(gameResult[0]) : undefined;
}

export const getCockieOwnerInfo = async (address: string): Promise<GetCockieOwnerInfoResponse | undefined> => {
  const payload: InputViewFunctionData = {
    function: `${COCKFIGHT_MODULE_ADDRESS}::game::get_cockie_owner_info`,
    functionArguments: [address]
  };
  const res = await aptos.view({ payload });
  if (res.length === 0) {
    return undefined;
  }
  const cockieOwnerInfo: GetCockieOwnerInfoResponse = {
    eggs: Number(res[0]),
    last_game_id: Number(res[1]),
    cockie_addresses: res[2]
  }

  console.log("cockieOwnerInfo:", cockieOwnerInfo)
  return cockieOwnerInfo;
}
