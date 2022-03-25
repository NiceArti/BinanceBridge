# Binance Bridge contract


- Link to deployed contract ETH: [link](https://kovan.etherscan.io/address/0x9Ef0b2389621158EA2691ff597b68e3D38B93aB2)
- Link to deployed contract BSC: [link](https://testnet.bscscan.com/address/0x36140E9fc2185df80Dc07f123b8C83f81b61ad17)
- Contract address ETH: 0xF1d92f1A54865bbc012a6b77C32A94dCcB26eD43
- Contract address BSC: 0x29b610AB8AF49C4Df30882e0Ec01aB11F6051f8f


## Faucet token Kovan

Kovan testnet faucet [link](https://kovan.etherscan.io/address/0xF1d92f1A54865bbc012a6b77C32A94dCcB26eD43)


## Faucet token Binance Testnet

Binance testnet faucet [link](https://testnet.bscscan.com/address/0x29b610AB8AF49C4Df30882e0Ec01aB11F6051f8f)


- OpenZeppelin library: [link](https://github.com/OpenZeppelin/openzeppelin-contracts)



## Try running some of the following tasks:

| Task | Description |
| --- | --- |
| `npx hardhat swap-{eth/bsc} --token some_address --amount some_amount --nonce some_value --chain-id-to chain --network {kovan/testnet}` | swaps token from one chain to other |
| `npx hardhat redeem-{eth/bsc} --account some_acc --tokenA some_address --tokenB some_address --amount some_amount --nonce some_value --chain-id-from chain --chain-id-to chain --network {kovan/testnet}` | sends tokens in amount sended from other chain |

