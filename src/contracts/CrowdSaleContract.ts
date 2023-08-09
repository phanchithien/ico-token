import { ethers } from "ethers";
import { getCrowdSaleAbi } from "./utils/getAbis";
import { getCrowdSaleAddress } from "./utils/getAddress";
import { getRPC } from "./utils/common";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BaseInterface } from "./interfaces";

export default class CrowdSaleContract extends BaseInterface {
    constructor(provider?: ethers.providers.Web3Provider) {
        const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
        super(provider || rpcProvider, getCrowdSaleAddress(), getCrowdSaleAbi());
        if (!provider) {
            this._contract = new ethers.Contract(this._contractAddress, this._abis, rpcProvider);
        }
    }

    async getBnbRate(): Promise<number> {
        let rate = await this._contract.BNB_rate();
        return this._toNumber(rate);
    }

    async getUsdtRate(): Promise<number> {
        const rate = await this._contract.USDT_rate();
        return this._toNumber(rate);
    }

    async buyTokenByBnB(amount: number) {
        const rate = await this.getBnbRate();
        const tx: TransactionResponse = await this._contract.buyTokenByBNB({
            ...this._option,
            value: this._numberToEth(amount/rate),
        });
        return this._handleTransactionResponse(tx);
    }

    async buyTokenByUSDT(amount: number) {
        const rate = await this.getUsdtRate();
        const tx: TransactionResponse = await this._contract.buyTokenByUSDT(
            this._numberToEth(amount/rate),
            this._option
        );
        return this._handleTransactionResponse(tx);
    }
}