// CONTRACT
export const COCKFIGHT_MODULE_NAME = 'cockie'
export const COCKFIGHT_MODULE_ADDRESS = '0xd23929f631c0ff1f0f3a152502a897c673e403c96875678f44f58f4755b9ab59'

// REGEX
export const INIT_BECH32_REGEX = /^init1(?:[a-z0-9]){38}/
export const INIT_HEX_REGEX = /0x(?:[a-f1-9][a-f0-9]*){1,64}/
export const INIT_ACCOUNT_REGEX = new RegExp(
  INIT_BECH32_REGEX.source + '|' + INIT_HEX_REGEX.source
)
export const INIT_OPERATOR_ADD_REGEX = /^initvaloper1[a-z0-9]{38}$/
export const BASE_64_REGEX =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
export const CHAIN_ID_REGEX = /^[a-zA-Z0-9-]{1,32}$/


export const DUMMY_VOLATILE_COCKIE_PRICE = 1_000_000
export const DUMMY_STABLE_COCKIE_PRICE = 1_000_000
export const DUMMY_EGG_PRICE = 100
export enum CockieType {
    STABLE = 'STABLE',
    VOLATILE = 'VOLATILE',
}


export const API_URL = import.meta.env.VITE_API_URL || 'https://api.cockfight.shop'
