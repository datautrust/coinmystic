var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken',function(accounts) {
	var tokenInstance;
	
	it('initializes the contract with the correct values',function() {
		return DappToken.deployed().then(function(instance) {
		tokenInstance = instance;
		return tokenInstance.name(); 
		}).then(function(name) {
			assert.equal(name,'DApp Token','has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol) {
			assert.equal(symbol,'DAPP','has the correct symbol');
			return tokenInstance.standard();
		}).then(function(standard){
			assert.equal(standard,"DApp Token v1.0",'has the correct standard');
			
		});
		
	})
	
	
	it('allocates the initial supply upon deployment',function() {
		return DappToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(),1000000,'sets the total supply to 1,000,000');
//			console.log(tokenInstance.balanceOf(accounts[0]));
// truffle test gives error with .balanceOf says not a function:
           return tokenInstance.balanceOf(accounts[0]);
//		    web3.eth.getBalance(accounts[0]).then (balance => {
//				console.log(balance);
//		});
			
//
		}).then(function(adminBalance)
			{
			  assert.equal(adminBalance.toNumber(),1000000,'it allocates initial supply to admin account')	
				
			})
		})
		
	it('transfers token ownership', function() {
			return DappToken.deployed().then(function(instance) 
			{
			 tokenInstance = instance;
			 // Test 'require' statement first by transferring something larger than sender's balance
			 return tokenInstance.transfer.call(accounts[1], 999999999999999999);
			 
			}).then(assert.fail).catch(function(error) {
				assert(error.message.toString().indexOf('revert') >=0, 'error message must contain revert');
//the above line is failing. i add .toString() but just comment it out for now ?????				
				return tokenInstance.transfer.call(accounts[1],250000, {from: accounts[0]});
			}).then(function(success) {
			assert.equal(success,true,'it returns true');
       	  return tokenInstance.transfer(accounts[1],250000,{from: accounts[0]});
			}).then(function(receipt)
			{
			  assert.equal(receipt.logs.length,1,'triggers one event');
			  assert.equal(receipt.logs[0].event,'Transfer','should be the "Transfer " event');
			  assert.equal(receipt.logs[0].args._from,accounts[0],'logs the account the tokens are transferred from');
			  assert.equal(receipt.logs[0].args._to,accounts[1],'logs teh account the tokens are transferred to');
			  assert.equal(receipt.logs[0].args._value,250000,'logs the transfer amount');
			  return tokenInstance.balanceOf(accounts[1]); 	
			   
			}).then(function(balance){
				assert.equal(balance.toNumber(),250000,'adds the amount to the rececing account');
				return tokenInstance.balanceOf(accounts[0]);
			}).then(function(balance) {
				assert.equal(balance.toNumber(),750000,'deducts the amount from sending account');
			})
		
	});
		
	it('approves tokens for delegated transfer',function(){
			return DappToken.deployed().then(function(instance) {
			  tokenInstance = instance;
			  return tokenInstance.approve.call(accounts[1],100);	 //recall that using call does not call the blockchain
			  
			}).then(function(success){
			   assert.equal(success, true, "it returns true");	
			   return tokenInstance.approve(accounts[1],100,{from: accounts[0]});  //here do don't use call. here we want to call to change data
			}).then(function(receipt) {
			  assert.equal(receipt.logs.length,1,'triggers one event');
			  assert.equal(receipt.logs[0].event,'Approval','should be the "Approval" event');
			  assert.equal(receipt.logs[0].args._owner,accounts[0],'logs the account the tokens are authorized by');
			  assert.equal(receipt.logs[0].args._spender,accounts[1],'logs teh account the tokens are authorized to');
			  assert.equal(receipt.logs[0].args._value,100,'logs the transfer amount');
	         return tokenInstance.allowance(accounts[0],accounts[1]);
			}).then(function(allowance){
				assert.equal(allowance.toNumber(),100,'stores the allowance for delegated transfer');
			});
	});

	it('handles delegated token transfers',function() {
			return DappToken.deployed().then(function(instance) {
			  tokenInstance = instance;	
			  fromAccount = accounts[2];
			  toAccount = accounts[3];
			  spendingAccount = accounts[4];
			  // transfer some tokens to fromAccount
			  return tokenInstance.transfer(fromAccount, 100, {from:accounts[0] });  //for testing using accounts[0] which we have given tokens
			}).then(function(receipt) {
				// approve spendingAccount to spend 10 tokens from fromAccount
				return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});// ?????????????
			}).then(function(receipt) {
				// try transfering something larger than sender's balance
				return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount}); //test with >100 to see it fail
			}).then(assert.fail).catch(function(error) {
// original				assert(error.message.indexOf('revert') >=0,'cannot transfer value larger than balance' );
				assert(error.message.toString().indexOf('revert') >=0,'cannot transfer value larger than balance' );
				
// note in the above code i get error TypeError: error.message.indexOf is not a function
// so per support note I will change it
//https://stackoverflow.com/questions/62111564/assertionerror-error-message-must-contain-revert
//				https://stackoverflow.com/questions/36483151/uncaught-typeerror-indexof-is-not-a-function
// this is the note that worked toString https://stackoverflow.com/questions/39821472/indexof-is-not-a-function
//Try transfering something larger than approved amount	

			return tokenInstance.transferFrom(fromAccount,toAccount, 20, {from: spendingAcount});
			}).then(assert.fail).catch(function(error) { 
	assert(error.message.toString().indexOf('revert') >=0,'cannot transfer value larger than approved amountXXX');
//the above line is failing. i add .toString() but just comment it out for now ?????

               return tokenInstance.transferFrom.call(fromAccount, toAccount,10, {from: spendingAccount});
			}).then(function(success){
			   assert.equal(success,true);
			   return tokenInstance.transferFrom(fromAccount,toAccount,10,{from : spendingAccount});
			}).then(function(receipt) {
	

              assert.equal(receipt.logs.length,1,'triggers one event');
			  assert.equal(receipt.logs[0].event,'Transfer','should be the "Transfer" event');
			  assert.equal(receipt.logs[0].args._from,fromAccount,'logs the account the tokens are transferred from ');
			  assert.equal(receipt.logs[0].args._to, toAccount,'logs teh account the tokens are transferred to');
			  assert.equal(receipt.logs[0].args._value,10,'logs the transfer amount');

			return tokenInstance.balanceOf(fromAccount);
	
			}).then(function(balance){
				assert.equal(balance.toNumber(),90,'deducts the amount from the sending account');
				return tokenInstance.balanceOf(toAccount);
			}).then(function(balance){
				assert.equal(balance.toNumber(),10,'adds the amount to the receiving account');
//				return tokenInstance.balanceOf(toAccount);;
				return tokenInstance.allowance(fromAccount, spendingAccount);
		}).then(function(allowance){
			assert.equal(allowance.toNumber(),0,'deducts teh amount from the allowance');
		});
	});
});


