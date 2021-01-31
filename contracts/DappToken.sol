//pragma solidity ^0.4.2;
pragma solidity >= 0.4.2;
contract DappToken {
	// Constructor
	// Set the total number of tokens
	// REad the total number of tokens
	uint256 public totalSupply;	
//	function DappToken() public {
	constructor() public {
	   totalSupply = 1000000;
	   
	}	
}