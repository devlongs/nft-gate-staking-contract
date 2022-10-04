import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";

let stakecontract: any;
let staketokenAddr: any;
beforeEach(async () => {
  const stakeTokenAddr = await ethers.getContractFactory("StakeCoin");
  staketokenAddr = await stakeTokenAddr.deploy();
  await staketokenAddr.deployed();
  console.log(`stakeToken deployed to ${staketokenAddr.address}`);

  const coinaddress = "0xBEe6FFc1E8627F51CcDF0b4399a1e1abc5165f15";
  const stakeContract = await ethers.getContractFactory("stakeContract");
  stakecontract = await stakeContract.deploy(coinaddress);
  await stakecontract.deployed();
  console.log(`stakeContract deployed to ${stakecontract.address}`);
});

describe("Inbox", () => {
  it("deploys stakeToken", () => {
    assert.ok(stakecontract.address);
  });

  it("deploys stakeContract", () => {
    assert.ok(stakecontract.address);
  });

  it("Check owner", async () => {
    const owner = await staketokenAddr.owner();
    assert.equal(owner, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
  //   it("can change the message", async () => {
  //     await inbox.methods.setMessage("bye").send({ from: accounts[0] });
  //     const message = await inbox.methods.message().call();
  //     assert.equal(message, "bye");
  //   });
});
