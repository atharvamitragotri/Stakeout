// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stakecoin is ERC20 {
    constructor() ERC20("Stakecoin", "STK") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}
