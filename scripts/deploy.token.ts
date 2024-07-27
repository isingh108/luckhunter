import hre, { ethers } from "hardhat";

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));
async function main() {
  const projectName = "Token";
  const name = "VLuckhunter";
  const symbol = "VLH";
  const decimals = 18;

  const airdropWallet = "0xb1F86EDB5be7E8ff7474881C67A7078Abed00b0A";
  const presaleBonusWallet = "0xb1F86EDB5be7E8ff7474881C67A7078Abed00b0A";
  const teamAndAdvisorsWallet = "0xb1F86EDB5be7E8ff7474881C67A7078Abed00b0A";
  const marketingWallet = "0xb1F86EDB5be7E8ff7474881C67A7078Abed00b0A";
  const liquidityPoolWallet = "0xb1F86EDB5be7E8ff7474881C67A7078Abed00b0A";
  const stakingRewardsWallet = "0xb1F86EDB5be7E8ff7474881C67A7078Abed00b0A";
  const referralsWallet = "0xb1F86EDB5be7E8ff7474881C67A7078Abed00b0A";
  const presaleWallet = "0xb1F86EDB5be7E8ff7474881C67A7078Abed00b0A";

  const gt = await ethers.deployContract(projectName, [
    name,
    symbol,
    decimals,
    airdropWallet,
    presaleBonusWallet,
    teamAndAdvisorsWallet,
    marketingWallet,
    liquidityPoolWallet,
    stakingRewardsWallet,
    referralsWallet,
    presaleWallet,
  ]);

  await gt.waitForDeployment();

  console.log(`contract deployed to ${gt.target}`);

  //verification of the smart contract
  const waitTime = 60;
  console.log(`Trying to verify after ${waitTime}s...`);
  await sleep(waitTime * 1000); // wait until blockchain indexes this newly deployed contract.
  try {
    await hre.run("verify:verify", {
      contract: "contracts/Token.sol:Token",
      address: gt.target,
      constructorArguments: [
        name,
        symbol,
        decimals,
        airdropWallet,
        presaleBonusWallet,
        teamAndAdvisorsWallet,
        marketingWallet,
        liquidityPoolWallet,
        stakingRewardsWallet,
        referralsWallet,
        presaleWallet,
      ],
    });
  } catch (e: any) {
    if (e.message.includes("Reason: Already Verified")) {
      return;
    }
    console.log(`Failed to verify. Retrying...`, e);
  }
  console.log("Done!");
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
