// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20 {
    constructor(
        string memory _name,
        string memory symbol,
        uint256 _supply,
        uint256 _decimals
    ) ERC20(_name, symbol){
        _mint(msg.sender, _supply * 10 ** _decimals);
    }
}