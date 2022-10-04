//require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
import "@nomiclabs/hardhat-ethers";
require("dotenv").config({ path: ".env" });


const URL = process.env.URL;
const PRIVATE = process.env.PRIVATE;

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      forking:{
        url: URL,
      }
    },
    goerli: {
      url: URL,
      accounts: [PRIVATE],
    }
  },
  // etherscan: {
  //   apiKey: "VUZ7GFPUYG8UGNZXS635722912XFCDBI67"
  // }
};
