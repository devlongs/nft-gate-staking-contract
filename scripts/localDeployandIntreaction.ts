import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const hre = require("hardhat");

async function main() {
    //impersonationg of a bored ape holder account to be able to use the private
    //key to approve transaction
    const boredapeHolder = "0x2c2ed4b3876c442fee80BeE76Ce0eE2CA2A512AF";
    // const impersonatedSigner = await helpers.impersonateAccount(boredapeHolder);

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [boredapeHolder],
      });
      const signer = await ethers.getSigner(boredapeHolder)

      console.log("signer: ", signer.address)
    
    //const impersonatedSigner = await ethers.getSigner(boredapeHolder);

    //deployed staketoken
  const StakeCoin = await ethers.getContractFactory("StakeCoin");
  const stakeCoin = await StakeCoin.deploy();
  await stakeCoin.deployed();
  console.log(`stakeCoin deployed to ${stakeCoin.address}`);

    //deployed stake contract
  const stakeContract = await ethers.getContractFactory("stakeContract");
  const stakecontract = await stakeContract.deploy(stakeCoin.address)
  await stakecontract.deployed();
  console.log(`stakeContract deployed to ${stakecontract.address}`);

  //interact with it
  const interactStakeContract = await  ethers.getContractAt("stakeContract", stakecontract.address)
  const InteractstakeCoin = await ethers.getContractAt("StakeCoin", stakeCoin.address);

  //deposit to impersontor and contract
  const amt = ethers.utils.parseUnits("1500");
  const mint = await  InteractstakeCoin.transferOut(signer.address, amt)
  console.log("minted: ", mint);

  const depositCont = await  InteractstakeCoin.transferOut(stakecontract.address, amt)
  console.log("deposit to contract: ", depositCont);

  const stakeBal = await InteractstakeCoin.balanceOf(signer.address);
  console.log("stakeBal of impersonated", stakeBal);

  const stakeAmt = ethers.utils.parseUnits("20000");
  const approveContract = await InteractstakeCoin.connect(signer).approve(stakecontract.address, stakeAmt);
  console.log("approveContract: ", approveContract);


  const userStake = await interactStakeContract.connect(signer).stake(amt);
  console.log("user stake: ", userStake);

  const userWithdraw = await interactStakeContract.connect(signer).withdraw();
  console.log("user withdraw: ", userWithdraw);

  const userDetails = await interactStakeContract.connect(signer).getUser(signer.address);
  console.log("user Details: ", userDetails);









}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
