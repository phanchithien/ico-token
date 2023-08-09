

export type AddressType = {
    97: string;
    56: string;
}

export enum CHAIN_ID {
    TESTNET = 97,
    MAINNET = 56,
}

export default function getChainIdFromEnv(): number {
    const env = process.env.NEXT_PUBLIC_CHAIN_ID;
    if (!env) { return 97;}
    return parseInt(env);
}

export const getRPC = () => {
    if (getChainIdFromEnv() === CHAIN_ID.MAINNET)
        return process.env.NEXT_PUBLIC_RPC_MAINNET;
    return process.env.NEXT_PUBLIC_RPC_TESTNET;
}

export const SMART_ADDRESS = {
    CROWD_SALE: {97: '0x81e2687626F9B6F0090899d37C2B59418803DfE2', 56: ''},
    USDT: {97: '0x2bE6Bbf5024f452d9B05C59Bd6D10382e792a541', 56: ''},
}