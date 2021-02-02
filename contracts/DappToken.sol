//pragma solidity ^0.4.2;
pragma solidity >= 0.4.2;
contract DappToken {
	string public name ="DApp Token";
	string public symbol ="DAPP";
	string public standard ="DApp Token v1.0";  //not part of the erc-20 implementation


	// Constructor
	// Set the total number of tokens
	// REad the total number of tokens
	uint256 public totalSupply;	
//must create event
	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);
	mapping(address => uint256) public balanceOf;
	
	
//	function DappToken() public {
	constructor(uint256 _initialSupply) public {
       balanceOf[msg.sender] = _initialSupply;
	   totalSupply = _initialSupply;    //1000000;
	   // allocated the initial supply
	}	

	//need transfer function
    function transfer(address _to,uint256 _value ) public returns(bool success) {
     //Trigger exception if account does not have enough	
	 
     require(balanceOf[msg.sender] >= _value);//if eval to true continue, false then stop fnc and throw error. gas is used.
	 balanceOf[msg.sender] -= _value;
	 balanceOf[_to] += _value;
     //transfer Event: had to emit as earlier course vers was depecrated.
	 emit Transfer(msg.sender,_to,_value);
     // return a boolean
	 return true;
    }
}