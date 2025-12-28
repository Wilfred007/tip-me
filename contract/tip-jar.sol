// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TipJarFactory
 * @notice Factory contract for creating individual tip jars
 */
contract TipJarFactory {
    event TipJarCreated(address indexed creator, address tipJarAddress);
    
    mapping(address => address) public creatorToTipJar;
    address[] public allTipJars;
    
    function createTipJar(uint256 minTip) external returns (address) {
        require(creatorToTipJar[msg.sender] == address(0), "Tip jar already exists");
        
        TipJar newTipJar = new TipJar(msg.sender, minTip);
        address tipJarAddress = address(newTipJar);
        
        creatorToTipJar[msg.sender] = tipJarAddress;
        allTipJars.push(tipJarAddress);
        
        emit TipJarCreated(msg.sender, tipJarAddress);
        return tipJarAddress;
    }
    
    function getTipJar(address creator) external view returns (address) {
        return creatorToTipJar[creator];
    }
    
    function getAllTipJars() external view returns (address[] memory) {
        return allTipJars;
    }
    
    function getTipJarCount() external view returns (uint256) {
        return allTipJars.length;
    }
}

/**
 * @title TipJar
 * @notice Individual tip jar contract for a creator
 */
contract TipJar {
    struct TipRecord {
        address tipper;
        uint256 amount;
    }
    
    address public immutable creator;
    uint256 public immutable minTip;
    uint256 public totalTips;
    uint256 public tipCounter;
    
    mapping(uint256 => TipRecord) public recentTips;
    
    event TipReceived(address indexed tipper, uint256 amount, uint256 tipNumber);
    
    constructor(address _creator, uint256 _minTip) {
        require(_creator != address(0), "Invalid creator address");
        creator = _creator;
        minTip = _minTip;
    }
    
    function tip() external payable {
        require(msg.value >= minTip, "Tip below minimum");
        
        // Transfer to creator
        (bool success, ) = creator.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        // Update total tips
        totalTips += msg.value;
        
        // Update tip counter and store in recent tips (last 5)
        tipCounter++;
        uint256 slot = (tipCounter - 1) % 5;
        recentTips[slot] = TipRecord({
            tipper: msg.sender,
            amount: msg.value
        });
        
        emit TipReceived(msg.sender, msg.value, tipCounter);
    }
    
    function getTotalTips() external view returns (uint256) {
        return totalTips;
    }
    
    function getRecentTip(uint256 index) external view returns (address tipper, uint256 amount) {
        require(index < 5, "Index out of bounds");
        TipRecord memory record = recentTips[index];
        return (record.tipper, record.amount);
    }
    
    function getAllRecentTips() external view returns (TipRecord[] memory) {
        uint256 count = tipCounter < 5 ? tipCounter : 5;
        TipRecord[] memory tips = new TipRecord[](count);
        
        for (uint256 i = 0; i < count; i++) {
            tips[i] = recentTips[i];
        }
        
        return tips;
    }
    
    function getTipCounter() external view returns (uint256) {
        return tipCounter;
    }
}