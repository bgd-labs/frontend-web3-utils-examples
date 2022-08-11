# BGD front-end example
The purpose of this repo is to demonstrate how to structure front-end project to play nicely with [`fe-shared`][1] package

## What do we build?
It’s a simple counter project which will showcase how interact with other blockchain, how to submit and wait for transaction and how to structure folders and structure.  
Keep in mind the project is highly opinionated and is not meant to be universal

## The contract
The whole contract is a bit modified example of [SimpleStorage example][2]
Source code looks like this 

```Solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.10;

contract SimpleStorage {
    uint256 storedData;

    function increment() public {
        storedData++;
    }

    function decrement() public {
        if (storedData > 0) {
            storedData--;
        }
    }

    function getCurrentNumber() public view returns (uint256) {
        return storedData;
    }
}

```

If you want to see how front-end is build, skip to front-end part right away, otherwise here is how to run the project with local anvil environment from [foundry][3]
### Running locally and deploying the contract
1. Install [foundy][4] 
2. In terminal run command `anvil`, the output should look something like this  
	![Anvil output][image-1]
3. Add one of the private keys from anvil output like so
```bash
export PK= 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
4. Add anvil url to .env variables (don’t forget http:// before anvil url) 
```bash
export ANVIL_RPC=http://127.0.0.1:8545
```
6. Deploy `Counter` contract to anvil go to contracts folder and execute
```bash
forge script contracts/src/script/Counter.s.sol:CounterScript --fork-url $ANVIL_RPC --private-key $PK --broadcast
```

Once the contract is deployed you should have contract address like so
![Contract deployed output][image-2]
Let’s test if it’s working fine, in the same terminal session do
```bash
export CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
```
Let’s verify if contract is working as expected
1. Increment 
```bash
cast send $CONTRACT_ADDRESS "increment()" --private-key $PK --rpc-url $ANVIL_RPC
```
2. Get counter value _should output 1_
```bash
cast call $CONTRACT_ADDRESS "getCurrentNumber()(uint256)" --rpc-url $ANVIL_RPC
```

Hooray! The contract is deployed and running on local network. 

### Optional generate [TypeChain][5] types
1. Install `npm i -g @typechain/ethers-v5 `
```bash
	typechain --target ethers-v5 --out-dir ./contracts './out/Counter.sol/**.json'
	```
_Contracts folder is already located in example package, no need to do anything_

## Front-end

[1]:	https://github.com/bgd-labs/fe-shared
[2]:	https://docs.soliditylang.org/en/develop/introduction-to-smart-contracts.html#storage-example
[3]:	https://github.com/foundry-rs/foundry
[4]:	https://getfoundry.sh/
[5]:	https://github.com/dethcrypto/TypeChain

[image-1]:	./front-end/public/anvil_output.png
[image-2]:	./front-end/public/anvil_deploy.png