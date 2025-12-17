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

        try {
            // Gauname vartotojo sąskaitą
            const accounts = await web3.eth.getAccounts();
            App.account = accounts[0];
            $("#account").html(App.account);

            // Gauname kontrakto instanciją
            fundingInstance = await App.contracts.CrowdFunding.deployed();

            // --- PATIKRINIMAS: Ar kontraktas tikrai egzistuoja? ---
            // Dažna klaida: Ganache persikrovė, bet naršyklė atsimena seną adresą.
            const code = await web3.eth.getCode(fundingInstance.address);
            if (code === '0x' || code === '0x0') {
                console.error("Kontraktas nerastas adresu: " + fundingInstance.address);
                $("#status").html("Klaida: Kontraktas nerastas (adresas tuščias). <br> Pabandykite terminale paleisti: <b>truffle migrate --reset</b>");
                $("#status").css("color", "red");
                return;
            }
            // -------------------------------------------------------

        } catch (error) {
            console.error("Klaida prisijungiant prie kontrakto:", error);
            $("#status").html("Klaida: Kontraktas nerastas šiame tinkle. Patikrinkite MetaMask tinklą.");
            $("#status").css("color", "red");
            return;
        }

        try {
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
        } catch (error) {
            console.error("Klaida nuskaitant duomenis:", error);
            $("#status").html("Klaida nuskaitant duomenis iš kontrakto.");
            $("#status").css("color", "red");
        }
    },
  
    // 5. Funkcija: Pervesti pinigus (Contribute)
    contribute: async function() {
      const amountEth = $("#amount").val();
      const amountWei = web3.utils.toWei(amountEth, 'ether');
      
      $("#status").html("Vykdoma transakcija...");
  
      try {
        const instance = await App.contracts.CrowdFunding.deployed();
        await instance.contribute({ from: App.account, value: amountWei });
        $("#status").html("Sėkmingai paremta!");
        App.render(); // Atnaujiname informaciją
      } catch (err) {
        console.error(err);
        $("#status").html("Klaida vykdant transakciją.");
      }
    },
  
    // 6. Funkcija: Išimti pinigus (Withdraw - tik kūrėjui)
    withdraw: async function() {
        $("#status").html("Bandoma išimti lėšas...");
        try {
          const instance = await App.contracts.CrowdFunding.deployed();
          await instance.withdraw({ from: App.account });
          
          $("#status").html("Lėšos sėkmingai pervestos kūrėjui!");
          $("#status").css("color", "green");
          App.render();
        } catch (err) {
          // Čia naudojame naują funkciją
          const reason = App.handleError(err);
          $("#status").html(reason);
          $("#status").css("color", "red");
        }
      },
  
    // 7. Funkcija: Grąžinti pinigus (Refund - rėmėjams)
    refund: async function() {
        $("#status").html("Bandoma susigrąžinti lėšas...");
        try {
          const instance = await App.contracts.CrowdFunding.deployed();
          await instance.getRefund({ from: App.account });
          
          $("#status").html("Lėšos grąžintos į jūsų sąskaitą!");
          $("#status").css("color", "green");
          App.render();
        } catch (err) {
          // Čia naudojame naują funkciją
          const reason = App.handleError(err);
          $("#status").html(reason);
          $("#status").css("color", "red");
        }
    },
    // Pagalbinė funkcija klaidų apdorojimui
    handleError: function(err) {
        console.error("Pilna klaida (debug):", err);
        
        // Konvertuojame klaidą į tekstą
        const message = err.message || err.toString();
        
        // 1. Ieškome žodžio "revert" (nes Solidity klaidos prasideda "VM Exception... revert ...")
        // Regex paaiškinimas: ieškome "revert " ir paimame viską kas seka po jo
        const match = message.match(/revert (.*)/);
        
        if (match && match[1]) {
        // Išvalome, jei netyčia paėmėme per daug (pvz., uždarančias kabutes ar kitus techninius simbolius)
        // Dažniausiai tekstas būna švarus, bet kartais reikia apkarpyti
        let cleanReason = match[1].trim();
        
        // Jei gale yra nereikalingų simbolių, galime juos apvalyti (priklauso nuo naršyklės)
        if (cleanReason.endsWith("'") || cleanReason.endsWith('"')) {
            cleanReason = cleanReason.slice(0, -1);
        }
        
        return "Klaida: " + cleanReason;
        }
        
        // 2. Jei neradome "revert", galbūt vartotojas tiesiog atmetė transakciją MetaMask lange
        if (message.includes("User denied") || message.includes("User rejected")) {
        return "Jūs atšaukėte transakciją.";
        }

        // 3. Jei nepavyko atpažinti
        return "Įvyko techninė klaida (žr. konsolę).";
    }
};
  
  // Startuojame aplikaciją

$(document).ready(function() {
    App.init();
});