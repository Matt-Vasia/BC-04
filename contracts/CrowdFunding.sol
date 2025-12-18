// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFunding {
    
    // 1. Kintamieji (State Variables)
    address public manager;          // Projekto kūrėjo adresas
    uint public targetAmount;        // Finansinis tikslas (Wei formatu)
    uint public deadline;            // Laiko pabaigos žyma (timestamp)
    uint public raisedAmount;        // Kiek iš viso surinkta
    
    // Mapping saugo informaciją, kiek kiekvienas rėmėjas pervedė
    mapping(address => uint) public contributors;

    // 2. Konstruktorius - pasileidžia tik vieną kartą, kuriant sutartį
    // _targetWei: kiek ETH norime surinkti (Wei formatu)
    // _durationInMinutes: kiek minučių galioja
    constructor(uint _targetWei, uint _durationInMinutes) {
        manager = msg.sender; // Tas, kas "deplojina" kontraktą, tampa valdytoju
        targetAmount = _targetWei; // Suma Wei formatu
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    // 3. Funkcija: Rėmimas (Investavimas)
    function contribute() public payable {
        // Tikrinimai (Validation)
        require(block.timestamp < deadline, "Laikas baigesi, remti nebegalima.");
        require(msg.value > 0, "Pervedama suma turi buti didesne nei 0.");
        
        contributors[msg.sender] += msg.value; // Pridedame prie rėmėjo balanso
        raisedAmount += msg.value;             // Atnaujiname bendrą sumą
    }

    // 4. Funkcija: Pinigų išmokėjimas kūrėjui (Sėkmės atveju)
    function withdraw() public {
        require(msg.sender == manager, "Tik projekto kurejas gali inicijuoti ismokejima.");
        require(raisedAmount >= targetAmount, "Finansinis tikslas nepasiektas.");
        
        uint balance = address(this).balance;
        payable(manager).transfer(balance); // Pervedame visus kontrakte esančius pinigus kūrėjui
    }

    // 5. Funkcija: Pinigų susigrąžinimas (Nesėkmės atveju)
    function getRefund() public {
        // Leidžiame grąžinti tik jei laikas baigėsi IR tikslas nebuvo pasiektas
        require(block.timestamp >= deadline, "Kampanija dar vyksta.");
        require(raisedAmount < targetAmount, "Tikslas pasiektas, grazinimas negalimas.");
        require(contributors[msg.sender] > 0, "Jus nesate paremes sio projekto.");

        uint amountToRefund = contributors[msg.sender];
        
        contributors[msg.sender] = 0; 
        
        payable(msg.sender).transfer(amountToRefund);
    }

    function timeLeft() public view returns (uint) {
        if (block.timestamp >= deadline) {
            return 0;
        } else {
            return deadline - block.timestamp;
        }
    }
}