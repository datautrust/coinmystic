const DappToken = artifacts.require("./DappToken.sol");
const DappTokenSale = artifacts.require("./DappTokenSale.sol");

module.exports = function(deployer) {
  const tokenPrice= 1000000000000000; //  .001 Ether
  deployer.deploy(DappToken,1000000).then(function(){
	return deployer.deploy(DappTokenSale,DappToken.address,tokenPrice);  
  });
  
};
