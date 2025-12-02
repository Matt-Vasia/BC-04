// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFunding {
    
    // Kintamieji (State Variables)
    address public manager;          // Projekto kūrėjo adresas
    uint public targetAmount;        // Finansinis tikslas (Wei formatu)
    uint public deadline;            // Laiko pabaigos žyma (timestamp)
    uint public raisedAmount;        // Kiek iš viso surinkta
    
    // Mapping saugo informaciją, kiek kiekvienas rėmėjas pervedė
    mapping(address => uint) public contributors;

    // Konstruktorius - pasileidžia tik vieną kartą, kuriant sutartį
    // _targetETH: kiek ETH norime surinkti
    // _durationInMinutes: kiek minučių galios kampanija
    constructor(uint _targetETH, uint _durationInMinutes) {
        manager = msg.sender; // Tas, kas "deploja" kontraktą, tampa valdytoju
        targetAmount = _targetETH * 1 ether; // Konvertuojame ETH į Wei (mažiausią vienetą)
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
    }
}