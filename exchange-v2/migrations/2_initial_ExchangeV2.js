const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ExchangeV2 = artifacts.require('ExchangeV2');
const ERC20TransferProxy = artifacts.require('ERC20TransferProxy');
const TransferProxy = artifacts.require('TransferProxy');
const RoyaltiesRegistry = artifacts.require("RoyaltiesRegistry.sol");

const rinkeby = {
	communityWallet: "0x3D0b45BCEd34dE6402cE7b9e7e37bDd0Be9424F3"
};

let settings = {
	"rinkeby": rinkeby,
};

function getSettings(network) {
	if (settings[network] !== undefined) {
		return settings[network];
	} else {
		return settings["default"];
	}
}

module.exports = async function (deployer, network) {
	const { communityWallet} = getSettings(network);

	await deployer.deploy(ERC20TransferProxy);
	const eRC20TransferProxy = await ERC20TransferProxy.deployed();
	await eRC20TransferProxy.__ERC20TransferProxy_init();

	await deployer.deploy(TransferProxy);
	const transferProxy = await TransferProxy.deployed();
	await transferProxy.__TransferProxy_init();

	await deployer.deploy(RoyaltiesRegistry);
	const royaltiesRegistry = await RoyaltiesRegistry.deployed();
	await royaltiesRegistry.initializeRoyaltiesRegistry();

	await deployer.deploy(ExchangeV2);
	const exchangeV2 = await ExchangeV2.deployed();
	await exchangeV2.__ExchangeV2_init(transferProxy.address, eRC20TransferProxy.address, 100, 100, communityWallet, royaltiesRegistry.address);
};