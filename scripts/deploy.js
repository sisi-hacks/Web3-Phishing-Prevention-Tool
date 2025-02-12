const hre = require("hardhat");

async function main() {
  const URLReputation = await hre.ethers.getContractFactory("URLReputation");
  const contract = await URLReputation.deploy();

  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });