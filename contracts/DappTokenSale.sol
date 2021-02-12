pragma solidity >= 0.4.2;
import "./DappToken.sol";

contract DappTokenSale {
//to use selfdestruct i had to change address admin to "address payable admin"
	address payable  admin;
	DappToken public tokenContract;
	uint256 public tokenPrice;
    uint256 public tokensSold;
	
	event Sell(address _buyer,uint256 _amount);

//constructor
//function DappTokenSale() public 
	constructor(DappToken _tokenContract, uint256 _tokenPrice) public {

        //assign an admin 
    	 admin = msg.sender;
    	 //Token Contract
    	 tokenContract = _tokenContract;
    	 //Token Price
	   tokenPrice = _tokenPrice;
	}
	
	//create multiply function note: used his math lib https://dapp.tools/dappsys/ds-math.html
	function multiply(uint x, uint y) internal pure returns (uint z) {
	require(y == 0 || (z= x* y)/y == x);
	}
	
	
	//buy token
	function buyTokens(uint256 _numberOfTokens) public payable {
         // REquire that value is equal to tokensSold
//		 require(msg.value == _numberOfTokens * tokenPrice);
		require(msg.value == multiply(_numberOfTokens,tokenPrice));

		 // require that there are enough tokens in contract
		 require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
		 
		 // require that a transfer is successful
		 require(tokenContract.transfer(msg.sender, _numberOfTokens));
     	//keep track of tokensSold
		tokensSold += _numberOfTokens;
		
     	//emit Sell Event
		 emit Sell(msg.sender, _numberOfTokens);
	}
	
	//Ending Token DappTokenSale
	function endSale() public  {
		// require admin 
		require(msg.sender == admin);
		// transfer  remaining dapp tokens to admin
		require(tokenContract.transfer(admin,tokenContract.balanceOf(address(this))));
		// Destroy  contract
//as coded in course, but due to error and support note:	selfdestruct(admin);
//	selfdestruct(msg.sender);
//	selfdestruct(admin); Note working : get Error: Returned values aren't valid, did it run Out of Gas?
//		admin.transfer(address(this).balance);  //is this what course code has but still does work. ignore and go on
	}
	
}