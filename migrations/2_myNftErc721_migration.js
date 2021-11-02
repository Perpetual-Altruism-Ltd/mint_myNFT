const myNftErc721 = artifacts.require("myNftErc721");

module.exports = function (deployer) {
  deployer.deploy(myNftErc721);
};
