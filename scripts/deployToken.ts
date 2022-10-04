import { ethers } from "hardhat";

async function main() {
  const Impersonatoraddress = "0x2c2ed4b3876c442fee80BeE76Ce0eE2CA2A512AF"
  const StakeCoin = await ethers.getContractFactory("StakeCoin");
  const stakeCoin = await StakeCoin.deploy();

  await stakeCoin.deployed();
  console.log(`stakeCoin deployed to ${stakeCoin.address}`);

  //interact with it
  const stakeContract = await ethers.getContractAt("StakeCoin", stakeCoin.address);
  const amt = ethers.utils.parseUnits("15000000000000000000");
  const mint = await  stakeContract.transferOut(Impersonatoraddress, amt)
  console.log("minted: ", mint);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
