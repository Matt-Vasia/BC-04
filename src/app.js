App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
    // 1. Inicijavimas (pasileidžia užsikrovus puslapiui)
    init: async function() {
      return await App.initWeb3();
    },
  
    // 2. Web3 ir MetaMask konfigūracija
    initWeb3: async function() {
      // Modernios naršyklės su MetaMask
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Paprašome vartotojo leidimo prisijungti
          await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
          console.error("Vartotojas atmetė prisijungimą.");
        }
      }
      // Senesnės naršyklės
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      }
      // Jei MetaMask nėra, bandome jungtis tiesiai prie Ganache (fallback)
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      
      web3 = new Web3(App.web3Provider);
      return App.initContract();
    }
};

$(document).ready(function() {
    App.init();
});