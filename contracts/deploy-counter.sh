# To load the variables in the .env file
source .env

# To deploy and verify our contract
forge script script/Counter.s.sol:CounterScript --fork-url $ANVIL_RPC --private-key $PK --broadcast
