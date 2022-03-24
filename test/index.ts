import { expect } from "chai";
import { parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import * as helper from "./helpers"
import { BigNumber, ContractTransaction, Signature } from "ethers";
import { BinanceBridge, Token } from "../typechain";

describe("BinanceBridge", function () {
  const ZERO_ADDRESS: string = '0x0000000000000000000000000000000000000000'
  let owner: any, acc1: any


  let instance: BinanceBridge

  let token: Token
  let token2: Token

  const chainID = 31337
  const TRANSFER_AMOUNT = parseUnits('20')

  beforeEach(async () => 
  {
    // create accounts
    [owner, acc1] = await ethers.getSigners()
    // create token
    
    token = await helper.createToken()
    token2 = await helper.createToken()


    const BinanceBridge = await ethers.getContractFactory("BinanceBridge")
    instance = await BinanceBridge.deploy()
    
    await instance.deployed()

    await instance.setEquivalent(token.address, token2.address, chainID)
  });


  describe("redeem: ", () => 
  {
    beforeEach(async () => 
    {
      await token.approve(instance.address, TRANSFER_AMOUNT)
    })

    it("redeem: Should return tokens when call redeem", async () => 
    {
      let key: string = await helper.keygen(token.address, owner.address, TRANSFER_AMOUNT, 1, chainID, chainID)
      let message: ContractTransaction = await instance.swap(token.address, TRANSFER_AMOUNT, 1, chainID)

      // create message
      let signature = await helper.createSignature(message, owner)
      let sig: Signature = ethers.utils.splitSignature(signature);

      const v = sig.v;
      const r = sig.r;
      const s = sig.s;

      let Initialize = helper.Initialize(token.address,token2.address,owner.address,r, s, v)
      let balanceBefore: BigNumber = await token.balanceOf(owner.address)
      await instance.redeem(key, Initialize)
      let balanceAfter: BigNumber = await token.balanceOf(owner.address)

      expect(balanceBefore).to.equal(balanceAfter.sub(TRANSFER_AMOUNT))
    });

    it("redeem: Should fail when call redeem twice", async () =>
    {
      let key = await helper.keygen(token.address, owner.address, TRANSFER_AMOUNT, 1, chainID, chainID)
      let message: ContractTransaction = await instance.swap(token.address, TRANSFER_AMOUNT, 1, chainID)

      // create message
      let signature = await helper.createSignature(message, owner)
      let sig: Signature = ethers.utils.splitSignature(signature);

      const v = sig.v;
      const r = sig.r;
      const s = sig.s;

      let Initialize = helper.Initialize(token.address,token2.address,owner.address,r, s, v)

      await instance.redeem(key, Initialize)
      expect(instance.redeem(key, Initialize)).to.be.revertedWith("BinanceBridge: not initialized")
    })

    it("redeem: Should fail caller is not owner", async () =>
    {
      let key = await helper.keygen(token.address, owner.address, 20, 1, chainID, chainID)
      let message: ContractTransaction = await instance.swap(token.address, TRANSFER_AMOUNT, 1, chainID)

      // create message
      let signature = await helper.createSignature(message, owner)
      let sig: Signature = ethers.utils.splitSignature(signature);

      const v = sig.v;
      const r = sig.r;
      const s = sig.s;

      let Initialize = helper.Initialize(token.address,token2.address,owner.address,r, s, v)

      expect(instance.connect(acc1).redeem(key, Initialize)).to.be.revertedWith("BinanceBridge: not a caller")
    })
  })

  let key: string
  describe("returnTokens: ", () => 
  {
    beforeEach(async () => 
    {
      await token.approve(instance.address, TRANSFER_AMOUNT)
      await instance.swap(token.address, TRANSFER_AMOUNT, 1, chainID)
      key = await helper.keygen(token.address, owner.address, TRANSFER_AMOUNT, 1, chainID, chainID)
    })

    it("returnTokens: Should return tokens when call redeem", async () => 
    {
      await instance.returnTokens(key)
      expect(await token.balanceOf(owner.address)).to.equal(parseUnits('1000000000'))
    });

    it("returnTokens: Should fail when call status is not initialized", async () =>
    {
      expect(instance.connect(acc1).returnTokens(key)).to.be.revertedWith("BinanceBridge: not initialized")
    })

    it("returnTokens: Should fail when call twice", async () =>
    {
      await instance.returnTokens(key)
      expect(instance.returnTokens(key)).to.be.revertedWith("BinanceBridge: not initialized")
    })
  })

  describe("setEquivalent: ", () => 
  {
    it("setEquivalent: Should store equivalent address in the other network", async () => 
    {
      await instance.setEquivalent(token.address, token2.address, 3)
      expect(await instance.tokenEquivalent(token.address, 3)).to.equal(token2.address)
    });

    it("setEquivalent: Should fail if called with not owner", async () =>
    {
      expect(instance.connect(acc1).returnTokens(key)).to.be.revertedWith("Ownable: not an owner")
    })
  })

  describe("donateToken: ", () => 
  {
    it("donateToken: Should donate token and set equivalent in other network", async () => 
    {
      await token.approve(instance.address, TRANSFER_AMOUNT)
      await instance.donateToken(token.address, token2.address, 3, TRANSFER_AMOUNT)
      expect(await token.balanceOf(instance.address)).to.equal(TRANSFER_AMOUNT)
    });
  })
});
