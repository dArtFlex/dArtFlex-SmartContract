const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const axios = require("axios");
const ethers = require('ethers');

const os = require('os');
var json = require(os.homedir() + "/.ethereum/rinkeby.json");

const config = {
	private: json.key, // DO NOT PUSH PRIVATE KEY IN PUBLIC REPO! YOU PROBABLY SHOULD USE ENV VARIABLES HERE
	rpc: json.url,
	erc721ContractAddress: "0x6ede7f3c26975aad32a475e1021d8f6f39c89d82",
	apiBaseUrl: "https://api-staging.rarible.com"
}

const client = axios.create({
	baseURL: "https://api-staging.rarible.com"
})


const maker = new HDWalletProvider(config.private, config.rpc)
const web3 = new Web3(maker)

const contractAbi = JSON.parse(`[{ "inputs": [ { "components": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "string", "name": "uri", "type": "string" }, { "internalType": "address[]", "name": "creators", "type": "address[]" }, { "components": [ { "internalType": "address payable", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "internalType": "struct LibPart.Part[]", "name": "royalties", "type": "tuple[]" }, { "internalType": "bytes[]", "name": "signatures", "type": "bytes[]" } ], "internalType": "struct LibERC721LazyMint.Mint721Data", "name": "data", "type": "tuple" }, { "internalType": "address", "name": "to", "type": "address" } ], "name": "mintAndTransfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]`)
const contract = new web3.eth.Contract(contractAbi, config.erc721ContractAddress)

performMint(maker.getAddress())
	.then(x => console.log("Hash:", x))
	.catch(error => console.log("Mint error", error))


async function performMint(maker) {
	// const nonce = await getNonce(config.erc721ContractAddress, maker)
	const creator = '0x6973a5D5e2Bd3bBDe498104FeCDF3132A3c545aB';
	// const creator = maker;
    const nonce = creator + web3.utils.randomHex(12).slice(2);
	const tokenId = Web3.utils.toBN(nonce).toString();

	// const invocation = contract.methods
	// 	.mintAndTransfer(
	// 		[
	// 			tokenId,
	// 			"api/metadata/get/1",
	// 			[creator],
	// 			[],
	// 			// ["0x0000000000000000000000000000000000000000000000000000000000000000"]
	// 			['0xe76e03dc7f182bce6e24bed2f0a30fab1f82a211be4d9c296158430881f103934cb46d9dfd63997c9c8d72a1adf6386b973bb1273f36c97e0a0297842605f8c81b']
	// 		],
	// 		maker
	// 	)
		const invocation = contract.methods.mintAndTransfer({
			tokenId: "47697181068186769531961618022915416000049771014116107970786075107371289411590",
			uri: "/ipfs/QmWLsBu6nS4ovaHbGAXprD1qEssJu4r5taQfB74sCG51tp",
			creators: ['0x6973a5D5e2Bd3bBDe498104FeCDF3132A3c545aB'],
			royalties: [],
			signatures: []
		}, maker)
        // console.log(invocation.arguments)
		return new Promise(async (resolve, reject) => {
			web3.eth.sendTransaction({
					data: invocation.encodeABI(),
					to: config.erc721ContractAddress,
					from: maker,
					chainId: 4,
					gasPrice: "5000000000",
					gas: "10000000"
			})
			.once("transactionHash", resolve)
			.once("error", reject)
	}) 
}

