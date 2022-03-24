import { task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import {BSC_DEPLOYED_CONTRACT} from "../helper"


task("swap-bsc", "creates ERC721 nft token inside the contract")
.addParam("token", "token address to receive")
.addParam("amount", "amount of tokens")
.addParam("nonce", "random number")
.addParam("chainIdTo", "chain id from what to receive tokens")
.setAction(async function (taskArguments, hre) {
    const contract = await hre.ethers.getContractAt("BinanceBridge", BSC_DEPLOYED_CONTRACT);
    const transactionResponse = await contract.swap(
        taskArguments.token,
        taskArguments.amount,
        taskArguments.nonce,
        taskArguments.chainIDTo,
        {gasLimit: 500_000}
    );
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});