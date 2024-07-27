# Luck Hunter Project
This repository contains the `Presale` smart contract, a token presale system with multiple rounds, cliff and vesting periods, and token deposit and claim functionality. The contract is written in Solidity and uses OpenZeppelin contracts for security and functionality.
 
## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Functions](#functions)
- [Events](#events)
- [Security](#security)
- [License](#license)

## Overview

The `Presale` contract facilitates a token presale with multiple rounds. Users can deposit tokens during the sale rounds and claim their vested tokens after the vesting period. The contract owner can manage the sale rounds, token deposits, and withdrawals.

## Features

- **Multiple Rounds**: The contract supports up to 10 presale rounds with different token prices and caps.
- **Vesting and Cliff Periods**: Users' tokens are vested over time with an initial cliff period.
- **Pausable**: The contract can be paused and unpaused by the owner.
- **Token Management**: The contract owner can add and withdraw tokens from the presale contract.
- **Event Logging**: Key actions within the contract emit events for off-chain tracking.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/presale-contract.git
   cd presale-contract
   ```

2. **Install dependencies**:

   ```bash
   npm install
   npx hardhat test
   ```

## Usage

### Deployment
Deploy Token
npx hardhat --network bsc run scripts/deploy.token.ts

Deploy Presale
npx hardhat --network bsc run scripts/deploy.presale.ts


Deploy the `Presale` contract by providing the necessary constructor parameters:

- `_projectName`: Name of the project.
- `_vestingToken`: Address of the vesting token.
- `_depositToken`: Address of the deposit token.
- `_vestingDuration`: Duration of the vesting period in seconds.
- `_vestingInterval`: Interval for vesting in seconds.
- `_cliffDuration`: Duration of the cliff period in seconds.
- `_vestingStartTime`: Start time of the vesting period (Unix timestamp).
- `_cliffPercentage`: Percentage of tokens released at the end of the cliff period (0-100).
 

## Functions

### User Functions



- `depositTokens(uint256 amount)`: Deposit tokens during the current round.
- `claimTokens`: Claim vested tokens..
- `_depositToken`: Address of the deposit token.

### Owner Functions

- `updateVestingStartTime(uint256 _start)`: Update the vesting start time.
- `updateRoundTimes(uint8[] calldata _rounds,uint256[] calldata _starts, uint256[] calldata _ends)`: Update the start and end times for presale rounds.
- `nextRound()`: Move to the next presale round.
- `addTokensToPresale(uint256 amount)`: Add Vesting tokens to the presale contract.
- `withdrawTokens(address _token)`: Withdraw tokens from the presale contract.
- `pause()`: Pause the contract.
- `unpause()`: Unpause the contract.

### Events

- `TokensDeposited(address indexed user, uint256 amount)`: Emitted when a user deposits tokens.
- `TokensClaimed(address indexed user, uint256 amount)`: Emitted when a user claims tokens.
- `TokenAdded(address indexed token, uint256 amount)`: Emitted when tokens are added to the presale.
- `TokenWithdraw(address indexed token, uint256 amount)`: Emitted when tokens are withdrawn from the presale.
- `RoundTimeUpdated(uint256 indexed round, uint256 start, uint256 end)`: Emitted when a round's start and end times are updated.

### Security
- Keep the contract owner’s private key secure.
