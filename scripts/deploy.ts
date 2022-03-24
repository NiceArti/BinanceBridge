
import { ethers } from "hardhat";

async function main() {
  // KOVAN: 0x48C9CA42C01Ed0b619a233395e347Ddd9B4de9B0
  // BSC:   0x11171a4aB6528767dbFf72Bd14458Cc3850264ec
  // const BinanceBridge = await ethers.getContractFactory("BinanceBridge");
  // const bridge = await BinanceBridge.deploy();

  // await bridge.deployed();

  const Token = await ethers.getContractFactory("Token");
  const bridge = await Token.deploy();

  await bridge.deployed();

  console.log("Contract deployed to:", bridge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
