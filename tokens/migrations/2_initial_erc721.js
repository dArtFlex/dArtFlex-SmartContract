const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ERC721Rarible = artifacts.require('ERC721Rarible');

module.exports = async function (deployer) {
  // await deployProxy(ERC721Rarible, ["DartFlex", "DFN", "http://3.11.202.153:8888/", ""], { deployer, initializer: '__ERC721Rarible_init' });
  // deployer.deploy(ERC721Rarible);
    await deployer.deploy(ERC721Rarible);
    const ERC721_Rarible = await ERC721Rarible.deployed();
    await ERC721_Rarible.__ERC721Rarible_init("DartFlex", "DFN", "http://3.11.202.153:8888/", "");
}; 