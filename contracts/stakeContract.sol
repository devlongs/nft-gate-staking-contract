//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20{
    function transferFrom(address _from,address _to,uint256 _amount) external returns(bool);
    function transfer(address _to,uint256 _amount) external returns(bool);
    function symbol() external returns(string memory);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint256);
}

interface IERC721{
    function balanceOf(address account) external view returns (uint256);
    function symbol() external returns(string memory);
}

contract stakeContract {

    struct Record {
        address stakedBy;
        bool isActive;
        uint stakedAt;
        uint256 amount;
    }

    enum ACTION {
        STAKE,
        WITHDRAW
    }

    event Alert(Record record, ACTION action);

    IERC721 public boredApe;
    IERC20 public stakeToken;
    uint8 public constant MPY = 10;
    uint256 private totalStakes;
    string public boredApeYatchClub;

    mapping(address => Record) private records;


    constructor( address _stakeTokenAddr) {
        boredApe = IERC721(0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D);
        stakeToken = IERC20(_stakeTokenAddr);
    }

    modifier hasBoredApe() {
        require( boredApe.balanceOf(msg.sender) > 0,
            "account has no boredApe");
        _;
    }


    function stake(uint256 _amt) public hasBoredApe returns (bool) {
        require(_amt >= 1e18, "Invalid Stake");
        require(stakeToken.transferFrom(msg.sender, address(this), _amt), "Staking failed");

        uint256 _totalAmt = _amt;

        Record storage _record = records[msg.sender];
        // check that record exist for account, and update accordingly
        if (_record.isActive) {_totalAmt += _calculateYield(_record);}
        else {
            _record.stakedBy = msg.sender;
            _record.isActive = true;
        }

        _record.amount = _totalAmt;
        _record.stakedAt = block.timestamp;
        totalStakes += _record.amount;

        return true;
    }

    function getUser(address userAddress) public view returns(Record memory u){
        u = records[userAddress];
    }

    //withdraw token
    function withdraw() public returns (bool) {
        Record storage _record = records[msg.sender];
        require(_record.isActive, "No active record found");
        uint256 _yield = _calculateYield(_record);

        uint256 _totalReturns = _yield + _record.amount;

        stakeToken.transfer(msg.sender, _totalReturns);

        _record.isActive = false;

        totalStakes -= _record.amount;

        return true;
    }

    function _calculateYield(Record memory _record) internal view returns (uint256){
        uint256 _yield = 0;
        // cycle is 1 second long
        uint256 cycle = 1 seconds;
        uint256 minCycle = 3 days;

        uint256 _maturity = block.timestamp - _record.stakedAt;

        if (_maturity < minCycle) {
            return _yield;
        }

        uint256 _cycles = _maturity / cycle;
        _yield = (_cycles * MPY * _record.amount) / (259200000); // yield earned to a second
        return _yield;
    }

}