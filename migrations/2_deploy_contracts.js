// Pasiimame sukompiliuotą kontraktą
const CrowdFunding = artifacts.require("CrowdFunding");

module.exports = function (deployer) {
  // Čia nurodome konstruktoriaus argumentus:
  // 1. Target (Tikslas): 0.1 ETH (konvertuojame į Wei)
  // 2. Duration (Trukmė): 10 minučių
  
  const targetWei = web3.utils.toWei('0.1', 'ether');
  deployer.deploy(CrowdFunding, targetWei, 10);
};