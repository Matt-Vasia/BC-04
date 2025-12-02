// Pasiimame sukompiliuotą kontraktą
const CrowdFunding = artifacts.require("CrowdFunding");

module.exports = function (deployer) {
  // Čia nurodome konstruktoriaus argumentus:
  // 1. Target (Tikslas): 10 ETH
  // 2. Duration (Trukmė): 2 minutės
  
  deployer.deploy(CrowdFunding, 10, 2);
};