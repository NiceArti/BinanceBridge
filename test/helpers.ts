import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";


export async function createSignature(message: any, account: any)
{
    const rc = await message.wait();
    const event = rc.events.find((event: any) => event.event === "SwapInitialized")
    const [token, from, value, nonce, idFrom, idTo] = event.args
    const msg = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256", "uint256", "uint256"], 
        [token, from, value, nonce, idFrom, idTo])
    return account.signMessage(ethers.utils.arrayify(msg))
}

export async function keygen(token: any, account: any, amount: any, nonce: any, chainFrom: any, chainTo: any) {
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],
          [token, account, amount, nonce, chainFrom, chainTo]
        )
    )
}

export async function getChainId() {
    return await ethers.getDefaultProvider().getNetwork()
}

export async function createToken()
{
    const Token = await ethers.getContractFactory("Token")
    let token = await Token.deploy()
    await token.deployed()

    return token;
}

export function Initialize(
    tokenA: any,
    tokenB: any,
    account: any,
    r: any,
    s: any,
    v: any = 0,
    amount: BigNumber = parseUnits('20'),
    nonce: any = 1,
    blockchainIdFrom: any = 31337,
    blockchainIdTo: any = 31337,
    status: any = 1
){
    return {
        tokenA: tokenA,
        tokenB: tokenB,
        account: account,
        amount: amount,
        nonce: nonce,
        blockchainIdFrom: blockchainIdFrom,
        blockchainIdTo: blockchainIdTo,
        v: v,
        r: r,
        s: s,
        status: status
    }
}