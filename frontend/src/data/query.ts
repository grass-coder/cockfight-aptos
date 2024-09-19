import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { aptos } from "../lib/aptosClient";

// 0x1::aptos_coin::AptosCoin
export const getBalance = async (address: string, coinType: string): Promise<number | undefined> => {
  const payload: InputViewFunctionData = {
    function: "0x1::coin::balance",
    typeArguments: [coinType],
    functionArguments: [address]
  };
    
  const balance = await aptos.view({ payload });

  return balance.length > 0 ? Number(balance[0]) : undefined;
}