import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { NODIT_API_KEY, NODIT_ENABLED } from "./consts";

const NODIT_FULLNODE = `https://aptos-testnet.nodit.io/${NODIT_API_KEY}/v1`;
const NODIT_INDEXER = NODIT_FULLNODE + "/graphql"
const config = NODIT_ENABLED ? { network: Network.TESTNET, fullnode: NODIT_FULLNODE, indexer: NODIT_INDEXER } : { network: Network.TESTNET }

export const aptosConfig = new AptosConfig(config);
export const aptos = new Aptos(aptosConfig);