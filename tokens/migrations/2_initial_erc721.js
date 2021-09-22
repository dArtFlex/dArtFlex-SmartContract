const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ERC721Rarible = artifacts.require('ERC721Rarible');

module.exports = async function (deployer) {
    await deployer.deploy(ERC721Rarible);
    const ERC721_Rarible = await ERC721Rarible.deployed();
    await ERC721_Rarible.__ERC721Rarible_init("DartFlex", "DART", "ipfs:/", "");
};