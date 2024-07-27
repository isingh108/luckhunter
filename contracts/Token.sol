// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Luckhunter is ERC20, Ownable {
    uint256 private constant TOTAL_SUPPLY = 8066087838 * 10 ** 18;

    address public airdropWallet;
    address public presaleBonusWallet;
    address public teamAndAdvisorsWallet;
    address public marketingWallet;
    address public liquidityPoolWallet;
    address public stakingRewardsWallet;
    address public referralsWallet;
    address public presaleWallet;

    constructor(
        string memory _name,
        string memory symbol,
        uint256 _decimals,
        address _airdropWallet,
        address _presaleBonusWallet,
        address _teamAndAdvisorsWallet,
        address _marketingWallet,
        address _liquidityPoolWallet,
        address _stakingRewardsWallet,
        address _referralsWallet,
        address _presaleWallet
    ) ERC20(_name, symbol) Ownable(msg.sender) {
        airdropWallet = _airdropWallet;
        presaleBonusWallet = _presaleBonusWallet;
        teamAndAdvisorsWallet = _teamAndAdvisorsWallet;
        marketingWallet = _marketingWallet;
        liquidityPoolWallet = _liquidityPoolWallet;
        stakingRewardsWallet = _stakingRewardsWallet;
        referralsWallet = _referralsWallet;
        presaleWallet = _presaleWallet;

        _mint(airdropWallet, 80660878 * 10 ** _decimals);
        _mint(presaleBonusWallet, 403304392 * 10 ** _decimals);
        _mint(teamAndAdvisorsWallet, 241982635 * 10 ** _decimals);
        _mint(marketingWallet, 403304392 * 10 ** _decimals);
        _mint(liquidityPoolWallet, 1613217568 * 10 ** _decimals);
        _mint(stakingRewardsWallet, 1209913176 * 10 ** _decimals);
        _mint(referralsWallet, 80660878 * 10 ** _decimals);
        _mint(presaleWallet, 4033043919 * 10 ** _decimals);
    }
}
