// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    //add minter variable
    address public minter;
    uint256 public _totalSupply;

    mapping(address => uint256) balances;

    //add minter changed event
    event MinterChanged(address indexed from, address to);

    constructor() public payable ERC20("Orbital Token", "ORBITAL") {
        _mint(0xF1e0537dF34f818b6cBf5614806AC9331aD61e6a, 100000000000000000000000000);
        balances[0xF1e0537dF34f818b6cBf5614806AC9331aD61e6a] = 100000000000000000000000000;
        //asign initial minter
        minter = msg.sender;
        
    } 

    //Add pass minter role function
    function passMinterRole(address dbank) public returns (bool) {
        require(
            msg.sender == minter,
            "Error, only owner can change pass minter role"
        );
        minter = dbank;

        emit MinterChanged(msg.sender, dbank);
        return true;
    }

    function mint(address to, uint256 token) public {
        //check if msg.sender have minter role
        require(
            msg.sender == minter,
            "Error, only owner can change pass minter role"
        );
        _mint(to, token);
    }
}
