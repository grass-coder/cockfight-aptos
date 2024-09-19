import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const NODIT_FULLNODE = "https://aptos-testnet.nodit.io/mOKySohzEyYYYL-hX4nB2P03yYqSfTHh/v1";
const NODIT_INDEXER = NODIT_FULLNODE + "/graphql"

export const aptosConfig = new AptosConfig({ network: Network.TESTNET, fullnode: NODIT_FULLNODE, indexer: NODIT_INDEXER });
export const aptos = new Aptos(aptosConfig);
export const TEST_APT_ADDRESS = "0xd23929f631c0ff1f0f3a152502a897c673e403c96875678f44f58f4755b9ab59"
// const fund = await aptos.getAccountInfo({ accountAddress: "0x123" });
// const modules = await aptos.getAccountModules({ accountAddress: "0x123" });
// const tokens = await aptos.getAccountOwnedTokens({ accountAddress: "0x123" });