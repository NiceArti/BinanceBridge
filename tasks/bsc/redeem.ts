import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {BSC_DEPLOYED_CONTRACT} from "../helper"


task("redeem-bsc", "sends tokens in amount sended from other chain")
.addParam("account", "account of sender")
.addParam("tokenA", "token address to send")
.addParam("tokenB", "token address to receive")
.addParam("amount", "amount of tokens")
.addParam("nonce", "random number")
.addParam("chainIdTo", "chain id from what to receive tokens")
.addParam("chainIdTo", "chain id from what to receive tokens")
.setAction(async function (taskArguments, hre) {
    const contract = await hre.ethers.getContractAt("BinanceBridge", BSC_DEPLOYED_CONTRACT);
    
    let INIT = {
        account: taskArguments.account,
        tokenA: taskArguments.tokenA,
        tokenB: taskArguments.tokenB,
        amount: taskArguments.amount,
        nonce: taskArguments.nonce,
        blockchainIdFrom: taskArguments.chainIdFrom,
        blockchainIdTo: taskArguments.chainIdTo,
        v: taskArguments.v,
        r: taskArguments.r,
        s: taskArguments.s,
        status: taskArguments.status,
    }
    
    const transactionResponse = await contract.redeem(INIT, {gasLimit: 500_000});
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});