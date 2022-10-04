import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const stakecoinAddress = "0xBEe6FFc1E8627F51CcDF0b4399a1e1abc5165f15";
  const stakeContractAddress = "";
  const stakeCoin = await ethers.getContractAt("IERC20", stakecoinAddress);
  const stakeContract = await ethers.getContractAt("stakeContract", stakeContractAddress);


  

    //impersonationg of a bored ape holder account to be able to use the private
    //key to approve transaction
    const boredapeHolder = "0x2c2ed4b3876c442fee80BeE76Ce0eE2CA2A512AF";
    await helpers.impersonateAccount(boredapeHolder);
    const impersonatedSigner = await ethers.getSigner(boredapeHolder);


    const stakeBal = await stakeCoin.balanceOf(impersonatedSigner);
    console.log("stakeBal of impersonated", stakeBal);

    const amt = ethers.utils.parseUnits("1500e18");
    const approveContract = await stakeCoin.connect(impersonatedSigner).approve(stakeContractAddress, amt);
    console.log("approveContract: ", approveContract);


    const userStake = await stakeContract.connect(impersonatedSigner).stake(amt);
    console.log("user stake: ", userStake);



    




  console.log(`stakeContract deployed to }`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
