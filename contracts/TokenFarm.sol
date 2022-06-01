// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// stake tokens
// unstake tokens
// issue tokens
// timelock

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFarm is Ownable {
    IERC20 public stakeToken;
    IERC20 public daiToken;
    address[] public stakers;

    mapping(address => uint256) public stakingBalance;

    constructor(address _stakeToken, address _daiToken) public {
        stakeToken = IERC20(_stakeToken);
        daiToken = IERC20(_daiToken);
    }

    function checkAddressExists(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < stakers.length; i++) {
            if (stakers[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "Stake amount needs to be greater than zero!");
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        if (!checkAddressExists(msg.sender)) {
            stakers.push(msg.sender);
        }
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "Cannot unstake 0 tokens!");
        daiToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
    }

    function issueTokens() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            if (stakingBalance[stakers[i]] > 0) {
                stakeToken.transfer(stakers[i], stakingBalance[stakers[i]]);
            }
        }
    }
}
