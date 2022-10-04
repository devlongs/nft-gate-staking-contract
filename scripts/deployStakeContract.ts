import { ethers } from "hardhat";

async function main() {
  //Impersonatoraddress = "0x2c2ed4b3876c442fee80BeE76Ce0eE2CA2A512AF"
  const coinaddress = "0xBEe6FFc1E8627F51CcDF0b4399a1e1abc5165f15";
  const stakeContract = await ethers.getContractFactory("stakeContract");
  const stakecontract = await stakeContract.deploy(coinaddress);

  await stakecontract.deployed();

  console.log(`stakeContract deployed to ${stakecontract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
