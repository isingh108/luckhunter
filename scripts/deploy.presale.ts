import hre, { ethers } from "hardhat";

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));
async function main() {
  const currentTimestampInSeconds = 1721906293;

  const projectName = "Luckhunter Presale";
  const vestingToken = "0x512F6fce50b488848D283029e18E721BDa396d4F";
  const depositToken = "0x02e874C09626d1515e863f8b9fe5Fb392B3f9581";
  const vestingDuration = 10 * 60;
  const vestingInterval = 2 * 60;
  const cliffDuration = 3 * 60;
  const vestingStartTime = currentTimestampInSeconds + 6 * 60;
  const cliffPercentage = 20; //percentage released at cliff

  const gt = await ethers.deployContract("Presale", [
    projectName,
    vestingToken,
    depositToken,
    vestingDuration,
    vestingInterval,
    cliffDuration,
    vestingStartTime,
    cliffPercentage,
  ]);

  await gt.waitForDeployment();

  console.log(`contract deployed to ${gt.target}`);

  //verification of the smart contract
  const waitTime = 60;
  console.log(`Trying to verify after ${waitTime}s...`);
  await sleep(waitTime * 1000); // wait until blockchain indexes this newly deployed contract.
  try {
    await hre.run("verify:verify", {
      contract: "contracts/Presale.sol:Presale",
      address: gt.target,
      constructorArguments: [
        projectName,
        vestingToken,
        depositToken,
        vestingDuration,
        vestingInterval,
        cliffDuration,
        vestingStartTime,
        cliffPercentage,
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
