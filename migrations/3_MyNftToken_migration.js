const MyNftToken = artifacts.require("MyNftToken");

module.exports = function (deployer) {
  deployer.deploy(MyNftToken);
};
