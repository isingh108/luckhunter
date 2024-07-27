import hre, { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));
describe("Luckhunter Presale Contract", () => {
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const projectName = "Luckhunter Presale";
    const vestingDuration = 10 * 60;
    const vestingInterval = 2 * 60;
    const cliffDuration = 3 * 60;
    const vestingStartTime = currentTimestampInSeconds + 6 * 60;
    const cliffPercentage = 20; //percentage released at cliff

    const tokneIns = await ethers.getContractFactory("TestToken");

    const depositToken = await tokneIns.deploy(
      "Initial coin offering",
      "ICO",
      1000000,
      18
    );
    const vestingToken = await tokneIns.deploy("Genie", "GNI", 10000000000000, 18);

    const _presale = await ethers.getContractFactory("Presale");
    const presale = await _presale.deploy(
      projectName,
      vestingToken.target,
      depositToken.target,
      vestingDuration,
      vestingInterval,
      cliffDuration,
      vestingStartTime,
      cliffPercentage
    );

    return { depositToken, vestingToken, presale, owner, otherAccount };
  }

  it("should deposit tokens", async () => {
    const { depositToken, vestingToken, presale, owner, otherAccount } =
      await loadFixture(deployContract);

    // Allocate tokens to the other account
    const amountToTransfer = ethers.parseUnits("1000", 18);
    await depositToken.transfer(otherAccount.address, amountToTransfer);
    await vestingToken.transfer(presale.target, amountToTransfer);

    // Approve presale contract to spend deposit tokens
    await depositToken
      .connect(otherAccount)
      .approve(presale.target, ethers.parseUnits("500", 18));

    // Set round times
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const start = currentTimestampInSeconds;
    const end = start + 5 * 60; // round lasts for 5 minutes
    await presale.updateRoundTimes([0], [start], [end]);
    const times = await presale.roundTime(0);
    console.log(times);
     
    // Mine a block at the start time
    await ethers.provider.send("evm_setNextBlockTimestamp", [start]);
    await ethers.provider.send("evm_mine", []);

    await sleep((1) * 1000);

    await presale.connect(otherAccount).depositTokens(ethers.parseUnits("10", 18));

    const userDetails = await presale.userDetails(otherAccount.address);
    expect(userDetails.investedAmount).to.equal(ethers.parseUnits("10", 18));
    expect(userDetails.totalVestedAmounts).to.be.gt(0); // Check that tokens are vested
  });
  it("should claim tokens after cliff period", async () => {
    const { depositToken, vestingToken, presale, owner, otherAccount } =
      await loadFixture(deployContract);

    // Allocate tokens to the other account
    const amountToTransfer = ethers.parseUnits("1000", 18);
    await depositToken.transfer(otherAccount.address, amountToTransfer);
    await vestingToken.transfer(owner.address, ethers.parseUnits("10000000000", 18));

    await vestingToken
      .connect(owner)
      .approve(presale.target, ethers.parseUnits("100000000", 18));

    await presale.connect(owner).addTokensToPresale(ethers.parseUnits("100000000", 18));


    // Approve presale contract to spend deposit tokens
    await depositToken
      .connect(otherAccount)
      .approve(presale.target, ethers.parseUnits("500", 18));

    // Set round times
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const start = currentTimestampInSeconds;
    const end = start + 5 * 60; // Round lasts for 5 minutes
    await presale.updateRoundTimes([0], [start], [end]);

    // Mine a block at the start time
    await ethers.provider.send("evm_setNextBlockTimestamp", [start]);
    await ethers.provider.send("evm_mine", []);

    await presale.connect(otherAccount).depositTokens(ethers.parseUnits("10", 18));
    const vestingStartTime = await presale.vestingStartTime();
    const cliffDuration = await presale.cliffDuration();

    // Fast forward time to ensure cliff duration is over
    const cliffEndTime = parseInt(vestingStartTime) + parseInt(cliffDuration) + 1; // Ensure cliff is over
    await ethers.provider.send("evm_setNextBlockTimestamp", [cliffEndTime]);
    await ethers.provider.send("evm_mine", []);
    const claimableTokens = await presale.calculateUnlockedToken(otherAccount.address);

    // Claim tokens
    await presale.connect(otherAccount).claimTokens();

    const userDetails = await presale.userDetails(otherAccount.address);

    expect(userDetails.claimedTokens).to.equal(claimableTokens);
  });
});
