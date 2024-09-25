import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const NODIT_FULLNODE = "https://aptos-testnet.nodit.io/mOKySohzEyYYYL-hX4nB2P03yYqSfTHh/v1";
const NODIT_INDEXER = NODIT_FULLNODE + "/graphql"

export const aptosConfig = new AptosConfig({ network: Network.TESTNET, fullnode: NODIT_FULLNODE, indexer: NODIT_INDEXER });
export const aptos = new Aptos(aptosConfig);