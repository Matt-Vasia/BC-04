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
    },
  
    // 3. Kontrakto užkrovimas iš JSON failo
    initContract: function() {
      // Nurodome kelią iki sukompiliuoto failo (kurį sukūrė Truffle)
      $.getJSON('CrowdFunding.json', function(data) {
        // Sukuriame JavaScript objektą iš JSON
        var CrowdFundingArtifact = data;
        App.contracts.CrowdFunding = TruffleContract(CrowdFundingArtifact);
        
        // Nustatome providerį
        App.contracts.CrowdFunding.setProvider(App.web3Provider);
  
        // Užkrauname duomenis į ekraną
        return App.render();
      });
    },
  
    // 4. Duomenų atvaizdavimas ekrane
    render: async function() {
        var fundingInstance;

        // Gauname vartotojo sąskaitą
        const accounts = await web3.eth.getAccounts();
        App.account = accounts[0];
        $("#account").html(App.account);

        // Gauname kontrakto instanciją
        const instance = await App.contracts.CrowdFunding.deployed();
        fundingInstance = instance;

        // 1. Tikslas
        const target = await fundingInstance.targetAmount();
        $("#target").html(web3.utils.fromWei(target, 'ether'));

        // 2. Surinkta suma
        const raised = await fundingInstance.raisedAmount();
        $("#raised").html(web3.utils.fromWei(raised, 'ether'));

        // 3. LAIKMATIS (Atnaujinta dalis)
        // Pasiimame galutinį terminą (timestamp)
        const deadlineBN = await fundingInstance.deadline();
        const deadline = deadlineBN.toNumber(); // Konvertuojame į paprastą skaičių

        // Sustabdome seną laikmatį, jei toks buvo (kad nesidubliuotų)
        if (App.timerInterval) {
        clearInterval(App.timerInterval);
        }

        // Paleidžiame funkciją, kuri tiksi kas 1 sekundę (1000 ms)
        App.timerInterval = setInterval(function() {
        // Dabartinis laikas sekundėmis
        const now = Math.floor(Date.now() / 1000);
        
        // Skaičiuojame skirtumą
        let distance = deadline - now;

        if (distance < 0) {
            $("#timeLeft").html("Laikas baigėsi!");
            $("#timeLeft").css("color", "red");
            // Galime sustabdyti laikmatį
            clearInterval(App.timerInterval);
        } else {
            // Formatuojame gražiai: Minutės : Sekundės
            const minutes = Math.floor(distance / 60);
            const seconds = distance % 60;
            
            // Pridedame "0" priekyje, jei vienaženklis skaičius (pvz 09)
            const secondsStr = seconds < 10 ? "0" + seconds : seconds;
            
            $("#timeLeft").html(minutes + "m " + secondsStr + "s");
            $("#timeLeft").css("color", "black");
        }
        }, 1000);
    }
};

$(document).ready(function() {
    App.init();
});